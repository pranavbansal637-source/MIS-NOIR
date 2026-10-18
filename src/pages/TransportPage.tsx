import React from 'react';
import { useApp } from '../context/AppContext';
import { Bus, Navigation, Phone } from 'lucide-react';

export const TransportPage: React.FC = () => {
  const { transportRoute } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Shuttle & Transport Tracker</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Real-time GPS shuttle tracking, driver contacts & bus pass validity
        </p>
      </div>

      <div className="noir-card" style={{ borderLeft: '4px solid var(--brand-secondary)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bus size={28} color="#38BDF8" />
            </div>
            <div>
              <span className="badge badge-primary">{transportRoute.routeNo}</span>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{transportRoute.routeName}</h3>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                Bus Registration: {transportRoute.busNo} • Driver: {transportRoute.driverName} ({transportRoute.driverPhone})
              </div>
            </div>
          </div>

          <span className="badge badge-success" style={{ padding: '8px 14px' }}>
            ✓ {transportRoute.passValidity}
          </span>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>LIVE GPS TELEMETRY</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Navigation size={16} /> {transportRoute.currentLocation}
            </div>
          </div>

          <a href={`tel:${transportRoute.driverPhone}`} className="btn btn-secondary btn-sm">
            <Phone size={14} /> Call Driver
          </a>
        </div>
      </div>
    </div>
  );
};
