'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from '../../components/ChatInterface';

export default function ChatPage() {
  const [error, setError] = useState(null);

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

  return (
    <div className="app-container">
      {/* User Header */}
      <header className="header">
        <div className="title-section">
          <span className="title-icon">💬</span>
          <span className="title-text"> Chat </span>
        </div>
      </header>

      {/* User Chat Interface */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
        <ChatInterface onError={showError} />
      </main>

      {/* Error Toast */}
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
