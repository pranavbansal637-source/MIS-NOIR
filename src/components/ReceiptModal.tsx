import React from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from './NoirLogo';
import { CheckCircle2, X, Printer, Download } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeModal, setModal, selectedReceipt, student, showToast } = useApp();

  if (activeModal !== 'RECEIPT' || !selectedReceipt) return null;

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24, maxWidth: 440 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <NoirLogo size="sm" theme="light" />
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px dashed #E2E8F0' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: 'var(--state-success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}
          >
            <CheckCircle2 size={32} color="var(--state-success)" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>PAYMENT SUCCESSFUL</h3>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--brand-primary)', marginTop: 4 }}>
            ₹{selectedReceipt.amount}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Receipt ID: {selectedReceipt.receiptId}
          </div>
        </div>

        {/* Receipt Details */}
        <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Merchant</span>
            <strong>{selectedReceipt.merchantName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Category</span>
            <span className="badge badge-primary">{selectedReceipt.category}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Items</span>
            <span style={{ textAlign: 'right', fontWeight: 600 }}>{selectedReceipt.itemsSummary || 'General Service Fee'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Payer</span>
            <strong>{student.name} ({student.studentId})</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Timestamp</span>
            <span>{selectedReceipt.timestamp}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Status</span>
            <span className="badge badge-success">✓ COMPLETED</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={() => {
              window.print();
            }}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={() => {
              showToast('Receipt PDF downloaded to device.');
            }}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <Download size={16} /> Download
          </button>
        </div>
      </div>
    </div>
  );
};
