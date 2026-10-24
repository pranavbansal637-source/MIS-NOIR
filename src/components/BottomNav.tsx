import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  ShoppingBag,
  Activity,
  QrCode,
  User,
  CheckSquare,
  Users,
  Calendar,
  Store,
  CreditCard,
  Building2,
  BarChart3,
  Shield
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { role } = useApp();

  if (role === 'KIOSK') return null;

  // Role-customized navigation items
  const getNavItems = () => {
    switch (role) {
      case 'FACULTY':
        return [
          { id: 'faculty-home', label: 'CLASSES', icon: Home },
          { id: 'faculty-attendance', label: 'ATTENDANCE', icon: CheckSquare },
          { id: 'faculty-students', label: 'ROSTER', icon: Users },
          { id: 'faculty-schedule', label: 'SCHEDULE', icon: Calendar },
          { id: 'profile', label: 'PROFILE', icon: User }
        ];
      case 'BUSINESS':
        return [
          { id: 'biz-pos', label: 'POS', icon: CreditCard },
          { id: 'biz-orders', label: 'ORDERS', icon: ShoppingBag },
          { id: 'biz-inventory', label: 'STOCK', icon: Store },
          { id: 'biz-sales', label: 'SALES', icon: BarChart3 },
          { id: 'profile', label: 'PROFILE', icon: User }
        ];
      case 'MANAGEMENT':
      case 'SUPER_ADMIN':
        return [
          { id: 'mgmt-dashboard', label: 'OVERVIEW', icon: Building2 },
          { id: 'mgmt-terminals', label: 'TERMINALS', icon: QrCode },
          { id: 'mgmt-students', label: 'STUDENTS', icon: Users },
          { id: 'mgmt-security', label: 'AUDIT', icon: Shield },
          { id: 'profile', label: 'SETTINGS', icon: User }
        ];
      default:
        // STUDENT OS
        return [
          { id: 'home', label: 'HOME', icon: Home },
          { id: 'campus', label: 'CAMPUS', icon: ShoppingBag },
          { id: 'activity', label: 'ACTIVITY', icon: Activity },
          { id: 'noir-id', label: 'NEXORA ID', icon: QrCode },
          { id: 'profile', label: 'PROFILE', icon: User }
        ];
    }
  };

  const items = getNavItems();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: 'var(--bg-glass-card)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 90,
        boxShadow: 'var(--shadow-md)',
        padding: '0 4px'
      }}
      className="mobile-bottom-nav-only"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentTab === item.id ||
          (item.id === 'noir-id' && currentTab === 'nexora-id') ||
          (item.id === 'profile' && currentTab === 'settings');

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              flex: 1,
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
              transition: 'color 150ms ease'
            }}
          >
            <Icon size={20} color={isActive ? 'var(--brand-primary)' : 'var(--text-muted)'} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 900 : 700,
                letterSpacing: '0.04em',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)'
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
