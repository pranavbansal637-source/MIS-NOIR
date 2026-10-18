import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Share2, Download, Eye, Lock } from 'lucide-react';

export const DocumentVaultPage: React.FC = () => {
  const { documents, openShareModal, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Identity' | 'Academic' | 'Certificates'>('All');

  const filteredDocs = selectedCategory === 'All'
    ? documents
    : documents.filter((d) => d.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Encrypted Document Vault</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Verified digital transcripts, certificates & identity credentials with time-bound sharing
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 10 }}>
        {(['All', 'Identity', 'Academic', 'Certificates'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 18px', fontSize: 13 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="grid-2">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="noir-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span className="badge badge-primary">{doc.category}</span>
                {doc.verified && (
                  <span className="badge badge-success" style={{ fontSize: 11 }}>
                    <ShieldCheck size={12} /> VERIFIED
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{doc.title}</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Issuer: {doc.issuer} • Date: {doc.issueDate} • Size: {doc.fileSize}
              </div>

              {doc.shareCode && (
                <div className="badge badge-warning" style={{ marginTop: 10, fontSize: 11 }}>
                  <Lock size={12} /> Active Link Code: {doc.shareCode} ({doc.shareExpiresAt})
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
              <button
                onClick={() => showToast(`Opening preview for ${doc.title}`)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <Eye size={14} /> Preview
              </button>
              <button
                onClick={() => showToast(`Downloading ${doc.title}...`)}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
              >
                <Download size={14} /> Download
              </button>
              <button
                onClick={() => openShareModal(doc)}
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
              >
                <Share2 size={14} /> Share Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
