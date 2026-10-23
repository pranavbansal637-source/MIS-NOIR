export type Role = 
  | 'STUDENT'
  | 'FACULTY'
  | 'MANAGEMENT'
  | 'DEPARTMENT_ADMIN'
  | 'BUSINESS'
  | 'CLUB_ADMIN'
  | 'LIBRARY_STAFF'
  | 'HOSTEL_ADMIN'
  | 'SECURITY'
  | 'SUPER_ADMIN'
  | 'KIOSK';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  noirId: string;
  phone?: string;
  palmEnrolled: boolean;
  palmHash?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string;
  name: string;
  program: string; // e.g. BBA, B.Tech CS
  semester: number; // e.g. 2
  batch: string; // e.g. 2025-2028
  department: string;
  avatar: string;
  attendanceOverall: number;
  walletBalance: number;
  cgpa: number;
  qrCode: string;
  isVerified: boolean;
  email: string;
  phone: string;
  bloodGroup: string;
  hostelRoom: string;
  busRoute: string;
}

export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  code: string;
  instructor: string;
  percentage: number;
  attendedClasses: number;
  totalClasses: number;
  requiredPercentage: number;
  classesNeededToTarget: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  recentTrend: number[];
}

export interface ClassSession {
  id: string;
  subjectName: string;
  code: string;
  room: string;
  building: string;
  startTime: string;
  endTime: string;
  facultyName: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface WalletTransaction {
  id: string;
  userId: string;
  merchantName: string;
  category: 'CANTEEN' | 'STATIONERY' | 'PRINTING' | 'EVENTS' | 'LIBRARY' | 'FEES' | 'HOSTEL' | 'TOPUP';
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
  receiptId: string;
  title?: string;
  referenceId?: string;
  itemsSummary?: string;
  description?: string;
  date?: string;
  time?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: 'TECH' | 'INNOVATION' | 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'WORKSHOP';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  fee: number;
  availableSeats: number;
  totalSeats: number;
  posterUrl: string;
  description: string;
  isRegistered: boolean;
  ticketQr?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED' | 'COMPLETED';
}

export interface ProductItem {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  category: 'Food' | 'Stationery' | 'Printing' | 'Merchandise' | 'Services';
  price: number;
  stock: number;
  lowStockThreshold: number;
  image: string;
  description: string;
}

export interface PosPaymentRequest {
  id: string;
  shopName: string;
  amount: number;
  itemsSummary: string;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
}

export interface CampusOrder {
  id: string;
  userId: string;
  userName: string;
  shopName: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COLLECTED' | 'CANCELLED';
  pickupCode: string;
  timestamp: string;
  paymentId: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  title: string;
  category: 'Identity' | 'Academic' | 'Certificates' | 'Resume' | 'Internship' | 'Other';
  issuer: string;
  issueDate: string;
  fileSize: string;
  verified: boolean;
  shareCode?: string;
  shareExpiresAt?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  coverUrl: string;
  location: string;
  isReserved?: boolean;
}

export interface ComplaintTicket {
  id: string;
  ticketNo: string;
  userId: string;
  userName: string;
  userRole?: string;
  category: 'Classroom' | 'Wi-Fi' | 'Electricity' | 'Washroom' | 'Canteen' | 'Security' | 'Transport' | 'Hostel' | 'Other';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  assignedPerson?: string;
}

export interface TerminalDevice {
  id: string;
  terminalCode: string;
  locationName: string;
  roomNumber: string;
  building?: string;
  scannerHardwareId?: string;
  type: 'CLASSROOM' | 'GATE' | 'LIBRARY' | 'CANTEEN' | 'MAIN_KIOSK' | 'SHOP' | 'EVENT';
  status: 'ONLINE' | 'OFFLINE' | 'UPDATING' | 'MAINTENANCE';
  lastPing: string;
  firmwareVersion: string;
  ipAddress: string;
  macAddress: string;
  photoUrl?: string;
  assignedDept?: string;
  department?: string;
  isOperational?: boolean;
  maintenanceHistory?: TerminalMaintenanceLog[];
}

export interface AuditLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  result: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export interface AiChatMessage {
  id: string;
  sender: 'USER' | 'NOIR_AI' | 'NEXORA_AI';
  text: string;
  timestamp: string;
  actionRequired?: {
    type: 'PAYMENT_CONFIRMATION' | 'REGISTER_EVENT' | 'SUBMIT_TICKET';
    details: Record<string, any>;
    confirmed?: boolean;
  };
}

// ==========================================
// NEW FEATURE DATA MODELS (20+ Advanced Features)
// ==========================================

export interface MedicalRecord {
  id: string;
  studentId: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  insurancePolicyNo: string;
  recentVisits: {
    date: string;
    doctorName: string;
    diagnosis: string;
    prescription: string;
    vitalBP: string;
    temperature: string;
  }[];
}

export interface FeeItem {
  id: string;
  title: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  category: 'Tuition' | 'Hostel' | 'Transport' | 'Examination' | 'Library';
}

export interface HostelDetails {
  block: string;
  roomNo: string;
  wardenName: string;
  wardenPhone: string;
  messPassActive: boolean;
  dietPreference: 'VEG' | 'NON_VEG' | 'SPECIAL';
  gatePasses: {
    id: string;
    reason: string;
    departureTime: string;
    returnTime: string;
    status: 'APPROVED' | 'PENDING' | 'EXPIRED';
  }[];
}

export interface TransportRoute {
  id: string;
  routeNo: string;
  routeName: string;
  busNo: string;
  driverName: string;
  driverPhone: string;
  pickupTime: string;
  currentLocation: string;
  passValidity: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  role: string;
  ctc: string;
  driveDate: string;
  eligibilityCgpa: number;
  applied: boolean;
  status: 'OPEN' | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'CLOSED';
}

export interface ExamGrade {
  code: string;
  subjectName: string;
  credits: number;
  midSemMarks: number; // /30
  endSemMarks: number; // /50
  internalMarks: number; // /20
  totalMarks: number; // /100
  gradeLetter: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
}

export interface LostFoundItem {
  id: string;
  title: string;
  locationFound: string;
  dateFound: string;
  category: 'Electronics' | 'IDs & Cards' | 'Books' | 'Personal';
  status: 'UNCLAIMED' | 'CLAIMED';
  contactPerson: string;
}

export interface CampusPoll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  userVotedOption?: number;
  totalVotes: number;
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  degree: string;
  email: string;
  phone: string;
  office: string;
  avatar: string;
  rating: number;
  specialization: string[];
  courses: {
    code: string;
    name: string;
    room: string;
    time: string;
    studentsCount: number;
    credits: number;
  }[];
}

