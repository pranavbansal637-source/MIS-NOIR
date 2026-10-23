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
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A' }}>
          NEXORA ID Digital Identity
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>
          Verified campus digital pass & cryptographically signed credentials
        </p>
      </div>

      {/* Main NEXORA ID Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 55%, #EFF6FF 100%)',
          borderRadius: 24,
          border: '2px solid #BFDBFE',
          padding: 32,
          boxShadow: '0 20px 50px rgba(37, 99, 235, 0.12), 0 4px 12px rgba(15, 23, 42, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 20, marginBottom: 24 }}>
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
                border: '3px solid #2563EB',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)'
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
                padding: 4,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <ShieldCheck size={16} />
            </span>
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
              PRANAV BANSAL
            </h2>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#2563EB', marginTop: 2 }}>
              {student.program} • Semester {student.semester}
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div>Student ID: <strong style={{ color: '#0F172A' }}>{student.studentId}</strong></div>
              <div>Department: <strong style={{ color: '#0F172A' }}>{student.department}</strong></div>
              <div>Biometric Status: <strong style={{ color: '#059669' }}>✓ Palm Biometrics Enrolled</strong></div>
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              padding: 12,
              borderRadius: 14,
              border: '1px solid #CBD5E1',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.08)'
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
          <Share2 size={20} color="#2563EB" /> Share ID
        </button>

        <button
          onClick={() => onNavigate && onNavigate('documents')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <FileText size={20} color="#0284C7" /> Documents
        </button>

        <button
          onClick={() => showToast('📜 3 Verified Academic & Event Certificates available in NEXORA Vault.')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <Award size={20} color="#059669" /> Certificates
        </button>

        <button
          onClick={() => setModal('PRIVACY')}
          className="btn btn-secondary"
          style={{ flexDirection: 'column', padding: 16, gap: 8, fontSize: 13, fontWeight: 800 }}
        >
          <Lock size={20} color="#DC2626" /> Privacy
        </button>
      </div>
    </div>
  );
};

export default NoirIdPage;
