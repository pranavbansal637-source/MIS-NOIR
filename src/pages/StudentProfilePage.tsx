import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  BookOpen,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Sliders,
  Edit3,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Home,
  Bus,
  Award,
  Fingerprint,
  X,
  Save,
  GraduationCap
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { student, updateStudentProfile, logout, setModal, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Form State initialized with current student profile
  const [formData, setFormData] = useState({
    name: student.name,
    studentId: student.studentId,
    program: student.program,
    department: student.department,
    semester: student.semester,
    batch: student.batch,
    email: student.email,
    phone: student.phone,
    bloodGroup: student.bloodGroup,
    hostelRoom: student.hostelRoom,
    busRoute: student.busRoute,
    cgpa: student.cgpa,
    attendanceOverall: student.attendanceOverall,
    avatar: student.avatar
  });

  const handleOpenEdit = () => {
    setFormData({
      name: student.name,
      studentId: student.studentId,
      program: student.program,
      department: student.department,
      semester: student.semester,
      batch: student.batch,
      email: student.email,
      phone: student.phone,
      bloodGroup: student.bloodGroup,
      hostelRoom: student.hostelRoom,
      busRoute: student.busRoute,
      cgpa: student.cgpa,
      attendanceOverall: student.attendanceOverall,
      avatar: student.avatar
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Name cannot be empty.');
      return;
    }
    updateStudentProfile(formData);
    setIsEditing(false);
  };

  // Quick Realistic Presets
  const applyPreset = (preset: 'CS' | 'AI' | 'BUSINESS') => {
    if (preset === 'CS') {
      setFormData((prev) => ({
        ...prev,
        name: prev.name === 'PRANAV' ? 'Pranav R. Kulkarni' : prev.name,
        studentId: '1MS22CS104',
        program: 'B.Tech in Computer Science & Engineering',
        department: 'School of Computer Science & Engineering',
        semester: 6,
        batch: '2022–2026',
        cgpa: 9.14,
        attendanceOverall: 88.5,
        email: 'pranav.cs@nexora.edu',
        phone: '+91 98451 22334',
        bloodGroup: 'B+ Positive',
        hostelRoom: 'Hostel Block A • Room 402',
        busRoute: 'Route #8 (North Campus Express)'
      }));
      showToast('Loaded B.Tech Computer Science preset credentials!');
    } else if (preset === 'AI') {
      setFormData((prev) => ({
        ...prev,
        name: prev.name === 'PRANAV' ? 'Pranav Sharma' : prev.name,
        studentId: 'NR-2024-AI-889',
        program: 'B.Tech in Artificial Intelligence & Data Science',
        department: 'Department of AI & Autonomous Systems',
        semester: 4,
        batch: '2024–2028',
        cgpa: 9.38,
        attendanceOverall: 92.0,
        email: 'pranav.ai@nexora.edu',
        phone: '+91 98860 77112',
        bloodGroup: 'O+ Positive',
        hostelRoom: 'Hostel Block B • Room 215',
        busRoute: 'Route #4 (South Campus Express)'
      }));
      showToast('Loaded AI & Data Science preset credentials!');
    } else {
      setFormData((prev) => ({
        ...prev,
        name: prev.name === 'PRANAV' ? 'Pranav Mehta' : prev.name,
        studentId: 'NR-BBA-2025-089',
        program: 'Bachelor of Business Administration (FinTech)',
        department: 'School of Management & Finance',
        semester: 2,
        batch: '2025–2028',
        cgpa: 8.75,
        attendanceOverall: 84.5,
        email: 'pranav.bba@nexora.edu',
        phone: '+91 98112 44556',
        bloodGroup: 'A+ Positive',
        hostelRoom: 'Day Scholar (Off Campus)',
        busRoute: 'Route #2 (Metro Shuttle Connector)'
      }));
      showToast('Loaded Business Administration preset credentials!');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760, margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="noir-card"
        style={{
          padding: 28,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          background: 'linear-gradient(135deg, rgba(16, 21, 32, 0.95) 0%, rgba(8, 11, 18, 0.98) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ position: 'relative' }}>
            <img
              src={student.avatar}
              alt={student.name}
              style={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                border: '3px solid #F59E0B',
                objectFit: 'cover',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.35)'
              }}
            />
            <span
              title="Palm Biometrics Verified"
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                backgroundColor: '#10B981',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}
            >
              <CheckCircle2 size={16} />
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
                {student.name}
              </h1>
              <span className="badge badge-success" style={{ fontSize: 11, padding: '3px 10px' }}>
                ✓ VERIFIED PROFILE
              </span>
            </div>

            <div style={{ fontSize: 14, color: '#FBBF24', fontWeight: 800, marginTop: 2 }}>
              {student.studentId}
            </div>

            <div style={{ fontSize: 13, color: '#CBD5E1', marginTop: 4, fontWeight: 600 }}>
              {student.program} • Semester {student.semester} ({student.batch})
            </div>

            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              {student.department}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleOpenEdit}
            className="btn btn-primary"
            style={{
              gap: 8,
              borderRadius: 12,
              padding: '10px 20px',
              fontWeight: 800,
              fontSize: 13,
              boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)'
            }}
          >
            <Edit3 size={16} /> Edit My Profile
          </button>
          <div style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', fontWeight: 600 }}>
            Real credentials sync enabled
          </div>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid-3">
        <div className="noir-card" style={{ borderLeft: '4px solid #F59E0B', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>
            ACADEMIC CGPA
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#F8FAFC', marginTop: 4 }}>
            {student.cgpa} <span style={{ fontSize: 14, color: '#94A3B8' }}>/ 10.0</span>
          </div>
          <div style={{ fontSize: 12, color: '#34D399', fontWeight: 700, marginTop: 4 }}>
            ★ Outstanding Standing (Dean's Honor)
          </div>
        </div>

        <div className="noir-card" style={{ borderLeft: '4px solid #10B981', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>
            CAMPUS ATTENDANCE
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#34D399', marginTop: 4 }}>
            {student.attendanceOverall}%
          </div>
          <div style={{ fontSize: 12, color: '#34D399', fontWeight: 700, marginTop: 4 }}>
            ✓ Exceeds 75% Regulatory Mandate
          </div>
        </div>

        <div className="noir-card" style={{ borderLeft: '4px solid #FBBF24', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>
            NEXORA WALLET BALANCE
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#FBBF24', marginTop: 4 }}>
            ₹{student.walletBalance}
          </div>
          <div style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, marginTop: 4 }}>
            ● Instant Palm Debit Enabled
          </div>
        </div>
      </div>

      {/* Detail Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Personal & Contact Information */}
        <div className="noir-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserIcon size={18} color="#F59E0B" /> Personal & Contact Information
            </h3>
            <button
              onClick={handleOpenEdit}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}
            >
              Update
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Mail size={16} color="#94A3B8" />
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Official University Email</div>
                <strong style={{ color: '#F8FAFC' }}>{student.email}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Phone size={16} color="#94A3B8" />
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Contact Number</div>
                <strong style={{ color: '#F8FAFC' }}>{student.phone}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={16} color="#94A3B8" />
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Blood Group</div>
                <strong style={{ color: '#F8FAFC' }}>{student.bloodGroup}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Home size={16} color="#94A3B8" />
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Campus Residence</div>
                <strong style={{ color: '#F8FAFC' }}>{student.hostelRoom}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bus size={16} color="#94A3B8" />
              <div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>Transport Shuttle Route</div>
                <strong style={{ color: '#F8FAFC' }}>{student.busRoute}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Profile */}
        <div className="noir-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="#38BDF8" /> Academic Standing & Mentorship
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, fontSize: 13 }}>
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Degree & Major</div>
              <strong style={{ color: '#F8FAFC' }}>{student.program}</strong>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Academic Faculty Department</div>
              <strong style={{ color: '#F8FAFC' }}>{student.department}</strong>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Current Progression</div>
              <strong style={{ color: '#F8FAFC' }}>Semester {student.semester} • Batch of {student.batch}</strong>
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Assigned Faculty Mentor</div>
              <strong style={{ color: '#F59E0B' }}>Prof. Dr. Rajesh Sharma (Head of CSE)</strong>
            </div>
          </div>
        </div>

        {/* Biometrics & Security Credentials */}
        <div className="noir-card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Fingerprint size={18} color="#10B981" /> Biometrics & Identity Credentials
          </h3>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Subdermal Palm Vascular Key:</span>
              <span className="badge badge-success">✓ ENROLLED & ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Optical Scanner Terminal Clearance:</span>
              <span style={{ fontWeight: 800, color: '#F8FAFC' }}>All Campus Blocks (A, B, C, Library, Gates)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Digital Secure Token:</span>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#F59E0B' }}>{student.qrCode}</span>
            </div>
          </div>
        </div>

        {/* System Settings & Actions */}
        <div className="noir-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => showToast('Preferences updated and synced.')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Sliders size={18} color="#10B981" /> Campus Application Preferences</span>
            <span style={{ color: '#94A3B8' }}>›</span>
          </button>

          <button
            onClick={() => setModal('PRIVACY')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#F8FAFC', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 12 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Shield size={18} color="#F59E0B" /> Security, Palm Enrolment & Privacy</span>
            <span style={{ color: '#94A3B8' }}>›</span>
          </button>

          <button
            onClick={() => showToast('Notification settings active.')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#F8FAFC', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 12 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Bell size={18} color="#FBBF24" /> Push Notifications & Lecture Alerts</span>
            <span style={{ color: '#94A3B8' }}>›</span>
          </button>

          <button
            onClick={() => setModal('AI_ASSISTANT')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#F8FAFC', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 12 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><HelpCircle size={18} color="#EC4899" /> AI Student Advisor & Helpdesk</span>
            <span style={{ color: '#94A3B8' }}>›</span>
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="btn btn-danger btn-lg"
          style={{ width: '100%', justifyContent: 'center', gap: 10, borderRadius: 14, marginTop: 4, fontWeight: 800 }}
        >
          <LogOut size={18} /> Sign Out of NEXORA OS
        </button>
      </div>

      {/* ======================================================== */}
      {/* EDIT / CREATE MY PROFILE MODAL */}
      {/* ======================================================== */}
      {isEditing && (
        <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit3 size={22} color="#F59E0B" /> Edit & Create My Profile
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                  Set your real name, student registration number, degree program and details
                </p>
              </div>
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-icon btn-sm">
                <X size={20} color="#64748B" />
              </button>
            </div>

            {/* 1-Click Realistic Preset Choosers */}
            <div style={{ backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} color="#7C3AED" /> Quick 1-Click Realistic Presets:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => applyPreset('CS')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, borderRadius: 20 }}
                >
                  <GraduationCap size={13} color="#7C3AED" /> B.Tech Computer Science
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('AI')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, borderRadius: 20 }}
                >
                  <Sparkles size={13} color="#059669" /> B.Tech Artificial Intelligence
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('BUSINESS')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, borderRadius: 20 }}
                >
                  <BookOpen size={13} color="#0284C7" /> BBA / MBA Business
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Full Name & Student ID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pranav Sharma"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Roll No / USN ID *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g. 1MS22CS104 or NR-2026-8891"
                  />
                </div>
              </div>

              {/* Program & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Program / Degree</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science & Engg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Department / School</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. School of Computer Engineering"
                  />
                </div>
              </div>

              {/* Semester & Batch */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Semester</label>
                  <select
                    className="input-field"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Batch / Years</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="e.g. 2023–2027"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>CGPA (out of 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className="input-field"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>University Email</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@college.edu"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Mobile Phone</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Blood Group, Hostel, Bus Route */}
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Blood Group</label>
                  <select
                    className="input-field"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    {['O+ Positive', 'O- Negative', 'A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'AB+ Positive', 'AB- Negative'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Hostel / Room</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.hostelRoom}
                    onChange={(e) => setFormData({ ...formData, hostelRoom: e.target.value })}
                    placeholder="e.g. Block B • Room 304"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 800 }}>Bus Route</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.busRoute}
                    onChange={(e) => setFormData({ ...formData, busRoute: e.target.value })}
                    placeholder="e.g. Route #4"
                  />
                </div>
              </div>

              {/* Profile Avatar URL */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 800 }}>Profile Photo URL</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 12, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: 12, fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: 12, fontWeight: 900, gap: 8 }}
                >
                  <Save size={18} /> Save & Apply to Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
