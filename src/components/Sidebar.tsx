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
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { role, switchRole, setModal, showToast } = useApp();

  if (role === 'KIOSK') return null;

  const sidebarStyle: React.CSSProperties = {
    backgroundColor: '#090C13',
    borderRight: '1px solid rgba(245, 158, 11, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 16px',
    flexShrink: 0,
    zIndex: 20,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.6)',
    overflowY: 'auto'
  };

  const renderInterfaceSwitcher = () => (
    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14, marginTop: 14 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 900,
          color: '#F59E0B',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '0 4px 8px 4px'
        }}
      >
        SWITCH INTERFACE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        <button
          onClick={() => {
            switchRole('STUDENT');
            showToast('✓ Switched to Student OS');
          }}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'STUDENT' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            borderColor: role === 'STUDENT' ? '#F59E0B' : 'rgba(255, 255, 255, 0.12)',
            color: role === 'STUDENT' ? '#FBBF24' : '#CBD5E1'
          }}
          title="Switch to Student Dashboard"
        >
          🎓 Student
        </button>

        <button
          onClick={() => {
            switchRole('BUSINESS');
            showToast('✓ Switched to Shopkeeper POS');
          }}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'BUSINESS' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
            borderColor: role === 'BUSINESS' ? '#10B981' : 'rgba(255, 255, 255, 0.12)',
            color: role === 'BUSINESS' ? '#34D399' : '#CBD5E1'
          }}
          title="Switch to Merchant POS"
        >
          🏪 Shop POS
        </button>

        <button
          onClick={() => {
            switchRole('MANAGEMENT');
            showToast('✓ Switched to Management Console');
          }}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'MANAGEMENT' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            borderColor: role === 'MANAGEMENT' ? '#F59E0B' : 'rgba(255, 255, 255, 0.12)',
            color: role === 'MANAGEMENT' ? '#FBBF24' : '#CBD5E1'
          }}
          title="Switch to Management Portal"
        >
          🏛️ Mgmt
        </button>

        <button
          onClick={() => {
            switchRole('FACULTY');
            showToast('✓ Switched to Faculty Instructor OS');
          }}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            backgroundColor: role === 'FACULTY' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
            borderColor: role === 'FACULTY' ? '#F59E0B' : 'rgba(255, 255, 255, 0.12)',
            color: role === 'FACULTY' ? '#FBBF24' : '#CBD5E1'
          }}
          title="Switch to Faculty Portal"
        >
          👨‍🏫 Faculty
        </button>

        <button
          onClick={() => {
            switchRole('KIOSK');
            showToast('✓ Launched Palm Hardware Terminal Screen');
          }}
          className="btn btn-secondary btn-sm"
          style={{
            fontSize: 11,
            padding: '6px 8px',
            justifyContent: 'center',
            gridColumn: 'span 2',
            color: '#CBD5E1'
          }}
          title="Open Palm Terminal Hardware Simulation"
        >
          📱 Palm Touch Terminal Kiosk
        </button>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // 1. STUDENT SIDEBAR (Streamlined to ONLY 5 Main Items)
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
              color: '#F59E0B',
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
                    color: isActive ? '#FBBF24' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                    border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                    boxShadow: isActive ? '0 0 16px rgba(245, 158, 11, 0.2)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#F59E0B' : '#64748B'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: '#F59E0B',
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
                    color: isActive ? '#FBBF24' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                    border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Icon size={17} color={isActive ? '#F59E0B' : '#64748B'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Area */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => showToast('🔔 NEXORA Notifications: Exam registration reminder & Library book due in 2 days.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              color: '#94A3B8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Bell size={18} color="#F59E0B" />
            Notifications
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
              color: '#94A3B8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Settings size={18} color="#94A3B8" />
            Settings & Privacy
          </button>

          {renderInterfaceSwitcher()}
        </div>
      </aside>
    );
  }

  // ----------------------------------------------------
  // 2. MANAGEMENT SIDEBAR (Grouped Sections)
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
          { id: 'mgmt-attendance', label: 'Attendance', icon: CheckSquare },
          { id: 'mgmt-timetable', label: 'Timetable', icon: Clock },
          { id: 'mgmt-exams', label: 'Exams', icon: Briefcase }
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
                  color: '#F59E0B',
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
                        color: isActive ? '#FBBF24' : '#94A3B8',
                        backgroundColor: isActive ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                        border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Icon size={17} color={isActive ? '#F59E0B' : '#64748B'} />
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
      { id: 'biz-transactions', label: 'Transactions History', icon: CreditCard },
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
            color: '#10B981',
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
                  color: isActive ? '#34D399' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                  border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#10B981' : '#64748B'} />
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
        <div style={{ padding: '0 8px 20px 8px' }}>
          <NoirLogo size="sm" showSubtitle={true} />
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 900,
            color: '#F59E0B',
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
                  color: isActive ? '#FBBF24' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(245, 158, 11, 0.16)' : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#F59E0B' : '#64748B'} />
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
