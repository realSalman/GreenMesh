'use client';

import React from 'react';
import { formatMb } from '../lib/utils';

// Helper Sparkline Component
function Sparkline({ values, color }) {
  const emptySparkline = (
    <svg viewBox="0 0 120 24" style={{ width: '100%', height: '100%', opacity: 0.3 }}>
      <line x1="0" y1="12" x2="120" y2="12" stroke={color} strokeWidth="1" />
    </svg>
  );

  if (!values || values.length < 2) return emptySparkline;

  const filtered = values.filter((v) => v !== null && v !== undefined);
  if (filtered.length < 2) return emptySparkline;

  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  let range = max - min;
  if (range === 0) range = 1;

  const width = 120;
  const height = 24;
  const padding = 2;
  const step = (width - padding * 2) / (filtered.length - 1);

  const points = filtered.map((value, index) => {
    const x = padding + index * step;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M${points.join(' L')}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Helper Throughput Chart Component
function SvgThroughputChart({ genHistory, promptHistory }) {
  const hGen = genHistory || [];
  const hPrompt = promptHistory || [];

  if (hGen.length === 0 && hPrompt.length === 0) {
    return <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', padding: '1rem 0' }}>No historical throughput data yet</div>;
  }

  const allVals = [...hGen, ...hPrompt].filter((v) => v !== null && v !== undefined);
  const maxVal = allVals.length > 0 ? Math.max(...allVals, 10) : 10;

  const width = 500;
  const height = 100;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 20;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getCoordinates = (history) => {
    if (history.length < 2) return '';
    const step = chartWidth / (history.length - 1);
    return history.map((val, idx) => {
      const x = paddingLeft + idx * step;
      const y = paddingTop + chartHeight - ((val || 0) / maxVal) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' L');
  };

  const genPath = getCoordinates(hGen);
  const promptPath = getCoordinates(hPrompt);

  const gridLines = [];
  const gridCount = 3;
  for (let i = 0; i <= gridCount; i++) {
    const yVal = paddingTop + (chartHeight / gridCount) * i;
    const labelVal = (maxVal - (maxVal / gridCount) * i).toFixed(0);
    gridLines.push({ yVal, labelVal });
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '100px', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
          {gridLines.map(({ yVal, labelVal }, idx) => (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={yVal}
                x2={width - paddingRight}
                y2={yVal}
                stroke="var(--border-light)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              <text
                x={paddingLeft - 5}
                y={yVal + 3}
                fill="var(--text-muted)"
                fontSize="8"
                textAnchor="end"
                fontFamily="var(--font-sans)"
              >
                {labelVal}
              </text>
            </g>
          ))}

          {promptPath && (
            <path
              d={`M${promptPath}`}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          )}

          {genPath && (
            <path
              d={`M${genPath}`}
              fill="none"
              stroke="var(--accent-black)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', marginTop: '0.25rem', color: 'var(--text-secondary)', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-black)', borderRadius: '50%', display: 'inline-block' }} />
          Generation
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block' }} />
          Prompt
        </div>
      </div>
    </div>
  );
}

export default function MetricsCards({ gpuMetrics, throughputMetrics }) {
  // Build a map of GPU IDs to Runner Names
  const buildGpuRunnerMap = (associations) => {
    const map = {};
    if (!associations) return map;
    Object.entries(associations).forEach(([runnerName, info]) => {
      let gpuKeys = [];
      if (Array.isArray(info.gpu_ids)) {
        gpuKeys = info.gpu_ids;
      } else if (Array.isArray(info.gpu_indices)) {
        gpuKeys = info.gpu_indices.map((idx) => String(idx));
      }

      gpuKeys.forEach((gpuKey) => {
        if (!map[gpuKey]) {
          map[gpuKey] = [];
        }
        map[gpuKey].push(runnerName);
      });
    });
    return map;
  };

  const gpuRunnerMap = buildGpuRunnerMap(gpuMetrics?.runner_associations);

  const renderGpuSection = () => {
    if (!gpuMetrics || gpuMetrics.status !== 'available' || !gpuMetrics.gpus || gpuMetrics.gpus.length === 0) {
      const getReasonText = () => {
        if (!gpuMetrics) return 'Loading...';
        const reasonText = {
          unsupported_platform: 'GPU metrics are not supported on this operating system.',
          tool_not_found: 'No supported GPU telemetry tool found. Install nvidia-smi and/or amd-smi.',
          command_failed: 'GPU telemetry command failed. Check driver/tool installation.',
          command_timeout: 'amd-smi command timed out.',
          parse_error: 'Failed to parse amd-smi output.',
          no_visible_gpus: 'No visible GPUs detected.',
          disabled_in_config: 'GPU metrics collection is disabled in configuration.',
          fetch_error: 'Could not reach the GPU metrics endpoint.',
          rate_limited: 'GPU metrics request rate limited.',
        };
        return reasonText[gpuMetrics.reason] || gpuMetrics.collection_error || 'GPU metrics are currently unavailable.';
      };

      return (
        <div className="card">
          <div className="unavailable-state">
            <span className="unavailable-icon">⚠️</span>
            <span className="unavailable-text">GPU Metrics Unavailable</span>
            <span className="unavailable-reason">{getReasonText()}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="gpu-metrics-grid">
        {gpuMetrics.gpus.map((gpu) => {
          const idx = gpu.index;
          const gpuKey = gpu.id ? String(gpu.id) : String(idx);
          const name = gpu.name || `GPU ${idx}`;
          const vendor = gpu.vendor || 'unknown';
          const runners = gpuRunnerMap[gpuKey] || gpuRunnerMap[String(idx)] || [];

          const memUsed = gpu.memory_used_mb !== null ? formatMb(gpu.memory_used_mb) : '--';
          const memTotal = gpu.memory_total_mb !== null ? formatMb(gpu.memory_total_mb) : '--';
          const memPercent =
            gpu.memory_used_mb != null && gpu.memory_total_mb != null && gpu.memory_total_mb > 0
              ? Math.round((gpu.memory_used_mb / gpu.memory_total_mb) * 100)
              : null;

          const util = gpu.utilization_gpu_percent !== null ? `${Math.round(gpu.utilization_gpu_percent)}%` : '--';
          const temp = gpu.temperature_c !== null ? `${Math.round(gpu.temperature_c)}°C` : '--';

          const history = gpuMetrics.gpu_history?.[gpuKey] || {};
          const memHistory = history.memory_used_mb || [];
          const utilHistory = history.utilization_gpu_percent || [];
          const tempHistory = history.temperature_c || [];

          const isMemWarning = memPercent !== null && memPercent > 90;
          const isTempWarning = gpu.temperature_c !== null && gpu.temperature_c > 85;

          return (
            <div key={gpuKey} className="card gpu-card">
              <div className="gpu-header">
                <span className="gpu-title">{name}</span>
                <span className="gpu-vendor">{vendor.toUpperCase()} GPU {idx}</span>
              </div>
              <div className="gpu-metrics-row">
                <div className={`gpu-stat ${isMemWarning ? 'metric-warning' : ''}`} style={{ borderColor: isMemWarning ? 'var(--color-red)' : '' }}>
                  <span className="gpu-stat-label">VRAM</span>
                  <span className="gpu-stat-val" style={{ fontSize: '0.8rem' }}>{memUsed} / {memTotal}</span>
                </div>
                <div className="gpu-stat">
                  <span className="gpu-stat-label">Utility</span>
                  <span className="gpu-stat-val">{util}</span>
                </div>
                <div className={`gpu-stat ${isTempWarning ? 'metric-warning' : ''}`} style={{ borderColor: isTempWarning ? 'var(--color-red)' : '' }}>
                  <span className="gpu-stat-label">Temp</span>
                  <span className="gpu-stat-val">{temp}</span>
                </div>
              </div>
              <div className="gpu-sparklines">
                <div className="sparkline-row">
                  <span className="sparkline-label">VRAM</span>
                  <div className="sparkline-container">
                    <Sparkline values={memHistory} color="var(--accent-black)" />
                  </div>
                </div>
                <div className="sparkline-row">
                  <span className="sparkline-label">Util</span>
                  <div className="sparkline-container">
                    <Sparkline values={utilHistory} color="var(--text-secondary)" />
                  </div>
                </div>
                <div className="sparkline-row">
                  <span className="sparkline-label">Temp</span>
                  <div className="sparkline-container">
                    <Sparkline values={tempHistory} color="var(--text-muted)" />
                  </div>
                </div>
              </div>
              {runners.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                  <strong>Clusters:</strong> {runners.map(r => r === 'runner1' ? 'Cluster 1' : r === 'runner2' ? 'Cluster 2' : r.replace(/^runner-?/, 'Cluster ')).join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderThroughputSection = () => {
    if (!throughputMetrics || throughputMetrics.status !== 'available' || !throughputMetrics.models || throughputMetrics.models.length === 0) {
      const getReasonText = () => {
        if (!throughputMetrics) return 'Loading...';
        const reasonText = {
          disabled: 'Token throughput tracking is disabled in configuration.',
          fetch_error: 'Could not reach the throughput metrics endpoint.',
          rate_limited: 'Throughput metrics request rate limited.',
          internal_error: 'The throughput metrics endpoint returned an error.',
        };
        return reasonText[throughputMetrics.reason] || 'No token throughput recorded yet. Charts appear after completions.';
      };

      return (
        <div className="card">
          <div className="unavailable-state">
            <span className="unavailable-icon">📊</span>
            <span className="unavailable-text">No Throughput Data</span>
            <span className="unavailable-reason">{getReasonText()}</span>
          </div>
        </div>
      );
    }

    const history = throughputMetrics.throughput_history || {};

    return (
      <div className="throughput-grid">
        {throughputMetrics.models.map((model) => {
          const alias = model.alias;
          const modelHistory = history[alias] || {};
          const genHistory = modelHistory.generation_tokens_per_second || [];
          const promptHistory = modelHistory.prompt_tokens_per_second || [];

          return (
            <div key={alias} className="card throughput-card">
              <div className="throughput-card-header">
                <span className="throughput-name">{alias}</span>
                <div className="throughput-stats">
                  <span className="throughput-chip">
                    Avg 1m: <strong>{model.avg_gen_tps_1m !== null ? `${Number(model.avg_gen_tps_1m).toFixed(1)} t/s` : '--'}</strong>
                  </span>
                  <span className="throughput-chip">
                    Peak: <strong>{model.peak_gen_tps !== null ? `${Number(model.peak_gen_tps).toFixed(1)} t/s` : '--'}</strong>
                  </span>
                </div>
              </div>
              <div className="chart-wrapper">
                <SvgThroughputChart genHistory={genHistory} promptHistory={promptHistory} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="sections-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="section">
        <div className="section-title-wrapper">
          <h2 className="section-title">GPU Metrics</h2>
        </div>
        {renderGpuSection()}
      </div>

      <div className="section">
        <div className="section-title-wrapper">
          <h2 className="section-title">Token Throughput</h2>
        </div>
        {renderThroughputSection()}
      </div>
    </div>
  );
}
