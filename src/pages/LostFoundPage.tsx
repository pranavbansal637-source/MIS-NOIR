import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export const LostFoundPage: React.FC = () => {
  const { lostFoundItems, reportLostItem, showToast } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;
    reportLostItem(title, location, 'Electronics');
    setTitle('');
    setLocation('');
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Lost & Found Vault</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Report lost items or claim verified items from Security Desk
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus size={16} /> Report Item
        </button>
      </div>

      {showForm && (
        <form className="noir-card" onSubmit={handleSubmit} style={{ border: '1px solid var(--brand-primary)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Log Found Item</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Item Title</label>
              <input type="text" className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Apple Watch" />
            </div>
            <div className="form-group">
              <label className="form-label">Location Found</label>
              <input type="text" className="input-field" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., A403 Desk" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Submit Record</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {lostFoundItems.map((item) => (
          <div key={item.id} className="noir-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <strong style={{ fontSize: 15 }}>{item.title}</strong>
                <span className="badge badge-primary">{item.category}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Found at: {item.locationFound} • Date: {item.dateFound} • Contact: {item.contactPerson}
              </div>
            </div>

            {item.status === 'CLAIMED' ? (
              <span className="badge badge-success">✓ CLAIMED</span>
            ) : (
              <button onClick={() => showToast(`Claim request sent to Security Desk for ${item.title}`)} className="btn btn-secondary btn-sm">
                Claim Item
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
