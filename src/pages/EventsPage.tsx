import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { EventItem } from '../types';
import { Calendar, MapPin, Ticket, QrCode, CheckCircle2, User, X, Monitor, FileText } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, registerForEvent, terminals, student, showToast } = useApp();
  const [selectedTicket, setSelectedTicket] = useState<EventItem | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);

  // Manual Form State
  const [useManualForm, setUseManualForm] = useState(false);
  const manualRoll = student.studentId;
  const [manualPhone, setManualPhone] = useState(student.phone);
  const [manualReason, setManualReason] = useState('');
  const [agreeRules, setAgreeRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find nearest registered terminal
  const nearestTerminal = terminals.find((t) => t.type === 'CLASSROOM' || t.locationName.toLowerCase().includes('auditorium')) || terminals[0];

  const handleStartRegistration = (evt: EventItem) => {
    if (evt.isRegistered) {
      showToast(`Already registered for "${evt.title}". Duplicate submission prevented.`);
      return;
    }
    setRegisteringEvent(evt);
    setUseManualForm(false);
    setManualReason('');
    setAgreeRules(false);
  };

  const handleConfirmBiometricRegistration = async () => {
    if (!registeringEvent) return;
    setIsSubmitting(true);
    const success = await registerForEvent(registeringEvent.id);
    setIsSubmitting(false);
    if (success) {
      showToast(`✓ Biometric pass confirmed for ${registeringEvent.title}!`);
      setRegisteringEvent(null);
    }
  };

  const handleConfirmManualRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringEvent) return;

    if (!agreeRules) {
      showToast('⚠️ Please agree to the institutional event verification rules.');
      return;
    }

    if (!manualReason.trim()) {
      showToast('⚠️ Please state your verification reason for manual entry.');
      return;
    }

    setIsSubmitting(true);
    const success = await registerForEvent(registeringEvent.id);
    setIsSubmitting(false);

    if (success) {
      showToast(`✓ Manual registration form submitted and verified for ${registeringEvent.title}.`);
      setRegisteringEvent(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Campus Events & Registration</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Discover hackathons, guest lectures, cultural festivals & sports faceoffs with biometric terminal verification
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid-3">
        {events.map((evt) => (
          <div key={evt.id} className="noir-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <img
              src={evt.posterUrl}
              alt={evt.title}
              style={{ width: '100%', height: 160, objectFit: 'cover' }}
            />
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="badge badge-primary">{evt.category}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {evt.fee === 0 ? 'FREE ENTRY' : `₹${evt.fee}`}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{evt.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px 0 10px 0', lineHeight: 1.4 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="var(--brand-primary)" /> {evt.date} • {evt.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} color="var(--brand-accent)" /> {evt.venue}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={14} /> {evt.organizer}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 8 }}>
                {evt.isRegistered ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="badge badge-success" style={{ flex: 1, justifyContent: 'center', padding: '8px' }}>
                      <CheckCircle2 size={14} /> REGISTERED
                    </span>
                    <button onClick={() => setSelectedTicket(evt)} className="btn btn-secondary btn-sm" style={{ fontWeight: 700 }}>
                      <QrCode size={14} /> View Ticket
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartRegistration(evt)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontWeight: 800 }}
                  >
                    <Ticket size={16} /> Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal with Biometric Instructions & Manual Fallback (Module 1.5) */}
      {registeringEvent && (
        <div className="modal-backdrop" onClick={() => !isSubmitting && setRegisteringEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span className="badge badge-primary">{registeringEvent.category}</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 4, color: 'var(--text-primary)' }}>
                  {registeringEvent.title}
                </h3>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {registeringEvent.date} • {registeringEvent.venue}
                </div>
              </div>
              <button onClick={() => setRegisteringEvent(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            {/* Nearest Biometric Scanner Guidance Banner */}
            <div
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid #BFDBFE',
                borderRadius: 12,
                padding: 16,
                marginBottom: 18
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1D4ED8', fontWeight: 800, fontSize: 13 }}>
                <Monitor size={16} /> Nearest Registered Palm Scanner Terminal
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 4, fontWeight: 700 }}>
                {nearestTerminal ? nearestTerminal.locationName : 'Main Auditorium Foyer Terminal'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Terminal Identifier: <strong>{nearestTerminal ? nearestTerminal.terminalCode : 'NEXORA-TERM-AUD-01'}</strong> • Status: <strong style={{ color: '#059669' }}>Online</strong>
              </div>
            </div>

            {/* Option Switcher: Biometric vs Manual */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              <button
                type="button"
                onClick={() => setUseManualForm(false)}
                className={`btn ${!useManualForm ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ flex: 1, justifyContent: 'center', fontWeight: 700 }}
              >
                🖐️ Biometric Terminal Pass
              </button>
              <button
                type="button"
                onClick={() => setUseManualForm(true)}
                className={`btn ${useManualForm ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ flex: 1, justifyContent: 'center', fontWeight: 700 }}
              >
                <FileText size={14} /> Manual Form Entry
              </button>
            </div>

            {!useManualForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  This event uses biometric check-in at the venue. Your registered NEXORA Palm Biometrics credential will automatically unlock access at terminal <strong>{nearestTerminal ? nearestTerminal.terminalCode : 'NEXORA-TERM-AUD-01'}</strong>.
                </div>

                <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: 14, borderRadius: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Student Name:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{student.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Roll Number:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{student.studentId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Entry Fee:</span>
                    <strong style={{ color: '#059669' }}>{registeringEvent.fee === 0 ? 'FREE' : `₹${registeringEvent.fee}`}</strong>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBiometricRegistration}
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', gap: 8, fontWeight: 800 }}
                >
                  <CheckCircle2 size={18} /> {isSubmitting ? 'Confirming...' : 'Confirm Biometric Event Pass'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmManualRegistration} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Manual registration adheres to institutional verification rules. All submissions are cross-referenced with your student record and must include emergency contact details.
                </div>

                <div className="form-group">
                  <label className="form-label">Student Roll Number</label>
                  <input
                    type="text"
                    required
                    readOnly
                    className="input-field"
                    value={manualRoll}
                    style={{ backgroundColor: 'var(--bg-main)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact / Emergency Phone</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Manual Registration / Clearance Note</label>
                  <textarea
                    required
                    rows={2}
                    className="input-field"
                    value={manualReason}
                    onChange={(e) => setManualReason(e.target.value)}
                    placeholder="e.g. Attending as department delegate or requesting manual physical roster entry"
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeRules}
                    onChange={(e) => setAgreeRules(e.target.checked)}
                  />
                  <span>I certify this entry is authorized and adheres to campus event protocols.</span>
                </label>

                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ flex: 1, fontWeight: 800 }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Manual Entry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24, textAlign: 'center', maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="badge badge-success">✓ VALID EVENT ENTRY TICKET</span>
              <button onClick={() => setSelectedTicket(null)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedTicket.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{selectedTicket.date} • {selectedTicket.venue}</p>

            <div style={{ margin: '20px 0', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 'var(--radius-lg)', display: 'inline-block', border: '1px solid var(--border-color)' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedTicket.ticketQr}`}
                alt="QR Ticket"
                style={{ width: 140, height: 140 }}
              />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginTop: 8 }}>
                PALM / QR TERMINAL CHECK-IN
              </div>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Pass Code: <strong>{selectedTicket.ticketQr}</strong> • Registered to {student.name} ({student.studentId})
            </div>

            <button onClick={() => setSelectedTicket(null)} className="btn btn-primary" style={{ width: '100%', fontWeight: 700 }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
