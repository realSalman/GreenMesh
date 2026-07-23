"""
Federation Manager for GreenMesh.

Handles peer-to-peer node discovery, state exchange (heartbeats),
energy source tracking (admin-simulated), and green energy-aware request routing.
"""

import os
import time
import logging
import asyncio
import uuid
import aiohttp
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)

# Greenness scores for simulated energy sources
ENERGY_SCORES = {
    "solar": 100,
    "wind": 80,
    "grid": 20,
}


class NodeState:
    """Represents the state of a node in the GreenMesh network."""

    def __init__(
        self,
        node_id: str,
        node_name: str,
        address: str,
        energy_source: str = "grid",
        greenness_score: int = 20,
        available_models: Optional[List[str]] = None,
        gpu_utilization: float = 0.0,
        is_self: bool = False,
        last_heartbeat: Optional[float] = None,
    ):
        self.node_id = node_id
        self.node_name = node_name
        self.address = address.rstrip("/")
        self.energy_source = energy_source
        self.greenness_score = greenness_score
        self.available_models = available_models or []
        self.gpu_utilization = gpu_utilization
        self.is_self = is_self
        self.last_heartbeat = last_heartbeat or time.time()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "node_id": self.node_id,
            "node_name": self.node_name,
            "address": self.address,
            "energy_source": self.energy_source,
            "greenness_score": self.greenness_score,
            "available_models": self.available_models,
            "gpu_utilization": self.gpu_utilization,
            "is_self": self.is_self,
            "last_heartbeat": self.last_heartbeat,
            "is_online": self.is_online(),
        }

    def is_online(self, timeout_seconds: float = 15.0) -> bool:
        if self.is_self:
            return True
        return (time.time() - self.last_heartbeat) < timeout_seconds


