import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, X, Send, Bot, User as UserIcon, CheckCircle2 } from 'lucide-react';

export const AiAssistantDrawer: React.FC = () => {
  const { activeModal, setModal, aiMessages, sendAiMessage, confirmAiPayment } = useApp();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (activeModal !== 'AI_ASSISTANT') return null;

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim()) return;

    setInputText('');
    setLoading(true);
    await sendAiMessage(prompt);
    setLoading(false);
  };

  const suggestions = [
    'What is my next class?',
    "What's my attendance breakdown?",
    'Show today\'s events',
    'Where is Room A403?',
    'Show my wallet balance'
  ];

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 520,
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.15), 0 0 35px rgba(37, 99, 235, 0.08)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.15)'
              }}
            >
              <Sparkles size={18} color="#2563EB" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A' }}>NEXORA AI Intelligence</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>
                Autonomous Campus Neural Core • Permission-Aware
              </div>
            </div>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Message Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {aiMessages.map((msg) => {
            const isBot = msg.sender !== 'USER';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  flexDirection: isBot ? 'row' : 'row-reverse'
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: isBot ? '#EFF6FF' : '#F1F5F9',
                    border: isBot ? '1px solid #BFDBFE' : '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isBot ? (
                    <Bot size={16} color="#2563EB" />
                  ) : (
                    <UserIcon size={16} color="#0F172A" />
                  )}
                </div>

                <div style={{ maxWidth: '80%' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isBot ? '#F1F5F9' : '#2563EB',
                      color: isBot ? '#0F172A' : '#FFFFFF',
                      fontWeight: isBot ? 500 : 700,
                      border: isBot ? '1px solid #E2E8F0' : 'none',
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                      boxShadow: isBot ? '0 2px 6px rgba(0,0,0,0.03)' : '0 4px 14px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Confirmation Action UI if AI generated an explicit request */}
                  {msg.actionRequired && (
                    <div
                      style={{
                        marginTop: 10,
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: 'var(--radius-md)',
                        padding: 14,
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>
                        Payment Action Requested
                      </div>
                      <div style={{ fontSize: 12, color: '#334155' }}>
                        Amount: <strong style={{ color: '#059669' }}>₹{msg.actionRequired.details.amount}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>
                        Purpose: {msg.actionRequired.details.purpose}
                      </div>

                      {msg.actionRequired.confirmed ? (
                        <span className="badge badge-success">
                          <CheckCircle2 size={12} /> Payment Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmAiPayment(msg.actionRequired!.details)}
                          className="btn btn-primary btn-sm"
                          style={{ width: '100%' }}
                        >
                          [ CONFIRM PAYMENT ]
                        </button>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: 10,
                      color: '#94A3B8',
                      marginTop: 4,
                      textAlign: isBot ? 'left' : 'right'
                    }}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ fontSize: 12, color: '#2563EB', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> NEXORA AI is querying campus systems...
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: '8px 16px',
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC'
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                fontSize: 11,
                color: '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: 8,
            backgroundColor: '#FFFFFF'
          }}
        >
          <input
            type="text"
            className="input-field"
            placeholder="Ask NEXORA AI something..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-icon" disabled={!inputText.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistantDrawer;
