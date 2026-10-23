import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PalmService } from '../services/PalmService';
import type { PalmScanResult } from '../services/PalmService';
import { Hand, CheckCircle2, AlertCircle, X, ShieldCheck, RefreshCw, Lock } from 'lucide-react';

export const PalmModal: React.FC = () => {
  const {
    activeModal,
    setModal,
    student,
    recordPalmAttendance,
    pendingRoleTarget,
    loginWithPalm,
    cancelRoleSwitch
  } = useApp();

  const [scanState, setScanState] = useState<'IDLE' | 'DETECTING' | 'VERIFIED' | 'ERROR'>('IDLE');
  const [result, setResult] = useState<PalmScanResult | null>(null);

  if (activeModal !== 'PALM_SCAN') return null;

  const isRoleGate = Boolean(pendingRoleTarget);

  const handleStartScan = async () => {
    setScanState('DETECTING');
    setResult(null);

    // Call PalmService abstraction
    const scanRes = await PalmService.identifyPalm(student);

    if (scanRes.success) {
      setResult(scanRes);
      setScanState('VERIFIED');
      if (isRoleGate) {
        // Unlocks pending interface role
        loginWithPalm();
      } else {
        // Automatically record attendance for current session
        recordPalmAttendance('Marketing Management');
      }
    } else {
      setResult(scanRes);
      setScanState('ERROR');
    }
  };

  const handleReset = () => {
    setScanState('IDLE');
    setResult(null);
  };

  const handleClose = () => {
    if (isRoleGate) {
      cancelRoleSwitch();
    } else {
      setModal(null);
    }
    handleReset();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 32, textAlign: 'center' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isRoleGate ? <Lock size={22} color="#2563EB" /> : <ShieldCheck size={22} color="#2563EB" />}
            <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>
              {isRoleGate
                ? `BIOMETRIC SIGN-IN: ${pendingRoleTarget} INTERFACE`
                : 'NEXORA Palm Biometric Verification'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-icon btn-sm"
          >
            <X size={20} color="#64748B" />
          </button>
        </div>

        {/* Dynamic States */}
        {scanState === 'IDLE' && (
          <div>
            <div
              className="palm-radar-circle"
              style={{
                marginBottom: 24,
                cursor: 'pointer',
                backgroundColor: '#EFF6FF',
                border: '2px dashed #2563EB'
              }}
              onClick={handleStartScan}
            >
              <Hand size={64} color="#2563EB" />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#0F172A' }}>
              {isRoleGate
                ? `SCAN PALM TO UNLOCK ${pendingRoleTarget} INTERFACE`
                : 'PLACE PALM NEAR OPTICAL SENSOR'}
            </h3>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28, maxWidth: 380, margin: '0 auto 28px' }}>
              {isRoleGate
                ? `Position your palm 5–10cm above the sensor to verify identity and securely enter the ${pendingRoleTarget} interface.`
                : 'Position your palm 5–10cm above the NEXORA optical scanner for instant biometric identity verification.'}
            </p>

            <button
              onClick={handleStartScan}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', maxWidth: 320, backgroundColor: '#2563EB' }}
            >
              [ SIMULATE PALM SCAN SIGN-IN ]
            </button>

            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginTop: 14 }}>
              🔒 Subdermal Vascular Biometric Encryption Active
            </p>
          </div>
        )}

        {scanState === 'DETECTING' && (
          <div style={{ padding: '24px 0' }}>
            <div className="palm-radar-circle" style={{ marginBottom: 24, backgroundColor: '#EFF6FF', border: '2px solid #2563EB' }}>
              <div className="palm-radar-pulse" />
              <Hand size={64} color="#2563EB" />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#2563EB' }}>
              Detecting Palm Biometrics...
            </h3>
            <p style={{ fontSize: 14, color: '#64748B' }}>
              Matching vascular pattern template with encrypted campus registry...
            </p>
          </div>
        )}

        {scanState === 'VERIFIED' && result && (
          <div>
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                border: '3px solid #059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 25px rgba(5, 150, 105, 0.2)'
              }}
            >
              <CheckCircle2 size={50} color="#059669" />
            </div>

            <span className="badge badge-success" style={{ marginBottom: 14, fontSize: 13, padding: '6px 14px' }}>
              ✓ Identity Authenticated (99.94% Biometric Match)
            </span>

            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 6 }}>
              {isRoleGate
                ? `INTERFACE UNLOCKED: ${pendingRoleTarget || 'SUCCESS'}`
                : `WELCOME, ${result.matchedStudent?.name || student.name}!`}
            </h2>
            <p style={{ fontSize: 14, color: '#64748B', fontWeight: 600, marginBottom: 20 }}>
              {student.name} • {student.studentId} • {student.program}
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                fontSize: 13,
                color: '#0F172A',
                marginBottom: 24,
                textAlign: 'left',
                lineHeight: 1.6
              }}
            >
              <div><strong>Verification Status:</strong> GRANTED</div>
              <div><strong>Interface Access:</strong> {isRoleGate ? pendingRoleTarget : 'Attendance Check-in'}</div>
              <div><strong>Biometric Key Hash:</strong> {result.hash}</div>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: 14, backgroundColor: '#2563EB' }}
            >
              Enter Interface
            </button>
          </div>
        )}

        {scanState === 'ERROR' && (
          <div>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                border: '2px solid #EF4444',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
              }}
            >
              <AlertCircle size={44} color="#EF4444" />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#DC2626' }}>
              Biometric Access Denied
            </h3>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
              Palm scan does not match authorized credentials for this interface.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleReset} className="btn btn-secondary" style={{ flex: 1, padding: 12 }}>
                <RefreshCw size={16} /> Retry Scan
              </button>
              <button onClick={handleClose} className="btn btn-primary" style={{ flex: 1, padding: 12 }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PalmModal;