class FederationManager:
    """Manager for GreenMesh federation, peer communication, and green routing."""

    def __init__(self, config_manager, runner_manager):
        self.config_manager = config_manager
        self.runner_manager = runner_manager

        self.fed_config = config_manager.get_federation_config()
        self.enabled = bool(self.fed_config.get("enabled", False))

        self.node_id = self.fed_config.get("node_id")
        if not self.node_id or self.node_id == "auto":
            self.node_id = f"node-{uuid.uuid4().hex[:8]}"

        self.node_name = self.fed_config.get("node_name", "GreenMesh-Node")
        self.energy_source = self.fed_config.get("energy_source", "grid")
        if self.energy_source not in ENERGY_SCORES:
            self.energy_source = "grid"

        self.advertise_address = self.fed_config.get(
            "advertise_address",
            f"http://{config_manager.get_api_host()}:{config_manager.get_api_port()}",
        ).rstrip("/")

        self.peers = [
            p.rstrip("/") for p in self.fed_config.get("peers", []) if p and p != self.advertise_address
        ]
        self.heartbeat_interval = float(self.fed_config.get("heartbeat_interval_seconds", 5))
        self.node_timeout = float(self.fed_config.get("node_timeout_seconds", 15))

        self.nodes: Dict[str, NodeState] = {}
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._session: Optional[aiohttp.ClientSession] = None
        self._running = False

    def get_energy_source(self) -> str:
        return self.energy_source

    def set_energy_source(self, source: str) -> bool:
        source_lower = source.lower()
        if source_lower in ENERGY_SCORES:
            self.energy_source = source_lower
            logger.info(f"Federation: Node energy source updated to '{self.energy_source}' (score: {ENERGY_SCORES[self.energy_source]})")
            return True
        return False

    def get_greenness_score(self) -> int:
        return ENERGY_SCORES.get(self.energy_source, 20)

    def _get_local_available_models(self) -> List[str]:
        """Get models that are configured and available/ready or startable on this node."""
        return self.runner_manager.get_model_aliases()

    def _get_avg_gpu_utilization(self) -> float:
        """Get current average GPU utilization if available."""
        try:
            if hasattr(self.runner_manager, "gpu_metrics_collector"):
                snapshot = self.runner_manager.gpu_metrics_collector.get_snapshot()
                gpus = snapshot.get("gpus", [])
                if gpus:
                    utils = [g.get("utilization_gpu_percent", 0) for g in gpus if g.get("utilization_gpu_percent") is not None]
                    if utils:
                        return sum(utils) / len(utils)
        except Exception:
            pass
        return 0.0

    def get_self_state(self) -> NodeState:
        return NodeState(
            node_id=self.node_id,
            node_name=self.node_name,
            address=self.advertise_address,
            energy_source=self.energy_source,
            greenness_score=self.get_greenness_score(),
            available_models=self._get_local_available_models(),
            gpu_utilization=self._get_avg_gpu_utilization(),
            is_self=True,
            last_heartbeat=time.time(),
        )

    def handle_incoming_heartbeat(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process heartbeat received from a remote peer and update registry."""
        peer_id = data.get("node_id")
        if peer_id and peer_id != self.node_id:
            node = NodeState(
                node_id=peer_id,
                node_name=data.get("node_name", "Remote Node"),
                address=data.get("address", "").rstrip("/"),
                energy_source=data.get("energy_source", "grid"),
                greenness_score=data.get("greenness_score", 20),
                available_models=data.get("available_models", []),
                gpu_utilization=data.get("gpu_utilization", 0.0),
                is_self=False,
                last_heartbeat=time.time(),
            )
            self.nodes[peer_id] = node

            # If peer is not in configured peers list, dynamically add it
            if node.address and node.address not in self.peers and node.address != self.advertise_address:
                self.peers.append(node.address)

        return self.get_self_state().to_dict()

    def get_all_nodes(self) -> List[Dict[str, Any]]:
        """Return states of all active nodes including self."""
        result = [self.get_self_state().to_dict()]
        now = time.time()
        for peer_id, node in self.nodes.items():
            if (now - node.last_heartbeat) < (self.node_timeout * 2):
                result.append(node.to_dict())
        return result

    def get_federated_models(self) -> List[str]:
        """Get deduplicated list of all model aliases available across the federation."""
        models_set = set(self._get_local_available_models())
        now = time.time()
        for node in self.nodes.values():
            if node.is_online(self.node_timeout):
                for m in node.available_models:
                    models_set.add(m)
        return list(models_set)

    def select_greenest_node(self, model_alias: str) -> Optional[NodeState]:
        """
        Select the greenest online node that offers the requested model_alias.
        Tie-breaker: lowest GPU utilization.
        """
        candidates: List[NodeState] = []

        # Check self
        self_state = self.get_self_state()
        if model_alias in self_state.available_models:
            candidates.append(self_state)

        # Check online peers
        for node in self.nodes.values():
            if node.is_online(self.node_timeout) and model_alias in node.available_models:
                candidates.append(node)

        if not candidates:
            # Fallback: if no node specifically lists it, pick the greenest overall online candidate
            candidates = [self_state] + [n for n in self.nodes.values() if n.is_online(self.node_timeout)]

        if not candidates:
            return self_state

        # Sort candidate nodes by greenness_score desc, then gpu_utilization asc
        candidates.sort(key=lambda n: (-n.greenness_score, n.gpu_utilization))
        best_node = candidates[0]
        logger.info(
            f"Federation: Selected greenest node '{best_node.node_name}' ({best_node.address}) "
            f"for model '{model_alias}' [Energy: {best_node.energy_source}, Score: {best_node.greenness_score}]"
        )
        return best_node

    async def start(self):
        """Start the federation heartbeat loop."""
        if not self.enabled:
            logger.info("Federation is disabled in configuration.")
            return

        logger.info(f"Starting Federation Manager as '{self.node_name}' ({self.node_id}) on {self.advertise_address}")
        self._running = True
        self._session = aiohttp.ClientSession(connector=aiohttp.TCPConnector(limit=10))
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())

    async def stop(self):
        """Stop the federation heartbeat loop."""
        if not self.enabled:
            return

        logger.info("Stopping Federation Manager...")
        self._running = False
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass
            self._heartbeat_task = None

        if self._session and not self._session.closed:
            await self._session.close()
            self._session = None

    async def _heartbeat_loop(self):
        """Periodically ping peers with state."""
        while self._running:
            try:
                await self._send_heartbeats()
            except Exception as e:
                logger.error(f"Error in federation heartbeat loop: {e}")

            try:
                await asyncio.sleep(self.heartbeat_interval)
            except asyncio.CancelledError:
                break

    async def _send_heartbeats(self):
        if not self._session or self._session.closed:
            return

        self_payload = self.get_self_state().to_dict()

        for peer_address in list(self.peers):
            url = f"{peer_address}/v1/federation/heartbeat"
            try:
                async with self._session.post(
                    url,
                    json=self_payload,
                    timeout=aiohttp.ClientTimeout(total=3.0),
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        self.handle_incoming_heartbeat(data)
                    else:
                        logger.debug(f"Heartbeat to {url} returned HTTP {resp.status}")
            except (aiohttp.ClientError, asyncio.TimeoutError):
                logger.debug(f"Peer unreachable at {url}")
            except Exception as e:
                logger.debug(f"Heartbeat exception for {url}: {e}")
