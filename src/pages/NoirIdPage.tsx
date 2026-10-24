import React from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from '../components/NoirLogo';
import { ShieldCheck, Share2, FileText, Lock, Award, CheckCircle2 } from 'lucide-react';

interface NoirIdPageProps {
  onNavigate?: (tab: string) => void;
}

export const NoirIdPage: React.FC<NoirIdPageProps> = ({ onNavigate }) => {
  const { student, setModal, showToast } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680, margin: '0 auto', width: '100%' }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)' }}>
          NEXORA ID Digital Identity
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Verified campus digital pass & cryptographically signed credentials
        </p>
      </div>

      {/* Main NEXORA ID Card */}
      <div
        className="noir-card"
        style={{
          borderRadius: 24,
          border: '2px solid var(--border-color)',
          padding: '24px 20px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 16, marginBottom: 20 }}>
          <NoirLogo size="sm" showSubtitle={true} />
          <span className="badge badge-success" style={{ padding: '5px 12px', fontSize: 11 }}>
            <CheckCircle2 size={13} style={{ marginRight: 6 }} /> VERIFIED STUDENT
          </span>
        </div>

        {/* Card Body */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          {/* Photo */}
          <div style={{ position: 'relative' }}>
            <img
              src={student.avatar}
              alt={student.name}
              style={{
                width: 90,
                height: 90,
                borderRadius: 16,
                objectFit: 'cover',
                border: '3px solid var(--brand-primary)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                backgroundColor: 'var(--brand-emerald)',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <ShieldCheck size={14} />
            </span>
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>
              {student.name}
            </h2>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-primary)', marginTop: 2 }}>
              {student.program} • Semester {student.semester}
            </div>

            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Student ID: <strong style={{ color: 'var(--text-primary)' }}>{student.studentId}</strong></div>
              <div>Department: <strong style={{ color: 'var(--text-primary)' }}>{student.department}</strong></div>
              <div>Biometric Status: <strong style={{ color: 'var(--brand-emerald)' }}>✓ Palm Biometrics Enrolled</strong></div>
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              padding: 10,
              borderRadius: 14,
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${encodeURIComponent(student.qrCode)}`}
              alt="NEXORA Student QR"
              style={{ width: 85, height: 85, display: 'block' }}
            />
            <div style={{ fontSize: 10, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>
              NEXORA QR
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Buttons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        <button
          onClick={() => showToast('✓ NEXORA Digital ID link copied to clipboard.')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 14, gap: 6, fontSize: 12, fontWeight: 800 }}
        >
          <Share2 size={18} color="var(--brand-primary)" /> Share ID
        </button>

        <button
          onClick={() => onNavigate && onNavigate('documents')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 14, gap: 6, fontSize: 12, fontWeight: 800 }}
        >
          <FileText size={18} color="var(--brand-cyan)" /> Documents
        </button>

        <button
          onClick={() => showToast('📜 3 Verified Academic & Event Certificates available in NEXORA Vault.')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 14, gap: 6, fontSize: 12, fontWeight: 800 }}
        >
          <Award size={18} color="var(--brand-emerald)" /> Certificates
        </button>

        <button
          onClick={() => setModal('PRIVACY')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 14, gap: 6, fontSize: 12, fontWeight: 800 }}
        >
          <Lock size={18} color="var(--state-danger)" /> Privacy
        </button>
      </div>
    </div>
  );
};

export default NoirIdPage;
