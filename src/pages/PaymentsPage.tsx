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
          <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--brand-primary, #F59E0B)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            NEXORA WALLET & CLEARANCE GATEWAY
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main, #F8FAFC)', marginTop: 4 }}>
            Campus Pay & Wallet
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary, #94A3B8)', marginTop: 4 }}>
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
          background: 'linear-gradient(135deg, #161D2A 0%, #0D121B 50%, #07090E 100%)',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 158, 11, 0.12)',
          color: '#FFFFFF',
          padding: 28,
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              AVAILABLE NEXORA WALLET BALANCE
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, marginTop: 4, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              <span style={{ color: '#F59E0B', marginRight: 4 }}>₹</span>{student.walletBalance}
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Account linked: <strong style={{ color: '#E2E8F0' }}>{student.studentId}</strong></span>
              <span>•</span>
              <span style={{ color: '#E2E8F0' }}>{student.name}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <img src="/nexora-logo.png" alt="NEXORA" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)' }} />
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.16em', color: '#FBBF24', marginTop: 6, textTransform: 'uppercase' }}>
              NEXORA PAY
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History List */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main, #F8FAFC)', marginBottom: 14 }}>
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
                      backgroundColor: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: isCredit ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.25)'
                    }}
                  >
                    {isCredit ? (
                      <ArrowDownLeft size={20} color="#10B981" />
                    ) : (
                      <ArrowUpRight size={20} color="#F59E0B" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main, #F8FAFC)' }}>{tx.merchantName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary, #94A3B8)', marginTop: 2 }}>
                      {tx.timestamp} • {tx.itemsSummary || tx.category}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isCredit ? '#10B981' : 'var(--text-main, #F8FAFC)' }}>
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
