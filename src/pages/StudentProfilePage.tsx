import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Sparkles,
  Mail,
  Home,
  Fingerprint,
  X,
  Upload,
  Sun,
  Moon,
  AlertCircle,
  Camera,
  Save,
  RotateCcw,
  User,
  Shield,
  Bell,
  Palette,
  KeyRound,
  Plus,
  Check
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { student, updateStudentProfile, theme, setTheme, showToast, setModal } = useApp();

  // Active Settings Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'security'>('profile');

  // Avatar Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Editable Form State
  const [formData, setFormData] = useState({
    name: student.name || 'PRANAV',
    nickname: student.nickname || 'Pranav',
    studentId: student.studentId || 'NR-2026-8891',
    program: student.program || 'BBA',
    department: student.department || 'School of Business',
    semester: student.semester || 2,
    batch: student.batch || '2025–2028',
    email: student.email || 'pranav.student@nexora.edu',
    alternateEmail: student.alternateEmail || 'pranav.personal@gmail.com',
    phone: student.phone || '+91 98765 43210',
    emergencyPhone: student.emergencyPhone || '+91 98111 22334',
    bloodGroup: student.bloodGroup || 'O+ Positive',
    hostelRoom: student.hostelRoom || 'Hostel Block B • Room 304',
    busRoute: student.busRoute || 'Route #4 (South Campus Express)',
    bio: student.bio || 'Undergraduate student passionate about business operations, financial modeling and digital campus systems.',
    interests: student.interests || ['Business Analytics', 'Digital Fintech', 'Supply Chain', 'Venture Capital'],
    cgpa: student.cgpa || 3.84,
    attendanceOverall: student.attendanceOverall || 82.4,
    avatar: student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  });

  // Track if user has modified anything
  const [isDirty, setIsDirty] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');

  // Security Passcode Settings State
  const [newPin, setNewPin] = useState(student.studentPin || '1111');
  const [confirmPin, setConfirmPin] = useState(student.studentPin || '1111');
  const [pinMessage, setPinMessage] = useState('');

  // Notification Preferences State
  const [notificationsConfig, setNotificationsConfig] = useState({
    pushNotifications: true,
    emailExamAlerts: true,
    smsReceipts: true,
    attendanceLimitAlerts: true,
    emergencySosBroadcast: true,
    clubEventsAlert: false
  });

  // Privacy Directory state
  const [directoryVisible, setDirectoryVisible] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState('15');

  // Curated Preset Avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  ];

  // Sync state if student changes externally
  useEffect(() => {
    setFormData({
      name: student.name || 'PRANAV',
      nickname: student.nickname || 'Pranav',
      studentId: student.studentId || 'NR-2026-8891',
      program: student.program || 'BBA',
      department: student.department || 'School of Business',
      semester: student.semester || 2,
      batch: student.batch || '2025–2028',
      email: student.email || 'pranav.student@nexora.edu',
      alternateEmail: student.alternateEmail || 'pranav.personal@gmail.com',
      phone: student.phone || '+91 98765 43210',
      emergencyPhone: student.emergencyPhone || '+91 98111 22334',
      bloodGroup: student.bloodGroup || 'O+ Positive',
      hostelRoom: student.hostelRoom || 'Hostel Block B • Room 304',
      busRoute: student.busRoute || 'Route #4 (South Campus Express)',
      bio: student.bio || 'Undergraduate student passionate about business operations, financial modeling and digital campus systems.',
      interests: student.interests || ['Business Analytics', 'Digital Fintech', 'Supply Chain', 'Venture Capital'],
      cgpa: student.cgpa || 3.84,
      attendanceOverall: student.attendanceOverall || 82.4,
      avatar: student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    });
    setNewPin(student.studentPin || '1111');
    setConfirmPin(student.studentPin || '1111');
  }, [student]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setValidationError('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setValidationError('Image size must be under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, avatar: base64 }));
      setIsDirty(true);
      setShowAvatarModal(false);
      showToast('✓ Photo loaded successfully. Click Save Changes to confirm.');
    };
    reader.readAsDataURL(file);
  };

  const applyCustomUrlAvatar = () => {
    if (!customAvatarUrl.trim()) return;
    setFormData((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
    setIsDirty(true);
    setCustomAvatarUrl('');
    setShowAvatarModal(false);
    showToast('✓ Custom avatar URL applied.');
  };

  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    const item = newInterestInput.trim();
    if (!formData.interests.includes(item)) {
      handleInputChange('interests', [...formData.interests, item]);
    }
    setNewInterestInput('');
  };

  const handleRemoveInterest = (item: string) => {
    handleInputChange('interests', formData.interests.filter((i) => i !== item));
  };

  const handleSaveChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // 1. Validate Name
    if (!formData.name.trim()) {
      setValidationError('Student name cannot be empty.');
      setActiveTab('profile');
      return;
    }

    // 2. Validate Official Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid official university email (e.g. name@nexora.edu).');
      setActiveTab('profile');
      return;
    }

    // 3. Validate Phone Number (min 10 digits)
    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setValidationError('Please enter a valid 10-digit primary mobile phone number.');
      setActiveTab('profile');
      return;
    }

    setValidationError('');
    updateStudentProfile(formData);
    setIsDirty(false);
  };

  const handleResetChanges = () => {
    setFormData({
      name: student.name,
      nickname: student.nickname || 'Pranav',
      studentId: student.studentId,
      program: student.program,
      department: student.department,
      semester: student.semester,
      batch: student.batch,
      email: student.email,
      alternateEmail: student.alternateEmail || 'pranav.personal@gmail.com',
      phone: student.phone,
      emergencyPhone: student.emergencyPhone || '+91 98111 22334',
      bloodGroup: student.bloodGroup,
      hostelRoom: student.hostelRoom,
      busRoute: student.busRoute,
      bio: student.bio || '',
      interests: student.interests || [],
      cgpa: student.cgpa,
      attendanceOverall: student.attendanceOverall,
      avatar: student.avatar
    });
    setIsDirty(false);
    setValidationError('');
    showToast('Reverted unsaved changes to saved state.');
  };

  const handleUpdatePin = () => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinMessage('PIN must be exactly 4 numeric digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage('Passcode confirmation does not match.');
      return;
    }
    updateStudentProfile({ studentPin: newPin });
    setPinMessage('✓ Student passcode updated successfully!');
    setTimeout(() => setPinMessage(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960, margin: '0 auto', width: '100%' }}>
      {/* Sticky Unsaved Changes Floating Banner */}
      {isDirty && (
        <div
          style={{
            position: 'sticky',
            top: 76,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            backgroundColor: 'var(--brand-primary)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
            animation: 'fadeIn 180ms ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 800 }}>
            <AlertCircle size={18} />
            You have unsaved profile changes!
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleResetChanges}
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', borderColor: 'transparent', gap: 6 }}
            >
              <RotateCcw size={14} /> Discard
            </button>
            <button
              onClick={() => handleSaveChanges()}
              className="btn btn-sm"
              style={{ backgroundColor: '#FFFFFF', color: '#1D4ED8', fontWeight: 900, gap: 6 }}
            >
              <Save size={14} /> Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid var(--state-danger)',
            color: 'var(--state-danger)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            fontSize: 13,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          <AlertCircle size={18} /> {validationError}
        </div>
      )}

      {/* Header Profile Hero Card */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 18
          }}
        >
          {/* Avatar with Direct Photo Upload Hover */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={formData.avatar}
                alt={formData.name}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  border: '3px solid var(--brand-primary)',
                  objectFit: 'cover',
                  boxShadow: 'var(--shadow-md)',
                  display: 'block'
                }}
              />
              {/* Photo Change Trigger Button */}
              <button
                onClick={() => setShowAvatarModal(true)}
                title="Add or Change Profile Picture"
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  backgroundColor: 'var(--brand-primary)',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-surface)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'transform 150ms ease'
                }}
              >
                <Camera size={16} />
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                  {formData.name}
                </h1>
                <span className="badge badge-success" style={{ fontSize: 11, padding: '3px 10px' }}>
                  ✓ VERIFIED IDENTITY
                </span>
              </div>

              <div style={{ fontSize: 14, color: 'var(--brand-primary)', fontWeight: 800, marginTop: 4 }}>
                {formData.studentId} • {formData.program} (Sem {formData.semester})
              </div>

              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                {formData.department} • Batch {formData.batch}
              </div>
            </div>
          </div>

          {/* Quick Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6, borderRadius: 12, fontWeight: 800 }}
            >
              <Camera size={14} /> Change Photo
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6, borderRadius: 12, fontWeight: 800 }}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} color="#F59E0B" /> : <Moon size={14} color="#6366F1" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <button
              onClick={() => handleSaveChanges()}
              className="btn btn-primary btn-sm"
              style={{ gap: 6, borderRadius: 12, fontWeight: 900 }}
            >
              <Save size={14} /> Save Profile
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Academic CGPA</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
              {formData.cgpa} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/ 10.0</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Attendance Record</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--brand-emerald)', marginTop: 2 }}>
              {formData.attendanceOverall}%
            </div>
          </div>

          <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-subtle)', borderRadius: 14, border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Palm Pehchaan</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--brand-emerald)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} /> Enrolled & Active
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          backgroundColor: 'var(--bg-surface)',
          padding: 6,
          borderRadius: 16,
          border: '1px solid var(--border-color)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <button
          onClick={() => setActiveTab('profile')}
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: 140, justifyContent: 'center', gap: 6, borderRadius: 10, fontSize: 13 }}
        >
          <User size={15} /> Personal & Contact
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`btn btn-sm ${activeTab === 'appearance' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: 140, justifyContent: 'center', gap: 6, borderRadius: 10, fontSize: 13 }}
        >
          <Palette size={15} /> Appearance & Mode
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`btn btn-sm ${activeTab === 'notifications' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: 140, justifyContent: 'center', gap: 6, borderRadius: 10, fontSize: 13 }}
        >
          <Bell size={15} /> Notifications & Alerts
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`btn btn-sm ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ flex: 1, minWidth: 140, justifyContent: 'center', gap: 6, borderRadius: 10, fontSize: 13 }}
        >
          <Shield size={15} /> Security & Passcode
        </button>
      </div>

      {/* TAB 1: EDITABLE PERSONAL & CONTACT INFO */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Identity & Basic Info Card */}
          <div className="noir-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--brand-primary)" /> Student Identity Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. PRANAV BANSAL"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Display Nickname</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="e.g. Pranav"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Student ID (Institutional Master Token)</label>
                <input
                  type="text"
                  disabled
                  className="input-field"
                  value={formData.studentId}
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Blood Group</label>
                <select
                  className="input-field"
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="O+ Positive">O+ Positive</option>
                  <option value="O- Negative">O- Negative</option>
                  <option value="A+ Positive">A+ Positive</option>
                  <option value="A- Negative">A- Negative</option>
                  <option value="B+ Positive">B+ Positive</option>
                  <option value="B- Negative">B- Negative</option>
                  <option value="AB+ Positive">AB+ Positive</option>
                  <option value="AB- Negative">AB- Negative</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email & Phone Contact Info Card */}
          <div className="noir-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Mail size={18} color="var(--brand-primary)" /> Contact & Communication Channels
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Official University Email *</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@nexora.edu"
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Official university notifications and exam receipts are sent here.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Personal Recovery Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.alternateEmail}
                  onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                  placeholder="personal.email@gmail.com"
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Used for account recovery and backup password resets.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Primary Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  SMS passcodes and Palm Pay payment receipts are delivered here.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Emergency / Guardian Mobile Phone</label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="+91 98111 22334"
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Campus medical desk and security point-of-contact.
                </span>
              </div>
            </div>
          </div>

          {/* Campus Residential & Transport Card */}
          <div className="noir-card" style={{ padding: 22 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Home size={18} color="var(--brand-amber)" /> Campus Residential & Commute Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Campus Hostel & Room Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.hostelRoom}
                  onChange={(e) => handleInputChange('hostelRoom', e.target.value)}
                  placeholder="e.g. Hostel Block B • Room 304"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Campus Bus / Shuttle Route & Pass</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.busRoute}
                  onChange={(e) => handleInputChange('busRoute', e.target.value)}
                  placeholder="e.g. Route #4 (South Campus Express)"
                />
              </div>
            </div>

            {/* Bio and Academic Interests */}
            <div style={{ marginTop: 16 }}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">Student Bio / About Me</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Share a short bio, research goals or academic interests..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label className="form-label">Academic Focus & Research Interests</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6, marginBottom: 8 }}>
                  {formData.interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="badge badge-primary"
                      style={{ fontSize: 12, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      {item}
                      <X
                        size={12}
                        onClick={() => handleRemoveInterest(item)}
                        style={{ cursor: 'pointer', opacity: 0.7 }}
                      />
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="input-field"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    placeholder="Add an interest (e.g. Machine Learning, Cloud DevOps)..."
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: 4 }}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit & Discard Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
            <button
              type="button"
              onClick={handleResetChanges}
              className="btn btn-secondary"
              disabled={!isDirty}
              style={{ opacity: isDirty ? 1 : 0.6 }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontWeight: 900, minWidth: 160 }}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: APPEARANCE & THEME SETTINGS */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="noir-card" style={{ padding: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              VISUAL EXPERIENCE
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
              Choose Interface Color Theme
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, marginBottom: 20 }}>
              Select between Executive Clean Light Mode and Cyber NOIR Dark Mode. High contrast, clear typography and rich colors applied across all modules.
            </p>

            {/* Visual Theme Selector Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {/* Light Mode Card */}
              <div
                onClick={() => setTheme('light')}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  border: theme === 'light' ? '3px solid var(--brand-primary)' : '1px solid #CBD5E1',
                  boxShadow: theme === 'light' ? 'var(--shadow-brand)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 200ms ease'
                }}
              >
                {theme === 'light' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      padding: 4
                    }}
                  >
                    <Check size={14} />
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sun size={24} color="#D97706" />
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>Executive Light</h4>
                    <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Pristine Pearl & Royal Sapphire</p>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#2563EB' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#059669' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#D97706' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#F1F5F9' }} />
                </div>
              </div>

              {/* Dark Mode Card */}
              <div
                onClick={() => setTheme('dark')}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  backgroundColor: '#111827',
                  color: '#F8FAFC',
                  border: theme === 'dark' ? '3px solid var(--brand-primary)' : '1px solid #374151',
                  boxShadow: theme === 'dark' ? '0 0 25px rgba(59, 130, 246, 0.35)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 200ms ease'
                }}
              >
                {theme === 'dark' && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'var(--brand-primary)',
                      color: '#FFFFFF',
                      borderRadius: '50%',
                      padding: 4
                    }}
                  >
                    <Check size={14} />
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Moon size={24} color="#60A5FA" />
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: '#F8FAFC' }}>NOIR Cyber Dark</h4>
                    <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>High-Contrast Titanium & Neon Glow</p>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#3B82F6' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#10B981' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#F59E0B' }} />
                  <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#1F2937' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & PREFERENCES */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="noir-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>
              Campus Notification Preferences
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Control alerts across SMS, push notifications and email channels.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  id: 'pushNotifications',
                  title: 'Real-Time Device Push Notifications',
                  desc: 'Instant notifications when live attendance sessions open in your current classroom.'
                },
                {
                  id: 'emailExamAlerts',
                  title: 'Academic Exam Schedules & Timetables',
                  desc: 'Receive official PDF timetable publishes directly to your registered email.'
                },
                {
                  id: 'smsReceipts',
                  title: 'Palm Pay POS Receipts via SMS',
                  desc: 'Receive immediate SMS ledger receipts after authorized canteen & kiosk purchases.'
                },
                {
                  id: 'attendanceLimitAlerts',
                  title: 'Attendance 75% Threshold Alert',
                  desc: 'Proactive warning notifications if course attendance falls near the statutory minimum.'
                },
                {
                  id: 'emergencySosBroadcast',
                  title: 'Campus Safety & SOS Broadcasts',
                  desc: 'Institutional health, safety alerts and emergency protocols (strongly recommended).'
                }
              ].map((item) => {
                const checked = (notificationsConfig as any)[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setNotificationsConfig((prev) => ({ ...prev, [item.id]: !checked }));
                      showToast(`Updated preference for: ${item.title}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 14,
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ maxWidth: '85%' }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>

                    <div
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: checked ? 'var(--brand-primary)' : 'var(--bg-hover)',
                        position: 'relative',
                        transition: 'background-color 180ms ease'
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          top: 3,
                          left: checked ? 23 : 3,
                          transition: 'left 180ms ease',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & BIOMETRIC SETTINGS */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Change PIN Passcode */}
          <div className="noir-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyRound size={18} color="var(--brand-primary)" /> Student Passcode (PIN) Protection
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
              Your 4-digit PIN is required to unlock confidential grade sheets and verify identity at campus touch terminals (Default: 1111).
            </p>

            {pinMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  marginBottom: 16,
                  backgroundColor: pinMessage.startsWith('✓') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  color: pinMessage.startsWith('✓') ? 'var(--brand-emerald)' : 'var(--state-danger)'
                }}
              >
                {pinMessage}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New 4-Digit Passcode PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="input-field"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 1111"
                  style={{ letterSpacing: '0.3em', fontSize: 18, fontWeight: 900 }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm 4-Digit Passcode PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="input-field"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 1111"
                  style={{ letterSpacing: '0.3em', fontSize: 18, fontWeight: 900 }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleUpdatePin}
                  className="btn btn-primary"
                  style={{ width: '100%', fontWeight: 800, height: 46 }}
                >
                  Update Passcode
                </button>
              </div>
            </div>
          </div>

          {/* Biometric Pehchaan Status & Calibration */}
          <div className="noir-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Fingerprint size={26} color="var(--brand-emerald)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
                    Pehchaan Subdermal Palm Biometric Token
                  </h3>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Status: <strong style={{ color: 'var(--brand-emerald)' }}>Active & Verified</strong> • Key: <span style={{ fontFamily: 'monospace' }}>SHA256-PALM-99812</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModal('PALM_SCAN')}
                className="btn btn-secondary btn-sm"
                style={{ gap: 6, fontWeight: 800 }}
              >
                <Sparkles size={14} color="var(--brand-primary)" /> Test / Recalibrate Palm Sensor
              </button>
            </div>
          </div>

          {/* Session Auto-Lock Settings */}
          <div className="noir-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>
              Workspace Auto-Lock Security
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
              Automatically blur confidential workspace telemetry when inactive on shared campus workstations.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {['5', '15', '30', 'Never'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setAutoLockTimeout(opt);
                    showToast(`Auto-lock timeout updated to: ${opt} minutes`);
                  }}
                  className={`btn btn-sm ${autoLockTimeout === opt ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 10, fontWeight: 800 }}
                >
                  {opt === 'Never' ? 'Never Auto-Lock' : `${opt} Minutes`}
                </button>
              ))}
            </div>
          </div>

          {/* Student Directory Visibility */}
          <div className="noir-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
                  Campus Student Directory Visibility
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                  Allow faculty instructors and peers to find your profile in campus academic groups.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !directoryVisible;
                  setDirectoryVisible(next);
                  showToast(`Student directory listing: ${next ? 'Visible' : 'Hidden'}`);
                }}
                className={`btn btn-sm ${directoryVisible ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 10, fontWeight: 800 }}
              >
                {directoryVisible ? '✓ Listed in Directory' : 'Hidden from Directory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR & UPLOAD MODAL */}
      {showAvatarModal && (
        <div className="modal-backdrop" onClick={() => setShowAvatarModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 540, padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Camera size={18} color="var(--brand-primary)" /> Change Profile Picture
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  Upload a photo from your device, choose from presets, or paste an image URL.
                </p>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="btn btn-ghost btn-icon btn-sm"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 14, backgroundColor: 'var(--bg-subtle)', borderRadius: 14, border: '1px solid var(--border-color)', marginBottom: 18 }}>
              <img
                src={formData.avatar}
                alt="Current Preview"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--brand-primary)'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Current Profile Photo
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Displayed in navigation bar, student ID card, and classroom roster.
                </div>
              </div>
            </div>

            {/* Option 1: File Upload */}
            <div style={{ marginBottom: 18 }}>
              <label
                className="btn btn-primary"
                style={{ width: '100%', cursor: 'pointer', gap: 8, justifyContent: 'center', fontWeight: 800 }}
              >
                <Upload size={16} /> Upload Photo from Device
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                Supports PNG, JPG, WebP up to 3MB
              </div>
            </div>

            {/* Option 2: Preset Gallery */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                Or Select from Student Avatar Library:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {avatarPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, avatar: preset }));
                      setIsDirty(true);
                      setShowAvatarModal(false);
                      showToast('✓ Avatar preset selected. Remember to save changes.');
                    }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: formData.avatar === preset ? '3px solid var(--brand-primary)' : '1px solid var(--border-color)',
                      boxShadow: formData.avatar === preset ? 'var(--shadow-brand)' : 'none',
                      transition: 'transform 150ms ease'
                    }}
                  >
                    <img
                      src={preset}
                      alt={`Avatar option ${idx + 1}`}
                      style={{ width: '100%', height: 65, objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Option 3: Custom Web URL */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
                Or Paste Image Web URL:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="url"
                  className="input-field"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={applyCustomUrlAvatar}
                  disabled={!customAvatarUrl.trim()}
                  className="btn btn-secondary btn-sm"
                >
                  Apply
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
