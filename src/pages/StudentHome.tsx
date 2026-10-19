import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  ShoppingBag,
  Calendar,
  QrCode,
  Sparkles,
  TrendingUp,
  Wallet,
  Bell,
  Clock
} from 'lucide-react';

interface StudentHomeProps {
  onNavigate: (tab: string) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onNavigate }) => {
  const { student, setModal, subjects, events } = useApp();

  const nextClass = {
    subject: 'Marketing Management',
    code: 'MKT-201',
    time: '10:00 AM',
    room: 'A403',
    faculty: 'Dr. Sarah Jenkins'
  };

  const upcomingEvent = events[0] || {
    title: 'NEXORA HackSphere 2026',
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
              color: '#F8FAFC',
              letterSpacing: '-0.02em'
            }}
          >
            Good morning, {student.name}
          </h1>
          <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>
            {student.program} • Semester {student.semester} • NEXORA Student Node
          </p>
        </div>

        {/* Dynamic Palm Scanner Quick Button */}
        <button
          onClick={() => setModal('PALM_SCAN')}
          className="btn btn-primary"
          style={{ gap: 10, borderRadius: 30, padding: '10px 22px', fontWeight: 800 }}
        >
          <Sparkles size={18} /> [ PALM SCANNER ]
        </button>
      </div>

      {/* 4 Important KPI Cards */}
      <div className="grid-4">
        {/* ATTENDANCE Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => onNavigate('attendance')}
          style={{ borderLeft: '4px solid #F59E0B' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ATTENDANCE
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#F8FAFC', marginTop: 4 }}>
            {student.attendanceOverall}%
          </div>
          <div style={{ fontSize: 12, color: '#34D399', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            <TrendingUp size={14} color="#34D399" /> Satisfies 75% policy limit
          </div>
        </div>

        {/* NEXT CLASS Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => onNavigate('attendance')}
          style={{ borderLeft: '4px solid #FBBF24' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            NEXT CLASS
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#F8FAFC', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {nextClass.subject}
          </div>
          <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 6, fontWeight: 700 }}>
            {nextClass.time} • Room {nextClass.room}
          </div>
        </div>

        {/* UPCOMING EVENT Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => onNavigate('events')}
          style={{ borderLeft: '4px solid #F59E0B' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            UPCOMING EVENT
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#F8FAFC', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {upcomingEvent.title}
          </div>
          <div style={{ fontSize: 12, color: '#FBBF24', marginTop: 6, fontWeight: 700 }}>
            14 OCT • Registered
          </div>
        </div>

        {/* NEXORA BALANCE Card */}
        <div
          className="noir-card noir-card-interactive"
          onClick={() => setModal('TOPUP')}
          style={{ borderLeft: '4px solid #10B981' }}
        >
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            NEXORA WALLET
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#FBBF24', marginTop: 4 }}>
            ₹{student.walletBalance}
          </div>
          <div style={{ fontSize: 12, color: '#F59E0B', marginTop: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Wallet size={14} /> Quick Top-Up
          </div>
        </div>
      </div>

      {/* 4 Quick Actions */}
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 900, marginBottom: 14, color: '#F8FAFC' }}>Quick Operating Actions</h3>
        <div className="grid-4">
          <button
            onClick={() => onNavigate('attendance')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <CheckSquare size={22} color="#F59E0B" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC' }}>Attendance</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Breakdown & trends</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('campus')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <ShoppingBag size={22} color="#10B981" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC' }}>Campus</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Food, shops & library</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('events')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <Calendar size={22} color="#FBBF24" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC' }}>Events</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Tickets & check-ins</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('noir-id')}
            className="btn btn-secondary"
            style={{ padding: 18, justifyContent: 'flex-start', gap: 14, borderRadius: 14 }}
          >
            <QrCode size={22} color="#F59E0B" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#F8FAFC' }}>NEXORA ID</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Digital ID & vault</div>
            </div>
          </button>
        </div>
      </div>

      {/* TODAY'S Schedule & IMPORTANT Notifications */}
      <div className="grid-2">
        {/* TODAY */}
        <div className="noir-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="#F59E0B" /> TODAY'S SCHEDULE
            </h3>
            <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Semester 2 Roster</span>
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
                  background: i === 0 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: i === 0 ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#F8FAFC' }}>
                    {sub.subjectName}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                    {sub.code} • Room A403 • {sub.instructor}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: i === 0 ? '#FBBF24' : '#F8FAFC' }}>
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
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={18} color="#FBBF24" /> IMPORTANT NOTIFICATIONS
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                padding: 14,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 12
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: '#FBBF24' }}>
                Mid-Semester Exam Timetable Published
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 4 }}>
                Mid-term examinations start October 24th. Verify clearances in NEXORA ID Vault.
              </div>
            </div>

            <div
              style={{
                padding: 14,
                backgroundColor: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                borderRadius: 12
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: '#F59E0B' }}>
                Library Book Return Due Today
              </div>
              <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 4 }}>
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
