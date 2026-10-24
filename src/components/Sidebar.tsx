import React from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
import {
  Home,
  ShoppingBag,
  Activity,
  QrCode,
  User,
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckSquare,
  Building2,
  BookOpen,
  Calendar,
  CreditCard,
  Store,
  Shield,
  HelpCircle,
  BarChart3,
  Settings,
  Bell,
  Monitor,
  Package,
  Clock,
  Tag,
  Lock
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { role, switchRole, setModal, unreadNotificationCount, activeFaculty, lockSession, isSessionLocked } = useApp();

  if (role === 'KIOSK') return null;

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 16px',
    flexShrink: 0,
    zIndex: 20,
    boxShadow: '2px 0 12px rgba(15, 23, 42, 0.04)',
    overflowY: 'auto'
  };

  const renderInterfaceSwitcher = () => (
    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14, marginTop: 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px 8px 4px'
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: '#2563EB',
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }}
        >
          SWITCH INTERFACE
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            color: '#059669',
            backgroundColor: '#ECFDF5',
            padding: '2px 6px',
            borderRadius: 10
          }}
        >
          🔒 2FA Palm Scan
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        <button
          onClick={() => switchRole('STUDENT')}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'STUDENT' ? '#EFF6FF' : '#FFFFFF',
            borderColor: role === 'STUDENT' ? '#2563EB' : '#CBD5E1',
            color: role === 'STUDENT' ? '#1D4ED8' : '#334155',
            fontWeight: role === 'STUDENT' ? 800 : 600
          }}
          title="Switch to Student Dashboard (Requires Palm Scan & PIN: 1111)"
        >
          🎓 Student
        </button>

        <button
          onClick={() => switchRole('BUSINESS')}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'BUSINESS' ? '#ECFDF5' : '#FFFFFF',
            borderColor: role === 'BUSINESS' ? '#10B981' : '#CBD5E1',
            color: role === 'BUSINESS' ? '#047857' : '#334155',
            fontWeight: role === 'BUSINESS' ? 800 : 600
          }}
          title="Switch to Merchant POS (Requires Palm Scan & PIN: 8821)"
        >
          🏪 Shop POS
        </button>

        <button
          onClick={() => switchRole('MANAGEMENT')}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'MANAGEMENT' ? '#EFF6FF' : '#FFFFFF',
            borderColor: role === 'MANAGEMENT' ? '#2563EB' : '#CBD5E1',
            color: role === 'MANAGEMENT' ? '#1D4ED8' : '#334155',
            fontWeight: role === 'MANAGEMENT' ? 800 : 600
          }}
          title="Switch to Management Portal (Requires Palm Scan & PIN: 9900)"
        >
          🏛️ Mgmt
        </button>

        <button
          onClick={() => switchRole('FACULTY')}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'FACULTY' ? '#EFF6FF' : '#FFFFFF',
            borderColor: role === 'FACULTY' ? '#2563EB' : '#CBD5E1',
            color: role === 'FACULTY' ? '#1D4ED8' : '#334155',
            fontWeight: role === 'FACULTY' ? 800 : 600
          }}
          title="Switch to Faculty Portal (Requires Palm Scan & PIN: 4403)"
        >
          👨‍🏫 Faculty
        </button>

        <button
          onClick={() => switchRole('KIOSK')}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            gridColumn: 'span 2',
            color: '#334155',
            backgroundColor: '#FFFFFF',
            borderColor: '#CBD5E1'
          }}
          title="Open Palm Terminal Hardware Simulation (Requires Palm Scan & PIN: 1234)"
        >
          📱 Palm Touch Terminal Kiosk
        </button>
      </div>

      {/* Lock Interface Button */}
      <button
        type="button"
        onClick={() => lockSession()}
        className="btn btn-secondary btn-sm"
        style={{
          width: '100%',
          marginTop: 8,
          fontSize: 11,
          fontWeight: 800,
          padding: '7px 10px',
          justifyContent: 'center',
          gap: 6,
          backgroundColor: isSessionLocked ? '#FEF2F2' : '#F8FAFC',
          borderColor: isSessionLocked ? '#FCA5A5' : '#CBD5E1',
          color: isSessionLocked ? '#DC2626' : '#475569'
        }}
        title="Lock workspace to protect confidential data from unauthorized viewers"
      >
        <Lock size={13} color={isSessionLocked ? '#DC2626' : '#2563EB'} />
        {isSessionLocked ? 'Interface Session Locked' : '🔒 Lock Workspace (Palm Guard)'}
      </button>
    </div>
  );

  // ----------------------------------------------------
  // 1. STUDENT SIDEBAR
  // ----------------------------------------------------
  if (role === 'STUDENT') {
    const studentItems = [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'campus', label: 'Campus Services', icon: ShoppingBag },
      { id: 'activity', label: 'Activity Feed', icon: Activity },
      { id: 'noir-id', label: 'NEXORA ID', icon: QrCode },
      { id: 'profile', label: 'Profile', icon: User }
    ];

    const studentSubItems = [
      { id: 'attendance', label: 'Attendance', icon: CheckSquare },
      { id: 'timetable', label: 'Timetable', icon: Clock },
      { id: 'pay', label: 'Wallet Pay', icon: CreditCard },
      { id: 'events', label: 'Events Pass', icon: Calendar },
      { id: 'grades', label: 'Gradebook', icon: GraduationCap },
      { id: 'documents', label: 'Document Vault', icon: BookOpen }
    ];

    return (
      <aside style={{ ...sidebarStyle, width: 240, overflowY: 'auto' }} className="desktop-sidebar-only">
        <div>
          {/* NEXORA Logo */}
          <div style={{ padding: '0 8px 24px 8px' }}>
            <NoirLogo size="sm" showSubtitle={true} />
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: '#2563EB',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              padding: '0 12px 10px 12px'
            }}
          >
            MAIN MENU
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {studentItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'noir-id' && currentTab === 'nexora-id');
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#1D4ED8' : 'var(--text-secondary)',
                    backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                    border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                    boxShadow: isActive ? '0 1px 4px rgba(37, 99, 235, 0.08)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#2563EB' : '#64748B'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: '#2563EB',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              padding: '18px 12px 8px 12px'
            }}
          >
            ACADEMIC MODULES
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {studentSubItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 14px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#1D4ED8' : 'var(--text-secondary)',
                    backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                    border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Icon size={17} color={isActive ? '#2563EB' : '#64748B'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Area */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => setModal('NOTIFICATIONS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Bell size={18} color="var(--brand-primary)" />
              Notifications
            </div>
            {unreadNotificationCount > 0 && (
              <span className="badge badge-danger" style={{ fontSize: 10, padding: '2px 7px' }}>
                {unreadNotificationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setModal('PRIVACY')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Settings size={18} color="#64748B" />
            Settings & Privacy
          </button>

          {renderInterfaceSwitcher()}
        </div>
      </aside>
    );
  }

  // ----------------------------------------------------
  // 2. MANAGEMENT SIDEBAR
  // ----------------------------------------------------
  if (role === 'MANAGEMENT' || role === 'SUPER_ADMIN') {
    const mgmtGroups = [
      {
        header: 'OVERVIEW',
        items: [{ id: 'mgmt-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }]
      },
      {
        header: 'ACADEMICS',
        items: [
          { id: 'mgmt-students', label: 'Students', icon: Users },
          { id: 'mgmt-faculty', label: 'Faculty', icon: GraduationCap },
          { id: 'mgmt-attendance', label: 'Attendance', icon: CheckSquare }
        ]
      },
      {
        header: 'CAMPUS & COMMERCE',
        items: [
          { id: 'terminals', label: 'Palm Terminals', icon: Monitor },
          { id: 'mgmt-facilities', label: 'Facilities & Hostel', icon: Building2 },
          { id: 'mgmt-library', label: 'Library System', icon: BookOpen },
          { id: 'mgmt-commerce', label: 'Payments & POS', icon: CreditCard }
        ]
      },
      {
        header: 'SYSTEM',
        items: [
          { id: 'mgmt-complaints', label: 'Helpdesk Tickets', icon: HelpCircle },
          { id: 'mgmt-audit', label: 'Audit Logs & Roles', icon: Shield },
          { id: 'mgmt-reports', label: 'Analytics Reports', icon: BarChart3 }
        ]
      }
    ];

    return (
      <aside
        style={{
          ...sidebarStyle,
          width: 250,
          overflowY: 'auto'
        }}
        className="desktop-sidebar-only"
      >
        <div style={{ padding: '0 8px 16px 8px' }}>
          <NoirLogo size="sm" showSubtitle={true} />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          {mgmtGroups.map((group) => (
            <div key={group.header}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: '#2563EB',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  padding: '0 10px 8px 10px'
                }}
              >
                {group.header}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '9px 12px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? '#1D4ED8' : 'var(--text-secondary)',
                        backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                        border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={17} color={isActive ? '#2563EB' : '#64748B'} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {renderInterfaceSwitcher()}
      </aside>
    );
  }

  // ----------------------------------------------------
  // 3. BUSINESS SIDEBAR (Shopkeeper / Merchant POS)
  // ----------------------------------------------------
  if (role === 'BUSINESS') {
    const bizItems = [
      { id: 'biz-pos', label: 'POS Checkout', icon: Store },
      { id: 'biz-dashboard', label: 'Sales Dashboard', icon: LayoutDashboard },
      { id: 'biz-orders', label: 'Orders Feed', icon: Package },
      { id: 'biz-inventory', label: 'Products & Inventory', icon: ShoppingBag },
      { id: 'biz-offers', label: 'Store Deals & Offers', icon: Tag },
      { id: 'biz-transactions', label: 'Transactions History', icon: CreditCard },
      { id: 'biz-notifications', label: 'Store Alerts', icon: Bell },
      { id: 'terminals', label: 'Shop Palm Terminal', icon: Monitor },
      { id: 'biz-profile', label: 'Merchant Profile', icon: User }
    ];

    return (
      <aside
        style={{
          ...sidebarStyle,
          width: 240
        }}
        className="desktop-sidebar-only"
      >
        <div style={{ padding: '0 8px 20px 8px' }}>
          <NoirLogo size="sm" showSubtitle={true} />
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: '#059669',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            padding: '0 10px 10px 10px'
          }}
        >
          NEXORA Merchant POS OS
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {bizItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#065F46' : '#475569',
                  backgroundColor: isActive ? '#ECFDF5' : 'transparent',
                  border: isActive ? '1px solid #A7F3D0' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#059669' : '#64748B'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {renderInterfaceSwitcher()}
      </aside>
    );
  }

  // ----------------------------------------------------
  // 4. FACULTY SIDEBAR (Teaching Operations)
  // ----------------------------------------------------
  if (role === 'FACULTY') {
    const facultyItems = [
      { id: 'faculty-home', label: 'Today\'s Classes', icon: Home },
      { id: 'faculty-attendance', label: 'Live Attendance', icon: CheckSquare },
      { id: 'faculty-students', label: 'Class Roster', icon: Users },
      { id: 'faculty-assignments', label: 'Assignments', icon: BookOpen },
      { id: 'faculty-schedule', label: 'Schedule', icon: Calendar },
      { id: 'terminals', label: 'Classroom Terminals', icon: Monitor },
      { id: 'profile', label: 'Faculty Profile', icon: User }
    ];

    return (
      <aside
        style={{
          ...sidebarStyle,
          width: 240
        }}
        className="desktop-sidebar-only"
      >
        <div style={{ padding: '0 8px 16px 8px' }}>
          <NoirLogo size="sm" showSubtitle={true} />
        </div>

        {/* Aligned Faculty Profile Section (Module 4.1) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 14px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 14,
            marginBottom: 16
          }}
        >
          <img
            src={activeFaculty.avatar}
            alt={activeFaculty.name}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #2563EB',
              flexShrink: 0
            }}
          />
          <div style={{ overflow: 'hidden', minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeFaculty.name}
            </div>
            <div style={{ fontSize: 11, color: '#2563EB', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeFaculty.designation}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeFaculty.office}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: '#2563EB',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            padding: '0 10px 10px 10px'
          }}
        >
          NEXORA Instructor OS
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {facultyItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#1D4ED8' : '#475569',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                  border: isActive ? '1px solid #BFDBFE' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#2563EB' : '#64748B'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {renderInterfaceSwitcher()}
      </aside>
    );
  }

  return null;
};

export default Sidebar;
