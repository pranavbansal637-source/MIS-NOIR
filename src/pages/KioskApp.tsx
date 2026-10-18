import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NoirLogo } from '../components/NoirLogo';
import {
  Hand,
  ShieldAlert,
  CheckCircle2,
  MapPin,
  ArrowLeft
} from 'lucide-react';

export const KioskApp: React.FC = () => {
  const {
    setModal,
    recordPalmAttendance,
    student,
    activePosPaymentRequest,
    approvePosPaymentRequest,
    activeTerminalLocation,
    activeTerminalType,
    setActiveTerminalConfig,
    showToast,
    switchRole
  } = useApp();

  const [kioskStatus, setKioskStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS'>('IDLE');
  const [countdown, setCountdown] = useState(10);
  const [shopPaid, setShopPaid] = useState(false);

  const handleSimulatePalmScan = () => {
    setKioskStatus('SCANNING');
    setTimeout(() => {
      if (activeTerminalType === 'CLASSROOM') {
        recordPalmAttendance('Marketing Management');
      }
      setKioskStatus('SUCCESS');
      setCountdown(10);
    }, 1200);
  };

  const handleConfirmShopPayment = async () => {
    const ok = await approvePosPaymentRequest();
    if (ok) {
      setShopPaid(true);
      setTimeout(() => {
        setShopPaid(false);
        setKioskStatus('IDLE');
      }, 3000);
    }
  };

  useEffect(() => {
    let interval: any;
    if (kioskStatus === 'SUCCESS' && !shopPaid) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setKioskStatus('IDLE');
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [kioskStatus, shopPaid]);

  const terminalOptions = [
    { location: 'A403', type: 'CLASSROOM' as const, label: 'Room A403 (Classroom)' },
    { location: 'CANTEEN-01', type: 'SHOP' as const, label: 'Canteen Store (Shop POS)' },
    { location: 'LIB-01', type: 'LIBRARY' as const, label: 'Central Library (Library Terminal)' },
    { location: 'VENUE-01', type: 'EVENT' as const, label: 'Auditorium (Event Check-in)' },
    { location: 'GATE-01', type: 'GATE' as const, label: 'Main Gate (Campus Entry)' }
  ];

  return (
    <div
      className="kiosk-mode"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B0F19',
        color: '#FFFFFF',
        padding: 32,
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Kiosk Top Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1E293B', paddingBottom: 20 }}>
        <NoirLogo size="lg" showSubtitle={true} theme="dark" />

        {/* Location / Context Switcher (DEMO TOOLBAR) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1E293B', padding: '6px 14px', borderRadius: 20 }}>
            <MapPin size={16} color="#38BDF8" />
            <select
              value={`${activeTerminalLocation}:${activeTerminalType}`}
              onChange={(e) => {
                const [loc, typ] = e.target.value.split(':');
                setActiveTerminalConfig(loc, typ as any);
                setKioskStatus('IDLE');
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {terminalOptions.map((opt) => (
                <option key={opt.location} value={`${opt.location}:${opt.type}`} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                  Terminal: {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setModal('EMERGENCY')}
            className="btn btn-danger"
            style={{ padding: '10px 18px', borderRadius: 20, fontSize: 13 }}
          >
            <ShieldAlert size={18} /> SOS Emergency
          </button>

          <button
            onClick={() => {
              switchRole('STUDENT');
              showToast('✓ Exited Kiosk Node. Returned to Student OS.');
            }}
            className="btn btn-secondary"
            style={{ padding: '10px 18px', borderRadius: 20, fontSize: 13, gap: 6, fontWeight: 800 }}
          >
            <ArrowLeft size={16} /> Exit Kiosk (Back to Student OS)
          </button>
        </div>
      </div>

      {/* Kiosk Main Content Area */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'center', marginTop: 24 }}>
        {/* Physical Palm Scanner Node Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 21, 32, 0.95) 0%, rgba(9, 12, 19, 0.98) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.5)',
            borderRadius: 24,
            padding: 48,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 460,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)'
          }}
        >
          {kioskStatus === 'IDLE' && (
            <div>
              <div
                className="palm-radar-circle"
                style={{ width: 200, height: 200, marginBottom: 28, cursor: 'pointer', margin: '0 auto 28px' }}
                onClick={handleSimulatePalmScan}
              >
                <Hand size={100} color="#F59E0B" />
              </div>

              <h1 style={{ fontSize: 34, fontWeight: 900, color: '#F8FAFC', letterSpacing: '0.02em' }}>
                PLACE YOUR PALM
              </h1>
              <p style={{ fontSize: 16, color: '#94A3B8', marginTop: 8, margin: '8px auto 28px' }}>
                NEXORA Subdermal Biometric Identity Node • {activeTerminalLocation} ({activeTerminalType})
              </p>

              {/* DEMO PALM SCAN BUTTON */}
              <button
                onClick={handleSimulatePalmScan}
                className="btn btn-primary btn-lg"
                style={{
                  fontSize: 18,
                  padding: '16px 36px',
                  borderRadius: 30,
                  fontWeight: 900
                }}
              >
                [ SIMULATE PALM SCAN ] (DEMO)
              </button>
            </div>
          )}

          {kioskStatus === 'SCANNING' && (
            <div>
              <div className="palm-radar-circle" style={{ width: 180, height: 180, margin: '0 auto 28px' }}>
                <div className="palm-radar-pulse" />
                <Hand size={90} color="#F59E0B" />
              </div>

              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FBBF24' }}>
                PALM DETECTED
              </h1>
              <p style={{ fontSize: 16, color: '#94A3B8', marginTop: 8 }}>
                Verifying vascular match with NEXORA identity vault...
              </p>
            </div>
          )}

          {kioskStatus === 'SUCCESS' && (
            <div>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: '#064E3B',
                  border: '3px solid #10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <CheckCircle2 size={56} color="#10B981" />
              </div>

              <span className="badge badge-success" style={{ fontSize: 14, padding: '6px 16px', marginBottom: 12 }}>
                ✓ IDENTITY VERIFIED
              </span>

              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
                {student.name}
              </h2>
              <div style={{ fontSize: 16, color: '#38BDF8', fontWeight: 700, marginTop: 4 }}>
                {student.program} • Semester {student.semester}
              </div>

              {/* CONTEXT-AWARE TERMINAL ACTION DISPLAY */}
              <div style={{ marginTop: 24, padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                {activeTerminalType === 'CLASSROOM' && (
                  <div>
                    <div style={{ fontSize: 18, color: '#10B981', fontWeight: 900 }}>
                      ✓ ATTENDANCE RECORDED
                    </div>
                    <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 6 }}>
                      Marketing Management (MKT-201) • 10:42 AM
                    </div>
                    <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 10, fontStyle: 'italic' }}>
                      Have a good class, Pranav!
                    </div>
                  </div>
                )}

                {activeTerminalType === 'SHOP' && (
                  <div>
                    {activePosPaymentRequest ? (
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#F59E0B', textTransform: 'uppercase' }}>
                          PAYMENT REQUEST RECEIVED
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginTop: 4 }}>
                          {activePosPaymentRequest.shopName}: ₹{activePosPaymentRequest.amount}
                        </div>
                        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
                          Items: {activePosPaymentRequest.itemsSummary}
                        </div>

                        {!shopPaid ? (
                          <button
                            onClick={handleConfirmShopPayment}
                            className="btn btn-primary"
                            style={{ marginTop: 16, width: '100%', justifyContent: 'center', backgroundColor: '#059669', fontSize: 16, fontWeight: 900 }}
                          >
                            [ CONFIRM PAYMENT ₹{activePosPaymentRequest.amount} ]
                          </button>
                        ) : (
                          <div style={{ fontSize: 16, color: '#10B981', fontWeight: 900, marginTop: 12 }}>
                            ✓ PAYMENT SUCCESSFUL!
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 18, color: '#10B981', fontWeight: 900 }}>
                          ✓ SHOP IDENTIFICATION VERIFIED
                        </div>
                        <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 4 }}>
                          NEXORA Balance: ₹{student.walletBalance}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
                          Awaiting merchant payment request from POS...
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTerminalType === 'LIBRARY' && (
                  <div>
                    <div style={{ fontSize: 18, color: '#FBBF24', fontWeight: 900 }}>
                      Welcome, Pranav
                    </div>
                    <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 6 }}>
                      Books borrowed: <strong>2</strong> • Due today: <strong style={{ color: '#F59E0B' }}>1</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                      <button onClick={() => showToast('Library Scanner ready for barcode scan.')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Borrow</button>
                      <button onClick={() => showToast('Book return slot unlocked.')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Return</button>
                      <button onClick={() => showToast('Loans renewed for 14 days.')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Renew</button>
                    </div>
                  </div>
                )}

                {activeTerminalType === 'EVENT' && (
                  <div>
                    <div style={{ fontSize: 18, color: '#10B981', fontWeight: 900 }}>
                      ✓ CHECK-IN SUCCESSFUL
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
                      NEXORA HACKSPHERE 2026
                    </div>
                    <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
                      Venue: Auditorium A • 10:54 AM
                    </div>
                  </div>
                )}

                {activeTerminalType === 'GATE' && (
                  <div>
                    <div style={{ fontSize: 18, color: '#10B981', fontWeight: 900 }}>
                      ✓ VERIFIED ENTRY
                    </div>
                    <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 4 }}>
                      Campus Gate Entry Recorded for {student.name}
                    </div>
                    <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 6 }}>
                      Hostel Gate Pass Status: APPROVED
                    </div>
                  </div>
                )}
              </div>

              {!shopPaid && (
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 16 }}>
                  Resetting terminal in <strong>{countdown}s</strong>...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Info Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#1E293B', padding: 24, borderRadius: 20, border: '1px solid #334155' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              TERMINAL LOCATION CONTEXT
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginTop: 6 }}>
              {activeTerminalLocation}
            </h3>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
              Type: {activeTerminalType} • Device ID: TRM-8891
            </div>

            <div style={{ marginTop: 16, borderTop: '1px solid #334155', paddingTop: 14, fontSize: 13, color: '#CBD5E1' }}>
              <div>Hardware Status: <strong style={{ color: '#10B981' }}>● ONLINE</strong></div>
              <div>Palm Subdermal Provider: <strong style={{ color: '#38BDF8' }}>Biometric Hash Active</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
