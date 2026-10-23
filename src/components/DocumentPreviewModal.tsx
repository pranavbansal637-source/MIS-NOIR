import React from 'react';
import { useApp } from '../context/AppContext';
import { DocumentService } from '../services/DocumentService';
import { NoirLogo } from './NoirLogo';
import { ShieldCheck, Download, Share2, X, FileText, CheckCircle2 } from 'lucide-react';

export const DocumentPreviewModal: React.FC = () => {
  const {
    activeModal,
    setModal,
    selectedDocForPreview,
    student,
    downloadDoc,
    openShareModal
  } = useApp();

  if (activeModal !== 'DOCUMENT_PREVIEW' || !selectedDocForPreview) return null;

  const preview = DocumentService.getDocumentPreview(selectedDocForPreview, student);

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 680,
          maxHeight: '92vh',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} color="var(--brand-primary)" />
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-primary)' }}>
                Official Document Viewer
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Cryptographically Sealed • Document ID: {preview.docNumber}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                downloadDoc(selectedDocForPreview);
              }}
              className="btn btn-secondary btn-sm"
              title="Download Document"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => {
                setModal(null);
                openShareModal(selectedDocForPreview);
              }}
              className="btn btn-primary btn-sm"
              title="Share Document"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={() => setModal(null)}
              className="btn btn-ghost btn-icon btn-sm"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Document Paper Body */}
        <div
          style={{
            padding: 32,
            overflowY: 'auto',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            position: 'relative'
          }}
        >
          {/* Subtle Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: 64,
              fontWeight: 900,
              color: 'rgba(37, 99, 235, 0.04)',
              pointerEvents: 'none',
              letterSpacing: '0.2em',
              whiteSpace: 'nowrap',
              userSelect: 'none'
            }}
          >
            NEXORA VERIFIED
          </div>

          {/* Official Letterhead Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: 20,
              borderBottom: '2px solid var(--border-color)',
              marginBottom: 24
            }}
          >
            <div>
              <NoirLogo size="sm" showSubtitle={true} />
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>
                University Central Academic & Registrar Registry
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-success" style={{ gap: 6 }}>
                <ShieldCheck size={14} /> {preview.verified ? 'VERIFIED ORIGINAL' : 'PENDING'}
              </span>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Issued: <strong>{preview.issueDate}</strong>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Issuer: {preview.issuer}
              </div>
            </div>
          </div>

          {/* Document Title */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span
              className="badge badge-primary"
              style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}
            >
              {preview.category} Credential
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.01em', marginTop: 4 }}>
              {preview.title}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 700, marginTop: 4 }}>
              Ref: {preview.docNumber}
            </div>
          </div>

          {/* Student Dossier Information Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: 16,
              marginBottom: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              fontSize: 13
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                Full Name
              </span>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{preview.studentName}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                Student ID / Roll No
              </span>
              <div style={{ fontWeight: 800, color: 'var(--brand-primary)', marginTop: 2 }}>{preview.studentId}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                Academic Program
              </span>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{preview.program}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                Department / Faculty
              </span>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>{preview.department}</div>
            </div>
          </div>

          {/* Body Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
            {preview.bodySections.map((sec, idx) => (
              <div key={idx} style={{ fontSize: 13, lineHeight: 1.6 }}>
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <CheckCircle2 size={14} color="var(--brand-emerald)" /> {sec.heading}
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>{sec.content}</p>
              </div>
            ))}
          </div>

          {/* Official Signatory & Seal Footer */}
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                Dr. K. S. Ramanathan
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Registrar of Academic Examinations & Degrees
              </div>
              <div style={{ fontSize: 10, color: 'var(--brand-primary)', marginTop: 2, fontFamily: 'monospace' }}>
                DIGITAL SHA256 RSA-4096 SIGNATURE
              </div>
            </div>

            <div
              style={{
                border: '2px solid var(--brand-emerald)',
                borderRadius: 12,
                padding: '8px 16px',
                textAlign: 'center',
                backgroundColor: 'rgba(16, 185, 129, 0.08)'
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--brand-emerald)', letterSpacing: '0.08em' }}>
                NEXORA CRYPTO CORE
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-primary)' }}>
                VALIDATED ON-CHAIN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
