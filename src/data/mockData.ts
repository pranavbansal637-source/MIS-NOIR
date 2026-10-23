import type {
  StudentProfile,
  SubjectAttendance,
  ClassSession,
  WalletTransaction,
  EventItem,
  ProductItem,
  DocumentItem,
  LibraryBook,
  ComplaintTicket,
  TerminalDevice,
  AuditLogItem,
  User,
  MedicalRecord,
  FeeItem,
  HostelDetails,
  TransportRoute,
  PlacementDrive,
  ExamGrade,
  LostFoundItem,
  CampusPoll,
  FacultyMember,
  AssignmentItem,
  CampusOrder,
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

export const INITIAL_USER: User = {
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
};

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-8891',
  userId: 'usr-001',
  studentId: 'NR-2026-8891',
  name: 'PRANAV',
  program: 'BBA',
  semester: 2,
  batch: '2025–2028',
  department: 'School of Business',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  attendanceOverall: 82.4,
  walletBalance: 450,
  cgpa: 3.84,
  qrCode: 'NEXORA-STD-NR-2026-8891-SECURE-TOKEN',
  isVerified: true,
  email: 'pranav.student@nexora.edu',
  phone: '+91 98765 43210',
  bloodGroup: 'O+ Positive',
  hostelRoom: 'Hostel Block B • Room 304',
  busRoute: 'Route #4 (South Campus Express)'
};

export const MOCK_SUBJECTS_ATTENDANCE: SubjectAttendance[] = [
  {
    subjectId: 'sub-1',
    subjectName: 'Marketing Management',
    code: 'MKT-201',
    instructor: 'Dr. Sarah Jenkins',
    percentage: 84,
    attendedClasses: 21,
    totalClasses: 25,
    requiredPercentage: 75,
    classesNeededToTarget: 0,
    status: 'EXCELLENT',
    recentTrend: [80, 81, 83, 84]
  },
  {
    subjectId: 'sub-2',
    subjectName: 'Micro Economics',
    code: 'ECO-102',
    instructor: 'Prof. Rajesh Kumar',
    percentage: 76,
    attendedClasses: 19,
    totalClasses: 25,
    requiredPercentage: 75,
    classesNeededToTarget: 1,
    status: 'GOOD',
    recentTrend: [72, 74, 75, 76]
  },
  {
    subjectId: 'sub-3',
    subjectName: 'Corporate Finance',
    code: 'FIN-304',
    instructor: 'Dr. Elena Rostova',
    percentage: 91,
    attendedClasses: 22,
    totalClasses: 24,
    requiredPercentage: 75,
    classesNeededToTarget: 0,
    status: 'EXCELLENT',
    recentTrend: [88, 89, 90, 91]
  },
  {
    subjectId: 'sub-4',
    subjectName: 'Organizational Management',
    code: 'MGT-101',
    instructor: 'Prof. David Vance',
    percentage: 88,
    attendedClasses: 22,
    totalClasses: 25,
    requiredPercentage: 75,
    classesNeededToTarget: 0,
    status: 'EXCELLENT',
    recentTrend: [85, 86, 88, 88]
  }
];

