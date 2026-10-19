import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Phone, Ambulance, Flame, Lock, X } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { activeModal, setModal, showToast } = useApp();

  if (activeModal !== 'EMERGENCY') return null;

  const contacts = [
    { title: 'Campus Security Desk (Gate 1)', phone: '+91 11 2987 0001', icon: Lock, status: '24/7 Active' },
    { title: 'Campus Medical & Trauma Station', phone: '+91 11 2987 0002', icon: Ambulance, status: 'On Duty' },
    { title: 'Fire & Safety Incident Officer', phone: '+91 11 2987 0003', icon: Flame, status: 'Emergency Response' },
    { title: 'Women Safety & Helpline Cell', phone: '+91 11 2987 0004', icon: ShieldAlert, status: 'Direct Line' }
  ];

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24, borderColor: 'rgba(239, 68, 68, 0.4)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert size={22} color="var(--state-danger)" />
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--state-danger)' }}>
              NEXORA Emergency Contacts
            </span>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
          For immediate campus assistance, contact central security or dispatch a high-priority alert.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {contacts.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={20} color="var(--state-danger)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.status}</div>
                  </div>
                </div>
                <a
                  href={`tel:${c.phone}`}
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Alert dispatched to ${c.title}. Security notified.`);
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <Phone size={14} /> Call
                </a>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            showToast('🚨 SOS Emergency Signal Sent to Gate 1 Security Desk!');
            setModal(null);
          }}
          className="btn btn-danger btn-lg"
          style={{ width: '100%' }}
        >
          [ TRIGGER SOS DISPATCH ALERT ]
        </button>
      </div>
    </div>
  );
};
