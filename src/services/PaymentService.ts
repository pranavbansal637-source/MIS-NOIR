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

export interface IPaymentService {
  createPayment(req: PaymentRequest, currentBalance: number): Promise<PaymentResult>;
  confirmPayment(transactionId: string): Promise<boolean>;
  refundPayment(transactionId: string): Promise<boolean>;
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