export const MOCK_TODAY_CLASSES: ClassSession[] = [
  {
    id: 'cls-101',
    subjectName: 'Marketing Management',
    code: 'MKT-201',
    room: 'A403',
    building: 'Academic Block A',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    facultyName: 'Dr. Sarah Jenkins',
    status: 'UPCOMING'
  },
  {
    id: 'cls-102',
    subjectName: 'Corporate Finance',
    code: 'FIN-304',
    room: 'A404',
    building: 'Academic Block A',
    startTime: '11:30 AM',
    endTime: '12:45 PM',
    facultyName: 'Dr. Elena Rostova',
    status: 'UPCOMING'
  },
  {
    id: 'cls-103',
    subjectName: 'Micro Economics',
    code: 'ECO-102',
    room: 'L102',
    building: 'Lecture Hall Complex',
    startTime: '02:00 PM',
    endTime: '03:15 PM',
    facultyName: 'Prof. Rajesh Kumar',
    status: 'UPCOMING'
  }
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'NEXORA HackSphere 2026: National AI & Systems Hackathon',
    category: 'TECH',
    date: '14 OCT 2026',
    time: '09:30 AM',
    venue: 'Main Auditorium & Innovation Lab',
    organizer: 'NEXORA Student Developer & Innovation Society',
    fee: 0,
    availableSeats: 42,
    totalSeats: 200,
    posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80',
    description: 'Flagship 36-hour national collegiate hackathon with tracks in Palm Biometrics, Autonomous Agents, and Scalable FinTech systems.',
    isRegistered: true,
    ticketQr: 'TICKET-HACKSPHERE-2026-PRANAV',
    status: 'PUBLISHED'
  },
  {
    id: 'evt-2',
    title: 'AI & Autonomous Systems Summit',
    category: 'TECH',
    date: '20 OCT 2026',
    time: '11:00 AM',
    venue: 'Tech Block B Auditorium',
    organizer: 'Computer Science Department',
    fee: 150,
    availableSeats: 18,
    totalSeats: 120,
    posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    description: 'Explore neural architectures, palm biometrics, and edge deployment with industry experts.',
    isRegistered: false,
    status: 'PUBLISHED'
  },
  {
    id: 'evt-3',
    title: 'Autumn Music & Cultural Gala',
    category: 'CULTURAL',
    date: '28 OCT 2026',
    time: '05:30 PM',
    venue: 'Open Air Amphitheatre',
    organizer: 'Cultural Society NEXORA',
    fee: 100,
    availableSeats: 150,
    totalSeats: 500,
    posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    description: 'Live musical performances, inter-college dance faceoffs, and food stalls.',
    isRegistered: false,
    status: 'PUBLISHED'
  }
];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-901',
    userId: 'usr-001',
    merchantName: 'Central Campus Canteen',
    category: 'CANTEEN',
    amount: 120,
    type: 'DEBIT',
    status: 'SUCCESS',
    timestamp: 'Today, 08:45 AM',
    receiptId: 'RCP-8891-01',
    itemsSummary: 'Avocado Toast + Iced Cold Brew'
  },
  {
    id: 'tx-902',
    userId: 'usr-001',
    merchantName: 'Campus Print Hub - Library',
    category: 'PRINTING',
    amount: 30,
    type: 'DEBIT',
    status: 'SUCCESS',
    timestamp: 'Yesterday, 04:15 PM',
    receiptId: 'RCP-8891-02',
    itemsSummary: '6 Pages Color Document Printing'
  },
  {
    id: 'tx-903',
    userId: 'usr-001',
    merchantName: 'NEXORA UPI Wallet Topup',
    category: 'TOPUP',
    amount: 500,
    type: 'CREDIT',
    status: 'SUCCESS',
    timestamp: '01 Oct 2026, 09:00 AM',
    receiptId: 'RCP-TOPUP-992'
  }
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    shopId: 'canteen-main',
    shopName: 'Quad Cafe & Food Court',
    name: 'Artisanal Cold Brew Coffee',
    category: 'Food',
    price: 80,
    stock: 45,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&auto=format&fit=crop&q=80',
    description: '18-hour cold steeped single-origin dark roast with hazelnut hints.'
  },
  {
    id: 'prod-2',
    shopId: 'canteen-main',
    shopName: 'Quad Cafe & Food Court',
    name: 'Grilled Paneer Tikka Sandwich',
    category: 'Food',
    price: 120,
    stock: 35,
    lowStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80',
    description: 'Fresh cottage cheese marinated in tandoori spices, mint relish, toasted multigrain.'
  },
  {
    id: 'prod-3',
    shopId: 'canteen-main',
    shopName: 'Quad Cafe & Food Court',
    name: 'Special Masala Chai & Samosa (2 pcs)',
    category: 'Food',
    price: 45,
    stock: 80,
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
    description: 'Steaming ginger cardamom tea with crispy golden spiced potato samosas.'
  },
  {
    id: 'prod-4',
    shopId: 'canteen-main',
    shopName: 'Quad Cafe & Food Court',
    name: 'Crispy Veggie & Cheese Burger',
    category: 'Food',
    price: 95,
    stock: 25,
    lowStockThreshold: 6,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
    description: 'Crisp herb patty, cheddar melt, jalapeños and house special garlic mayo.'
  },
  {
    id: 'prod-5',
    shopId: 'canteen-main',
    shopName: 'Quad Cafe & Food Court',
    name: 'Fresh Berry Smoothie Bowl',
    category: 'Food',
    price: 110,
    stock: 20,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&auto=format&fit=crop&q=80',
    description: 'Blended Greek yogurt, blueberries, chia seeds, sliced bananas and granola.'
  },
  {
    id: 'prod-6',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Supplies',
    name: 'NEXORA Premium Hardbound Dot-Grid Notebook',
    category: 'Stationery',
    price: 190,
    stock: 60,
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80',
    description: '192 dot-grid pages, 100 GSM bleed-proof archival paper, ribbon marker.'
  },
  {
    id: 'prod-7',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Supplies',
    name: 'Classmate Pulse Spiral Register (240 pgs)',
    category: 'Stationery',
    price: 110,
    stock: 75,
    lowStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&auto=format&fit=crop&q=80',
    description: 'Standard engineering lecture notebook with micro-perforated pages.'
  },
  {
    id: 'prod-8',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Supplies',
    name: 'Pilot G2 0.7mm Gel Roller Pens (Pack of 3)',
    category: 'Stationery',
    price: 150,
    stock: 90,
    lowStockThreshold: 25,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&auto=format&fit=crop&q=80',
    description: 'Smooth writing refillable black ink gel roller pens with rubber grip.'
  },
  {
    id: 'prod-9',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Supplies',
    name: 'Casio Scientific Calculator fx-991CW',
    category: 'Merchandise',
    price: 1450,
    stock: 18,
    lowStockThreshold: 5,
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e4cb?w=300&auto=format&fit=crop&q=80',
    description: 'Latest ClassWiz non-programmable engineering calculator with QR visualization.'
  },
  {
    id: 'prod-10',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Supplies',
    name: 'Official NEXORA Varsity Heavyweight Hoodie',
    category: 'Merchandise',
    price: 999,
    stock: 30,
    lowStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80',
    description: '100% organic cotton fleece, embroidered varsity crest, unisex fit.'
  },
  {
    id: 'prod-11',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Printing',
    name: 'A4 B&W Laser Printing (Per Page)',
    category: 'Printing',
    price: 3,
    stock: 9999,
    lowStockThreshold: 100,
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=300&auto=format&fit=crop&q=80',
    description: 'Instant cloud duplex laser print job released via student palm terminal.'
  },
  {
    id: 'prod-12',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Printing',
    name: 'A4 Color Laser Printing (Per Page)',
    category: 'Printing',
    price: 10,
    stock: 9999,
    lowStockThreshold: 100,
    image: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=300&auto=format&fit=crop&q=80',
    description: 'High resolution 1200DPI vibrant color output for reports & presentations.'
  },
  {
    id: 'prod-13',
    shopId: 'stationery-hub',
    shopName: 'Campus Store & Printing',
    name: 'Project Thesis Hardbound Spiral Binding',
    category: 'Printing',
    price: 120,
    stock: 50,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&auto=format&fit=crop&q=80',
    description: 'Clear transparent protective front sheet, hardback and metal ring binding.'
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    userId: 'usr-001',
    title: 'NEXORA Student Official Identity Card',
    category: 'Identity',
    issuer: 'Registrar Office, NEXORA Campus',
    issueDate: '01 Aug 2025',
    fileSize: '1.2 MB',
    verified: true
  },
  {
    id: 'doc-2',
    userId: 'usr-001',
    title: 'Semester 1 Official Academic Transcript',
    category: 'Academic',
    issuer: 'Controller of Examinations',
    issueDate: '15 Jan 2026',
    fileSize: '840 KB',
    verified: true,
    shareCode: 'SHARE-8891-T77',
    shareExpiresAt: 'Expires in 28 mins'
  },
  {
    id: 'doc-3',
    userId: 'usr-001',
    title: 'National HackSphere Finalist & Merit Certificate',
    category: 'Certificates',
    issuer: 'Academic Innovation Board',
    issueDate: '10 Sep 2026',
    fileSize: '2.1 MB',
    verified: true
  }
];

export const MOCK_BOOKS: LibraryBook[] = [
  {
    id: 'bk-101',
    title: 'Principles of Modern Marketing Management',
    author: 'Philip Kotler & Kevin Lane',
    isbn: '978-0133856460',
    category: 'Business & Economics',
    availableCopies: 4,
    totalCopies: 10,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    location: 'Shelf B-14, 2nd Floor Library'
  },
  {
    id: 'bk-102',
    title: 'Corporate Finance: Theory and Practice',
    author: 'Aswath Damodaran',
    isbn: '978-0470128039',
    category: 'Finance',
    availableCopies: 1,
    totalCopies: 6,
    coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&auto=format&fit=crop&q=80',
    location: 'Shelf F-08, 2nd Floor Library'
  },
  {
    id: 'bk-103',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category: 'Computer Science',
    availableCopies: 3,
    totalCopies: 8,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&auto=format&fit=crop&q=80',
    location: 'Shelf CS-02, 1st Floor Library'
  }
];

export const MOCK_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'tkt-301',
    ticketNo: 'NEXORA-TKT-9021',
    userId: 'usr-001',
    userName: 'PRANAV',
    category: 'Classroom',
    description: 'HDMI Audio Projector cable faulty in Room A403 during 10:00 AM class.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: 'Yesterday, 11:30 AM',
    assignedPerson: 'IT Infrastructure Dept (Ramesh K.)'
  },
  {
    id: 'tkt-302',
    ticketNo: 'NEXORA-TKT-8812',
    userId: 'usr-001',
    userName: 'PRANAV',
    category: 'Wi-Fi',
    description: 'High latency on NEXORA-5G-CAMPUS node in Library 2nd Floor silent study zone.',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '28 Sep 2026',
    assignedPerson: 'Network Operations'
  }
];

