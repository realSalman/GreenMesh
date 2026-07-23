'use client';

import React from 'react';
import { ModelHealthItem, RunnerInfoItem } from '../types';

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  ok: { label: 'Ready', class: 'ok' },
  loading: { label: 'Loading', class: 'loading' },
  error: { label: 'Error', class: 'error' },
  not_running: { label: 'Not Running', class: 'error' },
  not_loaded: { label: 'Not Loaded', class: 'error' },
};

interface ModelsListProps {
  modelHealth: Record<string, ModelHealthItem>;
  runnerModels: Record<string, RunnerInfoItem>;
}

export default function ModelsList({ modelHealth, runnerModels }: ModelsListProps) {
  const loadedModels = new Set(
    Object.values(runnerModels)
      .map((info) => info?.current_model)
      .filter((m): m is string => Boolean(m))
  );

  const modelItems = Object.entries(modelHealth).map(([modelAlias, health]) => {
    return {
      alias: modelAlias,
      health,
      isLoaded: loadedModels.has(modelAlias),
    };
  });

  // Sort model items: loaded first, then status priority, then alphabetical
  modelItems.sort((a, b) => {
    if (a.isLoaded !== b.isLoaded) {
      return Number(b.isLoaded) - Number(a.isLoaded);
    }
    const statusPriority: Record<string, number> = {
      ok: 5,
      loading: 4,
      error: 3,
      not_loaded: 2,
      not_running: 1,
      unloaded: 0,
    };
    const aPriority = statusPriority[a.health.status] || 0;
    const bPriority = statusPriority[b.health.status] || 0;
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    return a.alias.localeCompare(b.alias);
  });

  return (
    <div className="section">
      <div className="section-title-wrapper">
        <h2 className="section-title">Available Models</h2>
      </div>
      <div className="card models-overview-card">
        {modelItems.length === 0 ? (
          <div className="unavailable-state">
            <span className="unavailable-text">No models available</span>
          </div>
        ) : (
          modelItems.map((model) => {
            const status = model.health.status || 'unloaded';
            const statusInfo = STATUS_MAP[status] || { label: status, class: 'error' };

            return (
              <div key={model.alias} className="model-row">
                <div>
                  <div className="model-name" title={model.alias}>
                    {model.alias}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                    {model.health.message || 'No message'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span className={`status-badge ${statusInfo.class}`}>
                    <span className={`status-dot ${statusInfo.class}`} />
                    {statusInfo.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {model.isLoaded ? 'Loaded' : 'Idle'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
