'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchHealth, fetchGpuMetrics, fetchThroughputMetrics } from '../lib/api';
import RunnersList from '../components/RunnersList';
import ModelsList from '../components/ModelsList';
import MetricsCards from '../components/MetricsCards';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.port === '3001' || process.env.NEXT_PUBLIC_APP_MODE === 'user') {
        setIsRedirecting(true);
        router.replace('/chat');
      }
    }
  }, [router]);

  const [healthData, setHealthData] = useState({
    runners: {},
    runnerInfo: {},
    modelHealth: {},
  });
  const [gpuMetrics, setGpuMetrics] = useState(null);
  const [throughputMetrics, setThroughputMetrics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(true);

  // Clear error toast helper
  const hideError = useCallback(() => setError(null), []);

  // Show error helper with auto-hide
  const showError = useCallback((msg) => {
    setError(msg);
  }, []);

  // Set up auto-dismiss for error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        hideError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, hideError]);

  // Fetch functions
  const loadHealthData = useCallback(async () => {
    try {
      const data = await fetchHealth();
      if (data) {
        setHealthData({
          runners: data.active_runners || {},
          runnerInfo: data.runner_info || {},
          modelHealth: data.model_health || {},
        });
        setLastUpdated(new Date());
        hideError();
      }
    } catch (err) {
      console.error('Error fetching health data:', err);
      showError('Failed to fetch runner data: ' + err.message);
    }
  }, [hideError, showError]);

  const loadGpuMetrics = useCallback(async () => {
    try {
      const data = await fetchGpuMetrics();
      if (data) {
        setGpuMetrics(data);
      }
    } catch (err) {
      console.error('Error fetching GPU metrics:', err);
      // We don't block health updates for GPU errors, but log them
    }
  }, []);

  const loadThroughputMetrics = useCallback(async () => {
    try {
      const data = await fetchThroughputMetrics();
      if (data) {
        setThroughputMetrics(data);
      }
    } catch (err) {
      console.error('Error fetching throughput metrics:', err);
    }
  }, []);

  // Unified refresh trigger
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadHealthData(),
      loadGpuMetrics(),
      loadThroughputMetrics(),
    ]);
  }, [loadHealthData, loadGpuMetrics, loadThroughputMetrics]);

  // Tracks window focus and visibility
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleVisibilityChange = () => {
      setIsFocused(!document.hidden);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Primary Refresh Loop
  useEffect(() => {
    // Initial fetch
    refreshAll();

    // Only set up interval loop if window/tab is focused
    if (!isFocused) return;

    const intervalId = setInterval(() => {
      refreshAll();
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isFocused, refreshAll]);

  if (isRedirecting) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="title-section">
            <span className="title-icon">💬</span>
            <span className="title-text">Redirecting to Chat Room...</span>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="title-section">
          <span className="title-icon">🗄️</span>
          <span className="title-text">Data Center Admin Dashboard</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="indicator">
            <span className="pulse-dot" />
            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Auto-refresh</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
        {/* Last Updated Timestamp */}
        {lastUpdated && (
          <div className="last-updated" style={{ textAlign: 'right', marginTop: '-0.75rem' }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}

        <div className="sections-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Runners & Models Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <RunnersList
              runners={healthData.runners}
              runnerInfo={healthData.runnerInfo}
              modelHealth={healthData.modelHealth}
              onRefresh={refreshAll}
            />

            <ModelsList
              modelHealth={healthData.modelHealth}
              runnerModels={healthData.runnerInfo}
            />
          </div>

          {/* Metrics Panel */}
          <MetricsCards
            gpuMetrics={gpuMetrics}
            throughputMetrics={throughputMetrics}
          />
        </div>
      </main>

      {/* Error Toast Overlay */}
      {error && (
        <div className="error-toast">
          <span>⚠️ {error}</span>
          <button className="error-close" onClick={hideError}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