export const MOCK_TERMINALS: TerminalDevice[] = [
  {
    id: 'term-403',
    terminalCode: 'NEXORA-TERM-A403',
    locationName: 'Classroom A403 Outer Terminal',
    roomNumber: 'A403',
    type: 'CLASSROOM',
    status: 'ONLINE',
    lastPing: '2 seconds ago',
    firmwareVersion: 'v2.4.1-palm',
    ipAddress: '10.14.2.103',
    macAddress: '70:B3:D5:E4:91:01',
    photoUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80',
    assignedDept: 'School of Business',
    isOperational: true,
    maintenanceHistory: []
  },
  {
    id: 'term-404',
    terminalCode: 'NEXORA-TERM-A404',
    locationName: 'Classroom A404 Outer Terminal',
    roomNumber: 'A404',
    type: 'CLASSROOM',
    status: 'ONLINE',
    lastPing: '3 seconds ago',
    firmwareVersion: 'v2.4.1-palm',
    ipAddress: '10.14.2.104',
    macAddress: '70:B3:D5:E4:91:02',
    photoUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&auto=format&fit=crop&q=80',
    assignedDept: 'School of Business',
    isOperational: true,
    maintenanceHistory: []
  },
  {
    id: 'term-lib',
    terminalCode: 'NEXORA-TERM-LIB-MAIN',
    locationName: 'Central Library Turnstile Gate',
    roomNumber: 'Library Gate',
    type: 'LIBRARY',
    status: 'ONLINE',
    lastPing: '1 second ago',
    firmwareVersion: 'v2.4.1-palm',
    ipAddress: '10.14.1.20',
    macAddress: '70:B3:D5:E4:80:5A',
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&auto=format&fit=crop&q=80',
    assignedDept: 'Central Library System',
    isOperational: true,
    maintenanceHistory: []
  },
  {
    id: 'term-gate1',
    terminalCode: 'NEXORA-TERM-GATE-1',
    locationName: 'Main Campus Gate Security Desk',
    roomNumber: 'Gate 1',
    type: 'GATE',
    status: 'ONLINE',
    lastPing: 'Just now',
    firmwareVersion: 'v2.4.0-palm',
    ipAddress: '10.14.0.1',
    macAddress: '70:B3:D5:E4:11:00',
    photoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&auto=format&fit=crop&q=80',
    assignedDept: 'Campus Security & Vigilance',
    isOperational: true,
    maintenanceHistory: [
      {
        id: 'maint-01',
        terminalId: 'term-gate1',
        reportedTime: '12 Oct 2026, 09:00 AM',
        reason: 'Optical sensor recalibration after power surge',
        assignedTechnician: 'Ramesh Verma (Hardware Engineer)',
        expectedRestorationDate: '12 Oct 2026, 11:30 AM',
        status: 'RESTORED',
        restoredAt: '12 Oct 2026, 11:15 AM',
        restorationNotes: 'Sensor recalibrated, vascular threshold test passed (99.8% match rate)'
      }
    ]
  },
  {
    id: 'term-cant',
    terminalCode: 'NEXORA-TERM-CANTEEN-POS',
    locationName: 'Canteen POS Express Station',
    roomNumber: 'Canteen',
    type: 'CANTEEN',
    status: 'ONLINE',
    lastPing: '4 seconds ago',
    firmwareVersion: 'v2.4.1-palm',
    ipAddress: '10.14.3.44',
    macAddress: '70:B3:D5:E4:44:99',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
    assignedDept: 'Campus Dining Services',
    isOperational: true,
    maintenanceHistory: []
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    user: 'Dr. Sarah Jenkins',
    role: 'FACULTY',
    action: 'SUBMIT_ATTENDANCE',
    target: 'Marketing MKT-201 (Room A403) - 48 Present, 2 Absent',
    timestamp: 'Today, 11:15 AM',
    result: 'SUCCESS'
  },
  {
    id: 'log-02',
    user: 'PRANAV (NR-2026-8891)',
    role: 'STUDENT',
    action: 'PALM_AUTHENTICATION',
    target: 'Terminal NEXORA-TERM-A403 (Room Entrance)',
    timestamp: 'Today, 09:58 AM',
    result: 'SUCCESS'
  },
  {
    id: 'log-03',
    user: 'PRANAV (NR-2026-8891)',
    role: 'STUDENT',
    action: 'CANTEEN_WALLET_PAYMENT',
    target: 'Order #NEXORA-ORD-4491 (₹120)',
    timestamp: 'Today, 08:45 AM',
    result: 'SUCCESS'
  },
  {
    id: 'log-04',
    user: 'Management Admin',
    role: 'MANAGEMENT',
    action: 'GENERATE_CAMPUS_REPORT',
    target: 'Daily Attendance & Financial Analytics PDF',
    timestamp: '01 Oct 2026, 06:00 PM',
    result: 'SUCCESS'
  }
];

export const DEMO_STUDENT_DIRECTORY = [
  {
    id: 'std-8891',
    studentId: 'NR-2026-8891',
    name: 'PRANAV',
    program: 'BBA',
    semester: 2,
    department: 'School of Business',
    attendance: 82.4,
    status: 'ACTIVE',
    palmVerified: true
  },
  {
    id: 'std-8892',
    studentId: 'NR-2026-8892',
    name: 'Aarav Sharma',
    program: 'B.Tech CS',
    semester: 4,
    department: 'Computer Science',
    attendance: 94.1,
    status: 'ACTIVE',
    palmVerified: true
  },
  {
    id: 'std-8893',
    studentId: 'NR-2026-8893',
    name: 'Ananya Verma',
    program: 'BBA',
    semester: 2,
    department: 'School of Business',
    attendance: 74.8,
    status: 'WARNING',
    palmVerified: true
  },
  {
    id: 'std-8894',
    studentId: 'NR-2026-8894',
    name: 'Rohan Mehta',
    program: 'Economics Honors',
    semester: 6,
    department: 'School of Business',
    attendance: 89.2,
    status: 'ACTIVE',
    palmVerified: true
  },
  {
    id: 'std-8895',
    studentId: 'NR-2026-8895',
    name: 'Sneha Patel',
    program: 'B.Tech AI',
    semester: 2,
    department: 'Computer Science',
    attendance: 91.5,
    status: 'ACTIVE',
    palmVerified: true
  }
];

// ==========================================
// NEW MOCK DATASETS
// ==========================================

export const MOCK_MEDICAL_RECORD: MedicalRecord = {
  id: 'med-8891',
  studentId: 'NR-2026-8891',
  bloodGroup: 'O+ Positive',
  allergies: ['Penicillin', 'Peanuts (Mild)'],
  chronicConditions: ['None'],
  emergencyContact: 'Mr. Rajesh Kumar (+91 98765 00000)',
  insurancePolicyNo: 'STAR-HEALTH-NEXORA-882199',
  recentVisits: [
    {
      date: '24 Sep 2026',
      doctorName: 'Dr. Anita Roy (Campus Chief Medical Officer)',
      diagnosis: 'Routine Seasonal Allergy Checkup',
      prescription: 'Cetirizine 10mg OD x 5 Days',
      vitalBP: '120/80 mmHg',
      temperature: '98.4°F'
    },
    {
      date: '10 Aug 2026',
      doctorName: 'Dr. V. Sharma (Sports Injuries)',
      diagnosis: 'Mild Ankle Sprain (Basketball Practice)',
      prescription: 'Volini Gel + Elastic Bandage',
      vitalBP: '118/76 mmHg',
      temperature: '98.6°F'
    }
  ]
};

