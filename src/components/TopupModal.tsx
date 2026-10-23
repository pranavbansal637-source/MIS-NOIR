import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, X, ShieldCheck, QrCode, CreditCard, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const TopupModal: React.FC = () => {
  const { activeModal, setModal, student, processGatewayTopup, openReceiptModal } = useApp();

  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');

  // Form Inputs
  const [upiVpa, setUpiVpa] = useState('pranav@okhdfcbank');
  const [cardHolder, setCardHolder] = useState(student.name);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('SBI');

  // Gateway Simulation State
  const [gatewayStage, setGatewayStage] = useState<'IDLE' | 'PROCESSING' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedTx, setCompletedTx] = useState<any | null>(null);

  if (activeModal !== 'TOPUP') return null;

  const amounts = [200, 500, 1000, 2000, 5000];
  const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount;

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) {
      setErrorMessage('Please select or enter a valid amount.');
      return;
    }

    setErrorMessage('');
    setGatewayStage('PROCESSING');

    // Stage 1: Initiating with payment gateway
    setTimeout(async () => {
      setGatewayStage('VERIFYING');

      // Stage 2: Verification webhook from provider
      const res = await processGatewayTopup(finalAmount, paymentMethod, {
        upiVpa,
        cardNumber,
        cardHolder,
        selectedBank
      });

      if (res.success && res.transaction) {
        setCompletedTx(res.transaction);
        setGatewayStage('SUCCESS');
      } else {
        setErrorMessage(res.error || 'Payment gateway declined transaction.');
        setGatewayStage('FAILED');
      }
    }, 1000);
  };

  const handleClose = () => {
    setGatewayStage('IDLE');
    setErrorMessage('');
    setCompletedTx(null);
    setModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: 24, maxWidth: 480 }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wallet size={20} color="var(--brand-primary)" />
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
              NEXORA Secure Payment Gateway
            </span>
          </div>
          <button onClick={handleClose} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Current Balance Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 14,
            marginBottom: 20,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Current Wallet Balance
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
            ₹{student.walletBalance}
          </div>
        </div>

        {/* Stage 1: Form Input */}
        {gatewayStage === 'IDLE' && (
          <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Amount Presets */}
            <div>
              <label className="form-label">Select Amount to Add</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 10 }}>
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`btn btn-sm ${selectedAmount === amt && !customAmount ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: 13, fontWeight: 800, padding: '8px 4px' }}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <input
                type="number"
                placeholder="Or enter custom amount in ₹..."
                className="input-field"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="10"
                max="50000"
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="form-label">Select Payment Gateway Provider</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { id: 'UPI' as const, label: 'Instant UPI', icon: QrCode },
                  { id: 'CARD' as const, label: 'Debit / Card', icon: CreditCard },
                  { id: 'NETBANKING' as const, label: 'NetBanking', icon: Building2 }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      style={{
                        flexDirection: 'column',
                        padding: '10px 8px',
                        gap: 4,
                        fontSize: 12,
                        borderRadius: 12
                      }}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Gateway Details Form */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', padding: 14, borderRadius: 12 }}>
              {paymentMethod === 'UPI' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Enter Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    placeholder="e.g. mobileNumber@upi or name@okaxis"
                    style={{ fontSize: 13 }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Supported: Google Pay, PhonePe, Paytm, BHIM & all Indian UPI apps
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 12 }}>Cardholder Name</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Name on Card"
                      style={{ fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Card Number</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="16-digit number"
                        style={{ fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>Expiry</label>
                      <input
                        type="text"
                        required
                        className="input-field"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        style={{ fontSize: 13 }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 12 }}>CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        className="input-field"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    🔒 256-bit SSL encrypted. Raw CVV is never stored.
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Select Approved Campus Banking Institution</label>
                  <select
                    className="input-field"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={{ fontSize: 13 }}
                  >
                    <option value="SBI">State Bank of India (Official University Branch)</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                  </select>
                </div>
              )}
            </div>

            {errorMessage && (
              <div style={{ color: 'var(--state-danger)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={15} /> {errorMessage}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--brand-emerald)" />
              Secured by RBI Compliant Payment Gateway • Zero Surcharge
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', fontWeight: 900 }}>
              Pay ₹{finalAmount} via Gateway
            </button>
          </form>
        )}

        {/* Stage 2 & 3: Processing & Server Webhook Verification */}
        {(gatewayStage === 'PROCESSING' || gatewayStage === 'VERIFYING') && (
          <div style={{ textAlign: 'center', padding: '36px 12px' }}>
            <Loader2 size={44} color="var(--brand-primary)" className="spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>
              {gatewayStage === 'PROCESSING' ? 'Contacting Payment Gateway...' : 'Verifying Server Webhook & Ledger...'}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
              Please do not close or refresh this window. Authorizing ₹{finalAmount} via {paymentMethod}...
            </p>
          </div>
        )}

        {/* Stage 4: Payment Confirmed */}
        {gatewayStage === 'SUCCESS' && (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.14)',
                border: '2px solid var(--brand-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={36} color="var(--brand-emerald)" />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)' }}>
              Payment Verified & Confirmed!
            </h3>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--brand-emerald)', margin: '8px 0' }}>
              +₹{finalAmount}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Transaction Ref: <strong>{completedTx?.receiptId}</strong>. Your updated wallet balance is <strong>₹{student.walletBalance}</strong>.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              {completedTx && (
                <button
                  onClick={() => {
                    handleClose();
                    openReceiptModal(completedTx);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  View Receipt
                </button>
              )}
              <button
                onClick={handleClose}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Stage 5: Payment Failed */}
        {gatewayStage === 'FAILED' && (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '2px solid var(--state-danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <AlertCircle size={32} color="var(--state-danger)" />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--state-danger)' }}>
              Transaction Declined
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, marginBottom: 20 }}>
              {errorMessage || 'Payment gateway could not verify the transaction.'}
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setGatewayStage('IDLE')} className="btn btn-secondary" style={{ flex: 1 }}>
                Try Again
              </button>
              <button onClick={handleClose} className="btn btn-primary" style={{ flex: 1 }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopupModal;
