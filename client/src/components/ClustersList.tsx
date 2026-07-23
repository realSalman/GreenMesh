'use client';

import React, { useState } from 'react';
import { startCluster, stopCluster, restartCluster } from '../lib/api';
import { ClusterInfoItem, ModelHealthItem } from '../types';

interface ClustersListProps {
  clusters: Record<string, boolean>;
  clusterInfo: Record<string, ClusterInfoItem>;
  modelHealth: Record<string, ModelHealthItem>;
  onRefresh?: () => Promise<void> | void;
}

export default function ClustersList({ clusters, clusterInfo, modelHealth, onRefresh }: ClustersListProps) {
  const [loadingClusters, setLoadingClusters] = useState<Record<string, string | null>>({});

  const handleAction = async (
    clusterName: string,
    actionFn: (name: string) => Promise<any>,
    actionName: string
  ) => {
    setLoadingClusters((prev) => ({ ...prev, [clusterName]: actionName }));
    try {
      await actionFn(clusterName);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error(`Failed to ${actionName} cluster ${clusterName}:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingClusters((prev) => ({ ...prev, [clusterName]: null }));
    }
  };

  const getClusterStatusClass = (clusterName: string): string => {
    const isRunning = clusters[clusterName];
    if (!isRunning) return 'error';

    let anyLoading = false;
    Object.entries(modelHealth).forEach(([modelAlias, health]) => {
      const info = clusterInfo[clusterName];
      if (info && info.current_model === modelAlias && health.status === 'loading') {
        anyLoading = true;
      }
    });

    return anyLoading ? 'loading' : 'ok';
  };

  const getClusterStatusLabel = (clusterName: string): string => {
    const isRunning = clusters[clusterName];
    if (!isRunning) return 'Stopped';

    let anyLoading = false;
    Object.entries(modelHealth).forEach(([modelAlias, health]) => {
      const info = clusterInfo[clusterName];
      if (info && info.current_model === modelAlias && health.status === 'loading') {
        anyLoading = true;
      }
    });

    return anyLoading ? 'Loading' : 'Running';
  };

  return (
    <div className="section">
      <div className="section-title-wrapper">
        <h2 className="section-title">Active Clusters</h2>
      </div>
      <div className="runners-grid">
        {Object.keys(clusters).length === 0 ? (
          <div className="unavailable-state">
            <span className="unavailable-text">No active clusters configured</span>
          </div>
        ) : (
          Object.keys(clusters).map((clusterName) => {
            const isRunning = clusters[clusterName];
            const info = clusterInfo[clusterName] || {};
            const statusClass = getClusterStatusClass(clusterName);
            const statusLabel = getClusterStatusLabel(clusterName);
            const isLoading = loadingClusters[clusterName];
            const displayName =
              clusterName === 'cluster1' || clusterName === 'runner1'
                ? 'Cluster 1'
                : clusterName === 'cluster2' || clusterName === 'runner2'
                ? 'Cluster 2'
                : clusterName.replace(/^runner-?/, 'Cluster ').replace(/^cluster-?/, 'Cluster ');

            return (
              <div key={clusterName} className="card runner-card">
                <div className="runner-header">
                  <div className="runner-title-group">
                    <span className="runner-name">{displayName}</span>
                  </div>
                  <span className={`status-badge ${statusClass}`}>
                    <span className={`status-dot ${statusClass}`} />
                    {statusLabel}
                  </span>
                </div>
                <div className="runner-meta">
                  <div className="runner-meta-row">
                    <span className="runner-meta-label">Address:</span>
                    <span className="runner-meta-val">
                      {info.host ? `${info.host}:${info.port}` : '--'}
                    </span>
                  </div>
                  <div className="runner-meta-row">
                    <span className="runner-meta-label">Active Model:</span>
                    <span className="runner-meta-val">{info.current_model || 'None'}</span>
                  </div>
                  <div className="runner-meta-row">
                    <span className="runner-meta-label">Auto-Unload:</span>
                    <span className="runner-meta-val">
                      {info.auto_unload_timeout_seconds === 0
                        ? 'Disabled'
                        : `${info.auto_unload_timeout_seconds}s`}
                      {info.auto_unload_countdown_seconds !== null &&
                        info.auto_unload_countdown_seconds !== undefined && (
                          <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>
                            (in {info.auto_unload_countdown_seconds}s)
                          </span>
                        )}
                    </span>
                  </div>
                </div>
                <div className="runner-actions">
                  {!isRunning ? (
                    <button
                      className="btn btn-primary"
                      disabled={Boolean(isLoading)}
                      onClick={() => handleAction(clusterName, startCluster, 'starting')}
                    >
                      {isLoading === 'starting' ? 'Starting...' : 'Start'}
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-danger"
                        disabled={Boolean(isLoading)}
                        onClick={() => handleAction(clusterName, stopCluster, 'stopping')}
                      >
                        {isLoading === 'stopping' ? 'Stopping...' : 'Stop'}
                      </button>
                      <button
                        className="btn"
                        disabled={Boolean(isLoading)}
                        onClick={() => handleAction(clusterName, restartCluster, 'restarting')}
                      >
                        {isLoading === 'restarting' ? 'Restarting...' : 'Restart'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export { ClustersList as RunnersList };
