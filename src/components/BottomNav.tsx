import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingBag, Activity, QrCode, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const { role } = useApp();

  if (role !== 'STUDENT') return null;

  const items = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'campus', label: 'CAMPUS', icon: ShoppingBag },
    { id: 'activity', label: 'ACTIVITY', icon: Activity },
    { id: 'noir-id', label: 'NEXORA ID', icon: QrCode },
    { id: 'profile', label: 'PROFILE', icon: User }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        backgroundColor: 'rgba(9, 12, 19, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 90,
        boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.6)',
        padding: '0 8px'
      }}
      className="mobile-bottom-nav-only"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

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
              color: isActive ? '#FBBF24' : '#64748B'
            }}
          >
            <Icon size={20} color={isActive ? '#F59E0B' : '#64748B'} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 800 : 600,
                letterSpacing: '0.04em',
                color: isActive ? '#FBBF24' : '#64748B'
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
