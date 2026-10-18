import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, CheckCircle2 } from 'lucide-react';

export const HostelPage: React.FC = () => {
  const { hostelDetails, applyGatePass } = useApp();
  const [gateReason, setGateReason] = useState('Weekend Home Outing');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Hostel Residence & Mess Pass</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Room allocation, Warden contacts, Digital Gate Pass generator & Mess Pass QR
        </p>
      </div>

      <div className="grid-2">
        {/* Residence Overview */}
        <div className="noir-card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{hostelDetails.block}</h3>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-primary)', marginBottom: 12 }}>
            Room {hostelDetails.roomNo}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div>Warden: <strong>{hostelDetails.wardenName}</strong></div>
            <div>Warden Phone: {hostelDetails.wardenPhone}</div>
            <div>Diet Preference: <span className="badge badge-success">{hostelDetails.dietPreference} MESS PASS</span></div>
          </div>
        </div>

        {/* Digital Gate Pass Request */}
        <div className="noir-card">
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Apply for Digital Outing Gate Pass</h3>
          <div className="form-group">
            <label className="form-label">Outing Reason</label>
            <input
              type="text"
              className="input-field"
              value={gateReason}
              onChange={(e) => setGateReason(e.target.value)}
            />
          </div>
          <button onClick={() => applyGatePass(gateReason)} className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={16} /> Request Outing Pass
          </button>
        </div>
      </div>

      {/* Approved Gate Passes */}
      <div className="noir-card">
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Active Gate Passes</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hostelDetails.gatePasses.map((gp) => (
            <div key={gp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <strong style={{ fontSize: 14 }}>{gp.reason}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Depart: {gp.departureTime} • Return: {gp.returnTime}</div>
              </div>
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> {gp.status} (Scan Gate 1 Turnstile)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
