import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, X, ShieldCheck } from 'lucide-react';

export const TopupModal: React.FC = () => {
  const { activeModal, setModal, topupWallet, student } = useApp();
  const [selectedAmount, setSelectedAmount] = useState(500);

  if (activeModal !== 'TOPUP') return null;

  const amounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24, maxWidth: 420 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wallet size={20} color="#F59E0B" />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC' }}>NEXORA Campus Wallet Top-Up</span>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} color="#94A3B8" />
          </button>
        </div>

        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>CURRENT WALLET BALANCE</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#FBBF24' }}>₹{student.walletBalance}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Top-Up Amount</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`btn ${selectedAmount === amt ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 15, fontWeight: 700 }}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94A3B8', marginBottom: 20 }}>
          <ShieldCheck size={16} color="#10B981" />
          Secured by NEXORA UPI Integration • Zero Transaction Fees
        </div>

        <button
          onClick={() => topupWallet(selectedAmount)}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          Add ₹{selectedAmount} to Wallet
        </button>
      </div>
    </div>
  );
};

export default TopupModal;
