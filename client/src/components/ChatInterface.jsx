'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchModels, getBaseUrl } from '../lib/api';

export default function ChatInterface({ onError }) {
  const [models, setModels] = useState([]);
  const [activeModel, setActiveModel] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  const chatHistoryRef = useRef(null);
  const textareaRef = useRef(null);

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
    } catch (err) {
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Safety escape
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
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
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

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

    const updatedMessages = [...messages, { role: 'user', content }];
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedResponse = '';

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
              const contentChunk = parsed.choices[0]?.delta?.content || '';
              accumulatedResponse += contentChunk;
              
              // Update last message
              setMessages((prev) => {
                const next = [...prev];
                if (next.length > 0) {
                  next[next.length - 1] = { role: 'assistant', content: accumulatedResponse };
                }
                return next;
              });
            } catch (e) {
              // Ignore incomplete JSON chunks from stream slicing
            }
          }
        }
      }
    } catch (err) {
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
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-black)' }}>💬 Chat Room</h3>
            <p style={{ fontSize: '0.85rem' }}>Select a model from the list above and start chatting. Responses stream in real-time.</p>
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
                    <div
                      style={{ color: msg.isError ? 'var(--color-red)' : 'inherit' }}
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
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
            rows="1"
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
