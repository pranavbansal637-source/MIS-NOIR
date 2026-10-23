import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
import { Hand, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { activeModal, setModal, loginWithPalm, loginWithCredentials, isAuthenticated, logout } = useApp();
  const [studentIdInput, setStudentIdInput] = useState('NX-2026-8891');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  const [isScanningPalm, setIsScanningPalm] = useState(false);

  if (activeModal !== 'AUTH_MODAL') return null;

  const handlePalmSignIn = () => {
    setIsScanningPalm(true);
    setTimeout(() => {
      setIsScanningPalm(false);
      loginWithPalm();
      setModal(null);
    }, 1200);
  };

  const handleCredSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentials(studentIdInput);
    setModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 28, maxWidth: 440, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <NoirLogo size="sm" showSubtitle={true} />
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
        </div>

        {isAuthenticated ? (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: '#0F172A' }}>Sign Out Confirmation</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Are you sure you want to sign out of your NEXORA Operating System session?
            </p>
            <button
              onClick={() => {
                logout();
                setModal(null);
              }}
              className="btn btn-danger btn-lg"
              style={{ width: '100%' }}
            >
              Sign Out Now
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: '#0F172A' }}>NEXORA Identity Portal</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Touch Palm to Sensor or Sign In with Campus Credentials
            </p>

            {/* Palm Sign-in Option */}
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '2px dashed #2563EB',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                marginBottom: 20,
                cursor: 'pointer'
              }}
              onClick={handlePalmSignIn}
            >
              <Hand size={42} color="#2563EB" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: 14, fontWeight: 800, color: '#2563EB' }}>
                {isScanningPalm ? 'Detecting Palm Subdermal Hash...' : '[ SCAN PALM TO SIGN IN ]'}
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                Instant Biometric Identity Pass
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0', color: 'var(--text-muted)', fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
              <span>OR USE CREDENTIALS</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
            </div>

            {/* Credential Form */}
            <form onSubmit={handleCredSignIn} style={{ textAlign: 'left' }}>
              <div className="form-group">
                <label className="form-label">Student / Employee ID</label>
                <input
                  type="text"
                  className="input-field"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secure Password</label>
                <input
                  type="password"
                  className="input-field"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 10 }}>
                Sign In to NEXORA OS
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
