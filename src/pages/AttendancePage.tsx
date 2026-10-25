import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hand, TrendingUp, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { student, subjects, setModal, liveAttendanceSession, attendanceRecords } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT' | 'CANCELLED' | 'EXCUSED'>('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  const isAttendanceRecorded = liveAttendanceSession.recordedStudentIds.includes(student.studentId);

  // Accurate calculations from actual attendance session history
  const conductedSessions = attendanceRecords.filter((r) => r.status !== 'CANCELLED');
  const attendedSessions = conductedSessions.filter((r) => r.status === 'PRESENT' || r.status === 'EXCUSED');
  const actualOverallPct = conductedSessions.length > 0
    ? Math.round((attendedSessions.length / conductedSessions.length) * 1000) / 10
    : student.attendanceOverall;

  const filteredHistory = attendanceRecords.filter((rec) => {
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;
    const matchesCourse = selectedCourseFilter === 'ALL' || rec.courseCode === selectedCourseFilter;
    return matchesStatus && matchesCourse;
  });

  const uniqueCourses = Array.from(new Set(attendanceRecords.map((r) => r.courseCode)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Subject Attendance & Insights</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Real-time biometric attendance tracker • Minimum University Threshold: 75%
          </p>
        </div>

        {/* Live Attendance State Action: Only shown during an authorized faculty live session */}
        {liveAttendanceSession.status === 'LIVE' ? (
          isAttendanceRecorded ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: 30,
                color: '#065F46',
                fontSize: 13,
                fontWeight: 800
              }}
            >
              <CheckCircle2 size={16} color="#059669" />
              ✓ Attendance Recorded ({liveAttendanceSession.courseCode})
            </div>
          ) : (
            <button
              onClick={() => setModal('PALM_SCAN')}
              className="btn btn-primary"
              style={{
                gap: 10,
                borderRadius: 30,
                padding: '9px 20px',
                fontWeight: 800,
                backgroundColor: '#059669',
                borderColor: '#047857',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#34D399', boxShadow: '0 0 8px #34D399' }} />
              <Hand size={18} /> Record Palm Check-In ({liveAttendanceSession.courseCode})
            </button>
          )
        ) : liveAttendanceSession.status === 'CLOSED' ? (
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 30
            }}
          >
            ● Attendance Session Closed
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Clock size={14} color="#64748B" />
            Attendance Standby (Awaiting Faculty Session)
          </div>
        )}
      </div>

      {/* Live Faculty Session Card if Live */}
      {liveAttendanceSession.status === 'LIVE' && (
        <div
          className="noir-card"
          style={{
            padding: 20,
            backgroundColor: '#ECFDF5',
            border: '2px solid #10B981',
            borderRadius: 14,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-success">● LIVE SESSION BROADCAST</span>
              <strong style={{ color: '#065F46', fontSize: 16 }}>
                {liveAttendanceSession.courseName} ({liveAttendanceSession.courseCode})
              </strong>
            </div>
            <div style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>
              Faculty: <strong>{liveAttendanceSession.facultyName}</strong> • Room: <strong>{liveAttendanceSession.room}</strong> ({liveAttendanceSession.building})
            </div>
          </div>

          {!isAttendanceRecorded ? (
            <button
              onClick={() => setModal('PALM_SCAN')}
              className="btn btn-primary"
              style={{ backgroundColor: '#059669', borderColor: '#047857', gap: 8, fontWeight: 800 }}
            >
              <Hand size={16} /> Scan Palm to Check-In
            </button>
          ) : (
            <span className="badge badge-success" style={{ padding: '8px 16px', fontSize: 12 }}>
              ✓ Check-In Verified via Biometrics
            </span>
          )}
        </div>
      )}

      {/* Main Stats Banner */}
      <div
        className="noir-card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-card) 60%, rgba(37, 99, 235, 0.05) 100%)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: 28,
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)'
        }}
      >
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Overall Academic Attendance
          </span>
          <div style={{ fontSize: 44, fontWeight: 800, color: actualOverallPct >= 75 ? '#2563EB' : '#DC2626', marginTop: 4 }}>
            {actualOverallPct}%
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {student.program} • Semester {student.semester} • Total Conducted Sessions: {conductedSessions.length} (Attended: {attendedSessions.length})
          </div>
        </div>

        {/* Insight Box */}
        <div
          style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 18,
            maxWidth: 420
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            <TrendingUp size={16} /> ATTENDANCE INSIGHT
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {actualOverallPct >= 75
              ? 'You are safely above the 75% university eligibility requirement.'
              : 'Attendance warning: You are below the 75% semester requirement.'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Calculated from {conductedSessions.length} verified lecture sessions. Authorized corrections and cancelled classes are factored automatically.
          </div>
        </div>
      </div>

      {/* Subject-Wise Breakdown Cards */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--text-primary)' }}>Subject Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {subjects.map((sub) => {
            const isWarning = sub.percentage < 75;
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
                      Instructor: {sub.instructor} • Required Threshold: {sub.requiredPercentage}%
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

                    <span className={`badge ${isWarning ? 'badge-danger' : sub.percentage >= 85 ? 'badge-success' : 'badge-primary'}`}>
                      {sub.percentage >= 85 ? 'EXCELLENT' : sub.percentage >= 75 ? 'SAFE' : 'CRITICAL'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', backgroundColor: 'var(--border-color)', height: 10, borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, sub.percentage)}%`,
                      height: '100%',
                      backgroundColor: isWarning ? '#DC2626' : 'var(--brand-primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 600ms ease-out'
                    }}
                  />
                </div>

                {/* Status bar details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span>
                    Classes needed to maintain 75%: <strong>{sub.classesNeededToTarget} lecture</strong>
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

      {/* Detailed Attendance Session Records (Module 1.4) */}
      <div className="noir-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>
              Historical Class Session Ledger
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Detailed present, absent, cancelled, and authorized correction records
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['ALL', 'PRESENT', 'ABSENT', 'CANCELLED', 'EXCUSED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`noir-tab-pill ${statusFilter === st ? 'active' : ''}`}
                  style={{ fontSize: 11, padding: '4px 12px' }}
                >
                  {st}
                </button>
              ))}
            </div>

            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="input-field"
              style={{ fontSize: 12, padding: '4px 10px', height: 32 }}
            >
              <option value="ALL">All Courses</option>
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-main)' }}>
                <th style={{ padding: '12px 14px' }}>DATE & TIME</th>
                <th style={{ padding: '12px 14px' }}>COURSE</th>
                <th style={{ padding: '12px 14px' }}>FACULTY & VENUE</th>
                <th style={{ padding: '12px 14px' }}>VERIFICATION</th>
                <th style={{ padding: '12px 14px' }}>STATUS</th>
                <th style={{ padding: '12px 14px' }}>AUDIT NOTES</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No attendance session records matching selected filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{rec.date}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rec.time}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{rec.courseName}</strong>
                      <div style={{ fontSize: 11, color: 'var(--brand-primary)', fontWeight: 700 }}>{rec.courseCode}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ color: 'var(--text-primary)' }}>{rec.facultyName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Room {rec.room}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                        <ShieldCheck size={12} /> {rec.verificationMethod}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        className={`badge ${
                          rec.status === 'PRESENT'
                            ? 'badge-success'
                            : rec.status === 'ABSENT'
                            ? 'badge-danger'
                            : rec.status === 'EXCUSED'
                            ? 'badge-warning'
                            : 'badge-neutral'
                        }`}
                        style={{ fontSize: 11, fontWeight: 800 }}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {rec.correctedBy ? (
                        <span style={{ color: '#D97706', fontWeight: 600 }}>
                          Adjusted by {rec.correctedBy}: {rec.correctionReason}
                        </span>
                      ) : rec.status === 'CANCELLED' ? (
                        <span style={{ color: '#DC2626' }}>Class not conducted</span>
                      ) : (
                        'Verified'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
