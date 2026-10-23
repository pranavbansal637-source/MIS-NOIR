import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const PlacementsPage: React.FC = () => {
  const { placementDrives, applyPlacementDrive, student } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Career Placement & Campus Recruitment</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Corporate hiring drives, resume verification & interview schedule tracker
        </p>
      </div>

      {/* Student CGPA Status */}
      <div className="noir-card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)', border: '1px solid #BFDBFE', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)', color: '#0F172A' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>OFFICIAL CUMULATIVE GPA (CGPA)</div>
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 4, color: '#2563EB' }}>{student.cgpa} / 4.00</div>
            <div style={{ fontSize: 13, color: '#475569' }}>Eligible for 100% of Tier-1 Corporate Campus Drives</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {placementDrives.map((drive) => (
          <div key={drive.id} className="noir-card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{drive.companyName}</h3>
                <span className="badge badge-primary">{drive.role}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                CTC Offer: <strong>{drive.ctc}</strong> • Drive Date: {drive.driveDate} • Minimum CGPA: {drive.eligibilityCgpa}
              </div>
            </div>

            <div>
              {drive.applied ? (
                <span className="badge badge-success" style={{ padding: '8px 14px' }}>
                  <CheckCircle2 size={14} /> {drive.status}
                </span>
              ) : (
                <button onClick={() => applyPlacementDrive(drive.id)} className="btn btn-primary">
                  Apply via NEXORA Resume Vault <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
