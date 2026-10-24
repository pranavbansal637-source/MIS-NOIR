import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  User,
  Role,
  StudentProfile,
  SubjectAttendance,
  EventItem,
  ProductItem,
  CampusOrder,
  WalletTransaction,
  DocumentItem,
  LibraryBook,
  ComplaintTicket,
  TerminalDevice,
  AuditLogItem,
  AiChatMessage,
  MedicalRecord,
  FeeItem,
  HostelDetails,
  TransportRoute,
  PlacementDrive,
  ExamGrade,
  LostFoundItem,
  CampusPoll,
  PosPaymentRequest,
  FacultyMember,
  AssignmentItem,
  AppNotification,
  LiveAttendanceSession,
  AttendanceSessionRecord,
  TimetableEntry,
  ShopOffer,
  StockMovementRecord,
  ShopProfile,
  LibraryIssueRecord,
  FacilityRecord
} from '../types';
import {
  INITIAL_USER,
  INITIAL_STUDENT_PROFILE,
  MOCK_SUBJECTS_ATTENDANCE,
  MOCK_EVENTS,
  MOCK_PRODUCTS,
  MOCK_TRANSACTIONS,
  MOCK_DOCUMENTS,
  MOCK_BOOKS,
  MOCK_COMPLAINTS,
  MOCK_TERMINALS,
  MOCK_AUDIT_LOGS,
  MOCK_MEDICAL_RECORD,
  MOCK_FEE_ITEMS,
  MOCK_HOSTEL_DETAILS,
  MOCK_TRANSPORT_ROUTE,
  MOCK_PLACEMENT_DRIVES,
  MOCK_EXAM_GRADES,
  MOCK_LOST_FOUND,
  MOCK_CAMPUS_POLLS,
  MOCK_FACULTY_LIST,
  MOCK_ASSIGNMENTS,
  INITIAL_CAMPUS_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LIVE_ATTENDANCE_SESSION,
  MOCK_ATTENDANCE_HISTORY,
  MOCK_STUDENT_TIMETABLE,
  INITIAL_SHOP_OFFERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_SHOP_PROFILE,
  INITIAL_LIBRARY_ISSUES,
  INITIAL_FACILITIES
} from '../data/mockData';
import { PaymentService, type PaymentRequest, type PaymentResult } from '../services/PaymentService';
import { DocumentService } from '../services/DocumentService';
import { AiService } from '../services/AiService';
import confetti from 'canvas-confetti';

export type ModalType =
  | 'PALM_SCAN'
  | 'AI_ASSISTANT'
  | 'COMMAND_CENTER'
  | 'EMERGENCY'
  | 'PRIVACY'
  | 'RECEIPT'
  | 'DOCUMENT_SHARE'
  | 'DOCUMENT_PREVIEW'
  | 'NOTIFICATIONS'
  | 'TOPUP'
  | 'AUTH_MODAL'
  | 'PAY_FEE'
  | 'CREATE_ASSIGNMENT'
  | 'EDIT_PRODUCT'
  | 'ADD_OFFER'
  | 'ISSUE_BOOK'
  | 'MAINTENANCE_TERMINAL'
  | 'REGISTER_TERMINAL_DETAILED'
  | 'INTERFACE_GATE'
  | null;

export interface RoleSecurityConfig {
  role: Role;
  title: string;
  tagline: string;
  authorizedUser: string;
  authorizedId: string;
  demoPin: string;
  pinLabel: string;
  themeColor: string;
  iconName: string;
  protectedDataTitle: string;
  confidentialItems: string[];
}

export const ROLE_SECURITY_REGISTRY: Record<Role, RoleSecurityConfig> = {
  STUDENT: {
    role: 'STUDENT',
    title: 'NEXORA Student OS',
    tagline: 'Personal Digital Campus Workspace',
    authorizedUser: 'Pranav Bansal (Roll #22BCS10892)',
    authorizedId: 'NR-2026-8891',
    demoPin: '1111',
    pinLabel: 'Student Passcode (PIN: 1111)',
    themeColor: '#2563EB',
    iconName: 'Smartphone',
    protectedDataTitle: 'Confidential Student Profile & Assets',
    confidentialItems: [
      'Personal Academic Grades & Semester CGPA Dossier',
      'Campus Digital Wallet Balance (₹450) & Private Ledger',
      'Confidential Medical Dossier, Blood Group & Prescription History',
      'Encrypted Personal Document Vault & Academic Transcripts'
    ]
  },
  FACULTY: {
    role: 'FACULTY',
    title: 'Faculty Instructor OS',
    tagline: 'Academic Evaluation & Classroom Authority',
    authorizedUser: 'Prof. Vikram Malhotra (CSE Faculty)',
    authorizedId: 'FAC-CS-403',
    demoPin: '4403',
    pinLabel: 'Faculty Passcode (PIN: 4403)',
    themeColor: '#D97706',
    iconName: 'GraduationCap',
    protectedDataTitle: 'Restricted Faculty & Evaluation Data',
    confidentialItems: [
      'Class Grading Master Sheet & Examination Score Submissions',
      'Student Disciplinary Records & Academic Attendance Overrides',
      'Active Course Roster, Syllabus Materials & Assignment Keys',
      'Classroom Live Attendance Broadcast Control Beacon'
    ]
  },
  BUSINESS: {
    role: 'BUSINESS',
    title: 'Shopkeeper & Merchant POS OS',
    tagline: 'Commercial Canteen Register & Stock Control',
    authorizedUser: 'Ramesh Kumar (Canteen Store Manager)',
    authorizedId: 'SHP-CANTEEN-01',
    demoPin: '8821',
    pinLabel: 'Merchant Key (PIN: 8821)',
    themeColor: '#059669',
    iconName: 'Store',
    protectedDataTitle: 'Commercial POS & Cash Vault Data',
    confidentialItems: [
      'Daily Merchant POS Cash Register & Revenue Ledgers',
      'Canteen Inventory Movement & Stock Reorder Telemetry',
      'Live Palm Biometric Charge Approvals & Customer Receipts',
      'Merchant Settlement Account & Commercial Withdrawal Ledger'
    ]
  },
  MANAGEMENT: {
    role: 'MANAGEMENT',
    title: 'University Management & Governance',
    tagline: 'Institutional Administration & NAAC Telemetry',
    authorizedUser: 'Dr. Aris Thorne (Registrar & Dean)',
    authorizedId: 'ADM-REG-001',
    demoPin: '9900',
    pinLabel: 'Admin Master Passkey (PIN: 9900)',
    themeColor: '#7C3AED',
    iconName: 'Building2',
    protectedDataTitle: 'University Institutional & Security Data',
    confidentialItems: [
      'University Revenue Ledger & Institutional Tuition Analytics',
      'Central Student & Staff Master Encrypted Registry',
      'Campus-wide Palm Biometric Terminal Network Controls',
      'Cryptographic RBAC Security Audit Trail & Telemetry'
    ]
  },
  KIOSK: {
    role: 'KIOSK',
    title: 'Touch Terminal Hardware Kiosk',
    tagline: 'Physical Optical Biometric Hardware Terminal',
    authorizedUser: 'Terminal Node 04 Operator',
    authorizedId: 'NODE-SEC-TERM-04',
    demoPin: '1234',
    pinLabel: 'Terminal Operator Lock (PIN: 1234)',
    themeColor: '#EA580C',
    iconName: 'Hand',
    protectedDataTitle: 'Physical Biometric Node Calibration',
    confidentialItems: [
      'Physical Optical Palm Vein Hardware Telemetry & Sensor Calibration',
      'Campus Turnstile Gate Lock State Controller',
      'SOS Campus Security Hardware Alarm Overrides'
    ]
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'NEXORA Root Master Admin',
    tagline: 'Full System Root Oversight & Infrastructure',
    authorizedUser: 'Root Security Controller',
    authorizedId: 'SYS-ROOT-000',
    demoPin: '9900',
    pinLabel: 'Root Master Key (PIN: 9900)',
    themeColor: '#DC2626',
    iconName: 'ShieldAlert',
    protectedDataTitle: 'Full Institutional Core Infrastructure',
    confidentialItems: [
      'System-wide Root Cryptographic Key Vault',
      'Database Schema Migration & Hardware Registry',
      'Master Override Authority on all Campus Terminals'
    ]
  },
  DEPARTMENT_ADMIN: {
    role: 'DEPARTMENT_ADMIN',
    title: 'Department Head Console',
    tagline: 'Academic Department Operations',
    authorizedUser: 'Dr. Neha Sharma (HOD CS)',
    authorizedId: 'HOD-CS-002',
    demoPin: '9900',
    pinLabel: 'HOD Key (PIN: 9900)',
    themeColor: '#2563EB',
    iconName: 'Building2',
    protectedDataTitle: 'Department Operational Data',
    confidentialItems: ['Faculty Teaching Loads', 'Department Budget Ledger']
  },
  CLUB_ADMIN: {
    role: 'CLUB_ADMIN',
    title: 'Student Society Console',
    tagline: 'Campus Activities Governance',
    authorizedUser: 'Aanya Verma (Council President)',
    authorizedId: 'NR-2026-CLUB-01',
    demoPin: '1111',
    pinLabel: 'PIN: 1111',
    themeColor: '#F59E0B',
    iconName: 'Users',
    protectedDataTitle: 'Club Activity Data',
    confidentialItems: ['Event Budgets', 'Society Approvals']
  },
  LIBRARY_STAFF: {
    role: 'LIBRARY_STAFF',
    title: 'Library Circulation Desk',
    tagline: 'Book Inventory & Issue Console',
    authorizedUser: 'Sunil Mathur (Librarian)',
    authorizedId: 'LIB-CIRC-09',
    demoPin: '9900',
    pinLabel: 'Staff PIN: 9900',
    themeColor: '#0284C7',
    iconName: 'BookOpen',
    protectedDataTitle: 'Circulation Data',
    confidentialItems: ['Overdue Fine Registry', 'Restricted Archives']
  },
  HOSTEL_ADMIN: {
    role: 'HOSTEL_ADMIN',
    title: 'Hostel Warden Console',
    tagline: 'Residential Clearance & Curfew Control',
    authorizedUser: 'Col. R. S. Rathore (Chief Warden)',
    authorizedId: 'WARDEN-RES-01',
    demoPin: '9900',
    pinLabel: 'Warden PIN: 9900',
    themeColor: '#B45309',
    iconName: 'Building2',
    protectedDataTitle: 'Residential Data',
    confidentialItems: ['Night Outing Gate Passes', 'Hostel Disciplinary Ledger']
  },
  SECURITY: {
    role: 'SECURITY',
    title: 'Campus Perimeter Security Console',
    tagline: 'Turnstile & Biometric Gate Watch',
    authorizedUser: 'Inspector Daljit Singh',
    authorizedId: 'SEC-GATE-01',
    demoPin: '9900',
    pinLabel: 'Security PIN: 9900',
    themeColor: '#EF4444',
    iconName: 'ShieldAlert',
    protectedDataTitle: 'Turnstile Telemetry',
    confidentialItems: ['Campus Gate Entry Logs', 'Blacklisted Badges']
  }
};