export const MOCK_FEE_ITEMS: FeeItem[] = [
  {
    id: 'fee-101',
    title: 'Semester 2 Academic Tuition Fee',
    dueDate: '15 NOV 2026',
    totalAmount: 45000,
    paidAmount: 45000,
    status: 'PAID',
    category: 'Tuition'
  },
  {
    id: 'fee-102',
    title: 'Hostel Block B Room & Utilities Fee',
    dueDate: '30 NOV 2026',
    totalAmount: 18000,
    paidAmount: 9000,
    status: 'PARTIAL',
    category: 'Hostel'
  },
  {
    id: 'fee-103',
    title: 'End-Term Examination Fee',
    dueDate: '05 DEC 2026',
    totalAmount: 2500,
    paidAmount: 0,
    status: 'PENDING',
    category: 'Examination'
  }
];

export const MOCK_HOSTEL_DETAILS: HostelDetails = {
  block: 'Block B (Boys Resident Hall)',
  roomNo: '304 (Deluxe Twin)',
  wardenName: 'Prof. S. N. Mukherjee',
  wardenPhone: '+91 11 2987 4001',
  messPassActive: true,
  dietPreference: 'SPECIAL',
  gatePasses: [
    {
      id: 'gp-01',
      reason: 'Weekend Home Visit',
      departureTime: '26 Sep 05:00 PM',
      returnTime: '28 Sep 09:00 PM',
      status: 'APPROVED'
    }
  ]
};

export const MOCK_TRANSPORT_ROUTE: TransportRoute = {
  id: 'tr-04',
  routeNo: 'Route #4',
  routeName: 'South Campus Express (Green Park - City Center)',
  busNo: 'DL-01-PC-8891',
  driverName: 'Mr. Satish Pal',
  driverPhone: '+91 98112 34567',
  pickupTime: '07:45 AM (Stop 3: Hauz Khas)',
  currentLocation: 'Arrived at Gate 1 Main Drop-Off',
  passValidity: 'Valid till 31 DEC 2026'
};

export const MOCK_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: 'pd-01',
    companyName: 'McKinsey & Company',
    role: 'Junior Business Analyst',
    ctc: '₹18.5 LPA',
    driveDate: '12 NOV 2026',
    eligibilityCgpa: 3.5,
    applied: true,
    status: 'INTERVIEW_SCHEDULED'
  },
  {
    id: 'pd-02',
    companyName: 'Deloitte India',
    role: 'Financial Risk Advisory Consultant',
    ctc: '₹12.0 LPA',
    driveDate: '18 NOV 2026',
    eligibilityCgpa: 3.2,
    applied: false,
    status: 'OPEN'
  },
  {
    id: 'pd-03',
    companyName: 'Amazon Development Center',
    role: 'Operations & Program Manager',
    ctc: '₹16.0 LPA',
    driveDate: '25 NOV 2026',
    eligibilityCgpa: 3.4,
    applied: false,
    status: 'OPEN'
  }
];

export const MOCK_EXAM_GRADES: ExamGrade[] = [
  {
    code: 'MKT-201',
    subjectName: 'Marketing Management',
    credits: 4,
    midSemMarks: 26,
    endSemMarks: 44,
    internalMarks: 18,
    totalMarks: 88,
    gradeLetter: 'A+'
  },
  {
    code: 'ECO-102',
    subjectName: 'Micro Economics',
    credits: 3,
    midSemMarks: 22,
    endSemMarks: 39,
    internalMarks: 16,
    totalMarks: 77,
    gradeLetter: 'A'
  },
  {
    code: 'FIN-304',
    subjectName: 'Corporate Finance',
    credits: 4,
    midSemMarks: 28,
    endSemMarks: 47,
    internalMarks: 19,
    totalMarks: 94,
    gradeLetter: 'A+'
  },
  {
    code: 'MGT-101',
    subjectName: 'Organizational Management',
    credits: 3,
    midSemMarks: 24,
    endSemMarks: 42,
    internalMarks: 17,
    totalMarks: 83,
    gradeLetter: 'A'
  }
];

export const MOCK_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-01',
    title: 'Apple iPad Air with Apple Pencil',
    locationFound: 'Library 2nd Floor Study Desk',
    dateFound: 'Yesterday, 06:00 PM',
    category: 'Electronics',
    status: 'UNCLAIMED',
    contactPerson: 'Central Security Gate 1 Desk'
  },
  {
    id: 'lf-02',
    title: 'Leather Wallet with NEXORA Student ID',
    locationFound: 'Canteen Counter 2',
    dateFound: '29 Sep 2026',
    category: 'IDs & Cards',
    status: 'CLAIMED',
    contactPerson: 'Canteen Manager'
  }
];

export const MOCK_CAMPUS_POLLS: CampusPoll[] = [
  {
    id: 'poll-01',
    question: 'Should the Canteen introduce Organic Smoothie & Juice Bars?',
    options: [
      { text: 'Yes, definitely!', votes: 342 },
      { text: 'Prefer traditional coffee/tea', votes: 89 },
      { text: 'Neutral', votes: 45 }
    ],
    totalVotes: 476
  }
];

// ==========================================
// REAL FACULTY DIRECTORY & INSTRUCTOR DATA
// ==========================================

