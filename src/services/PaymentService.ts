import type { WalletTransaction } from '../types';

export interface PaymentRequest {
  userId: string;
  merchantName: string;
  category: WalletTransaction['category'];
  amount: number;
  itemsSummary?: string;
}

export interface PaymentResult {
  success: boolean;
  transaction?: WalletTransaction;
  newBalance?: number;
  error?: string;
}

export interface GatewayTopupRequest {
  userId: string;
  amount: number;
  method: 'UPI' | 'CARD' | 'NETBANKING';
  upiVpa?: string;
  cardLast4?: string;
  cardHolder?: string;
}

export interface IPaymentService {
  createPayment(req: PaymentRequest, currentBalance: number): Promise<PaymentResult>;
  confirmPayment(transactionId: string): Promise<boolean>;
  refundPayment(transactionId: string): Promise<boolean>;
  processGatewayTopup(req: GatewayTopupRequest, currentBalance: number): Promise<PaymentResult>;
  getTransactionHistory(userId: string): WalletTransaction[];
}

class PaymentServiceImpl implements IPaymentService {
  private history: WalletTransaction[] = [];

  async createPayment(req: PaymentRequest, currentBalance: number): Promise<PaymentResult> {
    await new Promise((res) => setTimeout(res, 800));

    if (currentBalance < req.amount) {
      return {
        success: false,
        error: `Insufficient wallet balance. Available: ₹${currentBalance}, Required: ₹${req.amount}`
      };
    }

    const txId = `tx-${Date.now().toString().slice(-6)}`;
    const newTx: WalletTransaction = {
      id: txId,
      userId: req.userId,
      merchantName: req.merchantName,
      category: req.category,
      amount: req.amount,
      type: 'DEBIT',
      status: 'SUCCESS',
      timestamp: 'Just now',
      receiptId: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      itemsSummary: req.itemsSummary
    };

    this.history.unshift(newTx);

    return {
      success: true,
      transaction: newTx,
      newBalance: currentBalance - req.amount
    };
  }

  async processGatewayTopup(req: GatewayTopupRequest, currentBalance: number): Promise<PaymentResult> {
    // Simulate real gateway network latency and server verification webhook
    await new Promise((res) => setTimeout(res, 1200));

    if (req.amount <= 0 || req.amount > 50000) {
      return {
        success: false,
        error: 'Invalid top-up amount. Limit is between ₹10 and ₹50,000 per transaction.'
      };
    }

    if (req.method === 'UPI' && req.upiVpa && !req.upiVpa.includes('@')) {
      return {
        success: false,
        error: 'Invalid UPI VPA address format (e.g. yourname@okhdfcbank).'
      };
    }

    const gatewayRef = req.method === 'UPI'
      ? `UPI-AUTH-${Date.now().toString().slice(-7)}`
      : req.method === 'CARD'
      ? `CARD-TX-${Date.now().toString().slice(-7)}`
      : `NB-REF-${Date.now().toString().slice(-7)}`;

    const newTx: WalletTransaction = {
      id: `topup-${Date.now().toString().slice(-6)}`,
      userId: req.userId,
      merchantName: req.method === 'UPI' 
        ? `NEXORA UPI Gateway (${req.upiVpa || 'Instant QR'})`
        : req.method === 'CARD'
        ? `Razorpay / Visa Gateway (Card •••• ${req.cardLast4 || '4242'})`
        : 'Campus NetBanking Gateway',
      category: 'TOPUP',
      amount: req.amount,
      type: 'CREDIT',
      status: 'SUCCESS',
      timestamp: 'Just now',
      receiptId: `RCP-${gatewayRef}`,
      itemsSummary: `Added ₹${req.amount} via verified ${req.method} gateway settlement`
    };

    this.history.unshift(newTx);

    return {
      success: true,
      transaction: newTx,
      newBalance: currentBalance + req.amount
    };
  }

  async confirmPayment(_transactionId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  }

  async refundPayment(transactionId: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 600));
    const tx = this.history.find((t) => t.id === transactionId);
    if (tx) {
      tx.status = 'FAILED';
      return true;
    }
    return false;
  }

  getTransactionHistory(_userId: string): WalletTransaction[] {
    return this.history;
  }
}

export const PaymentService = new PaymentServiceImpl();
