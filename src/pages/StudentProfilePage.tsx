import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Edit3,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Home,
  Bus,
  Fingerprint,
  X,
  Upload,
  Sun,
  Moon,
  AlertCircle,
  Lock
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { student, updateStudentProfile, theme, setTheme, showToast, setModal } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState('');

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
    setValidationError('');
    setIsEditing(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setValidationError('Image size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, avatar: base64 }));
      showToast('✓ Photo loaded successfully. Save profile to confirm.');
    };
    reader.readAsDataURL(file);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Name
    if (!formData.name.trim()) {
      setValidationError('Student name cannot be empty.');
      return;
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid official email address (e.g. name@nexora.edu).');
      return;
    }

    // 3. Validate Phone Number (10 digits)
    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    setValidationError('');
    updateStudentProfile(formData);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 840, margin: '0 auto' }}>
      {/* Header Profile Card */}
      <div
        className="noir-card"
        style={{
          padding: 28,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ position: 'relative' }}>
            <img
              src={student.avatar}
              alt={student.name}
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                border: '3px solid var(--brand-primary)',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-brand)'
              }}
            />
            <span
              title="Palm Biometrics Verified"
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                backgroundColor: 'var(--brand-emerald)',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              <CheckCircle2 size={16} />
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {student.name}
              </h1>
              <span className="badge badge-success" style={{ fontSize: 11, padding: '3px 10px' }}>
                ✓ VERIFIED IDENTITY
              </span>
            </div>

            <div style={{ fontSize: 14, color: 'var(--brand-primary)', fontWeight: 800, marginTop: 2 }}>
              {student.studentId}
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>
              {student.program} • Semester {student.semester} ({student.batch})
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {student.department}
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="btn btn-primary"
          style={{ gap: 8, borderRadius: 12, padding: '10px 20px', fontWeight: 800 }}
        >
          <Edit3 size={16} /> Edit My Profile
        </button>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid-3">
        <div className="noir-card" style={{ borderLeft: '4px solid var(--brand-primary)', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ACADEMIC CGPA
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
            {student.cgpa} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>/ 10.0</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--brand-emerald)', fontWeight: 700, marginTop: 4 }}>
            ★ Outstanding Standing (Dean's Honor)
          </div>
        </div>

        <div className="noir-card" style={{ borderLeft: '4px solid var(--brand-emerald)', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            CAMPUS ATTENDANCE
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand-emerald)', marginTop: 4 }}>
            {student.attendanceOverall}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--brand-emerald)', fontWeight: 700, marginTop: 4 }}>
            ✓ Exceeds 75% Regulatory Norm
          </div>
        </div>

        <div className="noir-card" style={{ borderLeft: '4px solid var(--brand-amber)', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            NEXORA WALLET
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand-amber)', marginTop: 4 }}>
            ₹{student.walletBalance}
          </div>
          <div style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 700, marginTop: 4 }}>
            ● Palm Touch Active
          </div>
        </div>
      </div>

      {/* THEME & ACCESSIBILITY SETTINGS (Module 1.8) */}
      <div className="noir-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              APPEARANCE & THEME SETTINGS
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
              Visual Mode Preference
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Switch between High-Contrast Executive Light and NOIR Dark Theme. Preference is persisted across sessions.
            </p>
          </div>

          {/* Theme Switcher Toggle */}
          <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--bg-subtle)', padding: 4, borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setTheme('light')}
              className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 10, gap: 6, fontSize: 12 }}
            >
              <Sun size={15} /> Light Mode
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 10, gap: 6, fontSize: 12 }}
            >
              <Moon size={15} /> Dark Mode
            </button>
          </div>
        </div>
      </div>

      {/* Contact & Residential Details */}
      <div className="noir-card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 14 }}>
          Verified Student Contact & Residential Records
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <Mail size={18} color="var(--brand-primary)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Official Email</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{student.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <Phone size={18} color="var(--brand-emerald)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Mobile Phone</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{student.phone}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <Home size={18} color="var(--brand-amber)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Campus Hostel & Room</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{student.hostelRoom}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'var(--bg-subtle)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <Bus size={18} color="var(--brand-accent)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700 }}>Transport Pass</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{student.busRoute}</div>
            </div>
          </div>
        </div>
      </div>

      {/* BIOMETRIC PEHCHAAN STATUS (Module 1.8 & 5) */}
      <div className="noir-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(5, 150, 105, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(5, 150, 105, 0.3)'
              }}
            >
              <Fingerprint size={24} color="var(--brand-emerald)" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
                Pehchaan Subdermal Palm Biometric Enrolment
              </h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Status: <strong style={{ color: 'var(--brand-emerald)' }}>Active & Verified</strong> • Hardware Key: <span style={{ fontFamily: 'monospace' }}>SHA256-PALM-99812</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setModal('PALM_SCAN')}
            className="btn btn-secondary btn-sm"
            style={{ gap: 6 }}
          >
            <Sparkles size={14} color="var(--brand-primary)" /> Test / Recalibrate Palm
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Edit3 size={20} color="var(--brand-primary)" /> Edit Student Profile
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Update permitted contact and profile credentials. Updates are verified and persisted across sessions.
                </p>
              </div>
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            {/* Error banner if validation fails */}
            {validationError && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--state-danger)',
                  color: 'var(--state-danger)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16
                }}
              >
                <AlertCircle size={16} /> {validationError}
              </div>
            )}

            {/* PROFILE PHOTO SELECTOR & UPLOAD (Module 1.8) */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 14,
                padding: 16,
                marginBottom: 18
              }}
            >
              <label className="form-label" style={{ fontWeight: 800 }}>Profile Avatar & Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
                <img
                  src={formData.avatar}
                  alt="Preview"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--brand-primary)'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <label
                      className="btn btn-secondary btn-sm"
                      style={{ cursor: 'pointer', gap: 6, fontSize: 12 }}
                    >
                      <Upload size={14} /> Upload Custom Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Or select from student avatar presets:
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    {avatarPresets.map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt={`Preset ${idx + 1}`}
                        onClick={() => setFormData((prev) => ({ ...prev, avatar: av }))}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: formData.avatar === av ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                          boxShadow: formData.avatar === av ? 'var(--shadow-brand)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Student ID (Institutional Key)</label>
                  <input
                    type="text"
                    disabled
                    className="input-field"
                    value={formData.studentId}
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Official University Email *</label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@nexora.edu"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hostel & Room Assignment</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.hostelRoom}
                    onChange={(e) => setFormData({ ...formData, hostelRoom: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Campus Bus / Shuttle Route</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.busRoute}
                    onChange={(e) => setFormData({ ...formData, busRoute: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                <Lock size={13} color="var(--brand-primary)" />
                Institutional policy requires biometric palm identity token for changes to gradebook and registration records.
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, fontWeight: 900 }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
