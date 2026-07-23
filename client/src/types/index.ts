export interface GreenMeshConfig {
  HEALTH_ENDPOINT?: string;
  GPU_METRICS_ENDPOINT?: string;
  THROUGHPUT_METRICS_ENDPOINT?: string;
  [key: string]: string | undefined;
}

export type FlexLlamaConfig = GreenMeshConfig;

declare global {
  interface Window {
    GREENMESH_CONFIG?: GreenMeshConfig;
    FLEXLLAMA_CONFIG?: FlexLlamaConfig;
  }
}

export interface ClusterInfoItem {
  host?: string;
  port?: number | string;
  current_model?: string | null;
  auto_unload_timeout_seconds?: number;
  auto_unload_countdown_seconds?: number | null;
  gpu_ids?: (string | number)[];
  gpu_indices?: (string | number)[];
  [key: string]: any;
}

export type RunnerInfoItem = ClusterInfoItem;

export interface ModelHealthItem {
  status: 'ok' | 'loading' | 'error' | 'not_running' | 'not_loaded' | 'unloaded' | string;
  message?: string;
}

export interface HealthData {
  clusters: Record<string, boolean>;
  clusterInfo: Record<string, ClusterInfoItem>;
  runners: Record<string, boolean>;
  runnerInfo: Record<string, RunnerInfoItem>;
  modelHealth: Record<string, ModelHealthItem>;
}

export interface RawHealthResponse {
  active_clusters?: Record<string, boolean>;
  cluster_info?: Record<string, ClusterInfoItem>;
  active_runners?: Record<string, boolean>;
  runner_info?: Record<string, RunnerInfoItem>;
  model_health?: Record<string, ModelHealthItem>;
}

export interface GpuItem {
  index: number;
  id?: string | number;
  name?: string;
  vendor?: string;
  memory_used_mb?: number | null;
  memory_total_mb?: number | null;
  utilization_gpu_percent?: number | null;
  temperature_c?: number | null;
}

export interface GpuHistoryItem {
  memory_used_mb?: (number | null)[];
  utilization_gpu_percent?: (number | null)[];
  temperature_c?: (number | null)[];
}

export interface GpuMetricsResponse {
  status: 'available' | string;
  reason?: string;
  collection_error?: string;
  gpus?: GpuItem[];
  gpu_history?: Record<string, GpuHistoryItem>;
  cluster_associations?: Record<string, { gpu_ids?: (string | number)[]; gpu_indices?: (string | number)[] }>;
  runner_associations?: Record<string, { gpu_ids?: (string | number)[]; gpu_indices?: (string | number)[] }>;
}

export interface ThroughputModelItem {
  alias: string;
  avg_gen_tps_1m?: number | null;
  peak_gen_tps?: number | null;
}

export interface ThroughputHistoryItem {
  generation_tokens_per_second?: (number | null)[];
  prompt_tokens_per_second?: (number | null)[];
}

export interface ThroughputMetricsResponse {
  status: 'available' | string;
  reason?: string;
  models?: ThroughputModelItem[];
  throughput_history?: Record<string, ThroughputHistoryItem>;
}

export interface Model {
  id: string;
  [key: string]: any;
}

export interface ModelsResponse {
  data?: Model[];
}

export type EnergySource = 'solar' | 'wind' | 'grid';

export interface FederationNode {
  node_id: string;
  node_name: string;
  address: string;
  energy_source: EnergySource;
  greenness_score: number;
  available_models: string[];
  gpu_utilization: number;
  is_self: boolean;
  is_online: boolean;
  last_heartbeat: number;
}

export interface FederationNodesResponse {
  enabled: boolean;
  nodes: FederationNode[];
  self_node_id: string | null;
}

export interface RoutingMetadata {
  handled_by: string;
  energy_source: EnergySource;
  greenness_score: number;
  node_address: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isError?: boolean;
  routing?: RoutingMetadata;
}

