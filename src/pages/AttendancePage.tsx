import React from 'react';
import { useApp } from '../context/AppContext';
import { Hand, TrendingUp } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { student, subjects, setModal } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Subject Attendance & Insights</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Real-time biometric attendance tracker • Minimum University Threshold: 75%
          </p>
        </div>
        <button
          onClick={() => setModal('PALM_SCAN')}
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <Hand size={18} /> Record Palm Check-In
        </button>
      </div>

      {/* Main Stats Banner */}
      <div
        className="noir-card"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 21, 32, 0.95) 0%, rgba(9, 12, 19, 0.98) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          color: '#F8FAFC',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: 28
        }}
      >
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Overall Academic Attendance
          </span>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#FBBF24', marginTop: 4 }}>
            {student.attendanceOverall}%
          </div>
          <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4 }}>
            BBA • Semester 2 • Total Classes Conducted: 99
          </div>
        </div>

        {/* Insight Box */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: 18,
            maxWidth: 420
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34D399', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            <TrendingUp size={16} /> ATTENDANCE INSIGHT
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
            You are currently above the minimum attendance requirement.
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
            All subjects pass criteria. Micro Economics (76%) requires attendance in 1 more upcoming lecture to enter the safe 80%+ zone.
          </div>
        </div>
      </div>

      {/* Subject-Wise Breakdown Cards */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Subject Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {subjects.map((sub) => {
            const isWarning = sub.percentage < 78;
            return (
              <div
                key={sub.subjectId}
                className="noir-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                      {sub.subjectName} <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 13 }}>({sub.code})</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      Instructor: {sub.instructor} • Required: {sub.requiredPercentage}%
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: isWarning ? 'var(--state-warning)' : 'var(--brand-primary)' }}>
                        {sub.percentage}%
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {sub.attendedClasses} / {sub.totalClasses} Attended
                      </div>
                    </div>

                    <span className={`badge ${isWarning ? 'badge-warning' : 'badge-success'}`}>
                      {sub.percentage >= 85 ? 'EXCELLENT' : sub.percentage >= 75 ? 'SAFE' : 'WARNING'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)', height: 10, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${sub.percentage}%`,
                      height: '100%',
                      backgroundColor: isWarning ? 'var(--state-warning)' : 'var(--brand-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 600ms ease-out'
                    }}
                  />
                </div>

                {/* Status bar details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>
                    Classes needed to reach target: <strong>{sub.classesNeededToTarget} lecture</strong>
                  </span>
                  <span style={{ fontStyle: 'italic' }}>
                    Recent trend: {sub.recentTrend.join('% → ')}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
