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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680, margin: '0 auto' }}>
      {/* Page Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#F8FAFC' }}>
          NEXORA ID Digital Identity
        </h1>
        <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 4 }}>
          Verified campus digital pass & cryptographically signed credentials
        </p>
      </div>

      {/* Main NEXORA ID Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 21, 32, 0.96) 0%, rgba(8, 11, 18, 0.98) 100%)',
          borderRadius: 24,
          border: '2px solid rgba(245, 158, 11, 0.5)',
          padding: 32,
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 20, marginBottom: 24 }}>
          <NoirLogo size="sm" showSubtitle={true} />
          <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: 12 }}>
            <CheckCircle2 size={14} style={{ marginRight: 6 }} /> VERIFIED STUDENT
          </span>
        </div>

        {/* Card Body */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
          {/* Photo */}
          <div style={{ position: 'relative' }}>
            <img
              src={student.avatar}
              alt={student.name}
              style={{
                width: 100,
                height: 100,
                borderRadius: 16,
                objectFit: 'cover',
                border: '3px solid #F59E0B',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                borderRadius: '50%',
                padding: 4
              }}
            >
              <ShieldCheck size={16} />
            </span>
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#F8FAFC' }}>
              PRANAV BANSAL
            </h2>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#FBBF24', marginTop: 2 }}>
              {student.program} • Semester {student.semester}
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Student ID: <strong style={{ color: '#F8FAFC' }}>{student.studentId}</strong></div>
              <div>Department: <strong style={{ color: '#F8FAFC' }}>{student.department}</strong></div>
              <div>Biometric Status: <strong style={{ color: '#34D399' }}>✓ Palm Biometrics Enrolled</strong></div>
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              padding: 12,
              borderRadius: 14,
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
            }}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(student.qrCode)}`}
              alt="NEXORA Student QR"
              style={{ width: 90, height: 90 }}
            />
            <div style={{ fontSize: 10, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>
              NEXORA QR
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <button
          onClick={() => showToast('✓ NEXORA Digital ID link copied to clipboard.')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <Share2 size={20} color="#F59E0B" /> Share ID
        </button>

        <button
          onClick={() => onNavigate && onNavigate('documents')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <FileText size={20} color="#FBBF24" /> Documents
        </button>

        <button
          onClick={() => showToast('📜 3 Verified Academic & Event Certificates available in NEXORA Vault.')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <Award size={20} color="#10B981" /> Certificates
        </button>

        <button
          onClick={() => setModal('PRIVACY')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <Lock size={20} color="#EF4444" /> Privacy
        </button>
      </div>
    </div>
  );
};

export default NoirIdPage;