export const MOCK_FACULTY_LIST: FacultyMember[] = [
  {
    id: 'fac-01',
    name: 'Prof. Dr. Rajesh Sharma',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
    degree: 'Ph.D. (IIT Delhi) • M.Tech (IIT Bombay)',
    email: 'r.sharma@nexora.edu',
    phone: '+91 98101 23456',
    office: 'Academic Block A, Cabin 412',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    rating: 4.9,
    specialization: ['Distributed Systems', 'Operating Systems', 'Cloud Architecture'],
    courses: [
      {
        code: 'CS-401',
        name: 'Advanced Operating Systems',
        room: 'Room A403 Terminal',
        time: '10:00 AM - 11:15 AM',
        studentsCount: 50,
        credits: 4
      },
      {
        code: 'CS-502',
        name: 'Distributed Cloud Infrastructure',
        room: 'Tech Lab 3 Terminal',
        time: '02:00 PM - 03:15 PM',
        studentsCount: 45,
        credits: 4
      }
    ]
  },
  {
    id: 'fac-02',
    name: 'Dr. Priya Venkataraman',
    designation: 'Associate Professor & AI Lab Director',
    department: 'Artificial Intelligence & Data Science',
    degree: 'Ph.D. (IISc Bangalore) • B.Tech (NIT Trichy)',
    email: 'p.venkataraman@nexora.edu',
    phone: '+91 98450 78912',
    office: 'Tech Block B, Cabin 208',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    rating: 4.95,
    specialization: ['Computer Vision', 'Subdermal Palm Biometrics', 'Deep Learning'],
    courses: [
      {
        code: 'AI-302',
        name: 'Biometrics & Neural Architectures',
        room: 'Room B204 Terminal',
        time: '11:30 AM - 12:45 PM',
        studentsCount: 48,
        credits: 4
      },
      {
        code: 'AI-303',
        name: 'Deep Learning Systems Lab',
        room: 'AI Innovation Lab',
        time: '03:15 PM - 04:30 PM',
        studentsCount: 42,
        credits: 3
      }
    ]
  },
  {
    id: 'fac-03',
    name: 'Prof. Vikramaditya Rao',
    designation: 'Dean of Academic Affairs & Professor',
    department: 'Information Science & Engineering',
    degree: 'Ph.D. (BITS Pilani) • M.S. (Carnegie Mellon)',
    email: 'dean.academics@nexora.edu',
    phone: '+91 98220 11223',
    office: 'Administrative Towers, Floor 3',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    rating: 4.82,
    specialization: ['Cryptographic Protocols', 'Zero Knowledge Proofs', 'Network Security'],
    courses: [
      {
        code: 'ISE-404',
        name: 'Cryptographic Protocols & Cyber Defense',
        room: 'Auditorium A Terminal',
        time: '09:00 AM - 10:15 AM',
        studentsCount: 60,
        credits: 4
      }
    ]
  },
  {
    id: 'fac-04',
    name: 'Dr. Sarah Jenkins',
    designation: 'Associate Professor & MBA Program Chair',
    department: 'School of Management Studies',
    degree: 'Ph.D. (Harvard Business School) • MBA (Wharton)',
    email: 's.jenkins@nexora.edu',
    phone: '+91 98711 55443',
    office: 'Academic Block A, Cabin 305',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    rating: 4.88,
    specialization: ['Marketing Strategy', 'Brand Economics', 'Behavioral Analytics'],
    courses: [
      {
        code: 'MKT-201',
        name: 'Marketing Management',
        room: 'Room A403 Terminal',
        time: '10:00 AM - 11:15 AM',
        studentsCount: 50,
        credits: 4
      },
      {
        code: 'MKT-304',
        name: 'Consumer Behavior Analytics',
        room: 'Seminar Hall 1',
        time: '01:30 PM - 02:45 PM',
        studentsCount: 38,
        credits: 3
      }
    ]
  },
  {
    id: 'fac-05',
    name: 'Prof. Rameshwar Sen',
    designation: 'Department Chair & Senior Professor',
    department: 'Economics & Policy Studies',
    degree: 'Ph.D. (London School of Economics) • M.Phil (JNU)',
    email: 'r.sen@nexora.edu',
    phone: '+91 98118 66778',
    office: 'Academic Block C, Cabin 104',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    rating: 4.75,
    specialization: ['Macroeconomics', 'Econometrics', 'Public Financial Policy'],
    courses: [
      {
        code: 'ECO-102',
        name: 'Micro Economics',
        room: 'Lecture Hall Complex L102',
        time: '02:00 PM - 03:15 PM',
        studentsCount: 52,
        credits: 3
      }
    ]
  },
  {
    id: 'fac-06',
    name: 'Dr. Elena Rostova',
    designation: 'Professor of FinTech & Financial Modeling',
    department: 'Department of Corporate Finance',
    degree: 'Ph.D. (Oxford University) • CFA Charterholder',
    email: 'e.rostova@nexora.edu',
    phone: '+91 98199 44332',
    office: 'Academic Block A, Cabin 310',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
    rating: 4.92,
    specialization: ['Corporate Finance', 'Algorithmic Trading', 'Venture Capital'],
    courses: [
      {
        code: 'FIN-304',
        name: 'Corporate Finance & Risk Modeling',
        room: 'Room A404 Terminal',
        time: '11:30 AM - 12:45 PM',
        studentsCount: 46,
        credits: 4
      }
    ]
  }
];

// ==========================================
// REAL COURSE ASSIGNMENTS & SUBMISSIONS
// ==========================================

export const MOCK_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-01',
    courseCode: 'CS-401',
    courseName: 'Advanced Operating Systems',
    title: 'Distributed Key-Value Store with Raft Consensus Engine',
    dueDate: '28 OCT 2026',
    maxMarks: 50,
    totalSubmissions: 42,
    totalStudents: 50,
    description: 'Implement leader election, log replication and snapshotting in Go or Rust with unit benchmarks.',
    submissions: [
      {
        studentId: 'NR-2026-8891',
        studentName: 'PRANAV',
        submittedAt: 'Yesterday, 11:20 PM',
        status: 'SUBMITTED',
        fileUrl: 'raft_consensus_pranav.tar.gz'
      },
      {
        studentId: 'NR-2026-8892',
        studentName: 'Aarav Sharma',
        submittedAt: 'Yesterday, 09:14 PM',
        status: 'GRADED',
        marks: 48,
        grade: 'A+'
      },
      {
        studentId: 'NR-2026-8895',
        studentName: 'Sneha Patel',
        submittedAt: 'Today, 08:30 AM',
        status: 'SUBMITTED'
      }
    ]
  },
  {
    id: 'asg-02',
    courseCode: 'AI-302',
    courseName: 'Biometrics & Neural Architectures',
    title: 'Subdermal Palm Vascular Pattern Extraction & Siamese Matching',
    dueDate: '02 NOV 2026',
    maxMarks: 40,
    totalSubmissions: 38,
    totalStudents: 48,
    description: 'Train a lightweight Siamese CNN on infrared palm vein dataset with 99.8% precision at 10ms inference.',
    submissions: [
      {
        studentId: 'NR-2026-8891',
        studentName: 'PRANAV',
        submittedAt: 'Today, 10:15 AM',
        status: 'GRADED',
        marks: 39,
        grade: 'A+'
      }
    ]
  },
  {
    id: 'asg-03',
    courseCode: 'MKT-201',
    courseName: 'Marketing Management',
    title: 'Omnichannel Go-To-Market Blueprint for Campus SuperApp',
    dueDate: '25 OCT 2026',
    maxMarks: 30,
    totalSubmissions: 46,
    totalStudents: 50,
    description: 'Construct customer acquisition funnels, CAC/LTV benchmarks, and retention loop models.',
    submissions: []
  }
];

// ==========================================
// REAL CAMPUS MERCHANT ORDERS
// ==========================================

