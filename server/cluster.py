"""
Cluster manager for GreenMesh.

This module handles the lifecycle of llama.cpp server processes (clusters), including
starting, stopping, and monitoring processes based on configuration.
It supports multiple concurrent clusters for different models.
"""

import os
import subprocess
import time
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
import socket
import aiohttp
import json
import psutil
import shlex

# Get logger for this module
logger = logging.getLogger(__name__)


# Health Status Constants
class HealthStatus:
    """Constants for health check status values."""

    OK = "ok"
    LOADING = "loading"
    ERROR = "error"
    NOT_RUNNING = "not_running"
    NOT_LOADED = "not_loaded"


# Health Messages
class HealthMessages:
    """Constants for health check messages."""

    READY = "Ready"
    MODEL_LOADING = "Model is still loading"
    CLUSTER_NOT_RUNNING = "Cluster not running"
    RUNNER_NOT_RUNNING = "Cluster not running"
    MODEL_NOT_LOADED = "Model not loaded in cluster"
    NO_CLUSTER_AVAILABLE = "No cluster available"
    NO_RUNNER_AVAILABLE = "No cluster available"
    HEALTH_CHECK_TIMEOUT = "Health check timeout"
    CONNECTION_ERROR = "Connection error"
    HEALTH_CHECK_FAILED = "Health check failed"