export const ROLE_PERSONAS: Record<Role, User> = {
  STUDENT: {
    id: 'usr-001',
    name: 'PRANAV',
    email: 'pranav.student@nexora.edu',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'School of Business',
    noirId: 'NR-2026-8891',
    phone: '+91 98765 43210',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_PRANAV_99812'
  },
  FACULTY: {
    id: 'fac-01',
    name: 'Prof. Vikram Malhotra',
    email: 'v.malhotra@nexora.edu',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    noirId: 'FAC-CS-403',
    phone: '+91 98112 34567',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_FACULTY_MALHOTRA_4403'
  },
  BUSINESS: {
    id: 'biz-01',
    name: 'Ramesh Kumar (Canteen POS)',
    email: 'canteen.pos@nexora.edu',
    role: 'BUSINESS',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Campus Commerce & Food Court POS',
    noirId: 'SHP-CANTEEN-01',
    phone: '+91 98223 45678',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_MERCHANT_RAMESH_8821'
  },
  MANAGEMENT: {
    id: 'mgmt-01',
    name: 'Dr. Aris Thorne (Registrar & Dean)',
    email: 'registrar@nexora.edu',
    role: 'MANAGEMENT',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'University Academic Governance & Registry',
    noirId: 'ADM-REG-001',
    phone: '+91 98334 56789',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_ADMIN_THORNE_9900'
  },
  KIOSK: {
    id: 'kiosk-01',
    name: 'Terminal Node 04 (Touch Station)',
    email: 'terminal.04@nexora.edu',
    role: 'KIOSK',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    department: 'Hardware Terminal Infrastructure',
    noirId: 'NODE-SEC-TERM-04',
    phone: 'Ext: 404',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_KIOSK_NODE04_1234'
  },
  SUPER_ADMIN: {
    id: 'admin-root',
    name: 'Root Administrator',
    email: 'root.admin@nexora.edu',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    department: 'Central Cyber Infrastructure & Security',
    noirId: 'SYS-ROOT-000',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_ROOT_MASTER_9900'
  },
  DEPARTMENT_ADMIN: {
    id: 'dept-01',
    name: 'Dr. Neha Sharma',
    email: 'hod.cs@nexora.edu',
    role: 'DEPARTMENT_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    noirId: 'HOD-CS-002',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_HOD_SHARMA_9900'
  },
  CLUB_ADMIN: {
    id: 'club-01',
    name: 'Aanya Verma',
    email: 'council.lead@nexora.edu',
    role: 'CLUB_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Student Affairs & Societies',
    noirId: 'NR-2026-CLUB-01',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_CLUB_AANYA_1111'
  },
  LIBRARY_STAFF: {
    id: 'lib-01',
    name: 'Sunil Mathur',
    email: 'librarian@nexora.edu',
    role: 'LIBRARY_STAFF',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    department: 'Central University Library',
    noirId: 'LIB-CIRC-09',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_LIB_MATHUR_9900'
  },
  HOSTEL_ADMIN: {
    id: 'hostel-01',
    name: 'Col. R. S. Rathore',
    email: 'warden@nexora.edu',
    role: 'HOSTEL_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Campus Residential & Hostels',
    noirId: 'WARDEN-RES-01',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_WARDEN_RATHORE_9900'
  },
  SECURITY: {
    id: 'sec-01',
    name: 'Inspector Daljit Singh',
    email: 'security.lead@nexora.edu',
    role: 'SECURITY',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department: 'Campus Security',
    noirId: 'SEC-GATE-01',
    palmEnrolled: true,
    palmHash: 'PALM_HASH_SEC_DALJIT_9900'
  }
};

interface AppContextType {
  // Authentication & Profile
  isAuthenticated: boolean;
  user: User;
  student: StudentProfile;
  role: Role;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (t: 'light' | 'dark') => void;

  // Session Security & Role Gate
  isSessionLocked: boolean;
  lockSession: () => void;
  unlockSession: () => void;
  requestRoleSwitch: (targetRole: Role) => void;
  verifyAndUnlockRole: (targetRole: Role, pin: string, palmResult: any) => { success: boolean; error?: string };

  // Academic & Core Modules
  subjects: SubjectAttendance[];
  events: EventItem[];
  products: ProductItem[];
  orders: CampusOrder[];
  transactions: WalletTransaction[];
  documents: DocumentItem[];
  books: LibraryBook[];
  complaints: ComplaintTicket[];
  terminals: TerminalDevice[];
  auditLogs: AuditLogItem[];
  aiMessages: AiChatMessage[];
  cart: { product: ProductItem; quantity: number }[];
  activeModal: ModalType;
  selectedReceipt: WalletTransaction | null;
  selectedDocForShare: DocumentItem | null;
  selectedDocForPreview: DocumentItem | null;
  selectedFeeForPay: FeeItem | null;
  demoNotification: string | null;
  pendingRoleTarget: Role | null;