export const INITIAL_CAMPUS_ORDERS: CampusOrder[] = [
  {
    id: 'ord-101',
    userId: 'usr-001',
    userName: 'PRANAV',
    shopName: 'Quad Cafe & Food Court',
    items: [
      { productId: 'prod-2', name: 'Grilled Paneer Tikka Sandwich', quantity: 1, price: 120 },
      { productId: 'prod-1', name: 'Artisanal Cold Brew Coffee', quantity: 1, price: 80 }
    ],
    totalAmount: 200,
    status: 'READY',
    pickupCode: 'PK-44',
    timestamp: 'Today, 10:45 AM',
    paymentId: 'TX-PAY-8891-91'
  },
  {
    id: 'ord-102',
    userId: 'usr-002',
    userName: 'Aarav Sharma',
    shopName: 'Campus Store & Supplies',
    items: [
      { productId: 'prod-7', name: 'Classmate Pulse Spiral Register', quantity: 1, price: 110 },
      { productId: 'prod-8', name: 'Pilot G2 Gel Roller Pens (Pack of 3)', quantity: 1, price: 150 }
    ],
    totalAmount: 260,
    status: 'PREPARING',
    pickupCode: 'PK-45',
    timestamp: 'Today, 11:05 AM',
    paymentId: 'TX-PAY-8892-12'
  },
  {
    id: 'ord-103',
    userId: 'usr-005',
    userName: 'Sneha Patel',
    shopName: 'Campus Store & Supplies',
    items: [
      { productId: 'prod-9', name: 'Casio Scientific Calculator fx-991CW', quantity: 1, price: 1450 }
    ],
    totalAmount: 1450,
    status: 'COLLECTED',
    pickupCode: 'PK-39',
    timestamp: 'Yesterday, 03:20 PM',
    paymentId: 'TX-PAY-8895-04'
  }
];

// ==========================================
// REAL CAMPUS NOTIFICATIONS
// ==========================================

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Mid-Semester Examination Schedule Published',
    message: 'Official timetable for Fall 2026 mid-term examinations is now available. Verify hall ticket clearance.',
    category: 'EXAM',
    timestamp: '10 mins ago',
    read: false,
    targetTab: 'grades'
  },
  {
    id: 'notif-2',
    title: 'Library Book Return Due Today',
    message: '"Principles of Marketing" by Kotler is due at Central Library by 05:00 PM. Avoid late return penalty of ₹10/day.',
    category: 'LIBRARY',
    timestamp: '1 hour ago',
    read: false,
    targetTab: 'library'
  },
  {
    id: 'notif-3',
    title: 'Live Attendance Session Started: Marketing Management',
    message: 'Dr. Sarah Jenkins has opened live biometric attendance in Room A403. Check in within 15 minutes.',
    category: 'ATTENDANCE',
    timestamp: '2 hours ago',
    read: true,
    targetTab: 'attendance'
  },
  {
    id: 'notif-4',
    title: 'Semester Tuition & Lab Fee Due Date Approaching',
    message: 'Semester 2 installment balance of ₹24,000 is due on Nov 15th. Pay online via NEXORA Pay with zero charges.',
    category: 'FEES',
    timestamp: '1 day ago',
    read: true,
    targetTab: 'fees'
  },
  {
    id: 'notif-5',
    title: 'Canteen Flash Offer: 20% Off Artisanal Beverages',
    message: 'Use code COMBO20 at the Quad Cafe checkout for 20% off handcrafted cold brews & snacks.',
    category: 'SHOP',
    timestamp: '2 days ago',
    read: true,
    targetTab: 'marketplace'
  }
];

// ==========================================
// REAL LIVE ATTENDANCE SESSION
// ==========================================

export const INITIAL_LIVE_ATTENDANCE_SESSION: LiveAttendanceSession = {
  id: 'sess-live-403',
  courseCode: 'MKT-201',
  courseName: 'Marketing Management',
  facultyId: 'fac-01',
  facultyName: 'Dr. Sarah Jenkins',
  room: 'A403',
  building: 'Academic Block A',
  status: 'LIVE',
  startTime: '10:00 AM',
  endTime: '11:15 AM',
  recordedStudentIds: []
};

// ==========================================
// DETAILED STUDENT ATTENDANCE HISTORY
// ==========================================

export const MOCK_ATTENDANCE_HISTORY: AttendanceSessionRecord[] = [
  {
    id: 'att-rec-101',
    date: '23 Oct 2026',
    time: '10:00 AM - 11:15 AM',
    courseCode: 'MKT-201',
    courseName: 'Marketing Management',
    facultyName: 'Dr. Sarah Jenkins',
    room: 'A403',
    status: 'PRESENT',
    verificationMethod: 'Palm Biometrics'
  },
  {
    id: 'att-rec-102',
    date: '22 Oct 2026',
    time: '11:30 AM - 12:45 PM',
    courseCode: 'FIN-304',
    courseName: 'Corporate Finance',
    facultyName: 'Dr. Elena Rostova',
    room: 'A404',
    status: 'PRESENT',
    verificationMethod: 'Palm Biometrics'
  },
  {
    id: 'att-rec-103',
    date: '22 Oct 2026',
    time: '02:00 PM - 03:15 PM',
    courseCode: 'ECO-102',
    courseName: 'Micro Economics',
    facultyName: 'Prof. Rajesh Kumar',
    room: 'L102',
    status: 'ABSENT',
    verificationMethod: 'N/A'
  },
  {
    id: 'att-rec-104',
    date: '21 Oct 2026',
    time: '10:00 AM - 11:15 AM',
    courseCode: 'MGT-101',
    courseName: 'Organizational Management',
    facultyName: 'Prof. David Vance',
    room: 'A402',
    status: 'PRESENT',
    verificationMethod: 'Palm Biometrics'
  },
  {
    id: 'att-rec-105',
    date: '20 Oct 2026',
    time: '11:30 AM - 12:45 PM',
    courseCode: 'MKT-201',
    courseName: 'Marketing Management',
    facultyName: 'Dr. Sarah Jenkins',
    room: 'A403',
    status: 'PRESENT',
    verificationMethod: 'Manual Override',
    correctedBy: 'Dr. Sarah Jenkins',
    correctionReason: 'Authorized medical leave slip submitted'
  },
  {
    id: 'att-rec-106',
    date: '19 Oct 2026',
    time: '02:00 PM - 03:15 PM',
    courseCode: 'FIN-304',
    courseName: 'Corporate Finance',
    facultyName: 'Dr. Elena Rostova',
    room: 'A404',
    status: 'CANCELLED',
    verificationMethod: 'N/A',
    correctionReason: 'Faculty guest lecture at National Economic Conclave'
  },
  {
    id: 'att-rec-107',
    date: '18 Oct 2026',
    time: '10:00 AM - 11:15 AM',
    courseCode: 'ECO-102',
    courseName: 'Micro Economics',
    facultyName: 'Prof. Rajesh Kumar',
    room: 'L102',
    status: 'PRESENT',
    verificationMethod: 'Palm Biometrics'
  },
  {
    id: 'att-rec-108',
    date: '17 Oct 2026',
    time: '09:00 AM - 10:15 AM',
    courseCode: 'MGT-101',
    courseName: 'Organizational Management',
    facultyName: 'Prof. David Vance',
    room: 'A402',
    status: 'PRESENT',
    verificationMethod: 'Palm Biometrics'
  }
];

// ==========================================
// STUDENT ACADEMIC TIMETABLE
// ==========================================

