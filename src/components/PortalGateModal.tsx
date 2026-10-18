import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
import type { Role } from '../types';
import {
  ShieldAlert,
  Lock,
  X,
  Smartphone,
  Building2,
  Store,
  GraduationCap,
  Hand,
  KeyRound,
  Sparkles
} from 'lucide-react';

interface PortalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: Role | null;
  onSuccess: (role: Role) => void;
}

export const PortalGateModal: React.FC<PortalGateModalProps> = ({
  isOpen,
  onClose,
  targetRole: initialTargetRole,
  onSuccess
}) => {
  const { switchRole, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>(initialTargetRole || 'STUDENT');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanningPalm, setIsScanningPalm] = useState(false);

  if (!isOpen) return null;

  // Security Credentials Specification for each separate Portal
  const portalSecurity: Record<
    Role,
    {
      title: string;
      desc: string;
      icon: any;
      color: string;
      demoPin: string;
      pinLabel: string;
      allowInstantPalm: boolean;
    }
  > = {
    STUDENT: {
      title: 'NEXORA Student OS',
      desc: 'Personal Digital Campus Workspace (Grades, Attendance, Wallet, ID)',
      icon: Smartphone,
      color: '#F59E0B',
      demoPin: '1111',
      pinLabel: 'Student PIN (or PIN: 1111)',
      allowInstantPalm: true
    },
    BUSINESS: {
      title: 'NEXORA Business / Merchant POS OS',
      desc: 'Restricted to Verified Storekeepers & Canteen Cashiers',
      icon: Store,
      color: '#10B981',
      demoPin: '8821',
      pinLabel: 'Merchant Key (PIN: 8821)',
      allowInstantPalm: true
    },
    MANAGEMENT: {
      title: 'NEXORA University Management OS',
      desc: 'Institutional Governance, NAAC Telemetry, Terminals & RBAC Security',
      icon: Building2,
      color: '#FBBF24',
      demoPin: '9900',
      pinLabel: 'Admin Master Passkey (PIN: 9900)',
      allowInstantPalm: true
    },
    FACULTY: {
      title: 'NEXORA Faculty Instructor OS',
      desc: 'Authorized Academic Instructors, Live Attendance & Grading Roster',
      icon: GraduationCap,
      color: '#F59E0B',
      demoPin: '4403',
      pinLabel: 'Faculty Passcode (PIN: 4403)',
      allowInstantPalm: true
    },
    KIOSK: {
      title: 'NEXORA Touch Terminal Node',
      desc: 'Dedicated Physical Optical Palm Hardware Scanner Screen',
      icon: Hand,
      color: '#F59E0B',
      demoPin: '1234',
      pinLabel: 'Terminal Operator Lock (PIN: 1234)',
      allowInstantPalm: false
    },
    DEPARTMENT_ADMIN: {
      title: 'Department Admin',
      desc: 'Academic Department Head Console',
      icon: Building2,
      color: '#FBBF24',
      demoPin: '9900',
      pinLabel: 'Dept Passkey (PIN: 9900)',
      allowInstantPalm: true
    },
    SUPER_ADMIN: {
      title: 'NEXORA Super Admin',
      desc: 'Full System Root Access Console',
      icon: ShieldAlert,
      color: '#EF4444',
      demoPin: '9900',
      pinLabel: 'Root Master Key (PIN: 9900)',
      allowInstantPalm: true
    },
    CLUB_ADMIN: {
      title: 'Club Admin',
      desc: 'Campus Society Governance',
      icon: Smartphone,
      color: '#F59E0B',
      demoPin: '1111',
      pinLabel: 'PIN: 1111',
      allowInstantPalm: true
    },
    LIBRARY_STAFF: {
      title: 'Library Staff',
      desc: 'Book Circulation Desk',
      icon: Building2,
      color: '#0284C7',
      demoPin: '9900',
      pinLabel: 'Staff PIN: 9900',
      allowInstantPalm: true
    },
    HOSTEL_ADMIN: {
      title: 'Hostel Admin',
      desc: 'Warden & Gate Clearance',
      icon: Building2,
      color: '#F59E0B',
      demoPin: '9900',
      pinLabel: 'Warden PIN: 9900',
      allowInstantPalm: true
    },
    SECURITY: {
      title: 'Security Desk',
      desc: 'Gate Biometric Turnstile Console',
      icon: ShieldAlert,
      color: '#EF4444',
      demoPin: '9900',
      pinLabel: 'Security PIN: 9900',
      allowInstantPalm: true
    }
  };

  const currentPortalConfig = portalSecurity[selectedRole] || portalSecurity.STUDENT;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Verification check: Student allows blank or 1111; other roles require correct PIN
    if (selectedRole === 'STUDENT') {
      executeUnlock(selectedRole);
      return;
    }

    if (pinInput.trim() === currentPortalConfig.demoPin) {
      executeUnlock(selectedRole);
    } else {
      setErrorMsg(`Access Denied: Invalid passcode for ${currentPortalConfig.title}. Please enter ${currentPortalConfig.demoPin}.`);
    }
  };

  const handlePalmUnlock = () => {
    setIsScanningPalm(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsScanningPalm(false);
      executeUnlock(selectedRole);
    }, 1200);
  };

  const executeUnlock = (target: Role) => {
    switchRole(target);
    onSuccess(target);
    onClose();
    setPinInput('');
    showToast(`✓ Authentication Successful. Unlocked [${currentPortalConfig.title}]`);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 620,
          padding: 30,
          background: 'rgba(10, 14, 22, 0.98)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(245, 158, 11, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <NoirLogo size="sm" showSubtitle={false} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#F59E0B', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                SECURITY ACCESS GATEWAY
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#F8FAFC' }}>
                Role-Isolated Portal Sign In
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Informative Security Banner */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: 12,
            marginBottom: 20,
            fontSize: 12,
            color: '#CBD5E1',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <Lock size={16} color="#F59E0B" style={{ flexShrink: 0 }} />
          <span>
            Each interface is strictly segregated. To access Management, Merchant POS, or Faculty consoles, enter the respective authorization passkey below.
          </span>
        </div>

        {/* Portal Selection Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 24 }}>
          {[
            { role: 'STUDENT' as Role, label: 'Student OS', icon: Smartphone, pin: 'Free / 1111' },
            { role: 'BUSINESS' as Role, label: 'Shopkeeper POS', icon: Store, pin: 'PIN: 8821' },
            { role: 'MANAGEMENT' as Role, label: 'Management', icon: Building2, pin: 'PIN: 9900' },
            { role: 'FACULTY' as Role, label: 'Faculty OS', icon: GraduationCap, pin: 'PIN: 4403' },
            { role: 'KIOSK' as Role, label: 'Palm Kiosk', icon: Hand, pin: 'PIN: 1234' }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                onClick={() => {
                  setSelectedRole(item.role);
                  setErrorMsg('');
                  setPinInput(portalSecurity[item.role]?.demoPin || '');
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px 8px',
                  borderRadius: 12,
                  backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                  border: isSelected ? '2px solid #F59E0B' : '1px solid var(--border-color)',
                  color: isSelected ? '#FBBF24' : '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <Icon size={20} color={isSelected ? '#F59E0B' : '#64748B'} style={{ marginBottom: 6 }} />
                <span style={{ fontSize: 12, fontWeight: isSelected ? 800 : 600 }}>{item.label}</span>
                <span style={{ fontSize: 10, color: isSelected ? '#F59E0B' : '#64748B', marginTop: 2, fontWeight: 700 }}>
                  {item.pin}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Portal Authentication Form */}
        <div
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            marginBottom: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: currentPortalConfig.color,
                boxShadow: `0 0 10px ${currentPortalConfig.color}`
              }}
            />
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#F8FAFC' }}>
              {currentPortalConfig.title}
            </h3>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
            {currentPortalConfig.desc}
          </p>

          {/* ⚡ Instant 1-Click Access Button (Zero Friction for Evaluation) */}
          <button
            type="button"
            onClick={() => executeUnlock(selectedRole)}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: 14,
              fontWeight: 900,
              gap: 8,
              borderRadius: 12,
              backgroundColor: currentPortalConfig.color,
              borderColor: currentPortalConfig.color,
              color: '#080B12',
              boxShadow: `0 4px 20px ${currentPortalConfig.color}40`,
              cursor: 'pointer',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={16} />
            ⚡ Instant 1-Click Access: Enter {currentPortalConfig.title}
          </button>

          {/* Biometric Palm Option */}
          {currentPortalConfig.allowInstantPalm && (
            <button
              type="button"
              onClick={handlePalmUnlock}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px 18px',
                borderRadius: 12,
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px dashed rgba(245, 158, 11, 0.5)',
                color: '#FBBF24',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                marginBottom: 16,
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.12)'
              }}
            >
              <Hand size={18} color="#F59E0B" />
              {isScanningPalm ? 'Scanning Subdermal Palm Hash...' : `Scan Palm to Authenticate (${selectedRole})`}
            </button>
          )}

          {/* PIN Form */}
          <form onSubmit={handleVerify}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" style={{ fontSize: 12, fontWeight: 800, color: '#E2E8F0' }}>
                {currentPortalConfig.pinLabel}
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: 14, top: 12 }} />
                <input
                  type="password"
                  className="input-field"
                  style={{
                    paddingLeft: 42,
                    fontSize: 15,
                    letterSpacing: '0.1em',
                    backgroundColor: 'rgba(20, 26, 38, 0.95)',
                    color: '#F8FAFC',
                    borderColor: errorMsg ? '#EF4444' : 'rgba(245, 158, 11, 0.3)'
                  }}
                  placeholder={`Enter ${currentPortalConfig.demoPin} to unlock...`}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMsg('');
                  }}
                  autoFocus
                />
              </div>
              <div style={{ fontSize: 11, color: '#F59E0B', marginTop: 4, fontWeight: 700 }}>
                💡 Demo Passkey: <strong>{currentPortalConfig.demoPin}</strong>
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 8,
                  color: '#FCA5A5',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 14
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 900,
                borderRadius: 12,
                backgroundColor: currentPortalConfig.color,
                borderColor: currentPortalConfig.color,
                boxShadow: `0 4px 20px ${currentPortalConfig.color}40`
              }}
            >
              Verify & Enter {currentPortalConfig.title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
