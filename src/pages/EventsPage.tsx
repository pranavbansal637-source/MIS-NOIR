import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { EventItem } from '../types';
import { Calendar, MapPin, Ticket, QrCode, CheckCircle2, User, X } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, registerForEvent } = useApp();
  const [selectedTicket, setSelectedTicket] = useState<EventItem | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Events & Registration</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Discover hackathons, guest lectures, cultural festivals & sports faceoffs
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
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{evt.title}</h3>
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
                    <button onClick={() => setSelectedTicket(evt)} className="btn btn-secondary btn-sm">
                      <QrCode size={14} /> View Ticket
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => registerForEvent(evt.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Ticket size={16} /> Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="modal-backdrop" onClick={() => setSelectedTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 24, textAlign: 'center', maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="badge badge-success">✓ VALID EVENT ENTRY TICKET</span>
              <button onClick={() => setSelectedTicket(null)} className="btn btn-ghost btn-icon btn-sm"><X size={18} /></button>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800 }}>{selectedTicket.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{selectedTicket.date} • {selectedTicket.venue}</p>

            <div style={{ margin: '20px 0', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 'var(--radius-lg)', display: 'inline-block', border: '1px solid var(--border-color)' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedTicket.ticketQr}`}
                alt="QR Ticket"
                style={{ width: 140, height: 140 }}
              />
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginTop: 8 }}>
                PALM / QR TERMINAL CHECK-IN
              </div>
            </div>

            <button onClick={() => setSelectedTicket(null)} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};
