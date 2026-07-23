'use client';

import React, { useState } from 'react';
import { setFederationEnergy } from '../lib/api';
import { FederationNode, EnergySource } from '../types';

interface FederationPanelProps {
  nodes: FederationNode[];
  selfNodeId: string | null;
  onRefresh?: () => Promise<void> | void;
}

export default function FederationPanel({ nodes, selfNodeId, onRefresh }: FederationPanelProps) {
  const [updating, setUpdating] = useState<boolean>(false);

  const selfNode = nodes.find((n) => n.is_self || n.node_id === selfNodeId);

  const handleEnergyChange = async (source: EnergySource) => {
    setUpdating(true);
    try {
      await setFederationEnergy(source);
      if (onRefresh) await onRefresh();
    } catch (err: any) {
      console.error('Failed to set energy source:', err);
      alert(`Failed to set energy source: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const getEnergyIcon = (source: EnergySource) => {
    switch (source) {
      case 'solar':
        return '☀️';
      case 'wind':
        return '💨';
      case 'grid':
      default:
        return '⚡';
    }
  };

  const getEnergyLabel = (source: EnergySource) => {
    switch (source) {
      case 'solar':
        return 'Solar (Score: 100 - Greenest)';
      case 'wind':
        return 'Wind (Score: 80 - Greener)';
      case 'grid':
      default:
        return 'Grid (Score: 20 - Standard)';
    }
  };

  return (
    <div className="section federation-section">
      <div className="section-title-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title">
          <span style={{ marginRight: '0.5rem' }}>🌐</span> Federated Data Centers & Power Network
        </h2>
        {selfNode && (
          <div className="power-selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              This PC Power Source:
            </span>
            <select
              className="chat-select"
              style={{ padding: '0.35rem 0.75rem', fontWeight: 600, fontSize: '0.85rem' }}
              value={selfNode.energy_source}
              onChange={(e) => handleEnergyChange(e.target.value as EnergySource)}
              disabled={updating}
            >
              <option value="solar">☀️ Solar Power (100)</option>
              <option value="wind">💨 Wind Power (80)</option>
              <option value="grid">⚡ Grid Power (20)</option>
            </select>
          </div>
        )}
      </div>

      <div className="runners-grid">
        {nodes.length === 0 ? (
          <div className="unavailable-state">
            <span className="unavailable-text">No active nodes in federation</span>
          </div>
        ) : (
          nodes.map((node) => {
            const isOnline = node.is_online;
            const energyIcon = getEnergyIcon(node.energy_source);

            return (
              <div key={node.node_id} className={`card runner-card ${node.is_self ? 'self-node-card' : ''}`}>
                <div className="runner-header">
                  <div className="runner-title-group">
                    <span className="runner-name">
                      {node.node_name} {node.is_self ? '(This PC)' : ''}
                    </span>
                  </div>
                  <span className={`status-badge ${isOnline ? 'ok' : 'error'}`}>
                    <span className={`status-dot ${isOnline ? 'ok' : 'error'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="runner-meta">
                  <div className="runner-meta-row">
                    <span className="runner-meta-label">Power Source:</span>
                    <span className={`energy-badge energy-${node.energy_source}`}>
                      {energyIcon} {node.energy_source.toUpperCase()} ({node.greenness_score})
                    </span>
                  </div>

                  <div className="runner-meta-row">
                    <span className="runner-meta-label">Address:</span>
                    <span className="runner-meta-val">{node.address || 'Unknown'}</span>
                  </div>

                  <div className="runner-meta-row">
                    <span className="runner-meta-label">Available Models:</span>
                    <span className="runner-meta-val">
                      {node.available_models && node.available_models.length > 0
                        ? node.available_models.join(', ')
                        : 'None'}
                    </span>
                  </div>

                  {node.gpu_utilization !== undefined && (
                    <div className="runner-meta-row">
                      <span className="runner-meta-label">Avg GPU Load:</span>
                      <span className="runner-meta-val">{Math.round(node.gpu_utilization)}%</span>
                    </div>
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
