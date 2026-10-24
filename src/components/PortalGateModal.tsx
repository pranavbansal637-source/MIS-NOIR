import React, { useState, useEffect } from 'react';
import { useApp, ROLE_SECURITY_REGISTRY, ROLE_PERSONAS } from '../context/AppContext';
import { PalmService } from '../services/PalmService';
import type { PalmScanResult } from '../services/PalmService';
import { NoirLogo } from './NoirLogo';
import type { Role } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  X,
  Hand,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Cpu,
  Fingerprint,
  Zap,
  ArrowRight
} from 'lucide-react';

interface PortalGateModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  targetRole?: Role | null;
  onSuccess?: (role: Role) => void;
}

export const PortalGateModal: React.FC<PortalGateModalProps> = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  targetRole: propsTargetRole,
  onSuccess: propsOnSuccess
}) => {
  const {
    activeModal,
    pendingRoleTarget,
    role: currentRole,
    isSessionLocked,
    cancelRoleSwitch,
    verifyAndUnlockRole,
    setModal
  } = useApp();

  const isModalOpen =
    propsIsOpen !== undefined
      ? propsIsOpen
      : activeModal === 'INTERFACE_GATE' || Boolean(pendingRoleTarget);

  const effectiveTargetRole: Role =
    propsTargetRole || pendingRoleTarget || (currentRole === 'STUDENT' ? 'FACULTY' : 'STUDENT');

  const [selectedRole, setSelectedRole] = useState<Role>(effectiveTargetRole);
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'VERIFIED' | 'FAILED'>('IDLE');
  const [scanResult, setScanResult] = useState<PalmScanResult | null>(null);

  useEffect(() => {
    if (effectiveTargetRole) {
      setSelectedRole(effectiveTargetRole);
      setPinInput('');
      setErrorMsg('');
      setScanState('IDLE');
      setScanResult(null);
    }
  }, [effectiveTargetRole, isModalOpen]);

  if (!isModalOpen) return null;

  const targetConfig = ROLE_SECURITY_REGISTRY[selectedRole] || ROLE_SECURITY_REGISTRY.STUDENT;
  const currentConfig = ROLE_SECURITY_REGISTRY[currentRole] || ROLE_SECURITY_REGISTRY.STUDENT;
  const targetPersona = ROLE_PERSONAS[selectedRole] || ROLE_PERSONAS.STUDENT;
  const isSelfUnlock = isSessionLocked && selectedRole === currentRole;

  const handleStartPalmScan = async () => {
    setScanState('SCANNING');
    setErrorMsg('');
    try {
      const res = await PalmService.verifyPalmForRole(selectedRole, targetConfig.authorizedUser);
      setScanResult(res);
      if (res.success) {
        setScanState('VERIFIED');
      } else {
        setScanState('FAILED');
        setErrorMsg('Biometric matching failed. Please realign your palm above the sensor.');
      }
    } catch {
      setScanState('FAILED');
      setErrorMsg('Sensor timeout: Unable to capture infrared vascular refraction.');
    }
  };

  const handleQuickAutofillPin = () => {
    setPinInput(targetConfig.demoPin);
    setErrorMsg('');
  };

  const handleQuickDemoScanAndFill = async () => {
    await handleStartPalmScan();
    setPinInput(targetConfig.demoPin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Security Gate 1: Check Palm Scan
    if (scanState !== 'VERIFIED' || !scanResult) {
      setErrorMsg('⚠️ Palm Biometric Scan Required: You must verify your palm vascular pattern before credentials can be authorized.');
      return;
    }

    // Security Gate 2: Check Credentials
    if (!pinInput.trim()) {
      setErrorMsg(`⚠️ Login Passcode Required: Please enter the authorized passcode for ${targetConfig.title}.`);
      return;
    }

    const verification = verifyAndUnlockRole(selectedRole, pinInput, scanResult);
    if (verification.success) {
      if (propsOnSuccess) propsOnSuccess(selectedRole);
      if (propsOnClose) propsOnClose();
    } else {
      setErrorMsg(verification.error || 'Access Denied: Invalid credentials.');
    }
  };

  const handleClose = () => {
    if (propsOnClose) {
      propsOnClose();
    } else {
      cancelRoleSwitch();
      setModal(null);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleClose}
      style={{
        zIndex: 2000,
        backgroundColor: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 30px 90px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(255,255,255,0.8) inset',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            padding: '24px 28px',
            color: '#FFFFFF',
            position: 'relative',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <NoirLogo size="sm" showSubtitle={false} theme="dark" />
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 20,
                  backgroundColor: 'rgba(37, 99, 235, 0.25)',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#93C5FD',
                  textTransform: 'uppercase'
                }}
              >
                <ShieldCheck size={13} color="#60A5FA" />
                Zero-Trust Role Isolation • 2FA Biometric Guard
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-ghost btn-icon btn-sm"
              style={{ color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.08)' }}
              title="Cancel and remain in current workspace"
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isSelfUnlock ? (
              <Lock size={22} color="#F59E0B" />
            ) : (
              <KeyRound size={22} color="#60A5FA" />
            )}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                {isSelfUnlock
                  ? `Resume Session: ${targetConfig.title}`
                  : `Biometric Verification: Switch to ${targetConfig.title}`}
              </h2>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: '4px 0 0 0' }}>
                Identity check required. Unauthorized access to peer interfaces is strictly blocked.
              </p>
            </div>
          </div>

          {/* Transition Pill */}
          {!isSelfUnlock && (
            <div
              style={{
                marginTop: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 14px',
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: 12,
                fontWeight: 700
              }}
            >
              <span style={{ color: '#94A3B8' }}>Current: {currentConfig.title}</span>
              <ArrowRight size={14} color="#60A5FA" />
              <span style={{ color: '#60A5FA' }}>Target: {targetConfig.title}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Data Protection Policy Callout */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 14,
              display: 'flex',
              gap: 12
            }}
          >
            <ShieldAlert size={20} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#1E40AF', marginBottom: 4 }}>
                🔒 Data Privacy Guard: {targetConfig.protectedDataTitle}
              </div>
              <div style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.5 }}>
                To safeguard personal and departmental privacy, each interface is cryptographically isolated.
                Accessing this interface grants visibility to confidential records:
              </div>
              <ul
                style={{
                  margin: '6px 0 0 0',
                  paddingLeft: 18,
                  fontSize: 11,
                  color: '#3B82F6',
                  lineHeight: 1.6
                }}
              >
                {targetConfig.confidentialItems.map((item, idx) => (
                  <li key={idx}><strong>{item}</strong></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Target Switcher Tabs (in case user wants to test another role directly) */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8
              }}
            >
              Target Interface to Authenticate:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
              {[
                { r: 'STUDENT' as Role, label: '🎓 Student OS', pin: '1111' },
                { r: 'FACULTY' as Role, label: '👨‍🏫 Faculty OS', pin: '4403' },
                { r: 'BUSINESS' as Role, label: '🏪 Shop POS', pin: '8821' },
                { r: 'MANAGEMENT' as Role, label: '🏛️ Mgmt Console', pin: '9900' },
                { r: 'KIOSK' as Role, label: '📱 Palm Kiosk', pin: '1234' }
              ].map((item) => {
                const isSelected = selectedRole === item.r;
                return (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(item.r);
                      setScanState('IDLE');
                      setScanResult(null);
                      setPinInput('');
                      setErrorMsg('');
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      textAlign: 'center',
                      fontSize: 11,
                      fontWeight: isSelected ? 900 : 700,
                      backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
                      border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      color: isSelected ? '#1D4ED8' : '#64748B',
                      cursor: 'pointer',
                      transition: 'all 120ms ease'
                    }}
                  >
                    <div>{item.label}</div>
                    <div style={{ fontSize: 9, color: isSelected ? '#2563EB' : '#94A3B8', marginTop: 2 }}>
                      PIN: {item.pin}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 1: Biometric Palm Vein Scan */}
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              backgroundColor: scanState === 'VERIFIED' ? '#ECFDF5' : '#F8FAFC',
              border:
                scanState === 'VERIFIED'
                  ? '2px solid #10B981'
                  : scanState === 'SCANNING'
                  ? '2px solid #2563EB'
                  : '1px solid #E2E8F0',
              transition: 'all 200ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: scanState === 'VERIFIED' ? '#10B981' : '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900
                  }}
                >
                  {scanState === 'VERIFIED' ? '✓' : '1'}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#0F172A' }}>
                    FACTOR 1: Optical Subdermal Palm Biometric Scan
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Verifies authorized personnel template: <strong>{targetConfig.authorizedUser}</strong>
                  </div>
                </div>
              </div>

              {scanState === 'VERIFIED' ? (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: '#059669',
                    backgroundColor: '#D1FAE5',
                    padding: '4px 10px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <CheckCircle2 size={13} /> VERIFIED (99.9%)
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#D97706',
                    backgroundColor: '#FEF3C7',
                    padding: '4px 10px',
                    borderRadius: 20
                  }}
                >
                  MANDATORY
                </span>
              )}
            </div>

            {/* Scanner Visual Box */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 20px',
                borderRadius: 14,
                backgroundColor: scanState === 'VERIFIED' ? '#FFFFFF' : '#F1F5F9',
                border: scanState === 'VERIFIED' ? '1px solid #A7F3D0' : '1px dashed #CBD5E1',
                textAlign: 'center',
                cursor: scanState !== 'VERIFIED' ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={scanState !== 'VERIFIED' ? handleStartPalmScan : undefined}
            >
              {/* Animated Radar Pulse when scanning */}
              {scanState === 'SCANNING' ? (
                <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      border: '3px solid #2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      boxShadow: '0 0 24px rgba(37, 99, 235, 0.4)'
                    }}
                  >
                    <Hand size={36} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#2563EB' }}>
                    Scanning Subdermal Hemoglobin Vascular Bifurcations...
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Infrared Wavelength: 850nm • Liveness Testing Active • Pattern Extraction: 99.8%
                  </div>
                </div>
              ) : scanState === 'VERIFIED' && scanResult ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <CheckCircle2 size={30} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: '#065F46' }}>
                      {scanResult.message}
                    </div>
                    <div style={{ fontSize: 11, color: '#047857', marginTop: 2, fontFamily: 'monospace' }}>
                      Hash: {scanResult.hash} • Liveness: 99.8% • Anti-Spoof: PASS
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      border: '2px dashed #2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Hand size={28} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#1E293B' }}>
                    Click Sensor or Hold Palm 5–10cm Over Scanner
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Touch to trigger biometric vascular match for <strong>{targetConfig.authorizedUser}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Scan Action Controls */}
            {scanState !== 'VERIFIED' && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={handleStartPalmScan}
                  disabled={scanState === 'SCANNING'}
                  className="btn btn-primary btn-sm"
                  style={{
                    flex: 1,
                    backgroundColor: '#2563EB',
                    borderColor: '#2563EB',
                    justifyContent: 'center',
                    gap: 8,
                    fontWeight: 800
                  }}
                >
                  <Hand size={15} />
                  {scanState === 'SCANNING' ? 'Verifying Palm...' : '🖐️ Scan Palm Biometrics'}
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoScanAndFill}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '6px 14px',
                    fontSize: 11,
                    fontWeight: 800,
                    gap: 6,
                    color: '#2563EB',
                    backgroundColor: '#EFF6FF',
                    borderColor: '#BFDBFE'
                  }}
                  title="Automatically run palm verification and fill authorized PIN for rapid evaluation"
                >
                  <Zap size={14} /> Quick Demo Verify
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Role Login Credentials */}
          <div
            style={{
              padding: 18,
              borderRadius: 16,
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900
                  }}
                >
                  2
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#0F172A' }}>
                    FACTOR 2: Role Authorization Passcode
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Enter the authorized security credential for <strong>{targetConfig.title}</strong>
                  </div>
                </div>
              </div>

              {/* Quick-fill helper chip */}
              <button
                type="button"
                onClick={handleQuickAutofillPin}
                className="btn btn-ghost btn-sm"
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#2563EB',
                  backgroundColor: '#EFF6FF',
                  padding: '4px 10px',
                  borderRadius: 20
                }}
              >
                🔑 Autofill PIN: {targetConfig.demoPin}
              </button>
            </div>

            {/* Persona Preview Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 12,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                marginBottom: 14
              }}
            >
              <img
                src={targetPersona.avatar}
                alt={targetPersona.name}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                  {targetPersona.name}
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>
                  Authorized ID: <strong>{targetConfig.authorizedId}</strong> • {targetPersona.department}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: 12, fontWeight: 800, color: '#334155' }}>
                  {targetConfig.pinLabel}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPin ? 'text' : 'password'}
                    className="input-field"
                    placeholder={`Enter ${targetConfig.demoPin}`}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setErrorMsg('');
                    }}
                    style={{
                      paddingRight: 44,
                      fontSize: 15,
                      fontWeight: 700,
                      letterSpacing: showPin ? 'normal' : '0.25em'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#B91C1C',
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-secondary btn-lg"
                  style={{ flex: 1, justifyContent: 'center', fontWeight: 800 }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={scanState !== 'VERIFIED'}
                  style={{
                    flex: 2,
                    backgroundColor: scanState === 'VERIFIED' ? '#2563EB' : '#94A3B8',
                    borderColor: scanState === 'VERIFIED' ? '#2563EB' : '#94A3B8',
                    justifyContent: 'center',
                    gap: 8,
                    fontWeight: 900,
                    boxShadow: scanState === 'VERIFIED' ? '0 4px 16px rgba(37, 99, 235, 0.35)' : 'none',
                    cursor: scanState === 'VERIFIED' ? 'pointer' : 'not-allowed'
                  }}
                >
                  {scanState === 'VERIFIED' ? (
                    <>
                      <Unlock size={17} /> Authenticate & Unlock {targetConfig.title}
                    </>
                  ) : (
                    <>
                      <Hand size={17} /> Scan Palm to Enable Login
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Institutional Compliance Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: '1px solid #E2E8F0',
              fontSize: 11,
              color: '#64748B'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={14} color="#2563EB" />
              <span>AES-256 Vascular Hash Token Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Fingerprint size={14} color="#10B981" />
              <span>ISO/IEC 19794-6 Biometric Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalGateModal;
