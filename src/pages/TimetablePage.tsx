import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, User, AlertCircle, Sparkles } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { studentTimetable, student } = useApp();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

  // Determine current day of the week
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const defaultDay = todayIndex >= 1 && todayIndex <= 6 ? days[todayIndex - 1] : 'Monday';

  const [selectedDay, setSelectedDay] = useState<string>(defaultDay);
  const [viewMode, setViewMode] = useState<'DAY' | 'WEEK'>('DAY');

  const filteredEntries = viewMode === 'DAY'
    ? studentTimetable.filter((entry) => entry.day === selectedDay)
    : studentTimetable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            ACADEMIC ROSTER & SCHEDULING
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
            Student Class Timetable
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
            {student.program} • Semester {student.semester} • Section A • Academic Year 2026–2027
          </p>
        </div>

        {/* View Switcher Mode */}
        <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--bg-subtle)', padding: 4, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setViewMode('DAY')}
            className={`noir-tab-pill ${viewMode === 'DAY' ? 'active' : ''}`}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            Day Schedule
          </button>
          <button
            onClick={() => setViewMode('WEEK')}
            className={`noir-tab-pill ${viewMode === 'WEEK' ? 'active' : ''}`}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            Full Week Matrix
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      {viewMode === 'DAY' && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === defaultDay;
            const count = studentTimetable.filter((t) => t.day === day).length;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 18px',
                  borderRadius: 14,
                  background: isSelected ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'var(--bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  border: isSelected ? '1px solid #1D4ED8' : '1px solid var(--border-color)',
                  boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'var(--shadow-xs)',
                  cursor: 'pointer',
                  minWidth: 100,
                  transition: 'all 120ms ease'
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#FFFFFF' : 'inherit' }}>{day}</div>
                <div style={{ fontSize: 11, fontWeight: isSelected ? 700 : 500, color: isSelected ? '#FFFFFF' : 'var(--text-secondary)', opacity: isSelected ? 1 : 0.8, marginTop: 2 }}>
                  {isToday ? '★ Today' : `${count} Lectures`}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Schedule Feed */}
      {filteredEntries.length === 0 ? (
        <div className="noir-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Calendar size={42} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
            No Scheduled Classes for {selectedDay}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, maxWidth: 360, margin: '6px auto 0' }}>
            Enjoy your campus study break, work on group assignments, or reserve study rooms in the Central Library.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredEntries.map((item, idx) => (
            <div
              key={item.id}
              className="noir-card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                borderLeft: `5px solid ${idx % 2 === 0 ? 'var(--brand-primary)' : 'var(--brand-emerald)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Time Badge */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 12,
                    padding: '12px 16px',
                    textAlign: 'center',
                    minWidth: 110
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--brand-primary)' }}>
                    {item.startTime}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    to {item.endTime}
                  </div>
                  {viewMode === 'WEEK' && (
                    <span className="badge badge-neutral" style={{ fontSize: 10, marginTop: 4 }}>
                      {item.day}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge-primary">{item.courseCode}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {item.credits} Credits
                    </span>
                    {item.status === 'RESCHEDULED' && (
                      <span className="badge badge-warning" style={{ gap: 4 }}>
                        <AlertCircle size={12} /> Rescheduled
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', marginTop: 6 }}>
                    {item.courseName}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <User size={14} color="var(--brand-primary)" /> {item.facultyName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={14} color="var(--brand-accent)" /> Room {item.room} ({item.building})
                    </span>
                  </div>
                </div>
              </div>

              {/* Status / Quick Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="badge badge-success" style={{ padding: '6px 14px' }}>
                  <Sparkles size={12} /> Confirmed Slot
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
