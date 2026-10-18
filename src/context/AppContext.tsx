import React, { createContext, useContext, useState, type ReactNode } from 'react';
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
  AssignmentItem
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
  INITIAL_CAMPUS_ORDERS
} from '../data/mockData';
import { PaymentService, type PaymentRequest } from '../services/PaymentService';
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
  | 'TOPUP'
  | 'AUTH_MODAL'
  | 'PAY_FEE'
  | null;

interface AppContextType {
  isAuthenticated: boolean;
  user: User;
  student: StudentProfile;
  role: Role;
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
  selectedFeeForPay: FeeItem | null;
  demoNotification: string | null;
  pendingRoleTarget: Role | null;

  // Real Faculty & Classroom State
  facultyList: FacultyMember[];
  activeFaculty: FacultyMember;
  setActiveFacultyId: (id: string) => void;
  assignments: AssignmentItem[];
  gradeAssignmentSubmission: (asgId: string, studentId: string, marks: number, grade: string) => void;

  // Profile Management
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;

  // Real Shop Management
  updateOrderStatus: (orderId: string, status: CampusOrder['status']) => void;
  addProduct: (product: Omit<ProductItem, 'id'>) => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // New Feature States
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
  openPayFeeModal: (fee: FeeItem) => void;
  recordPalmAttendance: (subjectName?: string) => void;
  registerForEvent: (eventId: string) => Promise<boolean>;
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkoutCart: () => Promise<boolean>;
  topupWallet: (amount: number) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Logged in by default for quick demo
  const [user, setUser] = useState<User>(loadSavedUser);
  const [student, setStudent] = useState<StudentProfile>(loadSavedStudent);
  const [role, setRole] = useState<Role>('STUDENT');
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

  // Faculty and Assignments State
  const [facultyList] = useState<FacultyMember[]>(MOCK_FACULTY_LIST);
  const [activeFacultyId, setActiveFacultyId] = useState<string>('fac-01');
  const activeFaculty = facultyList.find((f) => f.id === activeFacultyId) || facultyList[0];
  const [assignments, setAssignments] = useState<AssignmentItem[]>(MOCK_ASSIGNMENTS);

  // New Feature States
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
  const [selectedFeeForPay, setSelectedFeeForPay] = useState<FeeItem | null>(null);
  const [demoNotification, setDemoNotification] = useState<string | null>(null);
  const [pendingRoleTarget, setPendingRoleTarget] = useState<Role | null>(null);

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
      setRole(target);
      setUser((prev) => ({ ...prev, role: target }));
      setPendingRoleTarget(null);
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

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    setUser((prev) => ({ ...prev, role: newRole }));
    showToast(`Switched workspace view to [${newRole}] mode.`);
  };

  const requestRoleSwitchWithPalm = (targetRole: Role) => {
    setPendingRoleTarget(targetRole);
    setActiveModal('PALM_SCAN');
    showToast(`🖐️ Biometric Palm Verification required to access [${targetRole}] interface.`);
  };

  const cancelRoleSwitch = () => {
    setPendingRoleTarget(null);
    setActiveModal(null);
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

  const openPayFeeModal = (fee: FeeItem) => {
    setSelectedFeeForPay(fee);
    setActiveModal('PAY_FEE');
  };

  const recordPalmAttendance = (subjectName: string = 'Marketing Management') => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.subjectName.toLowerCase().includes(subjectName.toLowerCase())) {
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

    const logItem: AuditLogItem = {
      id: `log-${Date.now()}`,
      user: `${student.name} (${student.studentId})`,
      role: 'STUDENT',
      action: 'PALM_BIOMETRIC_ATTENDANCE',
      target: `Class: ${subjectName} (Room A403 Terminal)`,
      timestamp: 'Just now',
      result: 'SUCCESS'
    };
    setAuditLogs((prev) => [logItem, ...prev]);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    showToast(`✓ Identity verified via Palm Biometrics. Attendance logged for ${subjectName}.`);
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
    const txId = `tx-${Date.now().toString().slice(-6)}`;
    const topupTx: WalletTransaction = {
      id: txId,
      userId: student.userId,
      merchantName: 'NEXORA UPI Payment Gateway',
      category: 'TOPUP',
      amount,
      type: 'CREDIT',
      status: 'SUCCESS',
      timestamp: 'Just now',
      receiptId: `RCP-TOPUP-${Math.floor(1000 + Math.random() * 9000)}`,
      itemsSummary: `Added ₹${amount} via UPI Instant`
    };

    setStudent((prev) => ({ ...prev, walletBalance: prev.walletBalance + amount }));
    setTransactions((prev) => [topupTx, ...prev]);
    setActiveModal(null);
    showToast(`Wallet credited with ₹${amount}. New balance: ₹${student.walletBalance + amount}`);
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

    showToast(`Secure 30-minute share link created for ${recipient}.`);
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
          ? { ...t, status: t.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' }
          : t
      )
    );
    showToast(`Terminal device status toggled.`);
  };

  const registerNewTerminal = (locationName: string, roomNumber: string, type: TerminalDevice['type']) => {
    const newTerm: TerminalDevice = {
      id: `term-${Date.now().toString().slice(-4)}`,
      terminalCode: `TRM-${Math.floor(1000 + Math.random() * 9000)}`,
      locationName,
      roomNumber,
      type,
      status: 'ONLINE',
      lastPing: 'Just now',
      firmwareVersion: 'NEXORA-OS v2.4',
      ipAddress: `192.168.1.${Math.floor(10 + Math.random() * 80)}`,
      macAddress: `00:1B:44:11:3A:${Math.floor(10 + Math.random() * 80)}`
    };
    setTerminals((prev) => [newTerm, ...prev]);
    showToast(`✓ Registered Palm Terminal: ${locationName} [${type}]`);
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
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Order #${orderId} status updated to: ${status}`);
  };

  const addProduct = (newProd: Omit<ProductItem, 'id'>) => {
    const item: ProductItem = {
      ...newProd,
      id: `prod-${Date.now().toString().slice(-4)}`
    };
    setProducts((prev) => [item, ...prev]);
    showToast(`Added "${item.name}" to campus catalogue!`);
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    showToast('Inventory stock count updated.');
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
        selectedFeeForPay,
        demoNotification,
        pendingRoleTarget,

        // Faculty & Assignments
        facultyList,
        activeFaculty,
        setActiveFacultyId,
        assignments,
        gradeAssignmentSubmission,

        // Profile Management
        updateStudentProfile,

        // Shop Management
        updateOrderStatus,
        addProduct,
        updateProductStock,

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
        loginWithPalm,
        loginWithCredentials,
        logout,
        switchRole,
        requestRoleSwitchWithPalm,
        cancelRoleSwitch,
        setModal,
        openReceiptModal,
        openShareModal,
        openPayFeeModal,
        recordPalmAttendance,
        registerForEvent,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        topupWallet,
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
