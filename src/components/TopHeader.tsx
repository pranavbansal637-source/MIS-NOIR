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
  Settings,
  Home,
  ShoppingBag,
  QrCode,
  CheckSquare,
  Clock,
  CreditCard,
  Calendar,
  GraduationCap,
  BookOpen,
  MapPin,
  Building2,
  Phone,
  HelpCircle
} from 'lucide-react';

interface TopHeaderProps {
  onOpenLanding?: () => void;
  onNavigate?: (tab: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenLanding, onNavigate }) => {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const allNavigationLinks = [
    { id: 'home', label: 'Student Home', icon: Home, roles: ['STUDENT'] },
    { id: 'attendance', label: 'Attendance & Roster', icon: CheckSquare, roles: ['STUDENT'] },
    { id: 'timetable', label: 'Class Timetable', icon: Clock, roles: ['STUDENT'] },
    { id: 'pay', label: 'Campus Wallet Pay', icon: CreditCard, roles: ['STUDENT'] },
    { id: 'events', label: 'Events & Societies', icon: Calendar, roles: ['STUDENT'] },
    { id: 'grades', label: 'Academic Gradebook', icon: GraduationCap, roles: ['STUDENT'] },
    { id: 'documents', label: 'Document Vault', icon: BookOpen, roles: ['STUDENT'] },
    { id: 'campus', label: 'Campus Services Hub', icon: ShoppingBag, roles: ['STUDENT'] },
    { id: 'marketplace', label: 'Canteen & Store', icon: ShoppingBag, roles: ['STUDENT'] },
    { id: 'library', label: 'Central Library', icon: BookOpen, roles: ['STUDENT'] },
    { id: 'map', label: 'Campus Map & Venues', icon: MapPin, roles: ['STUDENT'] },
    { id: 'hostel', label: 'Hostel Accommodation', icon: Building2, roles: ['STUDENT'] },
    { id: 'transport', label: 'Shuttle & Transport', icon: Building2, roles: ['STUDENT'] },
    { id: 'medical', label: 'Campus Medical Clinic', icon: Phone, roles: ['STUDENT'] },
    { id: 'complaints', label: 'Grievance Desk', icon: HelpCircle, roles: ['STUDENT'] },
    { id: 'noir-id', label: 'NEXORA Digital ID', icon: QrCode, roles: ['STUDENT'] },
    { id: 'profile', label: 'Profile & Settings', icon: Settings, roles: ['STUDENT', 'FACULTY', 'BUSINESS', 'MANAGEMENT'] }
  ];

  const handleNavClick = (tabId: string) => {
    setMobileMenuOpen(false);
    setShowUserDropdown(false);
    if (onNavigate) {
      onNavigate(tabId);
    }
  };

  return (
    <>
      <header
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

        {/* Left section: Hamburger (mobile), Logo & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="btn btn-ghost btn-icon mobile-only"
            title="Open Mobile Navigation Menu"
            style={{ width: 38, height: 38, borderRadius: 10, padding: 0 }}
          >
            <Menu size={20} color="var(--text-primary)" />
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
                <span className="header-hide-mobile">{roleLabels[role]}</span>
                <span className="mobile-only">{role}</span>
                <ChevronDown size={12} color="var(--text-muted)" />
              </div>

              {/* Direct Switch Interface Button (Desktop Only) */}
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="btn btn-secondary btn-sm header-hide-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
                title="Switch to Student, Shopkeeper POS, Management, Faculty, or Kiosk"
              >
                <KeyRound size={12} color="var(--brand-primary)" />
                Switch Interface
              </button>

              {/* Lock Workspace Button (Desktop Only) */}
              <button
                onClick={() => lockSession()}
                className="btn btn-secondary btn-sm header-hide-mobile"
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
                {isSessionLocked ? 'Locked' : 'Lock'}
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

        {/* Middle section: Global Command Center search trigger (Desktop Only) */}
        <div
          onClick={() => setModal('COMMAND_CENTER')}
          style={{
            display: 'none',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-full)',
            padding: '7px 16px',
            width: 320,
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: 13,
            boxShadow: 'var(--shadow-xs)'
          }}
          className="desktop-search-trigger"
        >
          <Search size={15} color="var(--brand-primary)" />
          <span style={{ flex: 1, color: 'var(--text-muted)', fontWeight: 500 }}>Search campus, rooms, fees...</span>
          <kbd
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              padding: '2px 6px',
              fontSize: 10,
              fontWeight: 800,
              color: 'var(--text-muted)'
            }}
          >
            CTRL+K
          </kbd>
        </div>

        {/* Right section: Wallet, Live Checkin, Notifications, Theme & Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                fontSize: 12
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
                padding: '6px 12px'
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 6px #34D399' }} />
              <Hand size={13} color="#FFFFFF" /> Check-In
            </button>
          )}

          {/* Notifications Button */}
          <button
            onClick={() => setModal('NOTIFICATIONS')}
            className="btn btn-secondary btn-icon btn-sm"
            title="Notifications Center"
            style={{
              borderRadius: 'var(--radius-full)',
              position: 'relative',
              width: 36,
              height: 36
            }}
          >
            <Bell size={16} color="var(--brand-primary)" />
            {unreadNotificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: 'var(--state-danger)',
                  color: '#FFFFFF',
                  fontSize: 9,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px'
                }}
              >
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon btn-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{ borderRadius: 'var(--radius-full)', width: 36, height: 36 }}
          >
            {theme === 'dark' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#6366F1" />}
          </button>

          {/* AI Assistant button (Desktop Only) */}
          <button
            onClick={() => setModal('AI_ASSISTANT')}
            className="btn btn-secondary btn-icon btn-sm header-hide-mobile"
            title="Launch NEXORA AI Assistant"
            style={{
              borderRadius: 'var(--radius-full)',
              position: 'relative',
              width: 36,
              height: 36
            }}
          >
            <Sparkles size={16} color="var(--brand-primary)" />
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                boxShadow: '0 0 6px var(--brand-primary)'
              }}
            />
          </button>

          {/* Emergency SOS button (Desktop Only) */}
          <button
            onClick={() => setModal('EMERGENCY')}
            className="btn btn-secondary btn-icon btn-sm header-hide-mobile"
            title="Campus Emergency SOS"
            style={{
              borderRadius: 'var(--radius-full)',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              width: 36,
              height: 36
            }}
          >
            <ShieldAlert size={16} color="var(--state-danger)" />
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

      {/* MOBILE SLIDE-OVER DRAWER (For Screens < 1024px) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
              <NoirLogo size="sm" showSubtitle={true} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-ghost btn-icon btn-sm"
                title="Close Navigation"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Card */}
            <div
              onClick={() => handleNavClick('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 14,
                border: '1px solid var(--border-color)',
                marginTop: 16,
                marginBottom: 16,
                cursor: 'pointer'
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 800 }}>
                  {roleLabels[role]}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  Tap to Edit Profile & Settings →
                </div>
              </div>
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleTheme();
                }}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', gap: 6, fontSize: 11 }}
              >
                {theme === 'dark' ? <Sun size={13} color="#F59E0B" /> : <Moon size={13} color="#6366F1" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModal('AI_ASSISTANT');
                }}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', gap: 6, fontSize: 11 }}
              >
                <Sparkles size={13} color="var(--brand-primary)" /> AI Chat
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  lockSession();
                }}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', gap: 6, fontSize: 11 }}
              >
                <Lock size={13} color="var(--brand-amber)" /> Lock Session
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModal('EMERGENCY');
                }}
                className="btn btn-secondary btn-sm"
                style={{ justifyContent: 'center', gap: 6, fontSize: 11, borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--state-danger)' }}
              >
                <ShieldAlert size={13} color="var(--state-danger)" /> SOS Emergency
              </button>
            </div>

            {/* Switch Portal in Mobile Drawer */}
            <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
              SWITCH CAMPUS PORTAL
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 16 }}>
              {[
                { r: 'STUDENT' as Role, label: '🎓 Student' },
                { r: 'BUSINESS' as Role, label: '🏪 Shop POS' },
                { r: 'MANAGEMENT' as Role, label: '🏛️ Mgmt' },
                { r: 'FACULTY' as Role, label: '👨‍🏫 Faculty' }
              ].map((item) => (
                <button
                  key={item.r}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    switchRole(item.r);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: 11,
                    justifyContent: 'center',
                    backgroundColor: role === item.r ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                    borderColor: role === item.r ? 'var(--brand-primary)' : 'var(--border-color)',
                    color: role === item.r ? 'var(--brand-primary)' : 'var(--text-primary)'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Navigation Links for Mobile */}
            <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
              CAMPUS MODULES & APPS
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, paddingBottom: 20 }}>
              {allNavigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={18} color="var(--brand-primary)" />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeader;
