import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
import { PortalGateModal } from './PortalGateModal';
import type { Role } from '../types';
import {
  Search,
  Wallet,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  LogOut,
  LogIn,
  Hand,
  Lock,
  KeyRound,
  ChevronDown
} from 'lucide-react';

interface TopHeaderProps {
  onOpenLanding?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenLanding }) => {
  const {
    user,
    student,
    role,
    switchRole,
    showToast,
    setModal,
    demoNotification,
    isAuthenticated
  } = useApp();

  const [showGateModal, setShowGateModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleLabels: Record<Role, string> = {
    STUDENT: 'NEXORA Student OS',
    FACULTY: 'Faculty Portal',
    MANAGEMENT: 'Campus Management',
    DEPARTMENT_ADMIN: 'Department Admin',
    BUSINESS: 'Shopkeeper / POS',
    CLUB_ADMIN: 'Club Admin',
    LIBRARY_STAFF: 'Library Staff',
    HOSTEL_ADMIN: 'Hostel Admin',
    SECURITY: 'Security Desk',
    SUPER_ADMIN: 'Super Admin',
    KIOSK: 'Touch Terminal Kiosk'
  };

  return (
    <header
      style={{
        height: 70,
        backgroundColor: 'rgba(8, 11, 18, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Toast banner overlay if active */}
      {demoNotification && (
        <div
          style={{
            position: 'absolute',
            top: 76,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(12, 16, 24, 0.98)',
            backdropFilter: 'blur(16px)',
            border: '1px solid #10B981',
            color: '#F8FAFC',
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.35)',
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 200,
            animation: 'fadeIn 150ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <CheckCircle2 size={18} color="#10B981" />
          {demoNotification}
        </div>
      )}

      {/* Left section: Logo & Role Pill with Interactive Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          onClick={onOpenLanding}
          style={{ cursor: onOpenLanding ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}
          title={onOpenLanding ? 'Open Workspace & Portal Gateway' : undefined}
        >
          <NoirLogo size="sm" showSubtitle={false} />
        </div>

        {/* Locked Active Role Badge with Interactive Dropdown */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 'var(--radius-full)',
                padding: '7px 16px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(20, 24, 34, 0.9) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#FBBF24',
                boxShadow: '0 2px 12px rgba(245, 158, 11, 0.18)',
                cursor: 'pointer'
              }}
              title="Click to Switch Interface"
            >
              <Lock size={12} color="#F59E0B" />
              {roleLabels[role]}
            </div>

            {/* Direct Switch Interface Button */}
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 'var(--radius-full)',
                padding: '7px 16px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#FBBF24',
                cursor: 'pointer'
              }}
              title="Switch to Student, Shopkeeper POS, Management, Faculty, or Kiosk"
            >
              <KeyRound size={13} color="#F59E0B" />
              Switch Interface
              <ChevronDown size={14} color="#F59E0B" />
            </button>
          </div>

          {/* Quick Portal Switcher Dropdown */}
          {showRoleDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 48,
                left: 0,
                width: 320,
                background: 'rgba(10, 14, 24, 0.98)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 16,
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(245, 158, 11, 0.15)',
                padding: 10,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 900, color: '#F59E0B', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                SELECT INTERFACE (1-CLICK SWITCH)
              </div>

              {[
                { r: 'STUDENT' as Role, label: '🎓 Student OS', desc: 'Personal Student Dashboard, Attendance & Wallet' },
                { r: 'BUSINESS' as Role, label: '🏪 Shopkeeper POS', desc: 'Merchant Canteen Register & Stock Inventory' },
                { r: 'MANAGEMENT' as Role, label: '🏛️ Campus Management', desc: 'Admin Console, Student Registry & NAAC' },
                { r: 'FACULTY' as Role, label: '👨‍🏫 Faculty Instructor OS', desc: 'Class Roll Call, Grading & Course Roster' },
                { r: 'KIOSK' as Role, label: '📱 Palm Hardware Terminal', desc: 'Optical Biometric Touch Kiosk Screen' }
              ].map((item) => {
                const isCurrent = role === item.r;
                return (
                  <button
                    key={item.r}
                    onClick={() => {
                      setShowRoleDropdown(false);
                      switchRole(item.r);
                      showToast(`✓ Switched to ${item.label}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 10,
                      backgroundColor: isCurrent ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
                      border: isCurrent ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 120ms ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: isCurrent ? '#FBBF24' : '#F8FAFC' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="badge badge-primary" style={{ fontSize: 10, padding: '2px 8px' }}>
                        Active
                      </span>
                    )}
                  </button>
                );
              })}

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '6px 0' }} />

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    setShowGateModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 700 }}
                >
                  <Lock size={12} color="#F59E0B" /> Security Passkey Gate
                </button>

                {onOpenLanding && (
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenLanding();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 700 }}
                  >
                    🚀 All Portals Hub
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle section: Global Command Center search trigger */}
      <div
        onClick={() => setModal('COMMAND_CENTER')}
        style={{
          display: 'none',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(16, 21, 32, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 18px',
          width: 340,
          cursor: 'pointer',
          color: '#94A3B8',
          fontSize: 13,
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
        }}
        className="desktop-search-trigger"
      >
        <Search size={16} color="#F59E0B" />
        <span style={{ flex: 1, color: '#94A3B8', fontWeight: 500 }}>Search campus, rooms, fees, medical...</span>
        <kbd
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 800,
            color: '#F8FAFC'
          }}
        >
          CTRL + K
        </kbd>
      </div>

      {/* Right section: Wallet, AI, Emergency & Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {role === 'STUDENT' && (
          <button
            onClick={() => setModal('TOPUP')}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 'var(--radius-full)',
              padding: '7px 16px',
              background: 'rgba(245, 158, 11, 0.15)',
              borderColor: 'rgba(245, 158, 11, 0.35)',
              color: '#FBBF24',
              fontWeight: 900,
              boxShadow: '0 2px 12px rgba(245, 158, 11, 0.2)'
            }}
          >
            <Wallet size={15} color="#F59E0B" />
            ₹{student.walletBalance}
          </button>
        )}

        {/* Palm Scan Trigger */}
        <button
          onClick={() => setModal('PALM_SCAN')}
          className="btn btn-secondary btn-icon"
          title="NEXORA Palm Biometric Scanner"
          style={{
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.12)',
            borderColor: 'rgba(245, 158, 11, 0.35)',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.2)'
          }}
        >
          <Hand size={18} color="#F59E0B" />
        </button>

        {/* AI Assistant button */}
        <button
          onClick={() => setModal('AI_ASSISTANT')}
          className="btn btn-secondary btn-icon"
          title="Launch NEXORA AI Assistant"
          style={{
            borderRadius: 'var(--radius-full)',
            position: 'relative',
            background: 'rgba(251, 191, 36, 0.12)',
            borderColor: 'rgba(251, 191, 36, 0.35)'
          }}
        >
          <Sparkles size={18} color="#FBBF24" />
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
              boxShadow: '0 0 8px #F59E0B'
            }}
          />
        </button>

        {/* Emergency SOS button */}
        <button
          onClick={() => setModal('EMERGENCY')}
          className="btn btn-secondary btn-icon"
          title="Campus Emergency Contacts"
          style={{
            borderRadius: 'var(--radius-full)',
            borderColor: 'rgba(239, 68, 68, 0.35)',
            background: 'rgba(239, 68, 68, 0.12)'
          }}
        >
          <ShieldAlert size={18} color="#EF4444" />
        </button>

        {/* Sign In / Sign Out Auth Button */}
        <button
          onClick={() => setModal('AUTH_MODAL')}
          className="btn btn-secondary btn-sm"
          style={{ borderRadius: 'var(--radius-full)', gap: 6, fontSize: 12, fontWeight: 700 }}
        >
          {isAuthenticated ? <LogOut size={14} /> : <LogIn size={14} />}
          {isAuthenticated ? 'Sign Out' : 'Sign In'}
        </button>

        {/* User avatar with solar amber ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #F59E0B',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)'
            }}
          />
        </div>
      </div>

      {/* Secure Role Isolation Gateway Modal */}
      <PortalGateModal
        isOpen={showGateModal}
        onClose={() => setShowGateModal(false)}
        onSuccess={() => setShowGateModal(false)}
      />
    </header>
  );
};

export default TopHeader;
