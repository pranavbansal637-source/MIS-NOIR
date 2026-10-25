import React, { useState } from 'react';
import { CampusMarketplacePage } from './CampusMarketplacePage';
import { LibraryPage } from './LibraryPage';
import { CampusMapPage } from './CampusMapPage';
import { HostelPage } from './HostelPage';
import { TransportPage } from './TransportPage';
import { MedicalPage } from './MedicalPage';
import {
  UtensilsCrossed,
  Store,
  BookOpen,
  Printer,
  MapPin,
  Building2,
  ArrowLeft
} from 'lucide-react';

export const StudentCampusPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'FOOD',
      title: 'FOOD',
      desc: 'Canteen food court, daily specials & pre-orders',
      icon: UtensilsCrossed,
      color: '#D97706',
      bgColor: '#FEF3C7'
    },
    {
      id: 'SHOPS',
      title: 'SHOPS',
      desc: 'Campus store, books, stationery & merchandise',
      icon: Store,
      color: '#059669',
      bgColor: '#D1FAE5'
    },
    {
      id: 'LIBRARY',
      title: 'LIBRARY',
      desc: 'Book catalogue search, borrow history & renewal',
      icon: BookOpen,
      color: '#2563EB',
      bgColor: '#EFF6FF'
    },
    {
      id: 'PRINTING',
      title: 'PRINTING',
      desc: 'Cloud document printing queue & kiosk status',
      icon: Printer,
      color: '#D97706',
      bgColor: '#FEF3C7'
    },
    {
      id: 'MAP',
      title: 'MAP',
      desc: 'Interactive campus map, rooms & venue directory',
      icon: MapPin,
      color: '#DB2777',
      bgColor: '#FCE7F3'
    },
    {
      id: 'FACILITIES',
      title: 'FACILITIES',
      desc: 'Hostel gate passes, Shuttle GPS & Medical desk',
      icon: Building2,
      color: '#2563EB',
      bgColor: '#EFF6FF'
    }
  ];

  if (activeCategory === 'FOOD' || activeCategory === 'SHOPS') {
    return (
      <div>
        <button
          onClick={() => setActiveCategory(null)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: 20, gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to Campus Gateway
        </button>
        <CampusMarketplacePage />
      </div>
    );
  }

  if (activeCategory === 'LIBRARY') {
    return (
      <div>
        <button
          onClick={() => setActiveCategory(null)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: 20, gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to Campus Gateway
        </button>
        <LibraryPage />
      </div>
    );
  }

  if (activeCategory === 'MAP') {
    return (
      <div>
        <button
          onClick={() => setActiveCategory(null)}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: 20, gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to Campus Gateway
        </button>
        <CampusMapPage />
      </div>
    );
  }

  if (activeCategory === 'FACILITIES') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <button
          onClick={() => setActiveCategory(null)}
          className="btn btn-secondary btn-sm"
          style={{ alignSelf: 'flex-start', gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to Campus Gateway
        </button>
        <HostelPage />
        <TransportPage />
        <MedicalPage />
      </div>
    );
  }

  if (activeCategory === 'PRINTING') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <button
          onClick={() => setActiveCategory(null)}
          className="btn btn-secondary btn-sm"
          style={{ alignSelf: 'flex-start', gap: 6 }}
        >
          <ArrowLeft size={16} /> Back to Campus Gateway
        </button>
        <div className="noir-card" style={{ padding: 28, textAlign: 'center' }}>
          <Printer size={48} color="var(--brand-primary)" style={{ margin: '0 auto 14px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>VASCENOVA Cloud Printing Services</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 480, margin: '8px auto 20px' }}>
            Upload PDFs from VASCENOVA Document Vault & release print jobs at any Campus Palm Terminal in Block A, B, or Library.
          </p>
          <div className="badge badge-success" style={{ padding: '8px 20px', fontSize: 13, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            ✓ 3 Cloud Print Kiosks Online • ₹2.00 / page
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          CAMPUS SERVICES GATEWAY
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
          Campus Experience
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Access food court orders, campus store, library catalogue, cloud printing, maps and facilities.
        </p>
      </div>

      {/* Visual Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="noir-card noir-card-interactive"
              style={{
                padding: 22,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                borderRadius: 16
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: cat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={24} color={cat.color} />
              </div>

              <div>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                  {cat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
