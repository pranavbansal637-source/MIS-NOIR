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
  ChevronDown,
  Bell,
  Sun,
  Moon
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
    isAuthenticated,
    theme,
    toggleTheme,
    unreadNotificationCount,
    liveAttendanceSession
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
        backgroundColor: 'var(--bg-surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
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
            background: '#FFFFFF',
            backdropFilter: 'blur(16px)',
            border: '1px solid #10B981',
            color: '#0F172A',
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
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
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                cursor: 'pointer'
              }}
              title="Click to Switch Interface"
            >
              <Lock size={12} color="#2563EB" />
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                cursor: 'pointer'
              }}
              title="Switch to Student, Shopkeeper POS, Management, Faculty, or Kiosk"
            >
              <KeyRound size={13} color="#2563EB" />
              Switch Interface
              <ChevronDown size={14} color="#64748B" />
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
                background: '#FFFFFF',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid #E2E8F0',
                borderRadius: 16,
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.14)',
                padding: 10,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 900, color: '#2563EB', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
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
                      backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
                      border: isCurrent ? '1px solid #BFDBFE' : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 120ms ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: isCurrent ? '#1D4ED8' : '#0F172A' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
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

              <div style={{ borderTop: '1px solid #E2E8F0', margin: '6px 0' }} />

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    setShowGateModal(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 700 }}
                >
                  <Lock size={12} color="#2563EB" /> Security Passkey Gate
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
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: 'var(--radius-full)',
          padding: '8px 18px',
          width: 340,
          cursor: 'pointer',
          color: '#475569',
          fontSize: 13,
          boxShadow: '0 1px 3px rgba(15,23,42,0.04)'
        }}
        className="desktop-search-trigger"
      >
        <Search size={16} color="#2563EB" />
        <span style={{ flex: 1, color: '#64748B', fontWeight: 500 }}>Search campus, rooms, fees, medical...</span>
        <kbd
          style={{
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 800,
            color: '#475569'
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
              background: '#EFF6FF',
              borderColor: '#BFDBFE',
              color: '#1D4ED8',
              fontWeight: 900,
              boxShadow: '0 1px 4px rgba(37, 99, 235, 0.1)'
            }}
          >
            <Wallet size={15} color="#2563EB" />
            ₹{student.walletBalance}
          </button>
        )}

        {/* Palm Scan: Show only when live session is active for student, or in non-student roles */}
        {role === 'STUDENT' ? (
          liveAttendanceSession?.status === 'LIVE' && (
            <button
              onClick={() => setModal('PALM_SCAN')}
              className="btn btn-primary btn-sm"
              title={`Live Attendance Open: ${liveAttendanceSession.courseName}`}
              style={{
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#059669',
                borderColor: '#047857',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: 12,
                padding: '7px 14px'
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 8px #34D399' }} />
              <Hand size={14} color="#FFFFFF" /> Check-In
            </button>
          )
        ) : (
          <button
            onClick={() => setModal('PALM_SCAN')}
            className="btn btn-secondary btn-icon"
            title="NEXORA Palm Hardware Terminal Emulator"
            style={{
              borderRadius: 'var(--radius-full)'
            }}
          >
            <Hand size={18} color="var(--brand-primary)" />
          </button>
        )}

        {/* Notifications Button with real unread count */}
        <button
          onClick={() => setModal('NOTIFICATIONS')}
          className="btn btn-secondary btn-icon"
          title="Notifications Center"
          style={{
            borderRadius: 'var(--radius-full)',
            position: 'relative'
          }}
        >
          <Bell size={18} color="var(--brand-primary)" />
          {unreadNotificationCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                minWidth: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 6px rgba(220, 38, 38, 0.6)'
              }}
            >
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          {theme === 'dark' ? <Sun size={17} color="#F59E0B" /> : <Moon size={17} color="#6366F1" />}
        </button>

        {/* AI Assistant button */}
        <button
          onClick={() => setModal('AI_ASSISTANT')}
          className="btn btn-secondary btn-icon"
          title="Launch NEXORA AI Assistant"
          style={{
            borderRadius: 'var(--radius-full)',
            position: 'relative',
            background: '#EFF6FF',
            borderColor: '#BFDBFE'
          }}
        >
          <Sparkles size={18} color="#2563EB" />
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              boxShadow: '0 0 6px #2563EB'
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
            borderColor: '#FECACA',
            background: '#FEF2F2'
          }}
        >
          <ShieldAlert size={18} color="#DC2626" />
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

        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 4 }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #2563EB',
              boxShadow: '0 1px 4px rgba(37, 99, 235, 0.2)'
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
