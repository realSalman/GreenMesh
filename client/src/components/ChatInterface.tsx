'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchModels, getBaseUrl } from '../lib/api';
import { Model, ChatMessage } from '../types';

interface ChatInterfaceProps {
  onError?: (msg: string) => void;
}

export default function ChatInterface({ onError }: ChatInterfaceProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [activeModel, setActiveModel] = useState<string>('');
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isResponding, setIsResponding] = useState<boolean>(false);

  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, []);

  // Scroll to bottom when messages or response state changes
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isResponding]);

  const loadModels = async () => {
    setIsLoadingModels(true);
    try {
      const data = await fetchModels();
      if (data && data.data) {
        setModels(data.data);
        if (data.data.length > 0) {
          // If activeModel is not set or not in the new list, select the first one
          if (!activeModel || !data.data.some((m) => m.id === activeModel)) {
            setActiveModel(data.data[0].id);
          }
        } else {
          setActiveModel('');
        }
      }
    } catch (err: any) {
      console.error('Failed to load models:', err);
      if (onError) onError('Failed to load models: ' + err.message);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const renderMarkdown = (text: string): string => {
    if (!text) return '';

    // Safety escape
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    html = html.replace(/```([\s\S]*?)```/g, (_match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **bold**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *italic*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Bullet points
    html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  };

  const handleSend = async () => {
    if (isResponding) return;
    const content = input.trim();
    if (!content) return;
    if (!activeModel) {
      if (onError) onError('Please select a model to chat with.');
      return;
    }

    setIsResponding(true);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(updatedMessages);

    // Create entry for assistant
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const devBase = getBaseUrl();
      const response = await fetch(`${devBase}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: activeModel,
          messages: updatedMessages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Inference error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedResponse = '';
      let routingInfo: any = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (let line of lines) {
          line = line.trim();
          if (line === 'data: [DONE]') continue;
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.greenmesh_routing) {
                routingInfo = parsed.greenmesh_routing;
              }
              const contentChunk = parsed.choices?.[0]?.delta?.content || '';
              accumulatedResponse += contentChunk;

              // Update last message
              setMessages((prev) => {
                const next = [...prev];
                if (next.length > 0) {
                  next[next.length - 1] = {
                    role: 'assistant',
                    content: accumulatedResponse,
                    routing: routingInfo || next[next.length - 1].routing,
                  };
                }
                return next;
              });
            } catch (e) {
              // Ignore incomplete JSON chunks from stream slicing
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      if (onError) onError('Chat generation failed: ' + err.message);
      setMessages((prev) => {
        const next = [...prev];
        if (next.length > 0) {
          next[next.length - 1] = { role: 'assistant', content: `Error: ${err.message}`, isError: true };
        }
        return next;
      });
    } finally {
      setIsResponding(false);
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.focus();
      }, 50);
    }
  };

  const getEnergyIcon = (source?: string) => {
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

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-model-selector">
          <label htmlFor="chatModelSelect">Active Model:</label>
          <select
            id="chatModelSelect"
            className="chat-select"
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            disabled={isResponding || isLoadingModels}
          >
            {isLoadingModels ? (
              <option value="">Loading models...</option>
            ) : models.length === 0 ? (
              <option value="">No models available. Start a runner.</option>
            ) : (
              models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))
            )}
          </select>
          <button
            id="chatRefreshModelsBtn"
            className="btn mini-btn"
            onClick={loadModels}
            disabled={isResponding || isLoadingModels}
            title="Refresh models list"
          >
            ⟳
          </button>
        </div>
        <button
          id="chatClearBtn"
          className="btn mini-btn"
          onClick={handleClear}
          disabled={isResponding || messages.length === 0}
        >
          Clear Chat
        </button>
      </div>

      <div ref={chatHistoryRef} className="chat-history" id="chatHistory">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-black)' }}>💬 Federated Green Chat</h3>
            <p style={{ fontSize: '0.85rem' }}>Select a model. Requests are automatically routed to the cluster running on the greenest energy source.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isLastMsg = index === messages.length - 1;
            const isTyping = isResponding && isLastMsg && !msg.content;

            return (
              <div key={index} className={`message ${isUser ? 'user' : 'assistant'}`}>
                <div className="msg-avatar">{isUser ? '👤' : '🤖'}</div>
                <div className="msg-body">
                  {isTyping ? (
                    <div className="typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : isUser ? (
                    msg.content
                  ) : (
                    <>
                      <div
                        style={{ color: msg.isError ? 'var(--color-red)' : 'inherit' }}
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                      {msg.routing && (
                        <div className="routing-badge">
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            🌿 Executed by <strong>{msg.routing.handled_by}</strong> ·{' '}
                            {getEnergyIcon(msg.routing.energy_source)} {msg.routing.energy_source.toUpperCase()} (Score: {msg.routing.greenness_score})
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="chat-input-area">
        <div className="chat-form">
          <textarea
            ref={textareaRef}
            id="chatInput"
            className="chat-textarea"
            placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isResponding || !activeModel}
          />
          <button
            onClick={handleSend}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-end', height: '38px' }}
            disabled={isResponding || !input.trim() || !activeModel}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
