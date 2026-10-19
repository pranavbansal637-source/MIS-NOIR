import React from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, ArrowRight } from 'lucide-react';

export const FeesPage: React.FC = () => {
  const { feeItems, openPayFeeModal } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>University Fee Structure & Clearance</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Tuition, hostel, mess & examination fee ledgers with installment options
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {feeItems.map((fee) => {
          const isPaid = fee.status === 'PAID';
          const due = fee.totalAmount - fee.paidAmount;
          return (
            <div key={fee.id} className="noir-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>{fee.title}</h3>
                  <span className={`badge ${isPaid ? 'badge-success' : fee.status === 'PARTIAL' ? 'badge-warning' : 'badge-danger'}`}>
                    {fee.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Due Date: {fee.dueDate} • Category: {fee.category}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                    Paid: ₹{fee.paidAmount} / ₹{fee.totalAmount}
                  </div>
                  <div style={{ fontSize: 12, color: isPaid ? 'var(--state-success)' : 'var(--state-danger)', fontWeight: 600 }}>
                    {isPaid ? '✓ Fully Cleared' : `Remaining Due: ₹${due}`}
                  </div>
                </div>

                {!isPaid && (
                  <button onClick={() => openPayFeeModal(fee)} className="btn btn-primary">
                    <CreditCard size={16} /> Pay Fee <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
