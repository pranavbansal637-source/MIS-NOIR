import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, X, ShieldCheck } from 'lucide-react';

export const PayFeeModal: React.FC = () => {
  const { activeModal, setModal, selectedFeeForPay, payFeeItem, student } = useApp();
  const [customAmount, setCustomAmount] = useState<number>(0);

  if (activeModal !== 'PAY_FEE' || !selectedFeeForPay) return null;

  const due = selectedFeeForPay.totalAmount - selectedFeeForPay.paidAmount;
  const payAmt = customAmount > 0 ? customAmount : due;

  const handlePay = async () => {
    await payFeeItem(selectedFeeForPay.id, payAmt);
  };

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24, maxWidth: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={20} color="#F59E0B" />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC' }}>NEXORA University Fee Clearance</span>
          </div>
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm"><X size={18} color="#94A3B8" /></button>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{selectedFeeForPay.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Due Date: {selectedFeeForPay.dueDate} • Total: ₹{selectedFeeForPay.totalAmount} • Paid: ₹{selectedFeeForPay.paidAmount}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#FBBF24', marginTop: 8 }}>
            Remaining Balance Due: ₹{due}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Amount</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setCustomAmount(due)} className={`btn ${payAmt === due ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>
              Full (₹{due})
            </button>
            {due > 5000 && (
              <button onClick={() => setCustomAmount(Math.round(due / 2))} className={`btn ${payAmt === Math.round(due / 2) ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>
                50% Installment (₹{Math.round(due / 2)})
              </button>
            )}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, margin: '14px 0' }}>
          <ShieldCheck size={16} color="var(--state-success)" /> Available Wallet Balance: ₹{student.walletBalance}
        </div>

        <button onClick={handlePay} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          Confirm Fee Payment of ₹{payAmt}
        </button>
      </div>
    </div>
  );
};

export default PayFeeModal;
