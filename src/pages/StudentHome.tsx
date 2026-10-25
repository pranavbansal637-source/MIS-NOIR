import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  ShoppingBag,
  Calendar,
  QrCode,
  TrendingUp,
  Wallet,
  Bell,
  Clock,
  Hand,
  CheckCircle2
} from 'lucide-react';

interface StudentHomeProps {
  onNavigate: (tab: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onNavigate }) => {
  const { student, setModal, subjects, events, liveAttendanceSession } = useApp();

  const isAttendanceRecorded = liveAttendanceSession.recordedStudentIds.includes(student.studentId);

  const nextClass = {
    subject: 'Marketing Management',
    code: 'MKT-201',
    time: '10:00 AM',
    room: 'A403',
    faculty: 'Dr. Sarah Jenkins'
  };

  const upcomingEvent = events[0] || {
    title: 'VASCENOVA HackSphere 2026',
    date: '14 OCT',
    organizer: 'Tech Innovation Society'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Greeting */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            Good morning, {student.name}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>
            {student.program} • Semester {student.semester} • VASCENOVA Student Node
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
                padding: '10px 22px',
                fontWeight: 800,
                backgroundColor: '#059669',
                borderColor: '#047857',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#34D399',
                  boxShadow: '0 0 8px #34D399'
                }}
              />
              <Hand size={18} /> [ SCAN PALM: {liveAttendanceSession.courseCode} ]
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
            Next: {nextClass.subject} ({nextClass.time})
          </div>
        )}
      </div>

      {/* Live Session Alert Banner if active */}
      {liveAttendanceSession.status === 'LIVE' && !isAttendanceRecorded && (
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#ECFDF5',
            border: '2px solid #10B981',
            borderRadius: 14,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.15)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-success" style={{ fontSize: 11, fontWeight: 900 }}>
                ● LIVE ATTENDANCE SESSION ACTIVE
              </span>
              <strong style={{ color: '#065F46', fontSize: 15 }}>
                {liveAttendanceSession.courseName} ({liveAttendanceSession.courseCode})
              </strong>
            </div>
            <div style={{ fontSize: 13, color: '#047857', marginTop: 4 }}>
              Faculty: <strong>{liveAttendanceSession.facultyName}</strong> • Room: <strong>{liveAttendanceSession.room}</strong> ({liveAttendanceSession.building})
            </div>
          </div>
          <button
            onClick={() => setModal('PALM_SCAN')}
            className="btn btn-primary"
            style={{ backgroundColor: '#059669', borderColor: '#047857', gap: 8, fontWeight: 800 }}
          >
            <Hand size={16} /> Scan Palm Terminal Now
          </button>
        </div>
      )}

      {/* 4 Important KPI Cards */}
      <div className="grid-4">
        {/* ATTENDANCE Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => onNavigate('attendance')}
          style={{ borderLeft: '4px solid var(--brand-primary)' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ATTENDANCE
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
            {student.attendanceOverall}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--brand-emerald)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            <TrendingUp size={14} color="var(--brand-emerald)" /> Satisfies 75% policy limit
          </div>
        </div>

        {/* NEXT CLASS Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => onNavigate('attendance')}
          style={{ borderLeft: '4px solid var(--brand-secondary)' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            NEXT CLASS
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextClass.subject}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 700 }}>
            {nextClass.time} • Room {nextClass.room}
          </div>
        </div>

        {/* UPCOMING EVENT Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => onNavigate('events')}
          style={{ borderLeft: '4px solid var(--brand-amber)' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            UPCOMING EVENT
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {upcomingEvent.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--brand-amber)', marginTop: 6, fontWeight: 700 }}>
            14 OCT • Registered
          </div>
        </div>

        {/* VASCENOVA BALANCE Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => setModal('TOPUP')}
          style={{ borderLeft: '4px solid var(--brand-emerald)' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            VASCENOVA WALLET
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--brand-emerald)', marginTop: 4 }}>
            ₹{student.walletBalance}
          </div>
          <div style={{ fontSize: 12, color: 'var(--brand-primary)', marginTop: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Wallet size={14} /> Quick Top-Up
          </div>
        </div>
      </div>

      {/* 4 Quick Actions */}
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 900, marginBottom: 14, color: 'var(--text-primary)' }}>Quick Operating Actions</h3>
        <div className="grid-4">
          <button
            onClick={() => onNavigate('attendance')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <CheckSquare size={22} color="var(--brand-primary)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Attendance</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Breakdown & trends</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('campus')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <ShoppingBag size={22} color="var(--brand-emerald)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Campus</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Food, shops & library</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <Calendar size={22} color="var(--brand-amber)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>Events</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tickets & check-ins</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('noir-id')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <QrCode size={22} color="var(--brand-accent)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>VASCENOVA ID</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Digital ID & vault</div>
            </div>
          </button>
        </div>
      </div>

      {/* TODAY'S Schedule & IMPORTANT Notifications */}
      <div className="grid-2">
        {/* TODAY */}
        <div className="noir-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="var(--brand-primary)" /> TODAY'S SCHEDULE
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Semester 2 Roster</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {subjects.slice(0, 3).map((sub, i) => (
              <div
                key={sub.subjectId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 12
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
                    {sub.subjectName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {sub.code} • Room A403 • {sub.instructor}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? 'var(--brand-primary)' : 'var(--text-primary)' }}>
                    {i === 0 ? '10:00 AM' : i === 1 ? '11:30 AM' : '02:00 PM'}
                  </div>
                  {i === 0 && <span className="badge badge-primary" style={{ marginTop: 2 }}>NEXT CLASS</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IMPORTANT Notifications */}
        <div className="noir-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} color="var(--brand-amber)" /> IMPORTANT NOTIFICATIONS
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                padding: 14,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                border: '1px solid var(--border-color)',
                borderRadius: 12
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-primary)' }}>
                Mid-Semester Exam Timetable Published
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                Mid-term examinations start October 24th. Verify clearances in VASCENOVA ID Vault.
              </div>
            </div>

            <div
              style={{
                padding: 14,
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid var(--border-color)',
                borderRadius: 12
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-amber)' }}>
                Library Book Return Due Today
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                "Principles of Marketing" is due at Central Library by 05:00 PM.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
