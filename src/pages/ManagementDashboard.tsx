import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_STUDENT_DIRECTORY } from '../data/mockData';
import type { TerminalDevice, FacilityRecord, AttendanceSessionRecord, ComplaintTicket } from '../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CheckSquare,
  Monitor,
  Building2,
  BookOpen,
  CreditCard,
  HelpCircle,
  Shield,
  BarChart3,
  Search,
  Plus,
  Download,
  X,
  AlertTriangle,
  Wrench,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  RotateCcw,
  Check
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
    registerDetailedTerminal,
    markTerminalMaintenance,
    restoreTerminalFromMaintenance,
    removeTerminal,
    facultyList,
    complaints,
    updateTicketStatus,
    auditLogs,
    attendanceRecords,
    correctAttendanceRecord,
    facilities,
    addFacility,
    books,
    libraryIssues,
    issueLibraryBook,
    returnLibraryBook,
    payLibraryFine,
    transactions,
    showToast
  } = useApp();

  const [localTab, setLocalTab] = useState(activeTab);
  const currentTab = onNavigate ? activeTab : localTab;
  const setTab = onNavigate || setLocalTab;

  // Student Registry State (Req 3.1)
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('ALL');
  const [clearedStudentId, setClearedStudentId] = useState<string | null>(null);

  // Faculty Affairs State (Req 3.2)
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyDeptFilter, setFacultyDeptFilter] = useState('ALL');

  // Attendance Telemetry State (Req 3.3)
  const [attCourseFilter, setAttCourseFilter] = useState('ALL');
  const [attStatusFilter, setAttStatusFilter] = useState('ALL');
  const [correctionModalRecord, setCorrectionModalRecord] = useState<AttendanceSessionRecord | null>(null);
  const [correctionStatus, setCorrectionStatus] = useState<AttendanceSessionRecord['status']>('EXCUSED');
  const [correctionReason, setCorrectionReason] = useState('');

  // Terminal Hardware State (Req 3.5 & Module 5)
  const [showRegisterTerminalModal, setShowRegisterTerminalModal] = useState(false);
  const [newTermName, setNewTermName] = useState('');
  const [newTermCode, setNewTermCode] = useState('');
  const [newTermRoom, setNewTermRoom] = useState('');
  const [newTermBuilding, setNewTermBuilding] = useState('Academic Block A');
  const [newTermScannerId, setNewTermScannerId] = useState('');
  const [newTermDept, setNewTermDept] = useState('Computer Science & Engg');
  const [newTermType, setNewTermType] = useState<TerminalDevice['type']>('CLASSROOM');

  // Terminal Maintenance Modal State
  const [maintenanceModalTerm, setMaintenanceModalTerm] = useState<TerminalDevice | null>(null);
  const [maintReason, setMaintReason] = useState('Optical Sensor Recalibration');
  const [maintTechnician, setMaintTechnician] = useState('Arun Kumar (Hardware Support)');
  const [maintRestorationDate, setMaintRestorationDate] = useState('24 Oct 2026');

  // Terminal Delete Confirmation Modal
  const [deletingTerminalId, setDeletingTerminalId] = useState<string | null>(null);

  // Facilities State (Req 3.6)
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('ALL');
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [newFacName, setNewFacName] = useState('');
  const [newFacType, setNewFacType] = useState<FacilityRecord['type']>('HOSTEL');
  const [newFacBuilding, setNewFacBuilding] = useState('');
  const [newFacCapacity, setNewFacCapacity] = useState(400);
  const [newFacOccupancy, setNewFacOccupancy] = useState(380);
  const [newFacManager, setNewFacManager] = useState('');
  const [newFacContact, setNewFacContact] = useState('');

  // Library State (Req 3.7)
  const [bookSearch, setBookSearch] = useState('');
  const [showIssueBookModal, setShowIssueBookModal] = useState(false);
  const [issueSelectedBookId, setIssueSelectedBookId] = useState(books[0]?.id || '');
  const [issueStudentName, setIssueStudentName] = useState('');
  const [issueStudentId, setIssueStudentId] = useState('');
  const [issueDays, setIssueDays] = useState(14);

  // Commerce & POS State (Req 3.8)
  const [txMethodFilter, setTxMethodFilter] = useState('ALL');
  const [txStatusFilter, setTxStatusFilter] = useState('ALL');

  // Ticket Resolution State (Req 3.9)
  const [ticketStatusFilter, setTicketStatusFilter] = useState('ALL');
  const [resolvingTicket, setResolvingTicket] = useState<ComplaintTicket | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<ComplaintTicket['status']>('RESOLVED');
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionAssignee, setResolutionAssignee] = useState('');

  // CSV Generator Helper (Req 3.8 & 3.10)
  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join(
        '\n'
      );
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${filename} successfully!`);
  };

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  const handleRegisterTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTermName.trim() || !newTermCode.trim()) {
      showToast('Please provide both terminal name and code');
      return;
    }
    const res = registerDetailedTerminal({
      terminalCode: newTermCode.trim().toUpperCase(),
      locationName: newTermName.trim(),
      roomNumber: newTermRoom.trim() || 'Ground Kiosk',
      building: newTermBuilding,
      scannerHardwareId: newTermScannerId.trim() || `SN-PLM-${Date.now().toString().slice(-4)}`,
      type: newTermType,
      department: newTermDept,
      status: 'ONLINE'
    });
    if (res.success) {
      setShowRegisterTerminalModal(false);
      setNewTermName('');
      setNewTermCode('');
      setNewTermRoom('');
      setNewTermScannerId('');
    }
  };

  const handleLogMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceModalTerm) return;
    markTerminalMaintenance(maintenanceModalTerm.id, maintReason, maintTechnician, maintRestorationDate);
    setMaintenanceModalTerm(null);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionModalRecord) return;
    if (!correctionReason.trim()) {
      showToast('Please enter reason for administrative correction');
      return;
    }
    correctAttendanceRecord(correctionModalRecord.id, correctionStatus, correctionReason.trim());
    setCorrectionModalRecord(null);
    setCorrectionReason('');
  };

  const handleAddFacilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacName.trim()) {
      showToast('Please enter facility name');
      return;
    }
    addFacility({
      name: newFacName.trim(),
      type: newFacType,
      building: newFacBuilding.trim() || 'Central Campus',
      capacity: Number(newFacCapacity) || 100,
      currentOccupancy: Number(newFacOccupancy) || 0,
      managerName: newFacManager.trim() || 'Admin Office',
      contactPhone: newFacContact.trim() || '+91 98765 00000',
      status: 'OPERATIONAL'
    });
    setShowAddFacilityModal(false);
    setNewFacName('');
    setNewFacBuilding('');
    setNewFacManager('');
    setNewFacContact('');
  };

  const handleIssueBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueStudentName.trim() || !issueStudentId.trim()) {
      showToast('Please enter student name and registration ID');
      return;
    }
    issueLibraryBook(issueSelectedBookId, issueStudentId.trim(), issueStudentName.trim(), issueDays);
    setShowIssueBookModal(false);
    setIssueStudentName('');
    setIssueStudentId('');
  };

  const handleTicketResolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket) return;
    updateTicketStatus(resolvingTicket.id, resolutionStatus, resolutionNote.trim(), resolutionAssignee.trim());
    setResolvingTicket(null);
    setResolutionNote('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ======================================================== */}
      {/* HEADER SECTION */}
      {/* ======================================================== */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            NEXORA MANAGEMENT OS • INSTITUTIONAL EXECUTIVE CONSOLE
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>
            University Operations & Academic Telemetry
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
            Central campus governance, student registry, faculty affairs, Pehchaan palm hardware & RBAC security
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => {
              const headers = ['Report Category', 'Metric', 'Value', 'Status', 'Timestamp'];
              const rows = [
                ['Executive Summary', 'Total Enrolled Students', '4280', 'Active', new Date().toISOString()],
                ['Attendance Telemetry', 'Average Campus Attendance', '89.4%', 'Compliant', new Date().toISOString()],
                ['Biometric Network', 'Online Palm Terminals', `${terminals.filter((t) => t.status === 'ONLINE').length}/${terminals.length}`, 'Nominal', new Date().toISOString()],
                ['Campus Finance', 'Total POS Volume Today', '₹1,48,250', 'Reconciled', new Date().toISOString()],
                ['Hostel Infrastructure', 'Hostel Occupancy Rate', '95.2%', 'Optimal', new Date().toISOString()]
              ];
              exportCSV('NEXORA_Executive_NAAC_NIRF_Report.csv', headers, rows);
            }}
            className="btn btn-primary"
            style={{ gap: 6, fontWeight: 800 }}
          >
            <Download size={16} /> Export Executive Dataset (.csv)
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* NAVIGATION PILL BAR (Req 3.1 & 3.4) */}
      {/* ======================================================== */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
        {[
          { id: 'mgmt-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
          { id: 'mgmt-students', label: 'Students Registry', icon: Users },
          { id: 'mgmt-faculty', label: 'Faculty Affairs', icon: GraduationCap },
          { id: 'mgmt-attendance', label: 'Attendance Telemetry', icon: CheckSquare },
          { id: 'terminals', label: 'Palm Hardware Manager', icon: Monitor },
          { id: 'mgmt-facilities', label: 'Facilities & Hostels', icon: Building2 },
          { id: 'mgmt-library', label: 'Library Management', icon: BookOpen },
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
                backgroundColor: isActive ? '#0284C7' : '#FFFFFF',
                borderColor: isActive ? '#0284C7' : '#CBD5E1',
                color: isActive ? '#FFFFFF' : '#334155',
                boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              <Icon size={15} color={isActive ? '#FFFFFF' : '#64748B'} />
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
          {/* KPI Cards */}
          <div className="grid-4">
            <div className="noir-card" style={{ borderLeft: '4px solid #D97706' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>ENROLLED STUDENTS</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#0F172A' }}>4,280</div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>✓ 100% Palm Enrolled</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #0284C7' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>TODAY'S ATTENDANCE</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#0284C7' }}>89.4%</div>
              <div style={{ fontSize: 12, color: '#0284C7', marginTop: 4, fontWeight: 700 }}>45 Active Class Sessions</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #059669' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>POS REVENUE TODAY</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#059669' }}>₹1,48,250</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 700 }}>318 Settled Transactions</div>
            </div>

            <div className="noir-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>PALM TERMINALS</div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, color: '#0F172A' }}>
                {terminals.filter((t) => t.status === 'ONLINE').length} / {terminals.length} Online
              </div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>● Pehchaan Hardware Nominal</div>
            </div>
          </div>

          {/* Department Attendance Matrix */}
          <div className="noir-card">
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>
              Departmental Attendance & Compliance Matrix (Today)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { dept: 'School of Computer Science & Engg', att: '92.4%', students: '1,420', status: 'EXCELLENT', color: '#059669' },
                { dept: 'Department of AI & Data Science', att: '94.1%', students: '680', status: 'EXCELLENT', color: '#059669' },
                { dept: 'School of Business & Management', att: '88.2%', students: '1,120', status: 'GOOD', color: '#0284C7' },
                { dept: 'Economics & Policy Studies', att: '85.6%', students: '540', status: 'GOOD', color: '#0284C7' },
                { dept: 'Electronics & Communication', att: '81.4%', students: '520', status: 'COMPLIANT', color: '#D97706' }
              ].map((d) => (
                <div key={d.dept} style={{ padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1E293B' }}>{d.dept}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: d.color, marginTop: 6 }}>{d.att}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{d.students} Enrolled</div>
                  <span className="badge badge-success" style={{ marginTop: 8, fontSize: 10 }}>{d.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STUDENTS REGISTRY (Req 3.1: NO INSPECT BUTTON) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-students' && (
        <div className="noir-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                University Student Directory & Biometric Clearances
              </h3>
              <p style={{ fontSize: 13, color: '#64748B' }}>
                Student registry, semester attendance, biometric enrollment, and academic clearances
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={studentDeptFilter}
                onChange={(e) => setStudentDeptFilter(e.target.value)}
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
                  placeholder="Search student or ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ paddingLeft: 32, fontSize: 13 }}
                />
                <Search size={14} color="#64748B" style={{ position: 'absolute', left: 10, top: 12 }} />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                  <th style={{ padding: '12px 14px' }}>NAME</th>
                  <th style={{ padding: '12px 14px' }}>STUDENT ID</th>
                  <th style={{ padding: '12px 14px' }}>PROGRAM</th>
                  <th style={{ padding: '12px 14px' }}>ATTENDANCE</th>
                  <th style={{ padding: '12px 14px' }}>PALM STATUS</th>
                  <th style={{ padding: '12px 14px' }}>ACADEMIC STATUS</th>
                  <th style={{ padding: '12px 14px' }}>ADMINISTRATIVE ACTION</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_STUDENT_DIRECTORY.filter((s) => {
                  const matchesSearch =
                    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                    s.studentId.toLowerCase().includes(studentSearch.toLowerCase());
                  const matchesDept = studentDeptFilter === 'ALL' || s.department === studentDeptFilter;
                  return matchesSearch && matchesDept;
                }).map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>{s.name}</td>
                    <td style={{ padding: '12px 14px', color: '#0284C7', fontWeight: 700 }}>{s.studentId}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {s.program} (Sem {s.semester})
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 800, color: s.attendance >= 75 ? '#059669' : '#DC2626' }}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-success">✓ Verified Enrolled</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        onClick={() => {
                          setClearedStudentId(s.studentId);
                          showToast(`Issued Digital Exam & Hall Clearance for ${s.name} (${s.studentId})`);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: 11, gap: 4, fontWeight: 700 }}
                      >
                        <Check size={13} color="#059669" /> {clearedStudentId === s.studentId ? 'Cleared' : 'Issue Clearance'}
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
      {/* TAB 3: FACULTY AFFAIRS (Req 3.2) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="noir-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  University Faculty Directory & Department Heads
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Courses handled, daily teaching schedule, cabin offices, and contact details
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <select
                  value={facultyDeptFilter}
                  onChange={(e) => setFacultyDeptFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 220, fontSize: 13 }}
                >
                  <option value="ALL">All Academic Departments</option>
                  <option value="School of Business">School of Business</option>
                  <option value="Computer Science">Computer Science</option>
                </select>

                <div style={{ position: 'relative', width: 220 }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search faculty..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                    style={{ paddingLeft: 32, fontSize: 13 }}
                  />
                  <Search size={14} color="#64748B" style={{ position: 'absolute', left: 10, top: 12 }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 18 }}>
              {facultyList
                .filter((f) => {
                  const matchesSearch = f.name.toLowerCase().includes(facultySearch.toLowerCase()) || f.department.toLowerCase().includes(facultySearch.toLowerCase());
                  const matchesDept = facultyDeptFilter === 'ALL' || f.department.toLowerCase().includes(facultyDeptFilter.toLowerCase());
                  return matchesSearch && matchesDept;
                })
                .map((f) => (
                  <div
                    key={f.id}
                    style={{
                      padding: 20,
                      backgroundColor: '#F8FAFC',
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 14
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <img
                        src={f.avatar}
                        alt={f.name}
                        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284C7' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>{f.name}</h4>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0284C7' }}>{f.designation}</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>{f.department}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{f.degree} • Office: {f.office}</div>
                      </div>
                    </div>

                    {/* Courses & Today's Schedule */}
                    <div style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}>
                      <div style={{ fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase', fontSize: 11 }}>
                        Courses Handled & Schedule
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {f.courses.map((c) => (
                          <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong style={{ color: '#0F172A' }}>{c.code}:</strong> {c.name}
                            </div>
                            <span className="badge badge-neutral" style={{ fontSize: 10 }}>
                              {c.time} ({c.room})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact & Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: 10 }}>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Mail size={13} color="#0284C7" /> {f.email}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Phone size={13} color="#059669" /> {f.phone}
                        </span>
                      </div>
                      <strong style={{ color: '#D97706' }}>★ {f.rating}</strong>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ATTENDANCE TELEMETRY (Req 3.3) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Summary KPIs */}
          <div className="grid-3">
            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>TOTAL SESSIONS CONDUCTED</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>
                {attendanceRecords.length}
              </div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>100% Palm & QR Biometrically Verified</div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>AVERAGE ATTENDANCE RATE</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0284C7', marginTop: 4 }}>
                {Math.round(
                  (attendanceRecords.filter((r) => r.status === 'PRESENT').length / (attendanceRecords.length || 1)) * 100
                )}%
              </div>
              <div style={{ fontSize: 12, color: '#0284C7', marginTop: 4, fontWeight: 700 }}>Council Threshold: 75.0%</div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>ADMINISTRATIVE CORRECTIONS</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#D97706', marginTop: 4 }}>
                {attendanceRecords.filter((r) => r.correctedBy).length}
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 700 }}>Logged with immutable audit trail</div>
            </div>
          </div>

          {/* Session Ledger & Filter */}
          <div className="noir-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  Institutional Attendance Session Ledger
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Verified class sessions, biometric check-in timestamps, and administrative corrections
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <select
                  value={attCourseFilter}
                  onChange={(e) => setAttCourseFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 160, fontSize: 13 }}
                >
                  <option value="ALL">All Courses</option>
                  <option value="CS-401">CS-401</option>
                  <option value="AI-502">AI-502</option>
                  <option value="MGT-301">MGT-301</option>
                  <option value="FIN-302">FIN-302</option>
                </select>

                <select
                  value={attStatusFilter}
                  onChange={(e) => setAttStatusFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 140, fontSize: 13 }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="EXCUSED">Excused</option>
                </select>

                <button
                  onClick={() => {
                    const headers = ['Record ID', 'Date', 'Course Code', 'Subject', 'Faculty', 'Room', 'Status', 'Method', 'Correction Reason'];
                    const rows: (string | number)[][] = attendanceRecords.map((r) => [
                      r.id,
                      r.date,
                      r.courseCode,
                      r.courseName,
                      r.facultyName,
                      r.room,
                      r.status,
                      r.verifiedVia || r.verificationMethod || 'Palm Biometrics',
                      r.correctionReason || 'None'
                    ]);
                    exportCSV('Campus_Attendance_Sessions.csv', headers, rows);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 6 }}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                    <th style={{ padding: '12px 14px' }}>DATE & TIME</th>
                    <th style={{ padding: '12px 14px' }}>COURSE & SUBJECT</th>
                    <th style={{ padding: '12px 14px' }}>FACULTY</th>
                    <th style={{ padding: '12px 14px' }}>ROOM</th>
                    <th style={{ padding: '12px 14px' }}>STATUS</th>
                    <th style={{ padding: '12px 14px' }}>VERIFICATION METHOD</th>
                    <th style={{ padding: '12px 14px' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords
                    .filter((r) => {
                      const matchesCourse = attCourseFilter === 'ALL' || r.courseCode === attCourseFilter;
                      const matchesStatus = attStatusFilter === 'ALL' || r.status === attStatusFilter;
                      return matchesCourse && matchesStatus;
                    })
                    .map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                          {r.date} <span style={{ color: '#64748B', fontWeight: 500 }}>({r.time})</span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <strong style={{ color: '#0284C7' }}>{r.courseCode}</strong> — {r.courseName}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569' }}>{r.facultyName}</td>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{r.room}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span
                            className={`badge ${
                              r.status === 'PRESENT'
                                ? 'badge-success'
                                : r.status === 'EXCUSED'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {r.status}
                          </span>
                          {r.correctedBy && (
                            <div style={{ fontSize: 10, color: '#D97706', marginTop: 2 }}>
                              Corrected: {r.correctionReason}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{r.verifiedVia}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            onClick={() => {
                              setCorrectionModalRecord(r);
                              setCorrectionStatus(r.status === 'PRESENT' ? 'ABSENT' : 'PRESENT');
                              setCorrectionReason(r.correctionReason || '');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 11, gap: 4 }}
                          >
                            <RotateCcw size={12} /> Correct
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
      {/* TAB 5: PALM HARDWARE MANAGER (Req 3.5 & Module 5) */}
      {/* ======================================================== */}
      {currentTab === 'terminals' && (
        <div className="noir-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Monitor size={20} color="#0284C7" /> Pehchaan Palm Terminal Hardware Manager
              </h3>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                Configure physical biometric terminals, log breakdown/maintenance, and monitor connectivity
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowRegisterTerminalModal(true)}
                className="btn btn-primary btn-sm"
                style={{ gap: 6, fontWeight: 800 }}
              >
                <Plus size={16} /> Register New Terminal
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                  <th style={{ padding: '12px 14px' }}>TERMINAL / LOCATION</th>
                  <th style={{ padding: '12px 14px' }}>TERMINAL CODE</th>
                  <th style={{ padding: '12px 14px' }}>BUILDING & ROOM</th>
                  <th style={{ padding: '12px 14px' }}>SCANNER HARDWARE ID</th>
                  <th style={{ padding: '12px 14px' }}>STATUS</th>
                  <th style={{ padding: '12px 14px' }}>MAINTENANCE & ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {terminals.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>
                      {t.locationName}
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>
                        {t.type} • IP: {t.ipAddress}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#0284C7', fontWeight: 800 }}>{t.terminalCode}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {t.building || 'Main Campus'} (Room {t.roomNumber})
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748B', fontSize: 12 }}>
                      <code>{t.scannerHardwareId || 'NEX-PALM-V2'}</code>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        className={`badge ${
                          t.status === 'ONLINE'
                            ? 'badge-success'
                            : t.status === 'MAINTENANCE'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        ● {t.status}
                      </span>
                      {t.status === 'MAINTENANCE' && t.maintenanceHistory && t.maintenanceHistory[0] && (
                        <div style={{ fontSize: 10, color: '#D97706', marginTop: 2 }}>
                          {t.maintenanceHistory[0].reason}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {t.status === 'ONLINE' ? (
                          <button
                            onClick={() => setMaintenanceModalTerm(t)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: 11, gap: 4 }}
                          >
                            <Wrench size={12} color="#D97706" /> Breakdown
                          </button>
                        ) : (
                          <button
                            onClick={() => restoreTerminalFromMaintenance(t.id, 'Verified sensor calibration and connectivity.')}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: 11, gap: 4, backgroundColor: '#059669' }}
                          >
                            <RefreshCw size={12} /> Restore Online
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingTerminalId(t.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: 11, color: '#DC2626' }}
                          title="Safely remove / deactivate terminal"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: FACILITIES & HOSTELS (Req 3.6) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="noir-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  Campus Infrastructure, Buildings & Hostels Directory
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Manage resident halls, academic complexes, dining facilities, and occupancy rates
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <select
                  value={facilityTypeFilter}
                  onChange={(e) => setFacilityTypeFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 180, fontSize: 13 }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="HOSTEL">Hostels & Dormitories</option>
                  <option value="ACADEMIC">Academic Complexes</option>
                  <option value="DINING">Dining & Cafeteria</option>
                  <option value="ATHLETICS">Athletics & Sports</option>
                </select>

                <button
                  onClick={() => setShowAddFacilityModal(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: 6, fontWeight: 800 }}
                >
                  <Plus size={16} /> Add Campus Facility
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {facilities
                .filter((f) => facilityTypeFilter === 'ALL' || f.type === facilityTypeFilter)
                .map((fac) => {
                  const pct = Math.round((fac.currentOccupancy / fac.capacity) * 100);
                  return (
                    <div
                      key={fac.id}
                      style={{
                        padding: 18,
                        backgroundColor: '#F8FAFC',
                        borderRadius: 14,
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 12
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span className="badge badge-primary">{fac.type}</span>
                          <span className={`badge ${fac.status === 'OPERATIONAL' ? 'badge-success' : 'badge-warning'}`}>
                            {fac.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>{fac.name}</h4>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                          Location: <strong>{fac.building}</strong>
                        </div>
                      </div>

                      {/* Capacity / Occupancy Bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          <span style={{ color: '#475569' }}>Occupancy Capacity</span>
                          <span style={{ color: pct > 90 ? '#D97706' : '#059669' }}>
                            {fac.currentOccupancy} / {fac.capacity} ({pct}%)
                          </span>
                        </div>
                        <div style={{ width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              height: '100%',
                              backgroundColor: pct > 90 ? '#D97706' : '#059669',
                              borderRadius: 4
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: 10 }}>
                        <span>Warden/Mgr: <strong>{fac.managerName}</strong></span>
                        <span>{fac.contactPhone}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: LIBRARY MANAGEMENT (Req 3.7) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-library' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Library KPIs */}
          <div className="grid-4">
            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>TOTAL CATALOGUE TITLES</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>{books.length}</div>
              <div style={{ fontSize: 12, color: '#0284C7', marginTop: 4, fontWeight: 700 }}>
                {books.reduce((s, b) => s + b.totalCopies, 0)} Total Copies
              </div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>AVAILABLE ON SHELVES</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#059669', marginTop: 4 }}>
                {books.reduce((s, b) => s + b.availableCopies, 0)}
              </div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>Ready for immediate checkout</div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>CURRENTLY CIRCULATING</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#D97706', marginTop: 4 }}>
                {libraryIssues.filter((i) => i.status === 'ISSUED').length}
              </div>
              <div style={{ fontSize: 12, color: '#D97706', marginTop: 4, fontWeight: 700 }}>Active student loans</div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>OVERDUE FINES ACCRUED</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#DC2626', marginTop: 4 }}>
                ₹{libraryIssues.reduce((s, i) => s + (i.finePaid ? 0 : i.fineAmount), 0)}
              </div>
              <div style={{ fontSize: 12, color: '#DC2626', marginTop: 4, fontWeight: 700 }}>Institutional dues pending</div>
            </div>
          </div>

          {/* Active Borrowing & Issues Ledger */}
          <div className="noir-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  Central Library Circulation Ledger & Dues
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Track student issue dates, due dates, returns, and overdue fine settlements
                </p>
              </div>

              <button
                onClick={() => setShowIssueBookModal(true)}
                className="btn btn-primary btn-sm"
                style={{ gap: 6, fontWeight: 800 }}
              >
                <Plus size={16} /> Issue Book to Student
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                    <th style={{ padding: '12px 14px' }}>BOOK TITLE</th>
                    <th style={{ padding: '12px 14px' }}>BORROWER NAME</th>
                    <th style={{ padding: '12px 14px' }}>STUDENT ID</th>
                    <th style={{ padding: '12px 14px' }}>ISSUE DATE</th>
                    <th style={{ padding: '12px 14px' }}>DUE DATE</th>
                    <th style={{ padding: '12px 14px' }}>STATUS & FINE</th>
                    <th style={{ padding: '12px 14px' }}>CIRCULATION ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {libraryIssues.map((iss) => (
                    <tr key={iss.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>{iss.bookTitle}</td>
                      <td style={{ padding: '12px 14px', color: '#0F172A' }}>{iss.userName}</td>
                      <td style={{ padding: '12px 14px', color: '#0284C7', fontWeight: 700 }}>{iss.userId}</td>
                      <td style={{ padding: '12px 14px', color: '#64748B' }}>{iss.issueDate}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#DC2626' }}>{iss.dueDate}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          className={`badge ${
                            iss.status === 'RETURNED'
                              ? 'badge-success'
                              : iss.status === 'OVERDUE'
                              ? 'badge-danger'
                              : 'badge-primary'
                          }`}
                        >
                          {iss.status}
                        </span>
                        {iss.fineAmount > 0 && (
                          <div style={{ fontSize: 11, color: iss.finePaid ? '#059669' : '#DC2626', fontWeight: 700, marginTop: 2 }}>
                            {iss.finePaid ? '✓ Fine Paid (₹' + iss.fineAmount + ')' : 'Fine Due: ₹' + iss.fineAmount}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {iss.status !== 'RETURNED' && (
                            <button
                              onClick={() => returnLibraryBook(iss.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: 11 }}
                            >
                              Return Book
                            </button>
                          )}
                          {iss.fineAmount > 0 && !iss.finePaid && (
                            <button
                              onClick={() => payLibraryFine(iss.id)}
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: 11, backgroundColor: '#059669' }}
                            >
                              Collect Fine
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Book Catalogue Table */}
          <div className="noir-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>Library Catalogue Search</h3>
              <div style={{ position: 'relative', width: 260 }}>
                <input
                  type="text"
                  placeholder="Search catalogue..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 32, fontSize: 12 }}
                />
                <Search size={14} color="#64748B" style={{ position: 'absolute', left: 10, top: 11 }} />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '8px 10px' }}>TITLE</th>
                    <th style={{ padding: '8px 10px' }}>AUTHOR</th>
                    <th style={{ padding: '8px 10px' }}>ISBN</th>
                    <th style={{ padding: '8px 10px' }}>CATEGORY</th>
                    <th style={{ padding: '8px 10px' }}>AVAILABILITY</th>
                  </tr>
                </thead>
                <tbody>
                  {books
                    .filter((b) => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()))
                    .map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 800 }}>{b.title}</td>
                        <td style={{ padding: '8px 10px', color: '#475569' }}>{b.author}</td>
                        <td style={{ padding: '8px 10px', color: '#64748B' }}>{b.isbn}</td>
                        <td style={{ padding: '8px 10px' }}><span className="badge badge-neutral">{b.category}</span></td>
                        <td style={{ padding: '8px 10px' }}>
                          <strong style={{ color: b.availableCopies > 0 ? '#059669' : '#DC2626' }}>
                            {b.availableCopies} / {b.totalCopies} Available
                          </strong>
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
      {/* TAB 8: COMMERCE & POS (Req 3.8) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-commerce' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Commerce Financial Overview */}
          <div className="grid-3">
            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>CAMPUS WALLET ESCROW</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#059669', marginTop: 4 }}>₹24,80,000</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Held in reserve pool (State Bank of India NEXORA)</div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>MERCHANT POS SETTLEMENT</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0284C7', marginTop: 4 }}>₹1,48,250</div>
              <div style={{ fontSize: 12, color: '#059669', marginTop: 4, fontWeight: 700 }}>T+0 Real-Time Reconciliation Active</div>
            </div>

            <div className="noir-card">
              <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B', textTransform: 'uppercase' }}>TRANSACTIONS RECORDED</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>{transactions.length}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Encrypted gateway tokens (No raw card credentials)</div>
            </div>
          </div>

          {/* Reconciliation Table */}
          <div className="noir-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                  Institutional Payment & Settlement Ledger
                </h3>
                <p style={{ fontSize: 13, color: '#64748B' }}>
                  Audited sales receipts, student wallet top-ups, cafeteria POS, and tuition payments
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <select
                  value={txMethodFilter}
                  onChange={(e) => setTxMethodFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 150, fontSize: 13 }}
                >
                  <option value="ALL">All Methods</option>
                  <option value="CAMPUS_WALLET">Campus Wallet</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Debit/Credit Card</option>
                </select>

                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value)}
                  className="input-field"
                  style={{ width: 140, fontSize: 13 }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REFUNDED">Refunded</option>
                  <option value="PENDING">Pending</option>
                </select>

                <button
                  onClick={() => {
                    const headers = ['Tx ID', 'Title', 'Category', 'Amount (INR)', 'Type', 'Timestamp', 'Reference Code'];
                    const rows: (string | number)[][] = transactions.map((t) => [
                      t.id,
                      t.title || t.merchantName || 'Campus POS',
                      t.category,
                      t.amount,
                      t.type,
                      t.timestamp,
                      t.referenceId || t.receiptId || 'N/A'
                    ]);
                    exportCSV('Campus_Financial_Reconciliation_Ledger.csv', headers, rows);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: 6 }}
                >
                  <Download size={14} /> Export Settlement CSV
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', backgroundColor: '#F8FAFC' }}>
                    <th style={{ padding: '12px 14px' }}>REFERENCE</th>
                    <th style={{ padding: '12px 14px' }}>TRANSACTION / MERCHANT</th>
                    <th style={{ padding: '12px 14px' }}>CATEGORY</th>
                    <th style={{ padding: '12px 14px' }}>AMOUNT</th>
                    <th style={{ padding: '12px 14px' }}>TIMESTAMP</th>
                    <th style={{ padding: '12px 14px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter((t) => {
                      const matchesStatus = txStatusFilter === 'ALL' || t.status === txStatusFilter || (txStatusFilter === 'COMPLETED' && !t.status);
                      return matchesStatus;
                    })
                    .map((t) => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#0284C7', fontWeight: 700 }}>
                          {t.referenceId || t.id}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0F172A' }}>{t.title}</td>
                        <td style={{ padding: '12px 14px' }}><span className="badge badge-neutral">{t.category}</span></td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: t.type === 'CREDIT' ? '#059669' : '#0F172A' }}>
                          {t.type === 'CREDIT' ? '+' : '-'}₹{t.amount}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{t.timestamp}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="badge badge-success">✓ COMPLETED</span>
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
      {/* TAB 9: HELPDESK TICKETS (Req 3.9) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-complaints' && (
        <div className="noir-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                Campus Grievance & Technical Redressal Desk
              </h3>
              <p style={{ fontSize: 13, color: '#64748B' }}>
                Assign technicians, track status, add resolution notes, and maintain audit records
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <select
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
                className="input-field"
                style={{ width: 160, fontSize: 13 }}
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {complaints
              .filter((c) => ticketStatusFilter === 'ALL' || c.status === ticketStatusFilter)
              .map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 18,
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    gap: 16
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-primary">{c.category}</span>
                      <strong style={{ fontSize: 15, color: '#0F172A' }}>{c.ticketNo}</strong>
                      <span style={{ fontSize: 12, color: '#64748B' }}>Reported by {c.userName} ({c.userRole})</span>
                    </div>
                    <div style={{ fontSize: 14, color: '#334155', marginTop: 4 }}>{c.description}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                      Assigned to: <strong style={{ color: '#0F172A' }}>{c.assignedPerson || 'Unassigned'}</strong> • Priority: <strong style={{ color: c.priority === 'HIGH' ? '#DC2626' : '#D97706' }}>{c.priority}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      className={`badge ${
                        c.status === 'RESOLVED'
                          ? 'badge-success'
                          : c.status === 'IN_PROGRESS'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {c.status}
                    </span>
                    <button
                      onClick={() => {
                        setResolvingTicket(c);
                        setResolutionStatus(c.status);
                        setResolutionAssignee(c.assignedPerson || '');
                        setResolutionNote('');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontWeight: 700 }}
                    >
                      Update / Resolve
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: AUDIT LOGS */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-audit' && (
        <div className="noir-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>
                Institutional Security & Biometric Audit Trail
              </h3>
              <p style={{ fontSize: 13, color: '#64748B' }}>
                Tamper-resistant administrative and security ledger recording all critical changes
              </p>
            </div>
            <button
              onClick={() => {
                const headers = ['Log ID', 'User', 'Role', 'Action', 'Target', 'Timestamp', 'Result'];
                const rows = auditLogs.map((l) => [l.id, l.user, l.role, l.action, l.target, l.timestamp, l.result]);
                exportCSV('Institutional_Security_Audit_Logs.csv', headers, rows);
              }}
              className="btn btn-secondary btn-sm"
              style={{ gap: 6 }}
            >
              <Download size={14} /> Export Audit Log (.csv)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: 10,
                  fontSize: 13
                }}
              >
                <div>
                  <strong style={{ color: '#0F172A' }}>{log.user}</strong> ({log.role}) • <span style={{ color: '#0284C7', fontWeight: 700 }}>{log.action}</span>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{log.target}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success">{log.result}</span>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 11: ACCREDITATION & ANALYTICS REPORTS (Req 3.10) */}
      {/* ======================================================== */}
      {currentTab === 'mgmt-reports' && (
        <div className="noir-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A' }}>
              Institutional Analytics & NAAC/NIRF Report Generator
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
              Generate official datasets across attendance, academics, commerce, library, and facilities
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                gap: 14
              }}
            >
              <div>
                <strong style={{ fontSize: 15, color: '#0F172A' }}>NAAC Criterion II: Teaching-Learning and Evaluation</strong>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Student:Faculty ratio, biometric classroom attendance rates, LMS assignment completion metrics
                </div>
              </div>
              <button
                onClick={() => {
                  const headers = ['Criterion', 'Metric', 'Current Term Value', 'Council Standard', 'Status'];
                  const rows = [
                    ['II.1', 'Student Enrollment Percentage', '98.4%', '90.0%', 'Compliant'],
                    ['II.2', 'Student to Full-Time Faculty Ratio', '23:1', '25:1', 'Optimal'],
                    ['II.3', 'Biometric Verified Attendance', '89.4%', '75.0%', 'Compliant'],
                    ['II.4', 'LMS Assignment Completion Rate', '91.2%', '80.0%', 'Compliant']
                  ];
                  exportCSV('NAAC_Criterion_II_Teaching_Learning.csv', headers, rows);
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: 6, fontWeight: 800 }}
              >
                <Download size={14} /> Download Dataset (.csv)
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                gap: 14
              }}
            >
              <div>
                <strong style={{ fontSize: 15, color: '#0F172A' }}>NIRF 2026 Annual Comprehensive Dataset</strong>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Total enrolled strength, graduate placements, terminal hardware count, capital expenditure
                </div>
              </div>
              <button
                onClick={() => {
                  const headers = ['Parameter', 'Approved Intake', 'Actual Enrollment', 'Placement %', 'Median Salary (LPA)'];
                  const rows = [
                    ['Undergraduate (4-year B.Tech)', '600', '594', '94.2%', '14.8'],
                    ['Postgraduate (2-year M.Tech / MBA)', '240', '236', '91.8%', '16.5'],
                    ['Doctoral Research Scholars', '80', '78', '100%', 'N/A']
                  ];
                  exportCSV('NIRF_2026_Institutional_Dataset.csv', headers, rows);
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: 6, fontWeight: 800 }}
              >
                <Download size={14} /> Download Dataset (.csv)
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                gap: 14
              }}
            >
              <div>
                <strong style={{ fontSize: 15, color: '#0F172A' }}>Campus Infrastructure & Resident Hall Capacity Audit</strong>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Detailed room allocation, hostel block occupancy percentages, and facility operational status
                </div>
              </div>
              <button
                onClick={() => {
                  const headers = ['Facility Name', 'Category', 'Location', 'Capacity', 'Current Occupancy', 'Occupancy Rate', 'Status'];
                  const rows = facilities.map((f) => [
                    f.name,
                    f.type,
                    f.building,
                    f.capacity,
                    f.currentOccupancy,
                    `${Math.round((f.currentOccupancy / f.capacity) * 100)}%`,
                    f.status
                  ]);
                  exportCSV('Campus_Facilities_Occupancy_Audit.csv', headers, rows);
                }}
                className="btn btn-primary btn-sm"
                style={{ gap: 6, fontWeight: 800 }}
              >
                <Download size={14} /> Download Dataset (.csv)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: REGISTER PALM TERMINAL (Req 3.5 & 5.1) */}
      {/* ======================================================== */}
      {showRegisterTerminalModal && (
        <div className="modal-backdrop" onClick={() => setShowRegisterTerminalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Register New Palm Terminal</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>Add a physical optical palm scanner to Pehchaan infrastructure</p>
              </div>
              <button onClick={() => setShowRegisterTerminalModal(false)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterTerminal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Terminal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block C Seminar Hall Entrance Kiosk"
                  className="input-field"
                  value={newTermName}
                  onChange={(e) => setNewTermName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Terminal Code / Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PLM-C201"
                    className="input-field"
                    value={newTermCode}
                    onChange={(e) => setNewTermCode(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Room Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. C201"
                    className="input-field"
                    value={newTermRoom}
                    onChange={(e) => setNewTermRoom(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Building
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTermBuilding}
                    onChange={(e) => setNewTermBuilding(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Hardware Scanner ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NEX-PLM-V3-SN8902"
                    className="input-field"
                    value={newTermScannerId}
                    onChange={(e) => setNewTermScannerId(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Associated Department
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTermDept}
                    onChange={(e) => setNewTermDept(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Terminal Function Type
                  </label>
                  <select
                    className="input-field"
                    value={newTermType}
                    onChange={(e) => setNewTermType(e.target.value as any)}
                  >
                    <option value="CLASSROOM">Classroom / Hall</option>
                    <option value="GATE">Campus Gate</option>
                    <option value="LIBRARY">Central Library Turnstile</option>
                    <option value="SHOP">Canteen / POS Terminal</option>
                    <option value="EVENT">Auditorium / Event</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowRegisterTerminalModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Confirm Terminal Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TERMINAL BREAKDOWN & MAINTENANCE (Req 5.2) */}
      {/* ======================================================== */}
      {maintenanceModalTerm && (
        <div className="modal-backdrop" onClick={() => setMaintenanceModalTerm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={18} /> Log Terminal Breakdown & Maintenance
                </h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>
                  {maintenanceModalTerm.locationName} ({maintenanceModalTerm.terminalCode})
                </p>
              </div>
              <button onClick={() => setMaintenanceModalTerm(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLogMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Reported Issue / Reason *
                </label>
                <select
                  className="input-field"
                  value={maintReason}
                  onChange={(e) => setMaintReason(e.target.value)}
                >
                  <option value="Optical Sensor Recalibration">Optical Sensor Recalibration</option>
                  <option value="Ethernet Cable / Network Timeout">Ethernet Cable / Network Timeout</option>
                  <option value="Touch Display & Biometric Glare">Touch Display & Biometric Glare</option>
                  <option value="Firmware Update In Progress">Firmware Update In Progress</option>
                  <option value="Power Supply Surge Anomaly">Power Supply Surge Anomaly</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Assigned Hardware Technician *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={maintTechnician}
                  onChange={(e) => setMaintTechnician(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Expected Restoration Date *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={maintRestorationDate}
                  onChange={(e) => setMaintRestorationDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setMaintenanceModalTerm(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" style={{ fontWeight: 800 }}>
                  Mark Under Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DELETE TERMINAL CONFIRMATION (Req 5.1) */}
      {/* ======================================================== */}
      {deletingTerminalId && (
        <div className="modal-backdrop" onClick={() => setDeletingTerminalId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#DC2626', marginBottom: 8 }}>Deactivate Palm Terminal?</h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
              This will safely deactivate the terminal from the live biometric network. Historical attendance sessions recorded through this device will remain permanently intact.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setDeletingTerminalId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  removeTerminal(deletingTerminalId);
                  setDeletingTerminalId(null);
                }}
                className="btn btn-danger"
                style={{ fontWeight: 800 }}
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ATTENDANCE ADMINISTRATIVE CORRECTION (Req 3.3) */}
      {/* ======================================================== */}
      {correctionModalRecord && (
        <div className="modal-backdrop" onClick={() => setCorrectionModalRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Administrative Attendance Correction</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>
                  {correctionModalRecord.courseCode} ({correctionModalRecord.date}) • {correctionModalRecord.room}
                </p>
              </div>
              <button onClick={() => setCorrectionModalRecord(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  New Verified Attendance Status *
                </label>
                <select
                  className="input-field"
                  value={correctionStatus}
                  onChange={(e) => setCorrectionStatus(e.target.value as any)}
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="EXCUSED">EXCUSED (Medical / On-Duty)</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Institutional Reason / Council Reference *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g., Dean approval letter for Inter-University Hackathon delegation (Ref: DEAN-2026-88)"
                  className="input-field"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setCorrectionModalRecord(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Apply & Record Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: ADD CAMPUS FACILITY (Req 3.6) */}
      {/* ======================================================== */}
      {showAddFacilityModal && (
        <div className="modal-backdrop" onClick={() => setShowAddFacilityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Add Campus Facility or Resident Hall</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>Register building capacity and assign management warden</p>
              </div>
              <button onClick={() => setShowAddFacilityModal(false)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFacilitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hostel Block D (International Scholars)"
                  className="input-field"
                  value={newFacName}
                  onChange={(e) => setNewFacName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Facility Type
                  </label>
                  <select
                    className="input-field"
                    value={newFacType}
                    onChange={(e) => setNewFacType(e.target.value as any)}
                  >
                    <option value="HOSTEL">Hostel & Dormitory</option>
                    <option value="ACADEMIC">Academic Complex</option>
                    <option value="DINING">Dining Hall / Food Court</option>
                    <option value="ATHLETICS">Athletics / Gym</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Building / Campus Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. South Campus"
                    className="input-field"
                    value={newFacBuilding}
                    onChange={(e) => setNewFacBuilding(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Total Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    value={newFacCapacity}
                    onChange={(e) => setNewFacCapacity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Initial Occupancy
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={newFacOccupancy}
                    onChange={(e) => setNewFacOccupancy(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Warden / Manager Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Venkatraman"
                    className="input-field"
                    value={newFacManager}
                    onChange={(e) => setNewFacManager(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    className="input-field"
                    value={newFacContact}
                    onChange={(e) => setNewFacContact(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowAddFacilityModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Save Facility to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 6: ISSUE LIBRARY BOOK (Req 3.7) */}
      {/* ======================================================== */}
      {showIssueBookModal && (
        <div className="modal-backdrop" onClick={() => setShowIssueBookModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Issue Central Library Book</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>Assign book copy to authenticated student or faculty</p>
              </div>
              <button onClick={() => setShowIssueBookModal(false)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueBookSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Select Book Title *
                </label>
                <select
                  className="input-field"
                  value={issueSelectedBookId}
                  onChange={(e) => setIssueSelectedBookId(e.target.value)}
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Borrower Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRANAV"
                  className="input-field"
                  value={issueStudentName}
                  onChange={(e) => setIssueStudentName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Borrower Registration ID / Roll *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NR-2026-8891"
                  className="input-field"
                  value={issueStudentId}
                  onChange={(e) => setIssueStudentId(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="input-field"
                  value={issueDays}
                  onChange={(e) => setIssueDays(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowIssueBookModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Confirm Book Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 7: RESOLVE HELPDESK TICKET (Req 3.9) */}
      {/* ======================================================== */}
      {resolvingTicket && (
        <div className="modal-backdrop" onClick={() => setResolvingTicket(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Resolve Helpdesk Ticket</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>
                  {resolvingTicket.ticketNo} • {resolvingTicket.category}
                </p>
              </div>
              <button onClick={() => setResolvingTicket(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 12, backgroundColor: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 14, fontSize: 13 }}>
              <strong>Issue:</strong> {resolvingTicket.description}
            </div>

            <form onSubmit={handleTicketResolutionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Update Ticket Status *
                </label>
                <select
                  className="input-field"
                  value={resolutionStatus}
                  onChange={(e) => setResolutionStatus(e.target.value as any)}
                >
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Assigned Staff / Technician
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh (Electrical Dept)"
                  className="input-field"
                  value={resolutionAssignee}
                  onChange={(e) => setResolutionAssignee(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Resolution Notes & Remediation Audit
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe resolution steps taken or cause of delay..."
                  className="input-field"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setResolvingTicket(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Save Ticket Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