export interface AssignmentItem {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  dueDate: string;
  maxMarks: number;
  totalSubmissions: number;
  totalStudents: number;
  description: string;
  submissions: {
    studentId: string;
    studentName: string;
    submittedAt: string;
    status: 'SUBMITTED' | 'GRADED' | 'LATE';
    grade?: string;
    marks?: number;
    fileUrl?: string;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'ACADEMIC' | 'FEES' | 'EXAM' | 'LIBRARY' | 'SYSTEM' | 'ATTENDANCE' | 'SHOP';
  timestamp: string;
  read: boolean;
  targetTab?: string;
}

export interface LiveAttendanceSession {
  id: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  room: string;
  building: string;
  status: 'NOT_STARTED' | 'LIVE' | 'CLOSED';
  startTime: string;
  endTime: string;
  recordedStudentIds: string[];
}

export interface AttendanceSessionRecord {
  id: string;
  date: string;
  time: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  room: string;
  status: 'PRESENT' | 'ABSENT' | 'CANCELLED' | 'PENDING' | 'NOT_CONDUCTED' | 'EXCUSED';
  verificationMethod?: 'Palm Biometrics' | 'Manual Override' | 'QR Optical Token' | 'N/A' | string;
  verifiedVia?: string;
  correctedBy?: string;
  correctionReason?: string;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  courseCode: string;
  courseName: string;
  facultyName: string;
  room: string;
  building: string;
  startTime: string;
  endTime: string;
  credits: number;
  status?: 'NORMAL' | 'RESCHEDULED' | 'HOLIDAY';
}

export interface ShopOffer {
  id: string;
  code: string;
  title: string;
  discountPercentage: number;
  minOrderAmount?: number;
  validUntil: string;
  isActive: boolean;
  categoryLimit?: 'All' | 'Food' | 'Stationery' | 'Merchandise' | 'Printing';
  targetCategory?: string;
}

export interface StockMovementRecord {
  id: string;
  productId: string;
  productName: string;
  type: 'SALE' | 'RESTOCK' | 'MANUAL_ADJUSTMENT' | 'RETURN';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  timestamp: string;
  reason?: string;
  user: string;
  changeQuantity?: number;
  userName?: string;
}

export interface ShopProfile {
  id: string;
  name: string;
  shopName?: string;
  merchantId?: string;
  managerName: string;
  phone: string;
  contactPhone?: string;
  email: string;
  contactEmail?: string;
  location: string;
  operatingHours: string;
  category: string;
  gstin: string;
  fssaiNumber?: string;
  upiVpa?: string;
}

export interface LibraryIssueRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userRole: 'STUDENT' | 'FACULTY';
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  fineAmount: number;
  finePaid: boolean;
}

export interface FacilityRecord {
  id: string;
  name: string;
  type: 'HOSTEL_BOYS' | 'HOSTEL_GIRLS' | 'ACADEMIC_BLOCK' | 'LIBRARY' | 'SPORTS_COMPLEX' | 'CAFETERIA' | 'LAB' | 'HOSTEL' | 'ACADEMIC' | 'DINING' | 'ATHLETICS';
  building: string;
  location?: string;
  capacity: number;
  currentOccupancy: number;
  inCharge?: string;
  managerName?: string;
  contactPhone: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'PARTIAL';
  amenities?: string[];
}

export interface TerminalMaintenanceLog {
  id: string;
  terminalId: string;
  reportedTime: string;
  reason: string;
  assignedTechnician: string;
  expectedRestorationDate: string;
  status: 'REPORTED' | 'IN_PROGRESS' | 'RESTORED';
  restoredAt?: string;
  restorationNotes?: string;
}