  // Real Notifications (Module 1.7)
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Live Attendance Session (Module 1.2 & 4.2)
  liveAttendanceSession: LiveAttendanceSession;
  startLiveAttendanceSession: (courseCode: string, courseName: string, room: string) => void;
  closeLiveAttendanceSession: () => void;

  // Detailed Attendance Records (Module 1.4 & 3.3)
  attendanceRecords: AttendanceSessionRecord[];
  correctAttendanceRecord: (recId: string, newStatus: AttendanceSessionRecord['status'], reason: string) => void;

  // Timetable (Module 1.9)
  studentTimetable: TimetableEntry[];

  // Real Faculty & Classroom State (Module 4)
  facultyList: FacultyMember[];
  activeFaculty: FacultyMember;
  setActiveFacultyId: (id: string) => void;
  assignments: AssignmentItem[];
  gradeAssignmentSubmission: (asgId: string, studentId: string, marks: number, grade: string) => void;
  createAssignment: (asg: Omit<AssignmentItem, 'id' | 'submissions' | 'totalSubmissions'>) => void;

  // Profile Management (Module 1.8)
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;

  // Real Shop Management (Module 2)
  shopProfile: ShopProfile;
  updateShopProfile: (profile: Partial<ShopProfile>) => void;
  shopOffers: ShopOffer[];
  addShopOffer: (offer: Omit<ShopOffer, 'id'>) => void;
  toggleShopOffer: (offerId: string) => void;
  stockMovements: StockMovementRecord[];
  updateOrderStatus: (orderId: string, status: CampusOrder['status']) => void;
  addProduct: (product: Omit<ProductItem, 'id'>) => void;
  updateProduct: (productId: string, updated: Partial<ProductItem>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // Facilities Management (Module 3.6)
  facilities: FacilityRecord[];
  addFacility: (fac: Omit<FacilityRecord, 'id'>) => void;
  updateFacility: (id: string, updated: Partial<FacilityRecord>) => void;

  // Library Management (Module 3.7)
  libraryIssues: LibraryIssueRecord[];
  issueLibraryBook: (bookId: string, studentId: string, studentName: string, days?: number) => void;
  returnLibraryBook: (issueId: string) => void;
  payLibraryFine: (issueId: string) => void;

  // Terminal & Pehchaan Operations (Module 3.5 & 5)
  registerDetailedTerminal: (term: Omit<TerminalDevice, 'id' | 'lastPing' | 'firmwareVersion' | 'ipAddress' | 'macAddress' | 'maintenanceHistory'>) => { success: boolean; message: string };
  markTerminalMaintenance: (terminalId: string, reason: string, technician: string, expectedRestorationDate: string) => void;
  restoreTerminalFromMaintenance: (terminalId: string, notes: string) => void;
  removeTerminal: (terminalId: string) => void;

  // Ticket Management (Module 3.9)
  updateTicketStatus: (ticketId: string, status: ComplaintTicket['status'], note?: string, assignee?: string) => void;

  // Medical, Fees, Transport, Hostels, Polls
  medicalRecord: MedicalRecord;
  feeItems: FeeItem[];
  hostelDetails: HostelDetails;
  transportRoute: TransportRoute;
  placementDrives: PlacementDrive[];
  examGrades: ExamGrade[];
  lostFoundItems: LostFoundItem[];
  campusPolls: CampusPoll[];

  activePosPaymentRequest: PosPaymentRequest | null;
  activeTerminalLocation: string;
  activeTerminalType: 'CLASSROOM' | 'SHOP' | 'LIBRARY' | 'EVENT' | 'GATE';

  // Actions
  loginWithPalm: () => void;
  loginWithCredentials: (id: string) => void;
  logout: () => void;
  switchRole: (newRole: Role) => void;
  requestRoleSwitchWithPalm: (targetRole: Role) => void;
  cancelRoleSwitch: () => void;
  setModal: (modal: ModalType) => void;
  openReceiptModal: (tx: WalletTransaction) => void;
  openShareModal: (doc: DocumentItem) => void;
  openDocPreview: (doc: DocumentItem) => void;
  downloadDoc: (doc: DocumentItem) => void;
  openPayFeeModal: (fee: FeeItem) => void;
  recordPalmAttendance: (subjectName?: string) => { success: boolean; message: string };
  registerForEvent: (eventId: string) => Promise<boolean>;
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutCart: () => Promise<boolean>;
  topupWallet: (amount: number) => void;
  processGatewayTopup: (amount: number, method: 'UPI' | 'CARD' | 'NETBANKING', details: any) => Promise<PaymentResult>;
  payFeeItem: (feeId: string, amount: number) => Promise<boolean>;
  generateShareLink: (docId: string, recipient: string, durationMinutes: number) => string;
  submitComplaint: (category: ComplaintTicket['category'], description: string, priority: ComplaintTicket['priority']) => void;
  applyGatePass: (reason: string) => void;
  applyPlacementDrive: (driveId: string) => void;
  votePollOption: (pollId: string, optionIndex: number) => void;
  reportLostItem: (title: string, location: string, category: LostFoundItem['category']) => void;
  toggleTerminalStatus: (terminalId: string) => void;
  registerNewTerminal: (locationName: string, roomNumber: string, type: TerminalDevice['type']) => void;
  createPosPaymentRequest: (shopName: string, amount: number, itemsSummary: string) => void;
  approvePosPaymentRequest: () => Promise<boolean>;
  setActiveTerminalConfig: (location: string, type: 'CLASSROOM' | 'SHOP' | 'LIBRARY' | 'EVENT' | 'GATE') => void;
  sendAiMessage: (prompt: string) => Promise<void>;
  confirmAiPayment: (details: Record<string, any>) => Promise<void>;
  reserveBook: (bookId: string) => void;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const loadSavedStudent = (): StudentProfile => {
  try {
    const s = localStorage.getItem('noir_student_profile');
    if (s) return JSON.parse(s);
  } catch {}
  return INITIAL_STUDENT_PROFILE;
};

const loadSavedUser = (): User => {
  try {
    const u = localStorage.getItem('noir_user_profile');
    if (u) return JSON.parse(u);
  } catch {}
  return INITIAL_USER;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<User>(loadSavedUser);
  const [student, setStudent] = useState<StudentProfile>(loadSavedStudent);
  const [role, setRole] = useState<Role>('STUDENT');

  // Theme Management (Light & Dark Mode)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('noir_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('noir_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setThemeState(next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  // Academic & Core Modules
  const [subjects, setSubjects] = useState<SubjectAttendance[]>(MOCK_SUBJECTS_ATTENDANCE);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<CampusOrder[]>(INITIAL_CAMPUS_ORDERS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_TRANSACTIONS);
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [books, setBooks] = useState<LibraryBook[]>(MOCK_BOOKS);
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(MOCK_COMPLAINTS);
  const [terminals, setTerminals] = useState<TerminalDevice[]>(MOCK_TERMINALS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);

  // Notifications State (Module 1.7)
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('noir_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem('noir_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem('noir_notifications', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('All notifications marked as read.');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newN: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  // Live Attendance Session State (Module 1.2 & 4.2)
  const [liveAttendanceSession, setLiveAttendanceSession] = useState<LiveAttendanceSession>(INITIAL_LIVE_ATTENDANCE_SESSION);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceSessionRecord[]>(MOCK_ATTENDANCE_HISTORY);

  const startLiveAttendanceSession = (courseCode: string, courseName: string, room: string) => {
    const session: LiveAttendanceSession = {
      id: `sess-${Date.now()}`,
      courseCode,
      courseName,
      facultyId: activeFaculty.id,
      facultyName: activeFaculty.name,
      room,
      building: 'Academic Block A',
      status: 'LIVE',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: 'Scheduled class period (1 hr)',
      recordedStudentIds: []
    };
    setLiveAttendanceSession(session);
    addNotification({
      title: `Live Attendance Started: ${courseName}`,
      message: `${activeFaculty.name} has opened biometric check-in for ${courseCode} in Room ${room}.`,
      category: 'ATTENDANCE',
      targetTab: 'attendance'
    });
    showToast(`✓ Live Attendance broadcast active for ${courseName} in Room ${room}!`);
  };

  const closeLiveAttendanceSession = () => {
    setLiveAttendanceSession((prev) => ({ ...prev, status: 'CLOSED' }));
    showToast(`Live attendance closed for ${liveAttendanceSession.courseName}. Attendance finalized.`);
  };

  const recordPalmAttendance = (_subjectName?: string): { success: boolean; message: string } => {
    if (liveAttendanceSession.status !== 'LIVE') {
      showToast('❌ Attendance cannot be submitted: No authorized faculty live session active.');
      return { success: false, message: 'No live session active.' };
    }

    if (liveAttendanceSession.recordedStudentIds.includes(student.studentId)) {
      showToast('⚠️ Attendance already recorded for this session. Duplicate submission prevented.');
      return { success: false, message: 'Attendance already recorded for this session.' };
    }

    // Add student to recorded list
    setLiveAttendanceSession((prev) => ({
      ...prev,
      recordedStudentIds: [...prev.recordedStudentIds, student.studentId]
    }));

    // Add attendance session record
    const newRecord: AttendanceSessionRecord = {
      id: `att-rec-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      courseCode: liveAttendanceSession.courseCode,
      courseName: liveAttendanceSession.courseName,
      facultyName: liveAttendanceSession.facultyName,
      room: liveAttendanceSession.room,
      status: 'PRESENT',
      verificationMethod: 'Palm Biometrics'
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);

    // Update subject attendance percentage
    setSubjects((prev) =>
      prev.map((sub) => {
        if (
          sub.subjectName.toLowerCase().includes(liveAttendanceSession.courseName.toLowerCase()) ||
          sub.code === liveAttendanceSession.courseCode
        ) {
          const newAttended = sub.attendedClasses + 1;
          const newTotal = sub.totalClasses + 1;
          const newPct = Math.round((newAttended / newTotal) * 1000) / 10;
          return {
            ...sub,
            attendedClasses: newAttended,
            totalClasses: newTotal,
            percentage: newPct
          };
        }
        return sub;
      })
    );

    // Audit Log
    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      user: `${student.name} (${student.studentId})`,
      role: 'STUDENT',
      action: 'PALM_BIOMETRIC_ATTENDANCE',
      target: `Class: ${liveAttendanceSession.courseName} (Room ${liveAttendanceSession.room})`,
      timestamp: 'Just now',
      result: 'SUCCESS'
    };
    setAuditLogs((prev) => [logItem, ...prev]);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    showToast(`✓ Identity verified via Palm Biometrics. Attendance logged for ${liveAttendanceSession.courseName}!`);
    return { success: true, message: 'Attendance recorded successfully.' };
  };

  const correctAttendanceRecord = (recId: string, newStatus: AttendanceSessionRecord['status'], reason: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === recId
          ? {
              ...r,
              status: newStatus,
              correctedBy: user.name,
              correctionReason: reason
            }
          : r
      )
    );
    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      user: `${user.name} (${user.role})`,
      role: user.role,
      action: 'ATTENDANCE_ADMIN_CORRECTION',
      target: `Record ${recId} updated to ${newStatus}. Reason: ${reason}`,
      timestamp: 'Just now',
      result: 'SUCCESS'
    };
    setAuditLogs((prev) => [logItem, ...prev]);
    showToast(`Attendance record updated to ${newStatus}. Audit logged.`);
  };

  // Timetable
  const [studentTimetable] = useState<TimetableEntry[]>(MOCK_STUDENT_TIMETABLE);

  // Faculty and Assignments State
  const [facultyList] = useState<FacultyMember[]>(MOCK_FACULTY_LIST);
  const [activeFacultyId, setActiveFacultyId] = useState<string>('fac-01');
  const activeFaculty = facultyList.find((f) => f.id === activeFacultyId) || facultyList[0];
  const [assignments, setAssignments] = useState<AssignmentItem[]>(MOCK_ASSIGNMENTS);

  const createAssignment = (asg: Omit<AssignmentItem, 'id' | 'submissions' | 'totalSubmissions'>) => {
    const newAsg: AssignmentItem = {
      ...asg,
      id: `asg-${Date.now().toString().slice(-4)}`,
      totalSubmissions: 0,
      submissions: []
    };
    setAssignments((prev) => [newAsg, ...prev]);
    addNotification({
      title: `New Assignment Released: ${newAsg.title}`,
      message: `Course: ${newAsg.courseCode} (${newAsg.courseName}) • Due: ${newAsg.dueDate} • Max Marks: ${newAsg.maxMarks}`,
      category: 'ACADEMIC',
      targetTab: 'grades'
    });
    showToast(`✓ Assignment "${newAsg.title}" published for ${newAsg.courseCode}!`);
  };

  // Shop Management State (Module 2)
  const [shopProfile, setShopProfile] = useState<ShopProfile>(INITIAL_SHOP_PROFILE);
  const [shopOffers, setShopOffers] = useState<ShopOffer[]>(INITIAL_SHOP_OFFERS);
  const [stockMovements, setStockMovements] = useState<StockMovementRecord[]>(INITIAL_STOCK_MOVEMENTS);

  const updateShopProfile = (updated: Partial<ShopProfile>) => {
    setShopProfile((prev) => ({ ...prev, ...updated }));
    showToast('✓ Shop profile & settings successfully saved to campus merchant registry!');
  };

  const addShopOffer = (offer: Omit<ShopOffer, 'id'>) => {
    const newOffer: ShopOffer = {
      ...offer,
      id: `off-${Date.now().toString().slice(-4)}`
    };
    setShopOffers((prev) => [newOffer, ...prev]);
    addNotification({
      title: `Special Campus Offer: ${newOffer.code}`,
      message: `${newOffer.title} is now active at the campus store!`,
      category: 'SHOP',
      targetTab: 'marketplace'
    });
    showToast(`Offer coupon "${newOffer.code}" activated!`);
  };

  const toggleShopOffer = (offerId: string) => {
    setShopOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isActive: !o.isActive } : o))
    );
    showToast('Shop offer status toggled.');
  };

  const updateProduct = (productId: string, updated: Partial<ProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const next = { ...p, ...updated };
        if (updated.stock !== undefined && updated.stock !== p.stock) {
          const delta = updated.stock - p.stock;
          const movement: StockMovementRecord = {
            id: `sm-${Date.now()}`,
            productId: p.id,
            productName: next.name,
            type: delta > 0 ? 'RESTOCK' : 'MANUAL_ADJUSTMENT',
            quantityChange: delta,
            previousStock: p.stock,
            newStock: updated.stock,
            timestamp: 'Just now',
            reason: 'Manual Inventory Adjustment in POS',
            user: user.name
          };
          setStockMovements((sm) => [movement, ...sm]);
        }
        return next;
      })
    );
    showToast('Product specifications & inventory updated.');
  };

  const deleteProduct = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    setProducts((prev) => prev.filter((x) => x.id !== productId));
    showToast(`Removed "${p?.name || 'Product'}" from catalogue.`);
  };

  // Facilities Management (Module 3.6)
  const [facilities, setFacilities] = useState<FacilityRecord[]>(INITIAL_FACILITIES);

  const addFacility = (fac: Omit<FacilityRecord, 'id'>) => {
    const newFac: FacilityRecord = {
      ...fac,
      id: `fac-${Date.now().toString().slice(-4)}`
    };
    setFacilities((prev) => [...prev, newFac]);
    showToast(`Added facility "${newFac.name}" to campus infrastructure!`);
  };

  const updateFacility = (id: string, updated: Partial<FacilityRecord>) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
    showToast('Facility details updated.');
  };

  // Library Circulation (Module 3.7)
  const [libraryIssues, setLibraryIssues] = useState<LibraryIssueRecord[]>(INITIAL_LIBRARY_ISSUES);

  const issueLibraryBook = (bookId: string, studentId: string, studentName: string, days: number = 14) => {
    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      showToast('Error: No copies available for issue.');
      return;
    }

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + days);

    const newIssue: LibraryIssueRecord = {
      id: `iss-${Date.now()}`,
      bookId,
      bookTitle: book.title,
      userId: studentId,
      userName: studentName,
      userRole: 'STUDENT',
      issueDate: 'Today',
      dueDate: dueDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ISSUED',
      fineAmount: 0,
      finePaid: false
    };

    setLibraryIssues((prev) => [newIssue, ...prev]);
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );
    showToast(`✓ Issued "${book.title}" to ${studentName}. Due in ${days} days.`);
  };

  const returnLibraryBook = (issueId: string) => {
    const issue = libraryIssues.find((i) => i.id === issueId);
    if (!issue) return;

    setLibraryIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: 'RETURNED', returnDate: 'Today' } : i))
    );
    setBooks((prev) =>
      prev.map((b) => (b.id === issue.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    );
    showToast(`✓ Book "${issue.bookTitle}" returned to Central Library catalogue.`);
  };

  const payLibraryFine = (issueId: string) => {
    setLibraryIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, fineAmount: 0, finePaid: true } : i))
    );
    showToast('✓ Library overdue fine settled and receipt recorded.');
  };

  // Terminal & Pehchaan Operations (Module 3.5 & 5)
  const registerDetailedTerminal = (
    term: Omit<TerminalDevice, 'id' | 'lastPing' | 'firmwareVersion' | 'ipAddress' | 'macAddress' | 'maintenanceHistory'>
  ): { success: boolean; message: string } => {
    const exists = terminals.some((t) => t.terminalCode.toLowerCase() === term.terminalCode.toLowerCase());
    if (exists) {
      showToast(`Error: Terminal code "${term.terminalCode}" is already registered.`);
      return { success: false, message: 'Terminal code already registered.' };
    }

    const newDevice: TerminalDevice = {
      ...term,
      id: `term-${Date.now().toString().slice(-4)}`,
      lastPing: 'Just now',
      firmwareVersion: 'v2.4.1-palm',
      ipAddress: `10.14.${Math.floor(1 + Math.random() * 5)}.${Math.floor(10 + Math.random() * 80)}`,
      macAddress: `70:B3:D5:E4:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      isOperational: term.status === 'ONLINE',
      maintenanceHistory: []
    };

    setTerminals((prev) => [newDevice, ...prev]);
    showToast(`✓ Registered Palm Terminal: ${newDevice.locationName} (${newDevice.terminalCode})`);
    return { success: true, message: 'Terminal registered successfully.' };
  };

  const markTerminalMaintenance = (terminalId: string, reason: string, technician: string, expectedRestorationDate: string) => {
    const maintLog = {
      id: `maint-${Date.now()}`,
      terminalId,
      reportedTime: 'Just now',
      reason,
      assignedTechnician: technician,
      expectedRestorationDate,
      status: 'IN_PROGRESS' as const
    };

    setTerminals((prev) =>
      prev.map((t) => {
        if (t.id !== terminalId) return t;
        const currentHist = t.maintenanceHistory || [];
        return {
          ...t,
          status: 'MAINTENANCE',
          isOperational: false,
          maintenanceHistory: [maintLog, ...currentHist]
        };
      })
    );
    showToast('Terminal marked under maintenance. Status broadcast to system.');
  };

  const restoreTerminalFromMaintenance = (terminalId: string, notes: string) => {
    setTerminals((prev) =>
      prev.map((t) => {
        if (t.id !== terminalId) return t;
        const currentHist = (t.maintenanceHistory || []).map((m, idx) =>
          idx === 0
            ? { ...m, status: 'RESTORED' as const, restoredAt: 'Just now', restorationNotes: notes }
            : m
        );
        return {
          ...t,
          status: 'ONLINE',
          isOperational: true,
          maintenanceHistory: currentHist
        };
      })
    );
    showToast('✓ Terminal verified and restored to ONLINE service.');
  };

  const removeTerminal = (terminalId: string) => {
    const term = terminals.find((t) => t.id === terminalId);
    setTerminals((prev) => prev.filter((t) => t.id !== terminalId));
    showToast(`Terminal "${term?.locationName}" deactivated and removed from live network.`);
  };

  // Ticket Management (Module 3.9)
  const updateTicketStatus = (ticketId: string, status: ComplaintTicket['status'], note?: string, assignee?: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== ticketId) return c;
        return {
          ...c,
          status,
          assignedPerson: assignee || c.assignedPerson
        };
      })
    );
    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      user: `${user.name} (${user.role})`,
      role: user.role,
      action: 'TICKET_STATUS_UPDATE',
      target: `Ticket ${ticketId} status changed to ${status}. ${note ? `Note: ${note}` : ''}`,
      timestamp: 'Just now',
      result: 'SUCCESS'
    };
    setAuditLogs((prev) => [logItem, ...prev]);
    showToast(`Ticket status updated to ${status}.`);
  };

  // Other Feature States
  const [medicalRecord] = useState<MedicalRecord>(MOCK_MEDICAL_RECORD);
  const [feeItems, setFeeItems] = useState<FeeItem[]>(MOCK_FEE_ITEMS);
  const [hostelDetails, setHostelDetails] = useState<HostelDetails>(MOCK_HOSTEL_DETAILS);
  const [transportRoute] = useState<TransportRoute>(MOCK_TRANSPORT_ROUTE);
  const [placementDrives, setPlacementDrives] = useState<PlacementDrive[]>(MOCK_PLACEMENT_DRIVES);
  const [examGrades] = useState<ExamGrade[]>(MOCK_EXAM_GRADES);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(MOCK_LOST_FOUND);
  const [campusPolls, setCampusPolls] = useState<CampusPoll[]>(MOCK_CAMPUS_POLLS);

  const [activePosPaymentRequest, setActivePosPaymentRequest] = useState<PosPaymentRequest | null>(null);
  const [activeTerminalLocation, setActiveTerminalLocation] = useState<string>('A403');
  const [activeTerminalType, setActiveTerminalType] = useState<'CLASSROOM' | 'SHOP' | 'LIBRARY' | 'EVENT' | 'GATE'>('CLASSROOM');

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<WalletTransaction | null>(null);
  const [selectedDocForShare, setSelectedDocForShare] = useState<DocumentItem | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<FeeItem | null>(null);
  const [demoNotification, setDemoNotification] = useState<string | null>(null);
  const [pendingRoleTarget, setPendingRoleTarget] = useState<Role | null>(null);
  const [isSessionLocked, setIsSessionLocked] = useState(false);

  const [aiMessages, setAiMessages] = useState<AiChatMessage[]>([
    {
      id: 'init-1',
      sender: 'NEXORA_AI',
      text: 'Good day, PRANAV! I am your NEXORA Campus Operating System Assistant. Ask me about class schedules, attendance breakdown, upcoming events, medical records, or fee clearances.',
      timestamp: '09:00 AM'
    }
  ]);

  const showToast = (msg: string) => {
    setDemoNotification(msg);
    setTimeout(() => {
      setDemoNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const loginWithPalm = () => {
    setIsAuthenticated(true);
    if (pendingRoleTarget) {
      const target = pendingRoleTarget;
      const newPersona = ROLE_PERSONAS[target] || ROLE_PERSONAS.STUDENT;
      setRole(target);
      setUser(newPersona);
      setPendingRoleTarget(null);
      setIsSessionLocked(false);
      showToast(`✓ Identity verified via Palm Biometrics. Unlocked [${target}] Interface!`);
    } else {
      showToast('✓ Identity verified via Palm Biometrics. Welcome back!');
    }
  };

  const loginWithCredentials = (id: string) => {
    setIsAuthenticated(true);
    showToast(`✓ Logged in successfully as ${id}.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Signed out of NEXORA Operating System.');
  };

  const requestRoleSwitch = (targetRole: Role) => {
    if (targetRole === role && !isSessionLocked) {
      showToast(`Already viewing [${targetRole}] workspace.`);
      return;
    }
    setPendingRoleTarget(targetRole);
    setActiveModal('INTERFACE_GATE');
    const targetConfig = ROLE_SECURITY_REGISTRY[targetRole] || ROLE_SECURITY_REGISTRY.STUDENT;
    const logItem: AuditLogItem = {
      id: `log-chal-${Date.now()}`,
      user: `${user.name} (${user.role})`,
      role: role,
      action: 'INTERFACE_SECURITY_CHALLENGE',
      target: `Biometric Palm Scan & 2FA challenge triggered for switch to [${targetConfig.title}].`,
      timestamp: 'Just now',
      result: 'FLAGGED'
    };
    setAuditLogs((prev) => [logItem, ...prev]);
    showToast(`🔒 Biometric Palm Scan & Login Required: Switching to [${targetConfig.title}].`);
  };

  const cancelRoleSwitch = () => {
    const cancelledTarget = pendingRoleTarget;
    setPendingRoleTarget(null);
    setActiveModal(null);
    if (cancelledTarget) {
      const logItem: AuditLogItem = {
        id: `log-cncl-${Date.now()}`,
        user: `${user.name} (${user.role})`,
        role: role,
        action: 'INTERFACE_CHALLENGE_CANCELLED',
        target: `User aborted access challenge for [${cancelledTarget}]. Kept in current workspace.`,
        timestamp: 'Just now',
        result: 'DENIED'
      };
      setAuditLogs((prev) => [logItem, ...prev]);
      showToast(`Access challenge cancelled. Retained active [${role}] workspace.`);
    }
  };

  const lockSession = () => {
    setIsSessionLocked(true);
    setPendingRoleTarget(role);
    setActiveModal('INTERFACE_GATE');
    const logItem: AuditLogItem = {
      id: `log-lock-${Date.now()}`,
      user: `${user.name} (${user.role})`,
      role: role,
      action: 'WORKSPACE_MANUAL_LOCKDOWN',
      target: `Workspace locked down. Screen protected by optical palm biometric shield.`,
      timestamp: 'Just now',
      result: 'SUCCESS'
    };
    setAuditLogs((prev) => [logItem, ...prev]);
    showToast(`🔒 Workspace locked. Subdermal Palm Scan required to resume session.`);
  };

  const unlockSession = () => {
    setIsSessionLocked(false);
    setPendingRoleTarget(null);
    setActiveModal(null);
  };

  const verifyAndUnlockRole = (
    targetRole: Role,
    pin: string,
    palmResult: any
  ): { success: boolean; error?: string } => {
    const config = ROLE_SECURITY_REGISTRY[targetRole] || ROLE_SECURITY_REGISTRY.STUDENT;

    // 1. Mandatory Biometric Palm Scan Verification
    if (!palmResult || !palmResult.success) {
      const logItem: AuditLogItem = {
        id: `log-fail-palm-${Date.now()}`,
        user: `${user.name} (${user.role})`,
        role: role,
        action: 'BIOMETRIC_CHECK_FAILED',
        target: `Unauthorized attempt to access [${targetRole}]: Optical palm scan was not verified.`,
        timestamp: 'Just now',
        result: 'DENIED'
      };
      setAuditLogs((prev) => [logItem, ...prev]);
      return {
        success: false,
        error: 'Biometric Palm Scan Required: Subdermal vascular scan has not been verified.'
      };
    }

    // 2. Mandatory Role Passcode / PIN Check
    const normalizedPin = pin.trim();
    const expectedPin = config.demoPin;
    if (normalizedPin !== expectedPin) {
      const logItem: AuditLogItem = {
        id: `log-fail-pin-${Date.now()}`,
        user: `${user.name} (${user.role})`,
        role: role,
        action: 'CREDENTIAL_CHECK_FAILED',
        target: `Unauthorized attempt to access [${targetRole}]: Invalid passcode entered for ${config.title}.`,
        timestamp: 'Just now',
        result: 'DENIED'
      };
      setAuditLogs((prev) => [logItem, ...prev]);
      return {
        success: false,
        error: `Access Denied: Invalid security passcode for ${config.title}. Expected: ${expectedPin}`
      };
    }

    // 3. Both Multi-Factor Authentications Cleared -> Execute Switch
    const newPersona = ROLE_PERSONAS[targetRole] || ROLE_PERSONAS.STUDENT;
    setRole(targetRole);
    setUser(newPersona);
    setIsAuthenticated(true);
    setIsSessionLocked(false);
    setPendingRoleTarget(null);
    setActiveModal(null);

    const logItem: AuditLogItem = {
      id: `log-unlock-${Date.now()}`,
      user: `${newPersona.name} (${newPersona.role})`,
      role: targetRole,
      action: 'BIOMETRIC_INTERFACE_UNLOCKED',
      target: `Optical Palm Vascular Scan (${palmResult.hash || 'AES256'}) + 2FA PIN verified. Entered [${config.title}].`,
      timestamp: 'Just now',
      result: 'SUCCESS'
    };
    setAuditLogs((prev) => [logItem, ...prev]);

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}

    showToast(`✓ Identity & Palm Biometrics Verified. Entered [${config.title}]!`);
    return { success: true };
  };

  const switchRole = (newRole: Role, bypassSecurity = false) => {
    if (newRole === role && !isSessionLocked) {
      showToast(`Already active in [${newRole}] Workspace.`);
      return;
    }
    if (bypassSecurity) {
      const newPersona = ROLE_PERSONAS[newRole] || ROLE_PERSONAS.STUDENT;
      setRole(newRole);
      setUser(newPersona);
      setPendingRoleTarget(null);
      setIsSessionLocked(false);
      setActiveModal(null);
      showToast(`Switched workspace to [${newRole}].`);
      return;
    }
    // Universal Security Guard: Intercept any role switch and require Palm Scan + Login!
    requestRoleSwitch(newRole);
  };

  const requestRoleSwitchWithPalm = (targetRole: Role) => {
    requestRoleSwitch(targetRole);
  };

  const setModal = (modal: ModalType) => {
    setActiveModal(modal);
  };

  const openReceiptModal = (tx: WalletTransaction) => {
    setSelectedReceipt(tx);
    setActiveModal('RECEIPT');
  };

  const openShareModal = (doc: DocumentItem) => {
    setSelectedDocForShare(doc);
    setActiveModal('DOCUMENT_SHARE');
  };

  const openDocPreview = (doc: DocumentItem) => {
    setSelectedDocForPreview(doc);
    setActiveModal('DOCUMENT_PREVIEW');
  };

  const downloadDoc = (doc: DocumentItem) => {
    DocumentService.downloadDocument(doc, student);
    showToast(`✓ Valid document file "${doc.title}.txt" downloaded to your device.`);
  };

  const openPayFeeModal = (fee: FeeItem) => {
    setSelectedFeeForPay(fee);
    setActiveModal('PAY_FEE');
  };

  const registerForEvent = async (eventId: string): Promise<boolean> => {
    const targetEvent = events.find((e) => e.id === eventId);
    if (!targetEvent) return false;

    if (targetEvent.fee > 0) {
      const payReq: PaymentRequest = {
        userId: student.userId,
        merchantName: targetEvent.organizer,
        category: 'EVENTS',
        amount: targetEvent.fee,
        itemsSummary: `Registration Fee: ${targetEvent.title}`
      };

      const res = await PaymentService.createPayment(payReq, student.walletBalance);
      if (!res.success || !res.transaction) {
        showToast(`Payment failed: ${res.error}`);
        return false;
      }

      setStudent((prev) => ({ ...prev, walletBalance: res.newBalance || prev.walletBalance }));
      setTransactions((prev) => [res.transaction!, ...prev]);
    }

    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              isRegistered: true,
              availableSeats: Math.max(0, e.availableSeats - 1),
              ticketQr: `TICKET-${e.id.toUpperCase()}-${student.studentId}`
            }
          : e
      )
    );

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    showToast(`🎉 Registration successful for ${targetEvent.title}! Ticket issued.`);
    return true;
  };

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart.`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutCart = async (): Promise<boolean> => {
    if (cart.length === 0) return false;

    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shopName = cart[0].product.shopName;
    const itemsSummary = cart.map((i) => `${i.quantity}x ${i.product.name}`).join(', ');

    const payReq: PaymentRequest = {
      userId: student.userId,
      merchantName: shopName,
      category: 'CANTEEN',
      amount: totalAmount,
      itemsSummary
    };

    const res = await PaymentService.createPayment(payReq, student.walletBalance);
    if (!res.success || !res.transaction) {
      showToast(`Checkout failed: ${res.error}`);
      return false;
    }

    setStudent((prev) => ({ ...prev, walletBalance: res.newBalance || prev.walletBalance }));
    setTransactions((prev) => [res.transaction!, ...prev]);

    // Update inventory stock for purchased products
    cart.forEach((cartItem) => {
      updateProductStock(cartItem.product.id, Math.max(0, cartItem.product.stock - cartItem.quantity));
    });

    const newOrder: CampusOrder = {
      id: `ord-${Date.now().toString().slice(-5)}`,
      userId: student.userId,
      userName: student.name,
      shopName,
      items: cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price
      })),
      totalAmount,
      status: 'PLACED',
      pickupCode: `#P-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      paymentId: res.transaction.id
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}

    showToast(`Order placed successfully! Pickup code: ${newOrder.pickupCode}`);
    return true;
  };

  const topupWallet = (amount: number) => {
    // Legacy direct topup compatibility - calls gateway flow internally
    processGatewayTopup(amount, 'UPI', { upiVpa: 'instant@campus' });
  };

  const processGatewayTopup = async (
    amount: number,
    method: 'UPI' | 'CARD' | 'NETBANKING',
    details: any
  ): Promise<PaymentResult> => {
    const res = await PaymentService.processGatewayTopup(
      {
        userId: student.userId,
        amount,
        method,
        upiVpa: details?.upiVpa,
        cardLast4: details?.cardNumber ? details.cardNumber.slice(-4) : '4242',
        cardHolder: details?.cardHolder
      },
      student.walletBalance
    );

    if (res.success && res.transaction) {
      setStudent((prev) => {
        const next = { ...prev, walletBalance: res.newBalance || (prev.walletBalance + amount) };
        try {
          localStorage.setItem('noir_student_profile', JSON.stringify(next));
        } catch {}
        return next;
      });
      setTransactions((prev) => [res.transaction!, ...prev]);
      addNotification({
        title: `Wallet Credited: +₹${amount}`,
        message: `Payment confirmed via ${method} gateway. New balance: ₹${(res.newBalance || (student.walletBalance + amount))}. Receipt: ${res.transaction.receiptId}`,
        category: 'FEES',
        targetTab: 'pay'
      });
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast(`✓ Gateway Payment Confirmed! ₹${amount} credited to your NEXORA Wallet.`);
    } else {
      showToast(`Payment Failed: ${res.error || 'Gateway rejected transaction'}`);
    }
    return res;
  };

  const payFeeItem = async (feeId: string, amount: number): Promise<boolean> => {
    const targetFee = feeItems.find((f) => f.id === feeId);
    if (!targetFee) return false;

    const payReq: PaymentRequest = {
      userId: student.userId,
      merchantName: 'NEXORA Bursar & Accounts Desk',
      category: 'FEES',
      amount,
      itemsSummary: `Payment for: ${targetFee.title}`
    };

    const res = await PaymentService.createPayment(payReq, student.walletBalance);
    if (!res.success || !res.transaction) {
      showToast(`Fee payment failed: ${res.error}`);
      return false;
    }

    setStudent((prev) => ({ ...prev, walletBalance: res.newBalance || prev.walletBalance }));
    setTransactions((prev) => [res.transaction!, ...prev]);

    setFeeItems((prev) =>
      prev.map((f) => {
        if (f.id === feeId) {
          const newPaid = f.paidAmount + amount;
          const isFullyPaid = newPaid >= f.totalAmount;
          return {
            ...f,
            paidAmount: newPaid,
            status: isFullyPaid ? 'PAID' : 'PARTIAL'
          };
        }
        return f;
      })
    );

    setActiveModal(null);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    showToast(`✓ Fee payment of ₹${amount} cleared for ${targetFee.title}.`);
    return true;
  };

  const generateShareLink = (docId: string, recipient: string, durationMinutes: number): string => {
    const result = DocumentService.generateSecureShareLink(docId, recipient, durationMinutes);

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, shareCode: result.shareCode, shareExpiresAt: `Expires in ${durationMinutes} mins` }
          : d
      )
    );

    showToast(`Secure ${durationMinutes}-minute share link created for ${recipient}.`);
    return result.shareUrl;
  };

  const submitComplaint = (
    category: ComplaintTicket['category'],
    description: string,
    priority: ComplaintTicket['priority']
  ) => {
    const newTkt: ComplaintTicket = {
      id: `tkt-${Date.now().toString().slice(-5)}`,
      ticketNo: `NEXORA-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: student.userId,
      userName: student.name,
      category,
      description,
      priority,
      status: 'OPEN',
      createdAt: 'Just now'
    };

    setComplaints((prev) => [newTkt, ...prev]);
    showToast(`Ticket ${newTkt.ticketNo} registered. Status: OPEN.`);
  };

  const applyGatePass = (reason: string) => {
    setHostelDetails((prev) => ({
      ...prev,
      gatePasses: [
        {
          id: `gp-${Date.now().toString().slice(-4)}`,
          reason,
          departureTime: 'Today 06:00 PM',
          returnTime: 'Tomorrow 09:00 PM',
          status: 'APPROVED'
        },
        ...prev.gatePasses
      ]
    }));
    showToast('✓ Digital Hostel Gate Pass approved & QR code issued.');
  };

  const applyPlacementDrive = (driveId: string) => {
    setPlacementDrives((prev) =>
      prev.map((pd) =>
        pd.id === driveId
          ? { ...pd, applied: true, status: 'INTERVIEW_SCHEDULED' }
          : pd
      )
    );
    showToast('🎉 Application submitted to Career Placement Cell.');
  };

  const votePollOption = (pollId: string, optionIndex: number) => {
    setCampusPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          const updatedOptions = p.options.map((opt, idx) =>
            idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            options: updatedOptions,
            userVotedOption: optionIndex,
            totalVotes: p.totalVotes + 1
          };
        }
        return p;
      })
    );
    showToast('Vote recorded on NEXORA Campus Poll.');
  };

  const reportLostItem = (title: string, locationFound: string, category: LostFoundItem['category']) => {
    const newItem: LostFoundItem = {
      id: `lf-${Date.now().toString().slice(-4)}`,
      title,
      locationFound,
      dateFound: 'Just now',
      category,
      status: 'UNCLAIMED',
      contactPerson: 'Student Desk'
    };
    setLostFoundItems((prev) => [newItem, ...prev]);
    showToast(`Item "${title}" logged into Lost & Found database.`);
  };

  const toggleTerminalStatus = (terminalId: string) => {
    setTerminals((prev) =>
      prev.map((t) =>
        t.id === terminalId
          ? {
              ...t,
              status: t.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE',
              isOperational: t.status !== 'ONLINE'
            }
          : t
      )
    );
    showToast(`Terminal device status toggled.`);
  };

  const registerNewTerminal = (locationName: string, roomNumber: string, type: TerminalDevice['type']) => {
    registerDetailedTerminal({
      terminalCode: `TRM-${Math.floor(1000 + Math.random() * 9000)}`,
      locationName,
      roomNumber,
      type,
      status: 'ONLINE',
      isOperational: true
    });
  };

  const createPosPaymentRequest = (shopName: string, amount: number, itemsSummary: string) => {
    const req: PosPaymentRequest = {
      id: `pos-${Date.now().toString().slice(-4)}`,
      shopName,
      amount,
      itemsSummary,
      timestamp: 'Just now',
      status: 'PENDING'
    };
    setActivePosPaymentRequest(req);
    showToast(`📡 Payment request of ₹${amount} sent to Shop Palm Terminal!`);
  };

  const approvePosPaymentRequest = async (): Promise<boolean> => {
    if (!activePosPaymentRequest) return false;
    const req = activePosPaymentRequest;

    const payReq: PaymentRequest = {
      userId: student.userId,
      merchantName: req.shopName,
      category: 'CANTEEN',
      amount: req.amount,
      itemsSummary: req.itemsSummary
    };

    const res = await PaymentService.createPayment(payReq, student.walletBalance);
    if (!res.success || !res.transaction) {
      showToast(`Payment failed: ${res.error}`);
      return false;
    }

    setStudent((prev) => ({ ...prev, walletBalance: res.newBalance || prev.walletBalance }));
    setTransactions((prev) => [res.transaction!, ...prev]);
    setActivePosPaymentRequest(null);
    showToast(`✓ Payment of ₹${req.amount} authorized via Palm Identity for ${req.shopName}!`);
    return true;
  };

  const setActiveTerminalConfig = (location: string, type: 'CLASSROOM' | 'SHOP' | 'LIBRARY' | 'EVENT' | 'GATE') => {
    setActiveTerminalLocation(location);
    setActiveTerminalType(type);
    showToast(`Switched Palm Terminal context to: ${location} [${type}]`);
  };

  const sendAiMessage = async (prompt: string) => {
    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages((prev) => [...prev, userMsg]);

    const botResponse = await AiService.processUserQuery(prompt, role, student);
    setAiMessages((prev) => [...prev, botResponse]);
  };

  const confirmAiPayment = async (details: Record<string, any>) => {
    const payReq: PaymentRequest = {
      userId: student.userId,
      merchantName: details.merchantName || 'NEXORA Official Services',
      category: details.category || 'FEES',
      amount: details.amount || 150,
      itemsSummary: details.purpose || 'AI Request Execution'
    };

    const res = await PaymentService.createPayment(payReq, student.walletBalance);
    if (res.success && res.transaction) {
      setStudent((prev) => ({ ...prev, walletBalance: res.newBalance || prev.walletBalance }));
      setTransactions((prev) => [res.transaction!, ...prev]);

      setAiMessages((prev) =>
        prev.map((msg) =>
          msg.actionRequired
            ? {
                ...msg,
                text: `✓ Payment of ₹${details.amount} confirmed and processed. Transaction ID: ${res.transaction?.id}`,
                actionRequired: { ...msg.actionRequired, confirmed: true }
              }
            : msg
        )
      );

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}

      showToast(`Payment of ₹${details.amount} confirmed by user.`);
    } else {
      showToast(`Payment failed: ${res.error}`);
    }
  };

  const reserveBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, isReserved: true, availableCopies: Math.max(0, b.availableCopies - 1) }
          : b
      )
    );
    showToast(`Book reservation confirmed. Pick up at Central Library counter.`);
  };

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudent((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('noir_student_profile', JSON.stringify(next));
      } catch {}
      return next;
    });
    setUser((prev) => {
      const nextUser: User = {
        ...prev,
        name: updated.name ?? prev.name,
        email: updated.email ?? prev.email,
        department: updated.department ?? prev.department,
        avatar: updated.avatar ?? prev.avatar,
        phone: updated.phone ?? prev.phone,
        noirId: updated.studentId ?? prev.noirId
      };
      try {
        localStorage.setItem('noir_user_profile', JSON.stringify(nextUser));
      } catch {}
      return nextUser;
    });
    showToast('✓ Profile successfully updated & synchronized across NEXORA OS!');
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch {}
  };

  const updateOrderStatus = (orderId: string, status: CampusOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status,
          timestamp: `Updated to ${status} just now`
        };
      })
    );
    showToast(`Order #${orderId} status updated to: ${status}`);
  };

  const addProduct = (newProd: Omit<ProductItem, 'id'>) => {
    const item: ProductItem = {
      ...newProd,
      id: `prod-${Date.now().toString().slice(-4)}`
    };
    setProducts((prev) => [item, ...prev]);

    const movement: StockMovementRecord = {
      id: `sm-${Date.now()}`,
      productId: item.id,
      productName: item.name,
      type: 'RESTOCK',
      quantityChange: item.stock,
      previousStock: 0,
      newStock: item.stock,
      timestamp: 'Just now',
      reason: 'Initial Product Catalogue Addition',
      user: user.name
    };
    setStockMovements((sm) => [movement, ...sm]);

    showToast(`Added "${item.name}" to campus catalogue!`);
  };

  const updateProductStock = (productId: string, newStock: number) => {
    updateProduct(productId, { stock: Math.max(0, newStock) });
  };

  const gradeAssignmentSubmission = (asgId: string, studentId: string, marks: number, grade: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== asgId) return a;
        return {
          ...a,
          submissions: a.submissions.map((s) =>
            s.studentId === studentId ? { ...s, marks, grade, status: 'GRADED' } : s
          )
        };
      })
    );
    showToast(`Submission evaluated: ${marks} marks awarded (Grade ${grade})`);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        student,
        role,
        theme,
        toggleTheme,
        setTheme,
        subjects,
        events,
        products,
        orders,
        transactions,
        documents,
        books,
        complaints,
        terminals,
        auditLogs,
        aiMessages,
        cart,
        activeModal,
        selectedReceipt,
        selectedDocForShare,
        selectedDocForPreview,
        selectedFeeForPay,
        demoNotification,
        pendingRoleTarget,

        // Notifications
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,

        // Live Attendance Session
        liveAttendanceSession,
        startLiveAttendanceSession,
        closeLiveAttendanceSession,

        // Detailed Attendance Records
        attendanceRecords,
        correctAttendanceRecord,

        // Timetable
        studentTimetable,

        // Faculty & Assignments
        facultyList,
        activeFaculty,
        setActiveFacultyId,
        assignments,
        gradeAssignmentSubmission,
        createAssignment,

        // Profile Management
        updateStudentProfile,

        // Shop Management
        shopProfile,
        updateShopProfile,
        shopOffers,
        addShopOffer,
        toggleShopOffer,
        stockMovements,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,

        // Facilities Management
        facilities,
        addFacility,
        updateFacility,

        // Library Management
        libraryIssues,
        issueLibraryBook,
        returnLibraryBook,
        payLibraryFine,

        // Terminal Management & Pehchaan
        registerDetailedTerminal,
        markTerminalMaintenance,
        restoreTerminalFromMaintenance,
        removeTerminal,

        // Ticket Management
        updateTicketStatus,

        // Other state
        medicalRecord,
        feeItems,
        hostelDetails,
        transportRoute,
        placementDrives,
        examGrades,
        lostFoundItems,
        campusPolls,
        activePosPaymentRequest,
        activeTerminalLocation,
        activeTerminalType,
        // Session Security & Role Gate
        isSessionLocked,
        lockSession,
        unlockSession,
        requestRoleSwitch,
        verifyAndUnlockRole,

        loginWithPalm,
        loginWithCredentials,
        logout,
        switchRole,
        requestRoleSwitchWithPalm,
        cancelRoleSwitch,
        setModal,
        openReceiptModal,
        openShareModal,
        openDocPreview,
        downloadDoc,
        openPayFeeModal,
        recordPalmAttendance,
        registerForEvent,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        topupWallet,
        processGatewayTopup,
        payFeeItem,
        generateShareLink,
        submitComplaint,
        applyGatePass,
        applyPlacementDrive,
        votePollOption,
        reportLostItem,
        toggleTerminalStatus,
        registerNewTerminal,
        createPosPaymentRequest,
        approvePosPaymentRequest,
        setActiveTerminalConfig,
        sendAiMessage,
        confirmAiPayment,
        reserveBook,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
