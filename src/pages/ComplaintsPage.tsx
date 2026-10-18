import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ComplaintTicket } from '../types';
import { Plus } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const { complaints, submitComplaint } = useApp();
  const [showNew, setShowNew] = useState(false);

  const [category, setCategory] = useState<ComplaintTicket['category']>('Classroom');
  const [priority, setPriority] = useState<ComplaintTicket['priority']>('MEDIUM');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    submitComplaint(category, description, priority);
    setDescription('');
    setShowNew(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Issue & Maintenance Desk</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Report classroom AV, Wi-Fi, electrical, or facilities tickets
          </p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="btn btn-primary">
          <Plus size={18} /> Log New Ticket
        </button>
      </div>

      {showNew && (
        <form className="noir-card" onSubmit={handleSubmit} style={{ border: '1px solid var(--brand-primary)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Log Maintenance Ticket</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                <option value="Classroom">Classroom / AV Projector</option>
                <option value="Wi-Fi">Wi-Fi & Network Latency</option>
                <option value="Electricity">Electricity & AC</option>
                <option value="Canteen">Canteen & Hygiene</option>
                <option value="Security">Campus Security</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High / Class Interruption</option>
                <option value="URGENT">Urgent SOS</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description of Issue</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Describe location, room number & symptoms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>Submit Ticket</button>
        </form>
      )}

      {/* Ticket List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {complaints.map((t) => (
          <div key={t.id} className="noir-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <strong style={{ fontSize: 14 }}>{t.ticketNo}</strong>
                <span className="badge badge-primary">{t.category}</span>
                <span className={`badge ${t.priority === 'HIGH' || t.priority === 'URGENT' ? 'badge-danger' : 'badge-neutral'}`}>
                  {t.priority}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.description}</p>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Created: {t.createdAt} • Assigned to: {t.assignedPerson || 'Helpdesk Queue'}
              </div>
            </div>

            <span className={`badge ${t.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