export const MOCK_STUDENT_TIMETABLE: TimetableEntry[] = [
  // Monday
  {
    id: 'tt-mon-1',
    day: 'Monday',
    courseCode: 'MKT-201',
    courseName: 'Marketing Management',
    facultyName: 'Dr. Sarah Jenkins',
    room: 'A403',
    building: 'Academic Block A',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    credits: 4,
    status: 'NORMAL'
  },
  {
    id: 'tt-mon-2',
    day: 'Monday',
    courseCode: 'FIN-304',
    courseName: 'Corporate Finance',
    facultyName: 'Dr. Elena Rostova',
    room: 'A404',
    building: 'Academic Block A',
    startTime: '11:30 AM',
    endTime: '12:45 PM',
    credits: 4,
    status: 'NORMAL'
  },
  {
    id: 'tt-mon-3',
    day: 'Monday',
    courseCode: 'ECO-102',
    courseName: 'Micro Economics',
    facultyName: 'Prof. Rajesh Kumar',
    room: 'L102',
    building: 'Lecture Hall Complex',
    startTime: '02:00 PM',
    endTime: '03:15 PM',
    credits: 3,
    status: 'NORMAL'
  },

  // Tuesday
  {
    id: 'tt-tue-1',
    day: 'Tuesday',
    courseCode: 'MGT-101',
    courseName: 'Organizational Management',
    facultyName: 'Prof. David Vance',
    room: 'A402',
    building: 'Academic Block A',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    credits: 3,
    status: 'NORMAL'
  },
  {
    id: 'tt-tue-2',
    day: 'Tuesday',
    courseCode: 'MKT-201',
    courseName: 'Marketing Management Lab',
    facultyName: 'Dr. Sarah Jenkins',
    room: 'Lab B101',
    building: 'Innovation Block',
    startTime: '11:30 AM',
    endTime: '01:00 PM',
    credits: 2,
    status: 'NORMAL'
  },

  // Wednesday
  {
    id: 'tt-wed-1',
    day: 'Wednesday',
    courseCode: 'FIN-304',
    courseName: 'Corporate Finance',
    facultyName: 'Dr. Elena Rostova',
    room: 'A404',
    building: 'Academic Block A',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    credits: 4,
    status: 'NORMAL'
  },
  {
    id: 'tt-wed-2',
    day: 'Wednesday',
    courseCode: 'ECO-102',
    courseName: 'Micro Economics',
    facultyName: 'Prof. Rajesh Kumar',
    room: 'L102',
    building: 'Lecture Hall Complex',
    startTime: '11:30 AM',
    endTime: '12:45 PM',
    credits: 3,
    status: 'NORMAL'
  },

  // Thursday
  {
    id: 'tt-thu-1',
    day: 'Thursday',
    courseCode: 'MKT-201',
    courseName: 'Marketing Management',
    facultyName: 'Dr. Sarah Jenkins',
    room: 'A403',
    building: 'Academic Block A',
    startTime: '10:00 AM',
    endTime: '11:15 AM',
    credits: 4,
    status: 'NORMAL'
  },
  {
    id: 'tt-thu-2',
    day: 'Thursday',
    courseCode: 'MGT-101',
    courseName: 'Organizational Management',
    facultyName: 'Prof. David Vance',
    room: 'A402',
    building: 'Academic Block A',
    startTime: '02:00 PM',
    endTime: '03:15 PM',
    credits: 3,
    status: 'NORMAL'
  },

  // Friday
  {
    id: 'tt-fri-1',
    day: 'Friday',
    courseCode: 'FIN-304',
    courseName: 'Corporate Finance Simulation',
    facultyName: 'Dr. Elena Rostova',
    room: 'FinTech Lab C02',
    building: 'Academic Block C',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    credits: 4,
    status: 'NORMAL'
  },
  {
    id: 'tt-fri-2',
    day: 'Friday',
    courseCode: 'ECO-102',
    courseName: 'Micro Economics Seminar',
    facultyName: 'Prof. Rajesh Kumar',
    room: 'L102',
    building: 'Lecture Hall Complex',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    credits: 3,
    status: 'NORMAL'
  }
];

// ==========================================
// REAL SHOP OFFERS & COUPONS
// ==========================================

export const INITIAL_SHOP_OFFERS: ShopOffer[] = [
  {
    id: 'off-1',
    code: 'COMBO20',
    title: '20% Off Canteen Combos & Artisanal Coffee',
    discountPercentage: 20,
    minOrderAmount: 150,
    validUntil: '31 Oct 2026',
    isActive: true,
    categoryLimit: 'Food'
  },
  {
    id: 'off-2',
    code: 'EXAMFUEL',
    title: '15% Off All Campus Store Purchases',
    discountPercentage: 15,
    minOrderAmount: 200,
    validUntil: '15 Nov 2026',
    isActive: true,
    categoryLimit: 'All'
  },
  {
    id: 'off-3',
    code: 'STATIONERY10',
    title: '10% Off Exam Books & Registers',
    discountPercentage: 10,
    minOrderAmount: 100,
    validUntil: '05 Nov 2026',
    isActive: true,
    categoryLimit: 'Stationery'
  }
];

// ==========================================
// REAL STOCK AUDIT & MOVEMENTS
// ==========================================

export const INITIAL_STOCK_MOVEMENTS: StockMovementRecord[] = [
  {
    id: 'sm-1',
    productId: 'prod-2',
    productName: 'Grilled Paneer Tikka Sandwich',
    type: 'SALE',
    quantityChange: -1,
    previousStock: 45,
    newStock: 44,
    timestamp: 'Today, 10:45 AM',
    reason: 'Campus Order #ord-101',
    user: 'PRANAV'
  },
  {
    id: 'sm-2',
    productId: 'prod-1',
    productName: 'Artisanal Cold Brew Coffee',
    type: 'SALE',
    quantityChange: -1,
    previousStock: 60,
    newStock: 59,
    timestamp: 'Today, 10:45 AM',
    reason: 'Campus Order #ord-101',
    user: 'PRANAV'
  },
  {
    id: 'sm-3',
    productId: 'prod-7',
    productName: 'Classmate Pulse Spiral Register',
    type: 'RESTOCK',
    quantityChange: 50,
    previousStock: 25,
    newStock: 75,
    timestamp: 'Yesterday, 02:00 PM',
    reason: 'Weekly Wholesale Delivery (ITC Supplier)',
    user: 'Suresh Nair (Manager)'
  },
  {
    id: 'sm-4',
    productId: 'prod-9',
    productName: 'Casio Scientific Calculator fx-991CW',
    type: 'MANUAL_ADJUSTMENT',
    quantityChange: 10,
    previousStock: 5,
    newStock: 15,
    timestamp: '21 Oct 2026',
    reason: 'Warehouse Audit Inventory Correction',
    user: 'Suresh Nair (Manager)'
  }
];

// ==========================================
// REAL SHOP ENTITY PROFILE
// ==========================================

