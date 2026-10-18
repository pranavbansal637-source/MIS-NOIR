import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navigation, Search, Building } from 'lucide-react';

export const CampusMapPage: React.FC = () => {
  const { showToast } = useApp();
  const [search, setSearch] = useState('A403');

  const locations = [
    { name: 'Room A403 (Marketing Lecture)', building: 'Academic Block A', floor: '4th Floor', room: 'A403', distance: '120m away' },
    { name: 'Room A404 (Finance Lecture)', building: 'Academic Block A', floor: '4th Floor', room: 'A404', distance: '130m away' },
    { name: 'Central University Library', building: 'Library Pavilion', floor: 'Ground & 1st Floor', room: 'Lib Main', distance: '250m away' },
    { name: 'Main Campus Canteen & POS', building: 'Student Center', floor: 'Ground Floor', room: 'Canteen 1', distance: '300m away' },
    { name: 'Main Auditorium & Innovation Hall', building: 'Cultural Complex', floor: 'Main Level', room: 'AUD-01', distance: '400m away' }
  ];

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.room.toLowerCase().includes(search.toLowerCase()) ||
    l.building.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Room Locator & Map</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Real-time room navigation, terminal check-ins & building directories
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
        <input
          type="text"
          className="input-field"
          style={{ paddingLeft: 42 }}
          placeholder="Search room (e.g., A403, Library, Canteen, Auditorium)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid-2">
        {filtered.map((loc, i) => (
          <div key={i} className="noir-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Building size={22} color="#F59E0B" />
              </div>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800 }}>{loc.name}</h4>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {loc.building} • {loc.floor} • Room {loc.room}
                </div>
                <div style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 600, marginTop: 4 }}>
                  {loc.distance}
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast(`AR Navigation route calculated to ${loc.room}.`)}
              className="btn btn-primary btn-sm"
            >
              <Navigation size={14} /> Navigate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
