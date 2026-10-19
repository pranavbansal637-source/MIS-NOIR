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
          background: 'rgba(10, 13, 20, 0.98)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(16, 21, 32, 0.95)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Sparkles size={18} color="#FBBF24" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#F8FAFC' }}>NEXORA AI Intelligence</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>
                Autonomous Campus Neural Core • Permission-Aware
              </div>
            </div>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} color="#94A3B8" />
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
                    backgroundColor: isBot ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: isBot ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isBot ? (
                    <Bot size={16} color="#FBBF24" />
                  ) : (
                    <UserIcon size={16} color="#F8FAFC" />
                  )}
                </div>

                <div style={{ maxWidth: '80%' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isBot ? 'rgba(18, 23, 34, 0.95)' : 'var(--grad-primary)',
                      color: isBot ? '#F8FAFC' : '#000000',
                      fontWeight: isBot ? 500 : 700,
                      border: isBot ? '1px solid rgba(245, 158, 11, 0.2)' : 'none',
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                      boxShadow: isBot ? '0 4px 15px rgba(0,0,0,0.4)' : '0 4px 18px rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Confirmation Action UI if AI generated an explicit request */}
                  {msg.actionRequired && (
                    <div
                      style={{
                        marginTop: 10,
                        backgroundColor: 'rgba(20, 26, 38, 0.95)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: 14,
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                        Payment Action Requested
                      </div>
                      <div style={{ fontSize: 12, color: '#CBD5E1' }}>
                        Amount: <strong style={{ color: '#FBBF24' }}>₹{msg.actionRequired.details.amount}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>
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
                      color: '#64748B',
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
            <div style={{ fontSize: 12, color: '#F59E0B', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
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
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(12, 16, 24, 0.95)'
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: 11,
                color: '#CBD5E1',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: 8,
            backgroundColor: 'rgba(10, 13, 20, 0.98)'
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