class ClusterProcess:
    """Class representing a single GreenMesh cluster process."""

    def __init__(self, cluster_name, cluster_config, host, port, session_log_dir=None):
        """Initialize a cluster process.

        Args:
            cluster_name: Name of the cluster.
            cluster_config: Configuration for the cluster.
            host: Host to bind to.
            port: Port to bind to.
            session_log_dir: Session-specific log directory (optional).
        """
        self.cluster_name = cluster_name
        self.runner_name = cluster_name  # Alias for backward compatibility
        self.cluster_config = cluster_config
        self.runner_config = cluster_config  # Alias
        self.host = host
        self.port = port
        self.session_log_dir = session_log_dir or "logs"
        self.process = None
        self.output_file = None
        self.models = []  # List of models this cluster is responsible for
        self.current_model = None  # Track which model is currently loaded
        self.is_starting = False
        self.start_time = None

        # Auto-unload state tracking
        self.auto_unload_timeout_seconds = cluster_config.get(
            "auto_unload_timeout_seconds", 0
        )
        self.active_requests = 0
        self.last_activity_ts = None
        self._request_lock = asyncio.Lock()

    def _kill_process_tree(self, pid: int):
        """Terminate a process and all of its children, using an OS-specific method."""
        if os.name == "nt":
            try:
                result = subprocess.run(
                    ["taskkill", "/F", "/T", "/PID", str(pid)],
                    capture_output=True,
                    text=True,
                    check=False,
                )
                if result.returncode != 0 and result.returncode != 128:
                    logger.warning(
                        f"taskkill for PID {pid} returned exit code {result.returncode}."
                        f"\n  stdout: {result.stdout.strip()}"
                        f"\n  stderr: {result.stderr.strip()}"
                    )
            except FileNotFoundError:
                logger.warning("`taskkill` command not found. Falling back to psutil.")
                self._kill_with_psutil(pid)
        else:
            self._kill_with_psutil(pid)

    def _kill_with_psutil(self, pid: int):
        """Terminate a process and all of its children using psutil."""
        try:
            parent = psutil.Process(pid)
        except psutil.NoSuchProcess:
            return

        children = parent.children(recursive=True)
        for child in children:
            try:
                child.terminate()
            except psutil.NoSuchProcess:
                continue

        _, alive = psutil.wait_procs(children, timeout=3)
        for child in alive:
            try:
                child.kill()
            except psutil.NoSuchProcess:
                pass

        try:
            parent.terminate()
        except psutil.NoSuchProcess:
            return

        try:
            parent.wait(timeout=3)
        except psutil.TimeoutExpired:
            try:
                parent.kill()
            except psutil.NoSuchProcess:
                pass

    def add_model(self, model_config):
        """Add a model to this cluster."""
        self.models.append(model_config)

    def get_model_by_alias(self, model_alias):
        """Get a model configuration by alias."""
        for model in self.models:
            if (
                model.get("model_alias", os.path.basename(model["model"]))
                == model_alias
            ):
                return model
        return None

    def is_model_loaded(self, model_alias):
        """Check if a specific model is currently loaded."""
        if self.current_model is None:
            return False

        current_alias = self.current_model.get(
            "model_alias", os.path.basename(self.current_model["model"])
        )
        return current_alias == model_alias

    async def start_with_model(self, model_alias):
        """Start the cluster with a specific model, handling model switching."""
        model_config = self.get_model_by_alias(model_alias)
        if model_config is None:
            logger.error(f"Model {model_alias} not found in cluster {self.cluster_name}")
            return False

        if await self.is_running() and self.is_model_loaded(model_alias):
            logger.info(
                f"Model {model_alias} is already loaded in cluster {self.cluster_name}"
            )
            return True

        if await self.is_running() and not self.is_model_loaded(model_alias):
            current_alias = (
                self.current_model.get(
                    "model_alias", os.path.basename(self.current_model["model"])
                )
                if self.current_model
                else "unknown"
            )
            logger.info(
                f"Switching cluster {self.cluster_name} from model {current_alias} to {model_alias}"
            )
            await self.stop()

        return await self._start_with_specific_model(model_config)

    async def start(self):
        """Start the cluster process with the first available model."""
        if not self.models:
            logger.error(f"Cluster {self.cluster_name} has no models")
            return False

        return await self._start_with_specific_model(self.models[0])

    async def _start_with_specific_model(self, model_config):
        """Internal method to start the cluster process with a specific model."""
        if self.process is not None and self.process.poll() is None:
            logger.info(f"Cluster {self.cluster_name} is already running")
            return True

        if self.is_starting:
            logger.info(f"Cluster {self.cluster_name} is already starting")
            while self.is_starting:
                await asyncio.sleep(0.5)
            return self.process is not None and self.process.poll() is None

        self.is_starting = True
        self.start_time = time.time()

        try:
            cmd, env_from_path = self._build_command_and_env(model_config)
            env_for_child = self._compose_environment(model_config, env_from_path)

            if env_from_path:
                logger.warning(
                    f"Cluster {self.cluster_name}: inline env assignments in 'path' are deprecated; "
                    f"please use cluster.env/model.env. Parsed vars: {', '.join(sorted(env_from_path.keys()))}"
                )

            cluster_env_vars = list(self.cluster_config.get("env", {}).keys())
            model_env_vars = list(model_config.get("env", {}).keys())
            all_env_vars = cluster_env_vars + model_env_vars + list(env_from_path.keys())
            if all_env_vars:
                logger.info(
                    f"Cluster {self.cluster_name}: applying env vars {', '.join(sorted(set(all_env_vars)))}"
                )

            log_dir = self.session_log_dir
            os.makedirs(log_dir, exist_ok=True)
            log_file = os.path.join(log_dir, f"{self.cluster_name}.log")

            model_alias = model_config.get(
                "model_alias", os.path.basename(model_config["model"])
            )
            logger.info(f"Starting cluster {self.cluster_name} with model {model_alias}")
            logger.info(f"Command: {' '.join(cmd)}")
            logger.info(f"Log file: {log_file}")

            self.output_file = open(log_file, "a")
            self.output_file.write(
                f"\n=== Starting with model {model_alias} at {time.strftime('%Y-%m-%d %H:%M:%S')} ===\n"
            )
            self.output_file.flush()

            try:
                popen_kwargs = {
                    "stdout": self.output_file,
                    "stderr": self.output_file,
                    "text": True,
                    "bufsize": 1,
                    "env": env_for_child,
                }
                if os.name == "posix":
                    popen_kwargs["start_new_session"] = True
                elif os.name == "nt":
                    popen_kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP

                self.process = subprocess.Popen(cmd, **popen_kwargs)
            except Exception as e:
                logger.error(
                    f"Failed to create subprocess for cluster {self.cluster_name}: {e}"
                )
                self.process = None
                self.output_file.close()
                self.output_file = None
                self.current_model = None
                self.is_starting = False
                return False

            await asyncio.sleep(2)

            if self.process is not None and self.process.poll() is not None:
                logger.error(
                    f"Cluster {self.cluster_name} exited with code: {self.process.returncode}"
                )
                self.process = None
                self.output_file.close()
                self.output_file = None
                self.current_model = None
                self.is_starting = False
                return False

            max_retries = 30
            retry_interval = 1
            for _ in range(max_retries):
                if await self._is_server_ready():
                    logger.info(
                        f"Cluster {self.cluster_name} started successfully with model {model_alias}"
                    )
                    self.current_model = model_config
                    self.last_activity_ts = time.time()
                    self.active_requests = 0
                    self.is_starting = False
                    return True

                if self.process is not None and self.process.poll() is not None:
                    logger.error(
                        f"Cluster {self.cluster_name} exited with code: {self.process.returncode}"
                    )
                    self.process = None
                    self.output_file.close()
                    self.output_file = None
                    self.current_model = None
                    self.is_starting = False
                    return False

                await asyncio.sleep(retry_interval)

            logger.error(f"Cluster {self.cluster_name} did not start in time")
            await self.stop()
            self.is_starting = False
            return False

        except Exception as e:
            logger.error(f"Failed to start cluster {self.cluster_name}: {e}")
            if self.process is not None:
                await self.stop()
            self.is_starting = False
            return False

    async def stop(self):
        """Stop the cluster process."""
        if self.process is None:
            logger.info(f"Cluster {self.cluster_name} is not running")
            return True

        try:
            current_alias = (
                self.current_model.get(
                    "model_alias", os.path.basename(self.current_model["model"])
                )
                if self.current_model
                else "unknown"
            )
            logger.info(
                f"Stopping cluster {self.cluster_name} (current model: {current_alias})"
            )

            pid = self.process.pid
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, self._kill_process_tree, pid)

            if self.process:
                self.process.poll()

            exit_code = (
                self.process.returncode if self.process is not None else "unknown"
            )
            logger.info(
                f"Cluster {self.cluster_name} stopped with exit code: {exit_code}"
            )

            if self.output_file is not None:
                try:
                    self.output_file.close()
                except Exception:
                    pass
                self.output_file = None

            self.process = None
            self.current_model = None
            self.last_activity_ts = None
            self.active_requests = 0

            await asyncio.sleep(0.5)
            return True

        except Exception as e:
            logger.error(f"Failed to stop cluster {self.cluster_name}: {e}")
            if self.output_file is not None:
                try:
                    self.output_file.close()
                except Exception:
                    pass
                self.output_file = None
            self.process = None
            self.current_model = None
            self.last_activity_ts = None
            self.active_requests = 0
            return False

    async def is_running(self):
        """Check if the cluster process is running."""
        if self.process is None:
            return False

        if self.process.poll() is not None:
            current_alias = (
                self.current_model.get(
                    "model_alias", os.path.basename(self.current_model["model"])
                )
                if self.current_model
                else "unknown"
            )
            logger.warning(
                f"Cluster {self.cluster_name} has exited with code: {self.process.returncode} (was running model: {current_alias})"
            )
            self.process = None
            self.current_model = None

            if self.output_file is not None:
                self.output_file.close()
                self.output_file = None

            return False

        return True

    def _parse_runner_path_with_env(
        self, raw_path: str
    ) -> tuple[str, list[str], dict[str, str]]:
        """Parse cluster 'path' that may contain leading environment assignments."""
        try:
            tokens = shlex.split(raw_path)
        except ValueError as e:
            logger.warning(
                f"Cluster {self.cluster_name}: Failed to parse path '{raw_path}': {e}. "
                "Using simple split as fallback."
            )
            tokens = raw_path.split()

        env_from_path: dict[str, str] = {}
        if not tokens:
            return raw_path, [], env_from_path

        index = 0
        if tokens[0] == "env":
            index = 1

        while (
            index < len(tokens)
            and "=" in tokens[index]
            and not tokens[index].startswith("--")
        ):
            try:
                name, value = tokens[index].split("=", 1)
                env_from_path[name] = value
                index += 1
            except ValueError:
                break

        if index >= len(tokens):
            return raw_path, [], env_from_path

        executable = tokens[index]
        index += 1
        initial_args = tokens[index:] if index < len(tokens) else []
        return executable, initial_args, env_from_path

    def _compose_environment(
        self, model_config: dict, env_from_path: dict[str, str]
    ) -> dict[str, str]:
        """Build environment for subprocess."""
        inherit = self.cluster_config.get("inherit_env", True)
        if "inherit_env" in model_config:
            try:
                inherit = bool(model_config["inherit_env"])
            except Exception:
                inherit = True

        base_env = os.environ.copy() if inherit else {}
        merged: dict[str, str] = dict(base_env)

        for mapping in (
            self.cluster_config.get("env", {}),
            model_config.get("env", {}),
            env_from_path,
        ):
            if not isinstance(mapping, dict):
                continue
            for key, value in mapping.items():
                merged[str(key)] = str(value)

        return merged

    def _build_command_and_env(
        self, model_config: dict
    ) -> tuple[list[str], dict[str, str]]:
        """Build the command to start the cluster process."""
        executable, initial_args, env_from_path = self._parse_runner_path_with_env(
            self.cluster_config["path"]
        )

        cmd: list[str] = [executable]
        if initial_args:
            cmd.extend(initial_args)

        cmd.extend(["--model", model_config["model"]])
        cmd.extend(["--host", self.host, "--port", str(self.port)])

        if "mmproj" in model_config:
            cmd.extend(["--mmproj", model_config["mmproj"]])

        if "audio_encoder" in model_config and "mmproj" not in model_config:
            cmd.extend(["--mmproj", model_config["audio_encoder"]])

        if "talker_model" in model_config:
            cmd.extend(["--talker-model", model_config["talker_model"]])

        if "code2wav_model" in model_config:
            cmd.extend(["--code2wav-model", model_config["code2wav_model"]])

        if "model_vocoder" in model_config:
            cmd.extend(["--model-vocoder", model_config["model_vocoder"]])

        if "model_alias" in model_config:
            cmd.extend(["--alias", model_config["model_alias"]])

        if "n_ctx" in model_config:
            cmd.extend(["--ctx-size", str(model_config["n_ctx"])])

        if "n_batch" in model_config:
            cmd.extend(["--batch-size", str(model_config["n_batch"])])

        if "u_batch" in model_config:
            cmd.extend(["--ubatch-size", str(model_config["u_batch"])])

        if "n_threads" in model_config:
            cmd.extend(["--threads", str(model_config["n_threads"])])

        if "chat_template" in model_config:
            cmd.extend(["--chat-template", model_config["chat_template"]])

        if "split_mode" in model_config:
            cmd.extend(["--split-mode", str(model_config["split_mode"])])

        if model_config.get("embedding", False):
            cmd.extend(["--embedding"])

        if model_config.get("reranking", False):
            cmd.extend(["--reranking"])

        if not model_config.get("offload_kqv", True):
            cmd.append("--no-kv-offload")

        if model_config.get("jinja", False):
            cmd.append("--jinja")

        if "pooling" in model_config:
            cmd.extend(["--pooling", model_config["pooling"]])

        if "flash_attn" in model_config:
            cmd.extend(["--flash-attn", model_config["flash_attn"]])

        if model_config.get("use_mlock", False):
            cmd.append("--mlock")

        if "main_gpu" in model_config:
            cmd.extend(["--main-gpu", str(model_config["main_gpu"])])

        if "tensor_split" in model_config:
            cmd.extend(
                ["--tensor-split", ",".join(map(str, model_config["tensor_split"]))]
            )

        if "n_gpu_layers" in model_config:
            cmd.extend(["--n-gpu-layers", str(model_config["n_gpu_layers"])])

        if "cache-type-k" in model_config:
            cmd.extend(["--cache-type-k", str(model_config["cache-type-k"])])

        if "cache-type-v" in model_config:
            cmd.extend(["--cache-type-v", str(model_config["cache-type-v"])])

        if "rope-scaling" in model_config:
            cmd.extend(["--rope-scaling", str(model_config["rope-scaling"])])

        if "rope-scale" in model_config:
            cmd.extend(["--rope-scale", str(model_config["rope-scale"])])

        if "yarn-orig-ctx" in model_config:
            cmd.extend(["--yarn-orig-ctx", str(model_config["yarn-orig-ctx"])])

        if "args" in model_config and model_config["args"].strip():
            try:
                model_args = shlex.split(model_config["args"].strip())
                cmd.extend(model_args)
            except ValueError:
                cmd.extend(model_config["args"].strip().split())

        cmd.extend(self.cluster_config.get("extra_args", []))
        return cmd, env_from_path

    def _build_command(self, model_config):
        cmd, _ = self._build_command_and_env(model_config)
        return cmd

    async def _is_server_ready(self):
        loop = asyncio.get_event_loop()

        def check_socket():
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                    s.settimeout(1)
                    s.connect((self.host, self.port))
                    return True
            except (socket.timeout, ConnectionRefusedError):
                return False
            except Exception as e:
                logger.error(f"Error checking server readiness: {e}")
                return False

        with ThreadPoolExecutor() as executor:
            return await loop.run_in_executor(executor, check_socket)


