import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
import { PortalGateModal } from './PortalGateModal';
import type { Role } from '../types';
import {
  Smartphone,
  Building2,
  Store,
  GraduationCap,
  Hand,
  ShieldCheck,
  ChevronRight,
  Server
} from 'lucide-react';

interface LandingWorkspaceSelectorProps {
  onSelectWorkspace: (role: Role) => void;
}

export const LandingWorkspaceSelector: React.FC<LandingWorkspaceSelectorProps> = ({
  onSelectWorkspace
}) => {
  const { switchRole } = useApp();
  const [gateTargetRole, setGateTargetRole] = useState<Role | null>(null);

  const handleLaunch = (role: Role) => {
    if (role === 'STUDENT') {
      switchRole('STUDENT');
      onSelectWorkspace('STUDENT');
    } else {
      setGateTargetRole(role);
    }
  };

  const interfaces = [
    {
      role: 'STUDENT' as Role,
      title: 'NEXORA Student',
      tagline: 'Personal Digital Campus OS',
      desc: 'Clean mobile & desktop dashboard for live attendance, campus services, activity feed & NEXORA ID.',
      icon: Smartphone,
      color: '#2563EB',
      badge: 'Mobile & Desktop'
    },
    {
      role: 'MANAGEMENT' as Role,
      title: 'NEXORA Management',
      tagline: 'Institutional Administration Console',
      desc: 'Desktop-first workspace for academics, student directory, terminal management & audit security.',
      icon: Building2,
      color: '#4F46E5',
      badge: 'Desktop-First'
    },
    {
      role: 'BUSINESS' as Role,
      title: 'NEXORA Business',
      tagline: 'Campus Commerce & POS Portal',
      desc: 'Dedicated shopkeeper POS system linked directly with Palm payment terminals.',
      icon: Store,
      color: '#059669',
      badge: 'Merchant Register'
    },
    {
      role: 'FACULTY' as Role,
      title: 'NEXORA Faculty',
      tagline: 'Teaching & Live Attendance Portal',
      desc: 'Fast instructor portal for class schedules, roster check-ins & grade submission.',
      icon: GraduationCap,
      color: '#D97706',
      badge: 'Instructor OS'
    },
    {
      role: 'KIOSK' as Role,
      title: 'NEXORA Palm Terminal',
      tagline: 'Physical Kiosk Identity Node',
      desc: 'Hardware terminal interface for automated classroom attendance, shop POS & library check-in.',
      icon: Hand,
      color: '#0284C7',
      badge: 'Physical Kiosk'
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 24px',
        fontFamily: 'var(--font-family)',
        color: '#0F172A'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 40
        }}
      >
        <NoirLogo size="lg" showSubtitle={true} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-primary" style={{ padding: '6px 16px', fontSize: 12 }}>
            <Server size={14} style={{ marginRight: 6 }} /> NEXORA CORE BACKEND ONLINE
          </span>
        </div>
      </div>

      {/* Hero Vision Section */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: 820,
          marginBottom: 48
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 900,
            color: '#2563EB',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: 10
          }}
        >
          AUTONOMOUS CAMPUS OPERATING SYSTEM ARCHITECTURE
        </div>
        <h1
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            marginBottom: 16,
            lineHeight: 1.2
          }}
        >
          One Central Backend. Purpose-Built Workspaces.
        </h1>
        <p
          style={{
            fontSize: 16,
            color: '#475569',
            lineHeight: 1.6,
            fontWeight: 500
          }}
        >
          NEXORA separates student identity, institutional management, campus commerce, teaching operations, and physical palm terminals into modular applications connected to a single biometric-verified core.
        </p>
      </div>

      {/* Central Architecture Diagram Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          background: '#FFFFFF',
          borderRadius: 24,
          padding: 32,
          color: '#0F172A',
          marginBottom: 48,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          border: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: '#2563EB',
              letterSpacing: '0.14em',
              textTransform: 'uppercase'
            }}
          >
            NEXORA CORE CENTRAL BACKEND
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: '#0F172A' }}>
            Shared APIs • Granular RBAC • Biometric Identity Vault
          </div>
        </div>

        {/* Diagram Nodes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            position: 'relative',
            zIndex: 2
          }}
        >
          {interfaces.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onClick={() => handleLaunch(item.role)}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  padding: 18,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className="workspace-diagram-card"
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: `${item.color}15`,
                    border: `1px solid ${item.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}
                >
                  <Icon size={22} color={item.color} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{item.badge}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Workspaces Grid Selector */}
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', marginBottom: 20 }}>
          Launch Workspace Interface
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {interfaces.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onClick={() => handleLaunch(item.role)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid #E2E8F0',
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
                  transition: 'all 200ms ease-in-out'
                }}
                className="noir-card-interactive"
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: `${item.color}15`,
                        border: `1px solid ${item.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={24} color={item.color} />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: item.color,
                        backgroundColor: `${item.color}12`,
                        border: `1px solid ${item.color}25`,
                        padding: '4px 12px',
                        borderRadius: 20
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', marginBottom: 4 }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 10 }}>
                    {item.tagline}
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5, marginBottom: 20 }}>
                    {item.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #E2E8F0',
                    paddingTop: 16,
                    fontSize: 13,
                    fontWeight: 800,
                    color: item.color
                  }}
                >
                  <span>Enter Workspace</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 64,
          textAlign: 'center',
          fontSize: 12,
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <ShieldCheck size={16} color="#059669" />
        NEXORA Operating System • One Identity. One Campus. One Experience.
      </div>

      {/* Role Isolation Portal Gate Modal */}
      <PortalGateModal
        isOpen={Boolean(gateTargetRole)}
        targetRole={gateTargetRole}
        onClose={() => setGateTargetRole(null)}
        onSuccess={(unlockedRole) => {
          setGateTargetRole(null);
          onSelectWorkspace(unlockedRole);
        }}
      />
    </div>
  );
};

export default LandingWorkspaceSelector;
