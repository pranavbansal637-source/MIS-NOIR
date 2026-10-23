import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  StopCircle,
  CheckCircle2,
  Users,
  Calendar,
  BookOpen,
  Monitor,
  Award,
  Clock,
  Search,
  CheckSquare,
  XSquare,
  Plus,
  ChevronDown
} from 'lucide-react';

interface FacultyDashboardProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  activeTab = 'faculty-home',
  onNavigate
}) => {
  const {
    showToast,
    facultyList,
    activeFaculty,
    setActiveFacultyId,
    assignments,
    gradeAssignmentSubmission,
    terminals,
    liveAttendanceSession,
    startLiveAttendanceSession,
    closeLiveAttendanceSession,
    createAssignment
  } = useApp();

  // Internal tab state if not driven by parent
  const [localTab, setLocalTab] = useState(activeTab);
  const currentTab = onNavigate ? activeTab : localTab;
  const setTab = onNavigate || setLocalTab;

  // Live Attendance Session State
  const sessionActive = liveAttendanceSession.status === 'LIVE';
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [liveCount, setLiveCount] = useState(44);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentsRoster, setStudentsRoster] = useState([
    { id: 'std-8891', name: 'PRANAV', roll: 'NR-2026-8891', status: 'PRESENT', method: 'Palm Biometrics', cgpa: 9.14, att: 88 },
    { id: 'std-8892', name: 'Aarav Sharma', roll: 'NR-2026-8892', status: 'PRESENT', method: 'Palm Biometrics', cgpa: 9.40, att: 94 },
    { id: 'std-8893', name: 'Ananya Verma', roll: 'NR-2026-8893', status: 'ABSENT', method: 'N/A', cgpa: 7.80, att: 72 },
    { id: 'std-8894', name: 'Rohan Mehta', roll: 'NR-2026-8894', status: 'PRESENT', method: 'QR Token', cgpa: 8.60, att: 86 },
    { id: 'std-8895', name: 'Sneha Patel', roll: 'NR-2026-8895', status: 'PRESENT', method: 'Palm Biometrics', cgpa: 9.25, att: 91 },
    { id: 'std-8896', name: 'Kavya Nair', roll: 'NR-2026-8896', status: 'PRESENT', method: 'Palm Biometrics', cgpa: 8.90, att: 89 },
    { id: 'std-8897', name: 'Devendra Joshi', roll: 'NR-2026-8897', status: 'LATE', method: 'Manual Override', cgpa: 8.10, att: 79 }
  ]);

  // Assignment Creation Modal State
  const [showCreateAsgModal, setShowCreateAsgModal] = useState(false);
  const [newAsgCourseCode, setNewAsgCourseCode] = useState(activeFaculty.courses[0]?.code || 'CS-401');
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgDueDate, setNewAsgDueDate] = useState('');
  const [newAsgMaxMarks, setNewAsgMaxMarks] = useState(100);

  // Selected Assignment for Grading Modal
  const [gradingModalAsg, setGradingModalAsg] = useState<any | null>(null);
  const [marksInput, setMarksInput] = useState<Record<string, number>>({});
  const [gradeInput, setGradeInput] = useState<Record<string, string>>({});

  // Student Roster Search
  const [rosterSearch, setRosterSearch] = useState('');

  const currentCourse = activeFaculty.courses[selectedCourseIndex] || activeFaculty.courses[0];

  const handleStartSession = () => {
    startLiveAttendanceSession(currentCourse.code, currentCourse.name, currentCourse.room);
    setIsSubmitted(false);
    showToast(`Live Palm & QR Session activated for ${currentCourse.name} (${currentCourse.room})`);

    const interval = setInterval(() => {
      setLiveCount((prev) => {
        if (prev >= currentCourse.studentsCount - 2) {
          clearInterval(interval);
          return currentCourse.studentsCount - 2;
        }
        return prev + 1;
      });
    }, 1200);
  };

  const handleStopAndSubmit = () => {
    closeLiveAttendanceSession();
    setIsSubmitted(true);
    showToast(`✓ Attendance finalized & submitted: ${liveCount} Present, ${currentCourse.studentsCount - liveCount} Absent.`);
  };

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) {
      showToast('Please enter an assignment title');
      return;
    }
    if (!newAsgDueDate) {
      showToast('Please select a due date');
      return;
    }
    const matchedCourse = activeFaculty.courses.find((c) => c.code === newAsgCourseCode) || activeFaculty.courses[0];
    createAssignment({
      courseCode: matchedCourse.code,
      courseName: matchedCourse.name,
      title: newAsgTitle.trim(),
      description: newAsgDesc.trim() || 'Complete the assigned problem set and submit before deadline.',
      dueDate: newAsgDueDate,
      maxMarks: Number(newAsgMaxMarks) || 100,
      totalStudents: matchedCourse.studentsCount || 50
    });
    setShowCreateAsgModal(false);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setNewAsgDueDate('');
  };

  const toggleStudentStatus = (id: string) => {
    setStudentsRoster((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextStatus = s.status === 'PRESENT' ? 'ABSENT' : s.status === 'ABSENT' ? 'LATE' : 'PRESENT';
        return {
          ...s,
          status: nextStatus,
          method: nextStatus === 'PRESENT' ? 'Manual Override (Faculty)' : nextStatus === 'LATE' ? 'Late Slip' : 'N/A'
        };
      })
    );
  };

  const handleSaveGrade = (asgId: string, studentId: string) => {
    const marks = marksInput[studentId] || 45;
    const grade = gradeInput[studentId] || 'A';
    gradeAssignmentSubmission(asgId, studentId, marks, grade);
    showToast(`Recorded Grade ${grade} (${marks} Marks) for student.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header & Faculty Selector */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 60%, #EFF6FF 100%)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img
            src={activeFaculty.avatar}
            alt={activeFaculty.name}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: '3px solid #2563EB',
              objectFit: 'cover',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.2)'
            }}
          />
          <div>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              NEXORA FACULTY INSTRUCTOR OS
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>
              {activeFaculty.name}
            </h1>
            <p style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
              {activeFaculty.designation} • {activeFaculty.department}
            </p>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              {activeFaculty.degree} • {activeFaculty.office}
            </div>
          </div>
        </div>

        {/* Switch Faculty Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 260 }}>
          <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Switch Active Faculty Member:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={activeFaculty.id}
              onChange={(e) => setActiveFacultyId(e.target.value)}
              className="input-field"
              style={{
                fontWeight: 700,
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                borderColor: '#CBD5E1',
                paddingRight: 32
              }}
            >
              {facultyList.map((f) => (
                <option key={f.id} value={f.id} style={{ background: '#FFFFFF', color: '#0F172A' }}>
                  {f.name} ({f.department.split(' ')[0]})
                </option>
              ))}
            </select>
            <ChevronDown size={16} color="#2563EB" style={{ position: 'absolute', right: 12, top: 12, pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'faculty-home', label: "Today's Schedule & Classes", icon: Calendar },
          { id: 'faculty-attendance', label: 'Live Palm & QR Attendance', icon: CheckSquare },
          { id: 'faculty-students', label: 'Enrolled Students Roster', icon: Users },
          { id: 'faculty-assignments', label: 'Course Assignments & Grading', icon: BookOpen },
          { id: 'faculty-schedule', label: 'Weekly Timetable Matrix', icon: Clock },
          { id: 'terminals', label: 'Classroom Palm Terminals', icon: Monitor },
          { id: 'profile', label: 'Faculty Credentials & Office', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: 20,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                padding: '8px 18px',
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
                borderColor: isActive ? '#BFDBFE' : '#E2E8F0',
                color: isActive ? '#1D4ED8' : '#475569'
              }}
            >
              <Icon size={15} color={isActive ? '#2563EB' : '#64748B'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: FACULTY HOME / TODAY'S CLASSES */}
      {/* ======================================================== */}
      {currentTab === 'faculty-home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Summary */}
          <div className="grid-4">
            <div className="noir-card" style={{ borderLeft: '4px solid #2563EB' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>TODAY'S LECTURES</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>{activeFaculty.courses.length}</div>
              <div style={{ fontSize: 12, color: '#2563EB', marginTop: 4, fontWeight: 700 }}>Next: {currentCourse.code} at 10:00 AM</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>ENROLLED STUDENTS</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#059669', marginTop: 4 }}>
                {activeFaculty.courses.reduce((sum, c) => sum + c.studentsCount, 0)}
              </div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>✓ 100% Palm Enrolled</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>AVERAGE ATTENDANCE</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#D97706', marginTop: 4 }}>89.2%</div>
              <div style={{ fontSize: 12, color: '#D97706', marginTop: 4, fontWeight: 700 }}>Highest in Academic Block A</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #4F46E5' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>STUDENT RATING</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#4F46E5', marginTop: 4 }}>
                {activeFaculty.rating} <span style={{ fontSize: 14, color: '#64748B' }}>/ 5.0</span>
              </div>
              <div style={{ fontSize: 12, color: '#4F46E5', marginTop: 4, fontWeight: 700 }}>★ 184 Semester Reviews</div>
            </div>
          </div>

          {/* Today's Courses List */}
          <div className="noir-card">
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>
              Today's Teaching Schedule
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {activeFaculty.courses.map((c, i) => (
                <div
                  key={c.code}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 18,
                    backgroundColor: i === 0 ? '#EFF6FF' : '#F8FAFC',
                    border: i === 0 ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    borderRadius: 14,
                    gap: 16
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className={`badge ${i === 0 ? 'badge-primary' : 'badge-neutral'}`}>
                        {c.code}
                      </span>
                      <h4 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>{c.name}</h4>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                      Timing: <strong style={{ color: '#0F172A' }}>{c.time}</strong> • Location: <strong style={{ color: '#0F172A' }}>{c.room}</strong> • Enrolled: <strong style={{ color: '#0F172A' }}>{c.studentsCount} Students</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => {
                        setSelectedCourseIndex(i);
                        setTab('faculty-attendance');
                      }}
                      className="btn btn-primary"
                      style={{ gap: 6, fontWeight: 800 }}
                    >
                      <Play size={16} /> Open Attendance Terminal
                    </button>
                    <button
                      onClick={() => setTab('faculty-students')}
                      className="btn btn-secondary"
                      style={{ gap: 6 }}
                    >
                      <Users size={16} /> View Roster
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE PALM & QR ATTENDANCE */}
      {/* ======================================================== */}
      {currentTab === 'faculty-attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Active Session Controller */}
          <div
            className="noir-card"
            style={{
              padding: 24,
              border: sessionActive ? '2px solid #D97706' : '1px solid #E2E8F0',
              background: sessionActive ? '#FFFBEB' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 900 }}>{currentCourse.name} ({currentCourse.code})</h3>
                  <span className={`badge ${sessionActive ? 'badge-primary' : 'badge-neutral'}`}>
                    {sessionActive ? '● LIVE PALM BIOMETRIC SENSOR STREAMING' : 'IDLE SESSION'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                  Assigned Terminal: <strong>{currentCourse.room}</strong> • Enrolled Roster: <strong>{currentCourse.studentsCount}</strong>
                </div>
              </div>

              <div>
                {!sessionActive ? (
                  <button onClick={handleStartSession} className="btn btn-primary btn-lg" style={{ backgroundColor: '#D97706', gap: 8, fontWeight: 900 }}>
                    <Play size={18} /> Launch Live Attendance Session
                  </button>
                ) : (
                  <button onClick={handleStopAndSubmit} className="btn btn-danger btn-lg" style={{ gap: 8, fontWeight: 900 }}>
                    <StopCircle size={18} /> Finalize & Submit to Registrar
                  </button>
                )}
              </div>
            </div>

            {/* Live Counters */}
            {sessionActive && (
              <div style={{ display: 'flex', gap: 32, marginTop: 24, borderTop: '1px solid #FDE68A', paddingTop: 18 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>PRESENT VIA PALM/QR</div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: '#059669' }}>{liveCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>CURRENT %</div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: '#D97706' }}>
                    {Math.round((liveCount / currentCourse.studentsCount) * 100)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>ABSENT STUDENTS</div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: '#DC2626' }}>
                    {currentCourse.studentsCount - liveCount}
                  </div>
                </div>
              </div>
            )}

            {isSubmitted && (
              <div style={{ marginTop: 16, color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 10 }}>
                <CheckCircle2 size={18} /> Official attendance registry signed and synchronized to Dean's Office & Student Transcripts!
              </div>
            )}
          </div>

          {/* Interactive Live Check-in Roster */}
          <div className="noir-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  Live Class Roll Call & Override Controls
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Students checking in via palm terminal outside {currentCourse.room} appear in real-time
                </p>
              </div>
              <span className="badge badge-neutral">{studentsRoster.length} Sample Check-ins</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {studentsRoster.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 14,
                    backgroundColor: s.status === 'PRESENT' ? '#ECFDF5' : s.status === 'ABSENT' ? '#FEF2F2' : '#FFFBEB',
                    border: s.status === 'PRESENT' ? '1px solid #A7F3D0' : s.status === 'ABSENT' ? '1px solid #FECACA' : '1px solid #FDE68A',
                    borderRadius: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: s.status === 'PRESENT' ? '#059669' : s.status === 'ABSENT' ? '#DC2626' : '#D97706',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: 14
                      }}
                    >
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>
                        {s.name} <span style={{ color: '#64748B', fontWeight: 600 }}>({s.roll})</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        Method: <strong>{s.method}</strong> • Term CGPA: {s.cgpa}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`badge ${s.status === 'PRESENT' ? 'badge-success' : s.status === 'ABSENT' ? 'badge-danger' : 'badge-warning'}`}>
                      {s.status}
                    </span>
                    <button
                      onClick={() => toggleStudentStatus(s.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 12, fontWeight: 700 }}
                    >
                      Change Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: ENROLLED STUDENTS ROSTER */}
      {/* ======================================================== */}
      {currentTab === 'faculty-students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="noir-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  Enrolled Students Directory ({currentCourse.name})
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Total 50 students registered for {currentCourse.code}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 300 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search by student name or roll..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    style={{ paddingLeft: 36, fontSize: 13 }}
                  />
                  <Search size={16} color="#64748B" style={{ position: 'absolute', left: 12, top: 12 }} />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '12px 14px' }}>STUDENT NAME</th>
                    <th style={{ padding: '12px 14px' }}>ROLL NO</th>
                    <th style={{ padding: '12px 14px' }}>ATTENDANCE</th>
                    <th style={{ padding: '12px 14px' }}>CGPA</th>
                    <th style={{ padding: '12px 14px' }}>PALM STATUS</th>
                    <th style={{ padding: '12px 14px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsRoster
                    .filter((s) => s.name.toLowerCase().includes(rosterSearch.toLowerCase()) || s.roll.toLowerCase().includes(rosterSearch.toLowerCase()))
                    .map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>{s.name}</td>
                        <td style={{ padding: '12px 14px', color: '#2563EB', fontWeight: 700 }}>{s.roll}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontWeight: 800, color: s.att >= 75 ? '#059669' : '#DC2626' }}>{s.att}%</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>{s.cgpa}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="badge badge-success">✓ Verified</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            onClick={() => showToast(`Sent attendance & project alert to ${s.name}`)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 11 }}
                          >
                            Send Alert
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: COURSE ASSIGNMENTS & GRADING */}
      {/* ======================================================== */}
      {currentTab === 'faculty-assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A' }}>
                Course Assignments & Project Submissions
              </h2>
              <p style={{ fontSize: 13, color: '#64748B' }}>
                Review and grade student submissions for your courses
              </p>
            </div>
            <button
              onClick={() => setShowCreateAsgModal(true)}
              className="btn btn-primary"
              style={{ gap: 6 }}
            >
              <Plus size={16} /> Create Assignment
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {assignments.map((asg) => (
              <div key={asg.id} className="noir-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: 6 }}>{asg.courseCode}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{asg.title}</h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{asg.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748B' }}>Due Date</div>
                    <strong style={{ color: '#DC2626', fontSize: 14 }}>{asg.dueDate}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                  <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#475569' }}>
                    <div>Submissions: <strong style={{ color: '#0F172A' }}>{asg.totalSubmissions} / {asg.totalStudents}</strong></div>
                    <div>Max Marks: <strong style={{ color: '#0F172A' }}>{asg.maxMarks}</strong></div>
                  </div>

                  <button
                    onClick={() => setGradingModalAsg(asg)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontWeight: 800, gap: 6 }}
                  >
                    <Award size={15} color="#2563EB" /> Evaluate Submissions ({asg.submissions.length})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: WEEKLY TIMETABLE MATRIX */}
      {/* ======================================================== */}
      {currentTab === 'faculty-schedule' && (
        <div className="noir-card">
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>
            Weekly Teaching Timetable ({activeFaculty.name})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, minWidth: 680, overflowX: 'auto' }}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
              <div key={day} style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 900, color: '#0F172A', fontSize: 14, marginBottom: 12, textAlign: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
                  {day}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ backgroundColor: '#EFF6FF', padding: 10, borderRadius: 8, border: '1px solid #BFDBFE', fontSize: 12 }}>
                    <strong style={{ color: '#1D4ED8' }}>10:00 - 11:15 AM</strong>
                    <div style={{ fontWeight: 800, marginTop: 2, color: '#0F172A' }}>{activeFaculty.courses[0]?.code}</div>
                    <div style={{ color: '#475569' }}>{activeFaculty.courses[0]?.room}</div>
                  </div>

                  {idx % 2 === 1 && (
                    <div style={{ backgroundColor: '#F1F5F9', padding: 10, borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12 }}>
                      <strong style={{ color: '#2563EB' }}>02:00 - 03:15 PM</strong>
                      <div style={{ fontWeight: 800, marginTop: 2, color: '#0F172A' }}>{activeFaculty.courses[1]?.code || 'Research Lab'}</div>
                      <div style={{ color: '#475569' }}>Tech Block Lab</div>
                    </div>
                  )}

                  <div style={{ padding: 8, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px dashed #CBD5E1', fontSize: 11, color: '#64748B', textAlign: 'center' }}>
                    Office Hours: 03:30 PM
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: CLASSROOM TERMINALS */}
      {/* ======================================================== */}
      {currentTab === 'terminals' && (
        <div className="noir-card">
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>
            Assigned Lecture Hall Palm Terminals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {terminals.slice(0, 3).map((term) => (
              <div
                key={term.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge-success">ONLINE</span>
                    <strong style={{ fontSize: 15, color: '#0F172A' }}>{term.locationName}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                    Terminal Code: {term.terminalCode} • IP: {term.ipAddress} • Ping: {term.lastPing}
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Ping diagnostic sent to ${term.terminalCode}. Status: 2ms response.`)}
                  className="btn btn-secondary btn-sm"
                >
                  Test Biometric Sensor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: FACULTY PROFILE */}
      {/* ======================================================== */}
      {currentTab === 'profile' && (
        <div className="noir-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <img
              src={activeFaculty.avatar}
              alt={activeFaculty.name}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #2563EB' }}
            />
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>{activeFaculty.name}</h2>
              <div style={{ fontSize: 14, color: '#2563EB', fontWeight: 800 }}>{activeFaculty.designation}</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>{activeFaculty.department}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
            <div>Email: <strong style={{ color: '#0F172A' }}>{activeFaculty.email}</strong></div>
            <div>Phone: <strong style={{ color: '#0F172A' }}>{activeFaculty.phone}</strong></div>
            <div>Cabin Office: <strong style={{ color: '#0F172A' }}>{activeFaculty.office}</strong></div>
            <div>Education: <strong style={{ color: '#0F172A' }}>{activeFaculty.degree}</strong></div>
            <div>Student Evaluation Rating: <strong style={{ color: '#D97706' }}>{activeFaculty.rating} / 5.0</strong></div>
            <div>Specializations: <strong style={{ color: '#0F172A' }}>{activeFaculty.specialization.join(', ')}</strong></div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EVALUATION / GRADING MODAL */}
      {/* ======================================================== */}
      {gradingModalAsg && (
        <div className="modal-backdrop" onClick={() => setGradingModalAsg(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Grade Submissions</h3>
                <div style={{ fontSize: 13, color: '#64748B' }}>{gradingModalAsg.title}</div>
              </div>
              <button onClick={() => setGradingModalAsg(null)} className="btn btn-ghost btn-icon btn-sm"><XSquare size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto' }}>
              {gradingModalAsg.submissions.map((sub: any) => (
                <div key={sub.studentId} style={{ padding: 14, backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>{sub.studentName} ({sub.studentId})</span>
                    <span className="badge badge-success">{sub.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>Submitted: {sub.submittedAt}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                    <input
                      type="number"
                      placeholder="Marks"
                      defaultValue={sub.marks || 45}
                      onChange={(e) => setMarksInput({ ...marksInput, [sub.studentId]: parseInt(e.target.value) || 0 })}
                      className="input-field"
                      style={{ width: 90, padding: '6px 10px', fontSize: 12 }}
                    />
                    <select
                      defaultValue={sub.grade || 'A'}
                      onChange={(e) => setGradeInput({ ...gradeInput, [sub.studentId]: e.target.value })}
                      className="input-field"
                      style={{ width: 80, padding: '6px 10px', fontSize: 12 }}
                    >
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                    </select>
                    <button
                      onClick={() => handleSaveGrade(gradingModalAsg.id, sub.studentId)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#D97706', fontSize: 12 }}
                    >
                      Save Grade
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE ASSIGNMENT MODAL */}
      {/* ======================================================== */}
      {showCreateAsgModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateAsgModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Create New Course Assignment</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>Publish a problem set or project to enrolled students</p>
              </div>
              <button onClick={() => setShowCreateAsgModal(false)} className="btn btn-ghost btn-icon btn-sm">
                <XSquare size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Assigned Course
                </label>
                <select
                  value={newAsgCourseCode}
                  onChange={(e) => setNewAsgCourseCode(e.target.value)}
                  className="input-field"
                  style={{ fontWeight: 700 }}
                >
                  {activeFaculty.courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} ({c.studentsCount} students)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Assignment Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Assignment 3: Distributed Consensus & Raft Protocol"
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Instructions & Requirements
                </label>
                <textarea
                  placeholder="Provide detailed submission requirements, rubric, format (PDF/Zip), and guidelines..."
                  value={newAsgDesc}
                  onChange={(e) => setNewAsgDesc(e.target.value)}
                  className="input-field"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Submission Due Date *
                  </label>
                  <input
                    type="date"
                    value={newAsgDueDate}
                    onChange={(e) => setNewAsgDueDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newAsgMaxMarks}
                    onChange={(e) => setNewAsgMaxMarks(Number(e.target.value))}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button type="button" onClick={() => setShowCreateAsgModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Publish Assignment & Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
