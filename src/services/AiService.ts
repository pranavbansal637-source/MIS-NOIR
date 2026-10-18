import type { AiChatMessage, Role, StudentProfile } from '../types';

export class AiService {
  static async processUserQuery(
    prompt: string,
    role: Role,
    student: StudentProfile
  ): Promise<AiChatMessage> {
    await new Promise((res) => setTimeout(res, 700));

    const lower = prompt.toLowerCase();
    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Payment or fee intent requires explicit UI confirmation
    if (lower.includes('pay') || lower.includes('fee') || lower.includes('transfer')) {
      const matchAmount = lower.match(/₹?\s?(\d+)/);
      const amount = matchAmount ? parseInt(matchAmount[1], 10) : 150;

      return {
        id: messageId,
        sender: 'NEXORA_AI',
        text: `I've prepared a payment request for ₹${amount}. For your security, please confirm this transaction below:`,
        timestamp,
        actionRequired: {
          type: 'PAYMENT_CONFIRMATION',
          details: {
            merchantName: 'NEXORA Fee & Services Desk',
            category: 'FEES',
            amount,
            purpose: 'Library / Academic Fee Clearances'
          }
        }
      };
    }

    if (lower.includes('next class') || lower.includes('schedule') || lower.includes('where')) {
      return {
        id: messageId,
        sender: 'NEXORA_AI',
        text: `Your next class is **Marketing Management (MKT-201)** at **10:00 AM** in **Room A403** (Academic Block A, 4th Floor). Instructor: Dr. Sarah Jenkins.`,
        timestamp
      };
    }

    if (lower.includes('attendance') || lower.includes('percentage')) {
      return {
        id: messageId,
        sender: 'NEXORA_AI',
        text: `Your overall attendance is **${student.attendanceOverall}%**. Breakdown:
• Marketing Management: 84% (Requirement: 75% ✓)
• Corporate Finance: 91% (Requirement: 75% ✓)
• Organizational Management: 88% (Requirement: 75% ✓)
• Micro Economics: 76% (Requirement: 75% - 1 class buffer)`,
        timestamp
      };
    }

    if (lower.includes('event') || lower.includes('hackathon')) {
      return {
        id: messageId,
        sender: 'NEXORA_AI',
        text: `Upcoming featured event: **NEXORA HackSphere 2026: National AI & Systems Hackathon** on **14 OCT** at **09:30 AM** in the Main Auditorium. You are currently registered!`,
        timestamp
      };
    }

    if (lower.includes('transaction') || lower.includes('wallet') || lower.includes('balance')) {
      return {
        id: messageId,
        sender: 'NEXORA_AI',
        text: `Your current NEXORA Wallet balance is **₹${student.walletBalance}**. Recent transaction: ₹120 at Central Campus Canteen (Today, 08:45 AM).`,
        timestamp
      };
    }

    if (role === 'MANAGEMENT' || role === 'SUPER_ADMIN') {
      if (lower.includes('today') || lower.includes('campus attendance') || lower.includes('analytics')) {
        return {
          id: messageId,
          sender: 'NEXORA_AI',
          text: `NEXORA Campus Telemetry Summary (Today):
• Overall Student Attendance: **89.4%** across 45 running sessions
• Active Kiosk Terminals: **4/4 Online**
• Payments Processed Today: **₹42,850** across 318 POS transactions
• Open Maintenance Tickets: **1 Pending (Room A403 Projector Cable)**`,
          timestamp
        };
      }
    }

    return {
      id: messageId,
      sender: 'NEXORA_AI',
      text: `NEXORA OS Intelligence active. You can ask me about class schedules, attendance insights, campus directions (A403), event registration, wallet payments, or verified document requests.`,
      timestamp
    };
  }
}
