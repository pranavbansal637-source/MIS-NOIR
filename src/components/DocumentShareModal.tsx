import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Copy, Check, Clock, X, Lock } from 'lucide-react';

export const DocumentShareModal: React.FC = () => {
  const { activeModal, setModal, selectedDocForShare, generateShareLink, showToast } = useApp();

  const [recipient, setRecipient] = useState('Placement Cell / Recruiter');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'DOCUMENT_SHARE' || !selectedDocForShare) return null;

  const handleGenerate = () => {
    const url = generateShareLink(selectedDocForShare.id, recipient, durationMinutes);
    setGeneratedLink(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    showToast('Secure document verification link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24, maxWidth: 480 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={20} color="var(--brand-primary)" />
            <span style={{ fontSize: 16, fontWeight: 700 }}>Secure Time-Bound Share</span>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {selectedDocForShare.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            Issuer: {selectedDocForShare.issuer} • Verified Digital Signature
          </div>
        </div>

        {!generatedLink ? (
          <div>
            <div className="form-group">
              <label className="form-label">Authorized Recipient Entity</label>
              <input
                type="text"
                className="input-field"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g., Placement Cell, Bank Manager"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link Expiration Time</label>
              <select
                className="input-field"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={60}>1 Hour</option>
                <option value={1440}>24 Hours</option>
              </select>
            </div>

            <button onClick={handleGenerate} className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>
              <ShieldCheck size={16} /> Generate Time-Bound Verification Link
            </button>
          </div>
        ) : (
          <div>
            <div className="badge badge-warning" style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', marginBottom: 16 }}>
              <Clock size={14} /> Link Expires Automatically in {durationMinutes} Minutes
            </div>

            <div className="form-group">
              <label className="form-label">Cryptographically Signed Link</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" className="input-field" value={generatedLink} readOnly />
                <button onClick={handleCopy} className="btn btn-primary">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 20 }}>
              Shared with: <strong>{recipient}</strong>. Access is audited & revoked automatically after expiry.
            </p>

            <button onClick={() => setModal(null)} className="btn btn-secondary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
