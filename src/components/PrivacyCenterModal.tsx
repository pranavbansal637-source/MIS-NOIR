import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, X } from 'lucide-react';

export const PrivacyCenterModal: React.FC = () => {
  const { activeModal, setModal } = useApp();

  if (activeModal !== 'PRIVACY') return null;

  const privacyModules = [
    { title: 'Palm Biometrics', detail: 'Subdermal vascular vector hashes stored in encrypted hardware vault. Never raw biometric images.', status: 'Protected' },
    { title: 'Academic Documents', detail: 'End-to-end encrypted transcript records. Access requires time-bound token generation.', status: 'Encrypted' },
    { title: 'Campus Pay & Wallet', detail: 'PCI-DSS compliant payment ledger with audit log receipts.', status: 'Audited' },
    { title: 'AI Assistant Queries', detail: 'Permission-bounded tool access. Cannot modify grades or execute unconfirmed transfers.', status: 'Scoped' }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24, maxWidth: 540 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={22} color="#F59E0B" />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#F8FAFC' }}>NEXORA Privacy & Data Governance</span>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} color="#94A3B8" />
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          NEXORA enforces strict data minimization, RBAC access control, and user sovereignty over biometric and academic records.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {privacyModules.map((item, index) => (
            <div
              key={index}
              style={{
                padding: 14,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.detail}</div>
              </div>
              <span className="badge badge-success">{item.status}</span>
            </div>
          ))}
        </div>

        <button onClick={() => setModal(null)} className="btn btn-primary" style={{ width: '100%' }}>
          Understood & Verified
        </button>
      </div>
    </div>
  );
};

export default PrivacyCenterModal;
