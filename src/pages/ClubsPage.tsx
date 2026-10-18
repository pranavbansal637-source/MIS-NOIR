import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Calendar, Award, CheckCircle2 } from 'lucide-react';

export const ClubsPage: React.FC = () => {
  const { showToast } = useApp();

  const clubs = [
    { name: 'NEXORA Innovation & Robotics Society', category: 'Innovation & Startups', members: 142, icon: Award, joined: true },
    { name: 'Autonomous Robotics & AI Club', category: 'Technology', members: 98, icon: Users, joined: false },
    { name: 'NEXORA Symphony & Cultural Ensemble', category: 'Arts & Music', members: 210, icon: Calendar, joined: false }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Student Clubs & Societies</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Join campus chapters, manage event committees & track activity points
        </p>
      </div>

      <div className="grid-3">
        {clubs.map((c, i) => (
          <div key={i} className="noir-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: 8 }}>{c.category}</span>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>{c.name}</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                Active Members: {c.members} • Official Chapter
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
              {c.joined ? (
                <span className="badge badge-success" style={{ width: '100%', justifyContent: 'center', padding: 8 }}>
                  <CheckCircle2 size={14} /> CHAPTER MEMBER
                </span>
              ) : (
                <button
                  onClick={() => showToast(`Membership request submitted for ${c.name}`)}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Join Club Chapter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
