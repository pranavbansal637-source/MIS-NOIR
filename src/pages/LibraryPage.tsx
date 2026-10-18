import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bookmark, CheckCircle2 } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { books, reserveBook } = useApp();
  const [search, setSearch] = useState('');

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Central Library Catalogue & Reservations</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Search physical & digital books • Self-checkout via Palm / QR Terminal
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: 42 }}
            placeholder="Search titles, authors, ISBN (e.g. Marketing, Damodaran)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid-3">
        {filtered.map((b) => (
          <div key={b.id} className="noir-card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <img
              src={b.coverUrl}
              alt={b.title}
              style={{ width: 80, height: 110, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', flex: 1 }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: 10 }}>{b.category}</span>
                <h4 style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 2px 0' }}>{b.title}</h4>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.author}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{b.location}</div>
              </div>

              <div style={{ marginTop: 10 }}>
                {b.isReserved ? (
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> RESERVED FOR PICKUP
                  </span>
                ) : (
                  <button
                    onClick={() => reserveBook(b.id)}
                    className="btn btn-secondary btn-sm"
                    disabled={b.availableCopies === 0}
                  >
                    <Bookmark size={14} /> Reserve Copy ({b.availableCopies} Left)
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
