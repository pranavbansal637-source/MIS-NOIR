import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_STUDENT_DIRECTORY } from '../data/mockData';
import {
  Search,
  Eye,
  Plus,
  Monitor,
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckSquare,
  Clock,
  Briefcase,
  Building2,
  CreditCard,
  HelpCircle,
  Shield,
  BarChart3,
  X,
  Download
} from 'lucide-react';

interface ManagementDashboardProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  activeTab = 'mgmt-dashboard',
  onNavigate
}) => {
  const {
    terminals,
    toggleTerminalStatus,
    registerNewTerminal,
    facultyList,
    complaints,
    auditLogs,
    showToast
  } = useApp();

  const [localTab, setLocalTab] = useState(activeTab);
  const currentTab = onNavigate ? activeTab : localTab;
  const setTab = onNavigate || setLocalTab;

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Register Terminal Modal
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newType, setNewType] = useState<'CLASSROOM' | 'GATE' | 'LIBRARY' | 'CANTEEN' | 'MAIN_KIOSK'>('CLASSROOM');

  const filteredStudents = DEMO_STUDENT_DIRECTORY.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName) return;
    registerNewTerminal(newLocName, newRoomNo || 'N/A', newType);
    setShowRegisterModal(false);
    setNewLocName('');
    setNewRoomNo('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          background: 'linear-gradient(135deg, rgba(16, 21, 32, 0.95) 0%, rgba(8, 11, 18, 0.98) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            NEXORA MANAGEMENT OS • INSTITUTIONAL EXECUTIVE CONSOLE
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#F8FAFC', marginTop: 2 }}>
            University Operations & Academic Telemetry
          </h1>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            Central campus governance, student registry, faculty affairs, palm network hardware & RBAC security
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => showToast('Institutional NAAC & NIRF Report PDF exported successfully!')}
            className="btn btn-primary"
            style={{ gap: 6, fontWeight: 800 }}
          >
            <Download size={16} /> Export Executive Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs Pill Bar */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'mgmt-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
          { id: 'mgmt-students', label: 'Students Registry', icon: Users },
          { id: 'mgmt-faculty', label: 'Faculty Affairs', icon: GraduationCap },
          { id: 'mgmt-attendance', label: 'Attendance Telemetry', icon: CheckSquare },
          { id: 'mgmt-timetable', label: 'Master Timetable', icon: Clock },
          { id: 'mgmt-exams', label: 'Exams Control Board', icon: Briefcase },
          { id: 'terminals', label: 'Palm Hardware Manager', icon: Monitor },
          { id: 'mgmt-facilities', label: 'Facilities & Hostels', icon: Building2 },
          { id: 'mgmt-commerce', label: 'Campus Commerce & POS', icon: CreditCard },
          { id: 'mgmt-complaints', label: 'Helpdesk Tickets', icon: HelpCircle },
          { id: 'mgmt-audit', label: 'Security & Audit Logs', icon: Shield },
          { id: 'mgmt-reports', label: 'Accreditation Reports', icon: BarChart3 }
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
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: isActive ? 'rgba(245, 158, 11, 0.45)' : 'var(--border-color)',
                color: isActive ? '#FBBF24' : '#94A3B8'
              }}
            >
              <Icon size={15} color={isActive ? '#F59E0B' : '#64748B'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* KPI Overview Cards */}
          <div className="grid-4">
            <div className="noir-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>ENROLLED STUDENTS</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#F8FAFC' }}>4,280</div>
              <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: 700 }}>✓ 100% Palm Enrolled</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #38BDF8' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>TODAY'S ATTENDANCE</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#38BDF8' }}>89.4%</div>
              <div style={{ fontSize: 12, color: '#38BDF8', marginTop: 4, fontWeight: 700 }}>45 Running Class Sessions</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>POS REVENUE TODAY</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#10B981' }}>₹1,48,250</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: 700 }}>318 Total Transactions</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #FBBF24' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>PALM TERMINALS</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#F8FAFC' }}>{terminals.length} Online</div>
              <div style={{ fontSize: 12, color: '#10B981', marginTop: 4, fontWeight: 700 }}>● Network Status Nominal</div>
            </div>
          </div>

          {/* Department Attendance Matrix */}
          <div className="noir-card">
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
              Departmental Attendance & Compliance Matrix (Today)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { dept: 'School of Computer Science & Engg', att: '92.4%', students: '1,420', status: 'EXCELLENT', color: '#10B981' },
                { dept: 'Department of AI & Data Science', att: '94.1%', students: '680', status: 'EXCELLENT', color: '#10B981' },
                { dept: 'School of Business & Management', att: '88.2%', students: '1,120', status: 'GOOD', color: '#38BDF8' },
                { dept: 'Economics & Policy Studies', att: '85.6%', students: '540', status: 'GOOD', color: '#38BDF8' },
                { dept: 'Electronics & Communication', att: '81.4%', students: '520', status: 'COMPLIANT', color: '#F59E0B' }
              ].map((d) => (
                <div key={d.dept} style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#CBD5E1' }}>{d.dept}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: d.color, marginTop: 6 }}>{d.att}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{d.students} Enrolled</div>
                  <span className="badge badge-success" style={{ marginTop: 8, fontSize: 10 }}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STUDENTS REGISTRY */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-students' && (
        <div className="noir-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC' }}>
                University Student Directory & Biometric Profiles
              </h3>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                Search enrolled students, view credentials, and verify identity clearances
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="input-field"
                style={{ width: 180, fontSize: 13 }}
              >
                <option value="ALL">All Departments</option>
                <option value="School of Business">School of Business</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <div style={{ position: 'relative', width: 220 }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 32, fontSize: 13 }}
                />
                <Search size={14} color="#64748B" style={{ position: 'absolute', left: 10, top: 12 }} />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px 14px' }}>NAME</th>
                  <th style={{ padding: '12px 14px' }}>STUDENT ID</th>
                  <th style={{ padding: '12px 14px' }}>PROGRAM</th>
                  <th style={{ padding: '12px 14px' }}>ATTENDANCE</th>
                  <th style={{ padding: '12px 14px' }}>PALM STATUS</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#F8FAFC' }}>{s.name}</td>
                    <td style={{ padding: '12px 14px', color: '#F59E0B', fontWeight: 700 }}>{s.studentId}</td>
                    <td style={{ padding: '12px 14px' }}>{s.program} (Sem {s.semester})</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800 }}>{s.attendance}%</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-success">✓ Verified</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11, gap: 4 }}
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FACULTY AFFAIRS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="noir-card">
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 6 }}>
              University Faculty Directory & Department Heads
            </h3>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
              Total 184 faculty members • 100% Ph.D. / M.Tech credential compliance
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {facultyList.map((f) => (
                <div
                  key={f.id}
                  style={{
                    padding: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16
                  }}
                >
                  <img
                    src={f.avatar}
                    alt={f.name}
                    style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F59E0B' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 900, color: '#F8FAFC' }}>{f.name}</h4>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B' }}>{f.designation}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{f.department}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>{f.degree}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24', marginTop: 6 }}>
                      ★ {f.rating} Student Rating • {f.courses.length} Active Courses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ATTENDANCE TELEMETRY */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-attendance' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 6 }}>
            University Attendance Policy Compliance Engine
          </h3>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
            Mandatory 75% attendance audit under Academic Council Resolution 2026-B
          </p>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Total Active Students in Audit:</span>
              <strong>4,280</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Students with &gt; 75% Attendance (Eligible for Exams):</span>
              <strong style={{ color: '#10B981' }}>4,142 (96.8%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Warning Notices Issued (&lt; 75%):</span>
              <strong style={{ color: '#EF4444' }}>138 (3.2%)</strong>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: MASTER TIMETABLE */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-timetable' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            Institutional Master Lecture Hall Allocations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8 }}>
              <div><strong>Room A403:</strong> Marketing Management (Prof. Dr. Sarah Jenkins)</div>
              <span className="badge badge-success">OCCUPIED 10:00 - 11:15 AM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8 }}>
              <div><strong>Room A404:</strong> Corporate Finance (Dr. Elena Rostova)</div>
              <span className="badge badge-success">OCCUPIED 11:30 - 12:45 PM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 8 }}>
              <div><strong>Lecture Hall L102:</strong> Micro Economics (Prof. Rameshwar Sen)</div>
              <span className="badge badge-neutral">UPCOMING 02:00 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: EXAMS CONTROL BOARD */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-exams' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 6 }}>
            Controller of Examinations (COE) Console
          </h3>
          <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>
            End-Term & Mid-Semester examination hall ticket generation and biometric entry verification
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8' }}>UPCOMING EXAM CYCLE</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginTop: 4 }}>End-Semester Fall 2026</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Starts: 05 DEC 2026</div>
            </div>

            <div style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8' }}>HALL TICKETS RELEASED</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#10B981', marginTop: 4 }}>4,142 / 4,280 Verified</div>
              <div style={{ fontSize: 12, color: '#10B981', marginTop: 4 }}>✓ Palm token verified</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: PALM TERMINALS HARDWARE MANAGER */}
      {/* ======================================================== */}
      {currentTab === 'terminals' && (
        <div className="noir-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Monitor size={20} color="#F59E0B" /> Palm Terminal Hardware Manager
              </h3>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
                Configure physical terminal locations, assigned functions, and online status
              </p>
            </div>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn btn-primary btn-sm"
              style={{ gap: 6, fontWeight: 800 }}
            >
              <Plus size={16} /> Register New Terminal
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                  <th style={{ padding: '12px 14px' }}>LOCATION</th>
                  <th style={{ padding: '12px 14px' }}>TERMINAL CODE</th>
                  <th style={{ padding: '12px 14px' }}>FUNCTION</th>
                  <th style={{ padding: '12px 14px' }}>IP / FIRMWARE</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {terminals.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#F8FAFC' }}>{t.locationName}</td>
                    <td style={{ padding: '12px 14px', color: '#F59E0B', fontWeight: 700 }}>{t.terminalCode}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-neutral">{t.type}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>{t.ipAddress} ({t.firmwareVersion})</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${t.status === 'ONLINE' ? 'badge-success' : 'badge-danger'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => toggleTerminalStatus(t.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11 }}
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: FACILITIES & HOSTELS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-facilities' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            Campus Resident Halls & Infrastructure
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, fontSize: 13 }}>
            <div style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <strong>Hostel Block A (Boys):</strong>
              <div style={{ color: '#10B981', fontWeight: 800, marginTop: 4 }}>94% Occupancy (420/450)</div>
              <div style={{ color: '#94A3B8' }}>Warden: Prof. S. N. Mukherjee</div>
            </div>
            <div style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <strong>Hostel Block B (Boys):</strong>
              <div style={{ color: '#10B981', fontWeight: 800, marginTop: 4 }}>98% Occupancy (440/450)</div>
              <div style={{ color: '#94A3B8' }}>Room 304 assigned to PRANAV</div>
            </div>
            <div style={{ padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <strong>Hostel Block C (Girls):</strong>
              <div style={{ color: '#10B981', fontWeight: 800, marginTop: 4 }}>92% Occupancy (410/450)</div>
              <div style={{ color: '#94A3B8' }}>Biometric gate turnstile active</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: COMMERCE & POS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-commerce' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            Institutional Financial Telemetry & Merchant Settlement
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
            <div style={{ padding: 18, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ color: '#94A3B8', fontWeight: 800 }}>CAMPUS WALLET POOL BALANCE</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10B981', marginTop: 4 }}>₹24,80,000</div>
              <div style={{ color: '#94A3B8', marginTop: 4 }}>Held in Reserve Escrow (SBI NEXORA Branch)</div>
            </div>

            <div style={{ padding: 18, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ color: '#94A3B8', fontWeight: 800 }}>CANTEEN & STORE SETTLEMENT</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B', marginTop: 4 }}>₹1,48,250</div>
              <div style={{ color: '#94A3B8', marginTop: 4 }}>Scheduled for T+0 Direct Credit</div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: HELPDESK TICKETS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-complaints' && (
        <div className="noir-card">
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            Campus Grievance Redressal Desk
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {complaints.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="badge badge-primary">{c.category}</span>
                    <strong style={{ fontSize: 14 }}>{c.ticketNo}</strong>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>by {c.userName}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#F8FAFC', marginTop: 4 }}>{c.description}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>Assigned to: {c.assignedPerson}</div>
                </div>

                <span className={`badge ${c.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 11: AUDIT LOGS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-audit' && (
        <div className="noir-card">
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            Institutional Security & Biometric Audit Trail
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 10,
                  fontSize: 13
                }}
              >
                <div>
                  <strong>{log.user}</strong> ({log.role}) • <span style={{ color: '#F59E0B', fontWeight: 700 }}>{log.action}</span>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{log.target}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success">{log.result}</span>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 12: ACCREDITATION REPORTS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-reports' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#F8FAFC', marginBottom: 16 }}>
            Accreditation & NIRF Analytics Generator
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10 }}>
              <div>
                <strong>NAAC Criterion II: Teaching-Learning and Evaluation</strong>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>Biometric student attendance, LMS records, faculty:student ratio</div>
              </div>
              <button onClick={() => showToast('NAAC Criterion II Report downloaded.')} className="btn btn-secondary btn-sm">Download</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10 }}>
              <div>
                <strong>NIRF Annual Data Submission 2026</strong>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>Student strength, graduation outcomes, placement statistics</div>
              </div>
              <button onClick={() => showToast('NIRF 2026 Annual dataset exported.')} className="btn btn-secondary btn-sm">Download</button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REGISTER TERMINAL MODAL */}
      {/* ======================================================== */}
      {showRegisterModal && (
        <div className="modal-backdrop" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Register Physical Palm Terminal</h3>
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Location / Room Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C Seminar Hall Entrance"
                  className="input-field"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. C201"
                  className="input-field"
                  value={newRoomNo}
                  onChange={(e) => setNewRoomNo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Terminal Category</label>
                <select
                  className="input-field"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                >
                  <option value="CLASSROOM">Classroom / Lecture Hall</option>
                  <option value="GATE">Campus Security Gate</option>
                  <option value="LIBRARY">Central Library Turnstile</option>
                  <option value="CANTEEN">Canteen / Store POS</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setShowRegisterModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#0284C7' }}>
                  Register Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT STUDENT MODAL */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900 }}>Student Record Dossier</h3>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12 }}>
              <div>Student Name: <strong>{selectedStudent.name}</strong></div>
              <div>Roll / Registration: <strong>{selectedStudent.studentId}</strong></div>
              <div>Academic Program: <strong>{selectedStudent.program}</strong></div>
              <div>Department: <strong>{selectedStudent.department}</strong></div>
              <div>Semester Attendance: <strong style={{ color: selectedStudent.attendance >= 75 ? '#059669' : '#DC2626' }}>{selectedStudent.attendance}%</strong></div>
              <div>Biometric Status: <strong>{selectedStudent.palmVerified ? '✓ Palm Biometrics Enrolled' : 'Pending Enrollment'}</strong></div>
              <div>Disciplinary Status: <strong>{selectedStudent.status}</strong></div>
            </div>

            <button
              onClick={() => {
                showToast(`Issued exam pass clearance for ${selectedStudent.name}`);
                setSelectedStudent(null);
              }}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 16, backgroundColor: '#0284C7' }}
            >
              Issue Digital Clearance Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
