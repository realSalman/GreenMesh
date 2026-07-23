'use client';

import React, { useState } from 'react';
import { startRunner, stopRunner, restartRunner } from '../lib/api';

export default function RunnersList({ runners, runnerInfo, modelHealth, onRefresh }) {
  const [loadingRunners, setLoadingRunners] = useState({});

  const handleAction = async (runnerName, actionFn, actionName) => {
    setLoadingRunners((prev) => ({ ...prev, [runnerName]: actionName }));
    try {
      await actionFn(runnerName);
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error(`Failed to ${actionName} runner ${runnerName}:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingRunners((prev) => ({ ...prev, [runnerName]: null }));
    }
  };

  const getRunnerStatusClass = (runnerName) => {
    const isRunning = runners[runnerName];
    if (!isRunning) return 'error';

    let anyLoading = false;
    Object.entries(modelHealth).forEach(([modelAlias, health]) => {
      const info = runnerInfo[runnerName];
      if (info && info.current_model === modelAlias && health.status === 'loading') {
        anyLoading = true;
      }
    });

    return anyLoading ? 'loading' : 'ok';
  };

  const getRunnerStatusLabel = (runnerName) => {
    const isRunning = runners[runnerName];
    if (!isRunning) return 'Stopped';

    let anyLoading = false;
    Object.entries(modelHealth).forEach(([modelAlias, health]) => {
      const info = runnerInfo[runnerName];
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
        {Object.keys(runners).length === 0 ? (
          <div className="unavailable-state">
            <span className="unavailable-text">No active clusters configured</span>
          </div>
        ) : (
          Object.keys(runners).map((runnerName) => {
            const isRunning = runners[runnerName];
            const info = runnerInfo[runnerName] || {};
            const statusClass = getRunnerStatusClass(runnerName);
            const statusLabel = getRunnerStatusLabel(runnerName);
            const isLoading = loadingRunners[runnerName];
            const displayName = runnerName === 'runner1' ? 'Cluster 1' : runnerName === 'runner2' ? 'Cluster 2' : runnerName.replace(/^runner-?/, 'Cluster ');

            return (
              <div key={runnerName} className="card runner-card">
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
                      {info.auto_unload_countdown_seconds !== null && info.auto_unload_countdown_seconds !== undefined && (
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
                      disabled={isLoading}
                      onClick={() => handleAction(runnerName, startRunner, 'starting')}
                    >
                      {isLoading === 'starting' ? 'Starting...' : 'Start'}
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-danger"
                        disabled={isLoading}
                        onClick={() => handleAction(runnerName, stopRunner, 'stopping')}
                      >
                        {isLoading === 'stopping' ? 'Stopping...' : 'Stop'}
                      </button>
                      <button
                        className="btn"
                        disabled={isLoading}
                        onClick={() => handleAction(runnerName, restartRunner, 'restarting')}
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