export const INITIAL_SHOP_PROFILE: ShopProfile = {
  id: 'canteen-main',
  name: 'The Central Quad Cafe & Campus Store',
  managerName: 'Mr. Suresh Nair',
  phone: '+91 98112 99001',
  email: 'quadcafe@nexora.edu',
  location: 'Student Center Ground Floor (Near Courtyard Fountain)',
  operatingHours: '07:30 AM – 09:30 PM (Mon–Sat)',
  category: 'Canteen, Gourmet Coffee, Stationery & Digital Printing',
  gstin: '07AAAAA0000A1Z5',
  fssaiNumber: '10019011006542'
};

// ==========================================
// REAL LIBRARY ISSUES & CIRCULATION
// ==========================================

export const INITIAL_LIBRARY_ISSUES: LibraryIssueRecord[] = [
  {
    id: 'iss-1',
    bookId: 'b-1',
    bookTitle: 'Principles of Marketing (18th Global Ed)',
    userId: 'usr-001',
    userName: 'PRANAV',
    userRole: 'STUDENT',
    issueDate: '10 Oct 2026',
    dueDate: '24 Oct 2026',
    status: 'ISSUED',
    fineAmount: 0,
    finePaid: false
  },
  {
    id: 'iss-2',
    bookId: 'b-2',
    bookTitle: 'Corporate Finance: Theory and Practice',
    userId: 'usr-002',
    userName: 'Aarav Sharma',
    userRole: 'STUDENT',
    issueDate: '01 Oct 2026',
    dueDate: '15 Oct 2026',
    status: 'OVERDUE',
    fineAmount: 80,
    finePaid: false
  },
  {
    id: 'iss-3',
    bookId: 'b-3',
    bookTitle: 'Artificial Intelligence: A Modern Approach',
    userId: 'fac-01',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'FACULTY',
    issueDate: '15 Sep 2026',
    dueDate: '15 Nov 2026',
    status: 'ISSUED',
    fineAmount: 0,
    finePaid: false
  },
  {
    id: 'iss-4',
    bookId: 'b-4',
    bookTitle: 'Microeconomic Analysis (Hal Varian)',
    userId: 'usr-005',
    userName: 'Sneha Patel',
    userRole: 'STUDENT',
    issueDate: '25 Sep 2026',
    dueDate: '09 Oct 2026',
    returnDate: '09 Oct 2026',
    status: 'RETURNED',
    fineAmount: 0,
    finePaid: true
  }
];

// ==========================================
// REAL CAMPUS FACILITIES & HOSTELS
// ==========================================

export const INITIAL_FACILITIES: FacilityRecord[] = [
  {
    id: 'fac-hostel-a',
    name: 'Hostel Block A (Senior Boys)',
    type: 'HOSTEL_BOYS',
    building: 'Hostel Complex West',
    location: 'North Campus Lane 2',
    capacity: 450,
    currentOccupancy: 420,
    inCharge: 'Prof. S. N. Mukherjee (Warden)',
    contactPhone: '+91 98451 11220',
    status: 'OPERATIONAL',
    amenities: ['High-speed Wi-Fi', 'Solar Water Heating', 'Study Room', 'Indoor Gym', 'Biometric Palm Turnstile']
  },
  {
    id: 'fac-hostel-b',
    name: 'Hostel Block B (Junior Boys)',
    type: 'HOSTEL_BOYS',
    building: 'Hostel Complex West',
    location: 'North Campus Lane 3',
    capacity: 450,
    currentOccupancy: 440,
    inCharge: 'Dr. Arvind Swamy (Warden)',
    contactPhone: '+91 98451 11221',
    status: 'OPERATIONAL',
    amenities: ['Room 304 (PRANAV)', 'Common Recreation Lounge', 'Mess Hall Connector', '24x7 Security']
  },
  {
    id: 'fac-hostel-c',
    name: 'Hostel Block C (Women\'s Resident Hall)',
    type: 'HOSTEL_GIRLS',
    building: 'Hostel Complex East',
    location: 'East Campus Gardens',
    capacity: 450,
    currentOccupancy: 410,
    inCharge: 'Dr. Meenakshi Sundaram (Chief Warden)',
    contactPhone: '+91 98451 11222',
    status: 'OPERATIONAL',
    amenities: ['Biometric Optical Palm Access', 'Infirmary Annex', 'Reading Rooms', 'Fitness Studio', 'Automated Laundry']
  },
  {
    id: 'fac-mess',
    name: 'Central Annapoorna Dining Hall',
    type: 'CAFETERIA',
    building: 'Student Amenities Hub',
    location: 'Ground Floor, Amenities Center',
    capacity: 1200,
    currentOccupancy: 850,
    inCharge: 'Mr. B. K. Hegde (Mess Supervisor)',
    contactPhone: '+91 98451 11230',
    status: 'OPERATIONAL',
    amenities: ['Nutritional Quality Certified', 'Veg & Non-Veg Counters', 'Continuous Sanitization', 'Digital Palm Coupon Pass']
  },
  {
    id: 'fac-lib',
    name: 'Rabindranath Tagore Central Library',
    type: 'LIBRARY',
    building: 'Academic Block B',
    location: 'Floors 1, 2 & 3',
    capacity: 650,
    currentOccupancy: 380,
    inCharge: 'Dr. Radhakrishnan (Chief University Librarian)',
    contactPhone: '+91 98451 11240',
    status: 'OPERATIONAL',
    amenities: ['120,000 Physical Volumes', 'IEEE/ACM Digital Portal', 'Quiet Research Cubicles', 'Palm Kiosks']
  },
  {
    id: 'fac-acad-a',
    name: 'Sir C.V. Raman Academic Block A',
    type: 'ACADEMIC_BLOCK',
    building: 'Academic Quadrangle',
    location: 'Main University Boulevard',
    capacity: 2200,
    currentOccupancy: 1850,
    inCharge: 'Dean of Academic Affairs',
    contactPhone: '+91 98451 11250',
    status: 'OPERATIONAL',
    amenities: ['Smart Lecture Theatres (A401–A410)', 'Optical Palm Attendance Scanners', 'Air Conditioned']
  },
  {
    id: 'fac-sports',
    name: 'Major Dhyan Chand Indoor Sports Arena',
    type: 'SPORTS_COMPLEX',
    building: 'Sports Complex',
    location: 'South Campus Ring Road',
    capacity: 800,
    currentOccupancy: 210,
    inCharge: 'Col. Ranjit Singh (Director of Physical Education)',
    contactPhone: '+91 98451 11260',
    status: 'OPERATIONAL',
    amenities: ['Wooden Badminton Courts', 'Olympic Swimming Pool', 'Table Tennis Hall', 'Squash Court']
  },
  {
    id: 'fac-lab',
    name: 'Alan Turing AI & Autonomous Systems Lab',
    type: 'LAB',
    building: 'Innovation Block C',
    location: 'Floor 3, Innovation Block',
    capacity: 120,
    currentOccupancy: 95,
    inCharge: 'Dr. Sarah Jenkins',
    contactPhone: '+91 98451 11270',
    status: 'OPERATIONAL',
    amenities: ['NVIDIA H100 GPU Clusters', 'Optical Palm Scanner Development Kits', 'Edge TPU Workstations']
  }
];


