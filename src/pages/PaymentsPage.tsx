import React from 'react';
import { useApp } from '../context/AppContext';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { student, transactions, setModal, openReceiptModal } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--brand-primary, #2563EB)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            VASCENOVA WALLET & CLEARANCE GATEWAY
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary, #0F172A)', marginTop: 4 }}>
            Campus Pay & Wallet
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary, #64748B)', marginTop: 4 }}>
            Unified Payment Ledger • Canteen, Stationery, Events & Fee Clearances
          </p>
        </div>
        <button onClick={() => setModal('TOPUP')} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}>
          <Plus size={18} /> Top Up Wallet
        </button>
      </div>

      {/* Wallet Card */}
      <div
        className="noir-card"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #EFF6FF 100%)',
          border: '2px solid #BFDBFE',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.12)',
          color: '#0F172A',
          padding: 28,
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              AVAILABLE VASCENOVA WALLET BALANCE
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, marginTop: 4, color: '#0F172A', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#2563EB', marginRight: 4 }}>₹</span>{student.walletBalance}
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Account linked: <strong style={{ color: '#0F172A' }}>{student.studentId}</strong></span>
              <span>•</span>
              <span style={{ color: '#475569' }}>{student.name}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <img src="./vascenova-icon.png" alt="VASCENOVA" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '1.5px solid rgba(0, 229, 255, 0.4)', boxShadow: '0 2px 10px rgba(11, 37, 89, 0.4)' }} />
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.16em', color: '#2563EB', marginTop: 6, textTransform: 'uppercase' }}>
              VASCENOVA PAY
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History List */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary, #0F172A)', marginBottom: 14 }}>
          Recent Transactions & Receipts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {transactions.map((tx) => {
            const isCredit = tx.type === 'CREDIT';
            return (
              <div
                key={tx.id}
                className="noir-card noir-card-interactive"
                onClick={() => openReceiptModal(tx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      backgroundColor: isCredit ? 'rgba(16, 185, 129, 0.12)' : 'rgba(37, 99, 235, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isCredit ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(37, 99, 235, 0.25)'
                    }}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={20} color="#059669" />
                    ) : (
                      <ArrowUpRight size={20} color="#2563EB" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>{tx.merchantName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748B)', marginTop: 2 }}>
                      {tx.timestamp} • {tx.itemsSummary || tx.category}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isCredit ? '#059669' : 'var(--text-primary, #0F172A)' }}>
                    {isCredit ? '+' : '-'}₹{tx.amount}
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.04em' }}>
                    Receipt {tx.receiptId}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
