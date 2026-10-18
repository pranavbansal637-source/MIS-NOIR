import React from 'react';
import { useApp } from '../context/AppContext';
import { Power, Radio } from 'lucide-react';

export const PalmTerminalsPage: React.FC = () => {
  const { terminals, toggleTerminalStatus } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
          HARDWARE & BIOMETRIC INFRASTRUCTURE
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Palm Scan Terminal Hardware Manager</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Physical optical scanners deployed in Classrooms (A401–A410), Canteens, Library turnstiles & Gate Security
        </p>
      </div>

      {/* Terminal Cards Grid */}
      <div className="grid-2">
        {terminals.map((t) => {
          const isOnline = t.status === 'ONLINE';
          return (
            <div key={t.id} className="noir-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span className="badge badge-primary">{t.type} TERMINAL</span>
                  <span className={`badge ${isOnline ? 'badge-success' : 'badge-danger'}`}>
                    ● {t.status}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{t.locationName}</h3>
                <div style={{ fontSize: 13, color: 'var(--brand-primary)', fontWeight: 700, marginTop: 2 }}>
                  Terminal Code: {t.terminalCode} (Room {t.roomNumber})
                </div>

                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12, backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: 10, borderRadius: 'var(--radius-md)' }}>
                  <div><strong>IP Address:</strong> {t.ipAddress}</div>
                  <div><strong>MAC:</strong> {t.macAddress}</div>
                  <div><strong>Firmware:</strong> {t.firmwareVersion}</div>
                  <div><strong>Last Heartbeat:</strong> {t.lastPing}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Radio size={14} color={isOnline ? 'var(--state-success)' : 'var(--state-danger)'} /> Baud: 115200 bps
                </span>
                <button onClick={() => toggleTerminalStatus(t.id)} className={`btn ${isOnline ? 'btn-danger' : 'btn-primary'} btn-sm`}>
                  <Power size={14} /> {isOnline ? 'Disconnect' : 'Connect Terminal'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
