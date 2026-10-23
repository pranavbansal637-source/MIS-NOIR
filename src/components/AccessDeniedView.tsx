import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import type { Role } from '../types';

interface AccessDeniedViewProps {
  requiredRole: string;
  currentRole: Role;
  onAuthenticate: () => void;
  onReturnHome: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  currentRole,
  onAuthenticate,
  onReturnHome
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '40px 20px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 0 35px rgba(239, 68, 68, 0.25)'
        }}
      >
        <ShieldAlert size={42} color="#EF4444" />
      </div>

      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: '#EF4444',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          marginBottom: 8
        }}
      >
        403 ACCESS RESTRICTED • ROLE ISOLATION ACTIVE
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', marginBottom: 12 }}>
        Insufficient Privileges for this Workspace
      </h1>

      <p
        style={{
          fontSize: 14,
          color: '#64748B',
          maxWidth: 520,
          lineHeight: 1.6,
          marginBottom: 28
        }}
      >
        Your current session is authenticated as <strong style={{ color: '#2563EB' }}>[{currentRole}]</strong>.
        This interface requires <strong style={{ color: '#DC2626' }}>[{requiredRole}]</strong> authorization.
        In accordance with institutional security policies, cross-workspace access is strictly restricted.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
        <button
          onClick={onReturnHome}
          className="btn btn-secondary btn-lg"
          style={{ gap: 8, borderRadius: 12 }}
        >
          <ArrowLeft size={16} /> Return to My Workspace
        </button>

        <button
          onClick={onAuthenticate}
          className="btn btn-primary btn-lg"
          style={{
            gap: 8,
            borderRadius: 12,
            backgroundColor: '#2563EB',
            borderColor: '#2563EB',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
          }}
        >
          <KeyRound size={16} /> Authenticate as {requiredRole}
        </button>
      </div>

      <div
        style={{
          marginTop: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          color: '#64748B'
        }}
      >
        <Lock size={14} />
        NEXORA Cryptographic Zero-Trust RBAC Enforced
      </div>
    </div>
  );
};