# Alias for backward compatibility
RunnerProcess = ClusterProcess


class ClusterManager:
    """Manager for GreenMesh cluster processes."""

    def __init__(self, config_manager, session_log_dir=None):
        self.config_manager = config_manager
        self.session_log_dir = session_log_dir or "logs"
        self.clusters = {}  # Map of cluster_name to ClusterProcess
        self.runners = self.clusters  # Alias for backward compatibility
        self.model_cluster_map = {}  # Map of model_alias to cluster_name
        self.model_runner_map = self.model_cluster_map  # Alias
        self.mcp_model_aliases: list[str] = []
        self.timeout = config_manager.get_request_timeout_seconds()

        self._auto_unload_task = None
        self._watchdog_running = False

        self._initialize_clusters()

    def _initialize_clusters(self):
        """Initialize cluster processes based on configuration."""
        for cluster_name in self.config_manager.get_cluster_names():
            cluster_config = self.config_manager.get_cluster_config(cluster_name)
            host = self.config_manager.get_cluster_host(cluster_name)
            port = self.config_manager.get_cluster_port(cluster_name)
            self.clusters[cluster_name] = ClusterProcess(
                cluster_name, cluster_config, host, port, self.session_log_dir
            )

        for model in self.config_manager.get_config()["models"]:
            model_alias = model.get("model_alias", os.path.basename(model["model"]))
            cluster_name = model.get("cluster") or model.get("runner")

            if cluster_name in self.clusters:
                self.clusters[cluster_name].add_model(model)
                self.model_cluster_map[model_alias] = cluster_name
                if model.get("mcp", False):
                    self.mcp_model_aliases.append(model_alias)
            else:
                logger.error(
                    f"Model {model_alias} references unknown cluster {cluster_name}"
                )

    async def start_cluster(self, cluster_name):
        """Start a cluster process."""
        if cluster_name not in self.clusters:
            logger.error(f"Unknown cluster: {cluster_name}")
            return False

        return await self.clusters[cluster_name].start()

    async def start_runner(self, runner_name):
        """Alias for start_cluster."""
        return await self.start_cluster(runner_name)

    async def start_cluster_for_model(self, model_alias):
        """Start the cluster for a specific model, loading or switching to it."""
        if model_alias not in self.model_cluster_map:
            logger.error(f"Unknown model: {model_alias}")
            return False

        cluster_name = self.model_cluster_map[model_alias]
        cluster = self.clusters[cluster_name]
        return await cluster.start_with_model(model_alias)

    async def start_runner_for_model(self, model_alias):
        """Alias for start_cluster_for_model."""
        return await self.start_cluster_for_model(model_alias)

    async def stop_cluster(self, cluster_name):
        """Stop a cluster process."""
        if cluster_name not in self.clusters:
            logger.error(f"Unknown cluster: {cluster_name}")
            return False

        return await self.clusters[cluster_name].stop()

    async def stop_runner(self, runner_name):
        """Alias for stop_cluster."""
        return await self.stop_cluster(runner_name)

    async def stop_all_clusters(self):
        """Stop all cluster processes."""
        success = True
        for cluster_name in self.clusters:
            if not await self.stop_cluster(cluster_name):
                success = False
        return success

    async def stop_all_runners(self):
        """Alias for stop_all_clusters."""
        return await self.stop_all_clusters()

    async def auto_start_default_clusters(self):
        """Auto-start clusters with their first model if enabled."""
        if not self.config_manager.get_auto_start_clusters():
            logger.info("Auto-start is disabled, skipping cluster auto-start")
            return True

        logger.info("Auto-starting default clusters...")
        success = True
        started_count = 0

        for cluster_name in self.get_cluster_names():
            cluster = self.clusters[cluster_name]
            if cluster.models:
                logger.info(
                    f"Auto-starting cluster {cluster_name} with model {cluster.models[0].get('model_alias', 'unknown')}"
                )
                if await self.start_cluster(cluster_name):
                    started_count += 1
                    logger.info(f"Successfully auto-started cluster {cluster_name}")
                else:
                    logger.error(f"Failed to auto-start cluster {cluster_name}")
                    success = False
            else:
                logger.warning(
                    f"Cluster {cluster_name} has no models assigned, skipping auto-start"
                )

        if success and started_count > 0:
            logger.info(f"Successfully auto-started {started_count} clusters")
        elif started_count == 0:
            logger.info("No clusters were auto-started (no models assigned)")

        return success

    async def auto_start_default_runners(self):
        """Alias for auto_start_default_clusters."""
        return await self.auto_start_default_clusters()

    async def start_auto_unload_watchdog(self) -> None:
        """Start auto-unload watchdog."""
        if self._auto_unload_task is None:
            logger.info("Starting auto-unload watchdog")
            self._watchdog_running = True
            self._auto_unload_task = asyncio.create_task(self._auto_unload_loop())

    async def stop_auto_unload_watchdog(self) -> None:
        """Stop auto-unload watchdog."""
        if self._auto_unload_task:
            logger.info("Stopping auto-unload watchdog")
            self._watchdog_running = False
            self._auto_unload_task.cancel()
            try:
                await self._auto_unload_task
            except asyncio.CancelledError:
                pass
            self._auto_unload_task = None

    async def _auto_unload_loop(self) -> None:
        """Auto-unload watchdog loop checking for idle clusters."""
        while self._watchdog_running:
            try:
                await asyncio.sleep(1)
                current_time = time.time()

                for cluster_name, cluster in self.clusters.items():
                    if (
                        cluster.auto_unload_timeout_seconds > 0
                        and await cluster.is_running()
                        and cluster.current_model is not None
                        and not cluster.is_starting
                        and cluster.last_activity_ts is not None
                    ):
                        async with cluster._request_lock:
                            if (
                                cluster.active_requests == 0
                                and (current_time - cluster.last_activity_ts)
                                >= cluster.auto_unload_timeout_seconds
                            ):
                                current_alias = cluster.current_model.get(
                                    "model_alias",
                                    os.path.basename(cluster.current_model["model"]),
                                )
                                logger.info(
                                    f"Auto-unload triggered for cluster {cluster_name} "
                                    f"(model: {current_alias}) after {cluster.auto_unload_timeout_seconds}s idle"
                                )
                                await cluster.stop()

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in auto-unload watchdog: {e}")

    async def is_cluster_running(self, cluster_name):
        """Check if a cluster process is running."""
        if cluster_name not in self.clusters:
            logger.error(f"Unknown cluster: {cluster_name}")
            return False

        return await self.clusters[cluster_name].is_running()

    async def is_runner_running(self, runner_name):
        """Alias for is_cluster_running."""
        return await self.is_cluster_running(runner_name)

    async def is_model_available(self, model_alias):
        """Check if a model is loaded and running."""
        if model_alias not in self.model_cluster_map:
            logger.error(f"Unknown model: {model_alias}")
            return False

        cluster_name = self.model_cluster_map[model_alias]
        cluster = self.clusters[cluster_name]

        if not await self.is_cluster_running(cluster_name):
            return False

        return cluster.is_model_loaded(model_alias)

    def get_cluster_for_model(self, model_alias):
        """Get the cluster process for a model."""
        if model_alias not in self.model_cluster_map:
            logger.error(f"Unknown model: {model_alias}")
            return None

        cluster_name = self.model_cluster_map[model_alias]
        return self.clusters.get(cluster_name)

    def get_runner_for_model(self, model_alias):
        """Alias for get_cluster_for_model."""
        return self.get_cluster_for_model(model_alias)

    def get_default_audio_model_alias(self) -> str | None:
        for model in self.config_manager.get_config()["models"]:
            if model.get("type") == "audio":
                return model.get("model_alias", os.path.basename(model["model"]))
        return None

    def get_port_for_model(self, model_alias):
        cluster = self.get_cluster_for_model(model_alias)
        if cluster is None:
            return None
        return cluster.port

    def get_model_aliases(self):
        return list(self.model_cluster_map.keys())

    def get_mcp_model_aliases(self) -> list[str]:
        return list(self.mcp_model_aliases)

    def select_mcp_model(self, requested_alias: str | None = None) -> str | None:
        if requested_alias is not None:
            if requested_alias in self.mcp_model_aliases:
                return requested_alias
            return None
        return self.mcp_model_aliases[0] if self.mcp_model_aliases else None

    def get_cluster_names(self):
        return list(self.clusters.keys())

    def get_runner_names(self):
        """Alias for get_cluster_names."""
        return self.get_cluster_names()

    def get_model_cluster_map(self):
        return self.model_cluster_map.copy()

    def get_model_runner_map(self):
        """Alias for get_model_cluster_map."""
        return self.get_model_cluster_map()

    async def get_current_model_for_cluster(self, cluster_name):
        if cluster_name not in self.clusters:
            logger.error(f"Unknown cluster: {cluster_name}")
            return None

        cluster = self.clusters[cluster_name]
        if cluster.current_model is None:
            return None

        return cluster.current_model.get(
            "model_alias", os.path.basename(cluster.current_model["model"])
        )

    async def get_current_model_for_runner(self, runner_name):
        """Alias for get_current_model_for_cluster."""
        return await self.get_current_model_for_cluster(runner_name)

    async def switch_model(self, from_model_alias, to_model_alias):
        if from_model_alias not in self.model_cluster_map:
            logger.error(f"Unknown source model: {from_model_alias}")
            return False

        if to_model_alias not in self.model_cluster_map:
            logger.error(f"Unknown target model: {to_model_alias}")
            return False

        from_cluster = self.model_cluster_map[from_model_alias]
        to_cluster = self.model_cluster_map[to_model_alias]

        if from_cluster != to_cluster:
            logger.error(
                f"Models {from_model_alias} and {to_model_alias} are on different clusters ({from_cluster} vs {to_cluster})"
            )
            return False

        return await self.start_cluster_for_model(to_model_alias)

    async def get_cluster_status(self):
        """Get the status of all clusters and their loaded models."""
        status = {}
        for cluster_name, cluster in self.clusters.items():
            cluster_status = {
                "is_running": await cluster.is_running(),
                "current_model": await self.get_current_model_for_cluster(cluster_name),
                "available_models": [
                    model.get("model_alias", os.path.basename(model["model"]))
                    for model in cluster.models
                ],
                "host": cluster.host,
                "port": cluster.port,
            }
            status[cluster_name] = cluster_status
        return status

    async def get_runner_status(self):
        """Alias for get_cluster_status."""
        return await self.get_cluster_status()

    async def ensure_model_ready_with_retry(self, model_alias):
        if not self.config_manager.get_retry_on_model_loading():
            if not await self.is_model_available(model_alias):
                logger.info(f"Starting cluster for model {model_alias}")
                if not await self.start_cluster_for_model(model_alias):
                    return False, f"Failed to start model: {model_alias}"

            await self._wait_for_model_readiness(model_alias, max_wait_seconds=30)
            is_ready, error = await self._check_model_readiness(model_alias)
            return is_ready, error

        max_retries = self.config_manager.get_max_retries()
        base_delay = self.config_manager.get_base_delay_seconds()
        max_delay = self.config_manager.get_max_delay_seconds()

        last_error = None
        is_ready, last_error = await self._perform_readiness_check(model_alias)
        if is_ready:
            return True, None

        for attempt in range(max_retries):
            delay = min(base_delay * (2**attempt), max_delay)
            logger.info(
                f"Retrying model readiness check for {model_alias} (attempt {attempt + 2}/{max_retries + 1}) after {delay}s delay"
            )
            await asyncio.sleep(delay)

            is_ready, last_error = await self._perform_readiness_check(model_alias)
            if is_ready:
                return True, None

        logger.error(
            f"Model readiness check for {model_alias} failed after {max_retries + 1} attempts. Last error: {last_error}"
        )
        return False, last_error

    async def _perform_readiness_check(self, model_alias):
        try:
            if not await self.is_model_available(model_alias):
                logger.info(f"Starting cluster for model {model_alias}")
                if not await self.start_cluster_for_model(model_alias):
                    return False, f"Failed to start model: {model_alias}"

            logger.debug(
                f"Waiting for newly started model {model_alias} to become ready"
            )
            await self._wait_for_model_readiness(model_alias, max_wait_seconds=30)

            is_ready, readiness_error = await self._check_model_readiness(model_alias)
            if not is_ready:
                logger.info(f"Model {model_alias} not ready: {readiness_error}")
                return False, f"Model not ready: {readiness_error}"

            logger.debug(f"Model {model_alias} is ready")
            return True, None

        except Exception as e:
            logger.error(f"Error checking model readiness for {model_alias}: {e}")
            return False, f"Readiness check error: {str(e)}"

    async def _check_model_readiness(self, model_alias):
        try:
            cluster = self.get_cluster_for_model(model_alias)
            if cluster is None:
                return False, HealthMessages.NO_CLUSTER_AVAILABLE

            health_url = f"http://{cluster.host}:{cluster.port}/health"

            async with aiohttp.ClientSession() as session:
                try:
                    async with session.get(
                        health_url, timeout=aiohttp.ClientTimeout(total=5)
                    ) as response:
                        if response.status == 200:
                            return True, None
                        elif response.status == 503:
                            try:
                                error_data = await response.json()
                                error_message = error_data.get("error", {}).get(
                                    "message", "Unknown error"
                                )
                                if HealthStatus.LOADING in error_message.lower():
                                    return False, HealthMessages.MODEL_LOADING
                                else:
                                    return False, error_message
                            except (json.JSONDecodeError, aiohttp.ContentTypeError):
                                response_text = await response.text()
                                if HealthStatus.LOADING in response_text.lower():
                                    return False, HealthMessages.MODEL_LOADING
                                return (
                                    False,
                                    f"HTTP {response.status}: {response_text[:100]}",
                                )
                        else:
                            response_text = (
                                await response.text()
                                if response.content_type != "application/json"
                                else str(await response.json())
                            )
                            return (
                                False,
                                f"Health check failed with status {response.status}: {response_text[:100]}",
                            )
                except asyncio.TimeoutError:
                    return False, HealthMessages.HEALTH_CHECK_TIMEOUT
                except aiohttp.ClientError as e:
                    return False, f"{HealthMessages.CONNECTION_ERROR}: {str(e)}"
        except Exception as e:
            return False, f"{HealthMessages.HEALTH_CHECK_FAILED}: {str(e)}"

    async def _wait_for_model_readiness(self, model_alias, max_wait_seconds=10):
        start_time = asyncio.get_event_loop().time()
        while (asyncio.get_event_loop().time() - start_time) < max_wait_seconds:
            is_ready, _ = await self._check_model_readiness(model_alias)
            if is_ready:
                logger.debug(
                    f"Model {model_alias} became ready after {asyncio.get_event_loop().time() - start_time:.1f}s"
                )
                return
            await asyncio.sleep(0.5)
        logger.warning(
            f"Model {model_alias} did not become ready within {max_wait_seconds}s"
        )

    async def forward_request(self, model_alias, endpoint, request_data):
        cluster = self.get_cluster_for_model(model_alias)
        if cluster is None:
            return (
                False,
                {"error": {"message": f"Model not available: {model_alias}"}},
                500,
            )

        url = f"http://{cluster.host}:{cluster.port}{endpoint}"

        if self.timeout == 0:
            timeout_config = aiohttp.ClientTimeout(
                total=None, sock_connect=None, sock_read=None
            )
        else:
            timeout_config = aiohttp.ClientTimeout(
                total=self.timeout, sock_connect=self.timeout, sock_read=self.timeout
            )

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=request_data,
                    timeout=timeout_config,
                ) as response:
                    try:
                        response_data = await response.json()
                    except (json.JSONDecodeError, aiohttp.ContentTypeError):
                        response_text = await response.text()
                        response_data = {
                            "error": {"message": f"Invalid response: {response_text}"}
                        }

                    return response.status == 200, response_data, response.status

        except aiohttp.ClientError as e:
            logger.error(f"Client error forwarding to {url}: {e}")
            return False, {"error": {"message": f"Connection error: {str(e)}"}}, 503
        except asyncio.TimeoutError:
            logger.error(f"Timeout forwarding to {url}")
            return False, {"error": {"message": "Request timeout"}}, 408
        except Exception as e:
            logger.error(f"Unexpected error forwarding to {url}: {e}")
            return False, {"error": {"message": f"Unexpected error: {str(e)}"}}, 500

    async def check_model_health(self, model_alias):
        is_ready, error_message = await self._check_model_readiness(model_alias)
        return {
            "status": HealthStatus.OK if is_ready else HealthStatus.ERROR,
            "message": HealthMessages.READY if is_ready else error_message,
            "model_alias": model_alias,
        }


# Alias for backward compatibility
RunnerManager = ClusterManager
