import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
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
  Moon,
  Menu,
  X,
  Settings
} from 'lucide-react';

interface TopHeaderProps {
  onOpenLanding?: () => void;
  onNavigate?: (tab: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenLanding, onNavigate, onToggleSidebar, isSidebarOpen }) => {
  const {
    user,
    student,
    role,
    switchRole,
    setModal,
    demoNotification,
    isAuthenticated,
    theme,
    toggleTheme,
    unreadNotificationCount,
    liveAttendanceSession,
    lockSession,
    isSessionLocked
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

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

  const handleNavClick = (tabId: string) => {
    setShowUserDropdown(false);
    if (onNavigate) {
      onNavigate(tabId);
    }
  };

  return (
    <>
      <header
        className="noir-top-header"
        style={{
          height: 68,
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {/* Toast banner overlay if active */}
        {demoNotification && (
          <div
            style={{
              position: 'absolute',
              top: 74,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--brand-emerald)',
              color: 'var(--text-primary)',
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              zIndex: 200,
              animation: 'fadeIn 150ms ease'
            }}
          >
            <CheckCircle2 size={16} color="var(--brand-emerald)" />
            {demoNotification}
          </div>
        )}

        {/* Left section: Sidebar Toggle, Logo & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Unified Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-icon header-sidebar-toggle"
            title={isSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isSidebarOpen}
            style={{ borderRadius: 10, padding: 0 }}
          >
            {isSidebarOpen ? <X size={20} color="var(--brand-primary)" /> : <Menu size={20} color="var(--text-primary)" />}
          </button>

          {/* Logo */}
          <div
            onClick={onOpenLanding}
            style={{ cursor: onOpenLanding ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}
            title={onOpenLanding ? 'Open Workspace & Portal Gateway' : undefined}
          >
            <NoirLogo size="sm" showSubtitle={false} />
          </div>

          {/* Locked Active Role Badge with Interactive Dropdown */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                title="Click to Switch Interface"
              >
                <Lock size={11} color="var(--brand-primary)" />
                <span className="btn-label-desktop">{roleLabels[role]}</span>
                <span className="mobile-only" style={{ maxWidth: 65, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {role === 'STUDENT' ? 'Student' : role === 'BUSINESS' ? 'POS' : role === 'FACULTY' ? 'Faculty' : 'Admin'}
                </span>
                <ChevronDown size={12} color="var(--text-muted)" />
              </div>

              {/* Direct Switch Interface Button */}
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
                title="Switch to Student, Shopkeeper POS, Management, Faculty, or Kiosk"
              >
                <KeyRound size={12} color="var(--brand-primary)" />
                <span className="btn-label-desktop">Switch Interface</span>
              </button>

              {/* Lock Workspace Button */}
              <button
                onClick={() => lockSession()}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  backgroundColor: isSessionLocked ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-surface)',
                  borderColor: isSessionLocked ? 'var(--state-danger)' : 'var(--border-color)',
                  color: isSessionLocked ? 'var(--state-danger)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                title="Lock interface to protect confidential data. Requires Palm Scan to resume."
              >
                <Lock size={12} color={isSessionLocked ? 'var(--state-danger)' : 'var(--brand-primary)'} />
                <span className="btn-label-desktop">{isSessionLocked ? 'Locked' : 'Lock'}</span>
              </button>
            </div>

            {/* Quick Portal Switcher Dropdown */}
            {showRoleDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  left: 0,
                  width: 320,
                  background: 'var(--bg-surface)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 16,
                  boxShadow: 'var(--shadow-lg)',
                  padding: 10,
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px' }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    SWITCH INTERFACE (2FA)
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--brand-emerald)', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: 10 }}>
                    🔒 Palm Required
                  </span>
                </div>

                {[
                  { r: 'STUDENT' as Role, label: '🎓 Student OS', desc: 'CGPA, Wallet Balance (₹450) & Docs' },
                  { r: 'FACULTY' as Role, label: '👨‍🏫 Faculty Instructor OS', desc: 'Class Grading, Roster & Roll Call' },
                  { r: 'BUSINESS' as Role, label: '🏪 Shopkeeper POS', desc: 'POS Cash Register & Inventory' },
                  { r: 'MANAGEMENT' as Role, label: '🏛️ Campus Management', desc: 'University Ledger & Governance' },
                  { r: 'KIOSK' as Role, label: '📱 Palm Touch Terminal', desc: 'Physical Hardware Terminal' }
                ].map((item) => {
                  const isCurrent = role === item.r;
                  return (
                    <button
                      key={item.r}
                      onClick={() => {
                        setShowRoleDropdown(false);
                        switchRole(item.r);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '9px 12px',
                        borderRadius: 10,
                        backgroundColor: isCurrent ? 'var(--bg-subtle)' : 'transparent',
                        border: isCurrent ? '1px solid var(--brand-primary)' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: isCurrent ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                            {item.label}
                          </span>
                          {!isCurrent && <Lock size={11} color="var(--text-muted)" />}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
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

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '6px 0' }} />

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      setModal('INTERFACE_GATE');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 800 }}
                  >
                    <Lock size={12} color="var(--brand-primary)" /> Security Gate
                  </button>

                  {onOpenLanding && (
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        onOpenLanding();
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 800 }}
                    >
                      🚀 Portals Hub
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
          className="header-search-bar"
          title="Search campus, rooms, fees... (CTRL+K)"
        >
          <Search size={15} color="var(--brand-primary)" />
          <span className="search-text-placeholder">Search campus, rooms, fees...</span>
          <kbd className="search-kbd-hint">CTRL+K</kbd>
        </div>

        {/* Right section: Wallet, Live Checkin, Notifications, Theme & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Wallet Balance (Student) */}
          {role === 'STUDENT' && (
            <button
              onClick={() => setModal('TOPUP')}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                background: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--brand-primary)',
                fontWeight: 900,
                fontSize: 12,
                flexShrink: 0
              }}
              title="Click to Top Up NEXORA Wallet"
            >
              <Wallet size={14} color="var(--brand-primary)" />
              ₹{student.walletBalance}
            </button>
          )}

          {/* Live Attendance Palm Check-in */}
          {role === 'STUDENT' && liveAttendanceSession?.status === 'LIVE' && (
            <button
              onClick={() => setModal('PALM_SCAN')}
              className="btn btn-primary btn-sm"
              title={`Live Attendance Open: ${liveAttendanceSession.courseName}`}
              style={{
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--brand-emerald)',
                borderColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 800,
                fontSize: 11,
                padding: '6px 12px',
                flexShrink: 0
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 6px #34D399' }} />
              <Hand size={13} color="#FFFFFF" /> Check-In
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={() => setModal('NOTIFICATIONS')}
            className="header-action-btn header-btn-notification"
            title="Notifications Center"
            aria-label="Open notifications"
          >
            <Bell size={17} />
            {unreadNotificationCount > 0 && (
              <span className="notification-badge-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Theme Switcher Toggle (Light / Dark Mode) */}
          <button
            onClick={toggleTheme}
            className={`header-action-btn header-btn-theme ${theme === 'dark' ? 'header-btn-theme-dark' : 'header-btn-theme-light'}`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* AI Assistant button (Available on All Screens) */}
          <button
            onClick={() => setModal('AI_ASSISTANT')}
            className="header-action-btn header-btn-assistant"
            title="Launch NEXORA AI Copilot"
            aria-label="Launch AI Assistant"
          >
            <Sparkles size={17} />
            <span className="assistant-beacon-dot" />
          </button>

          {/* Emergency SOS button */}
          <button
            onClick={() => setModal('EMERGENCY')}
            className="header-action-btn"
            title="Campus Emergency SOS"
            style={{
              borderColor: 'rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: 'var(--state-danger)'
            }}
          >
            <ShieldAlert size={17} color="var(--state-danger)" />
          </button>

          {/* User Avatar with Clickable Profile & Settings Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 2,
                borderRadius: 'var(--radius-full)',
                border: '2px solid var(--brand-primary)',
                boxShadow: 'var(--shadow-xs)'
              }}
              title="Click for Profile & Settings"
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>

            {/* User Profile Quick Menu */}
            {showUserDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 44,
                  right: 0,
                  width: 250,
                  backgroundColor: 'var(--bg-surface)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 16,
                  boxShadow: 'var(--shadow-lg)',
                  padding: 12,
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  animation: 'fadeIn 120ms ease'
                }}
              >
                {/* User Summary */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 10px 8px', borderBottom: '1px solid var(--border-color)' }}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 800 }}>
                      {roleLabels[role]}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Profile & Settings Link */}
                <button
                  onClick={() => handleNavClick('profile')}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: 12, marginTop: 4 }}
                >
                  <Settings size={15} color="var(--brand-primary)" /> Profile & Settings
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    setModal('COMMAND_CENTER');
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: 12 }}
                >
                  <Search size={15} color="var(--brand-cyan)" /> Command Center
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    toggleTheme();
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: 12 }}
                >
                  {theme === 'dark' ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="#6366F1" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    lockSession();
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: 12 }}
                >
                  <Lock size={15} color="var(--brand-amber)" /> Lock Workspace
                </button>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    setModal('AUTH_MODAL');
                  }}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: 12, color: 'var(--state-danger)' }}
                >
                  {isAuthenticated ? <LogOut size={15} /> : <LogIn size={15} />}
                  {isAuthenticated ? 'Sign Out Session' : 'Sign In'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default TopHeader;
