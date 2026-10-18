import type { StudentProfile } from '../types';

export interface PalmScanResult {
  success: boolean;
  confidence: number;
  hash: string;
  matchedStudent?: StudentProfile;
  message: string;
}

export interface IPalmService {
  enrollPalm(userId: string): Promise<{ success: boolean; hash: string }>;
  detectPalm(): Promise<boolean>;
  verifyPalm(userId: string): Promise<PalmScanResult>;
  identifyPalm(demoStudent: StudentProfile): Promise<PalmScanResult>;
  getEnrollmentStatus(userId: string): boolean;
}

class PalmServiceImpl implements IPalmService {
  private enrolledUsers = new Set<string>(['usr-001', 'std-8891']);

  async enrollPalm(userId: string): Promise<{ success: boolean; hash: string }> {
    await new Promise((res) => setTimeout(res, 800));
    this.enrolledUsers.add(userId);
    return {
      success: true,
      hash: `PALM_VERIFIED_HASH_${Math.random().toString(36).substring(7).toUpperCase()}`
    };
  }

  async detectPalm(): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 400));
    return true;
  }

  async verifyPalm(userId: string): Promise<PalmScanResult> {
    await new Promise((res) => setTimeout(res, 1200));
    if (this.enrolledUsers.has(userId)) {
      return {
        success: true,
        confidence: 0.9984,
        hash: 'PALM_HASH_MATCHED_99812',
        message: 'Identity verified with 99.84% match score.'
      };
    }
    return {
      success: false,
      confidence: 0.12,
      hash: '',
      message: 'Palm biometrics not recognized. Please scan enrolled palm.'
    };
  }

  async identifyPalm(demoStudent: StudentProfile): Promise<PalmScanResult> {
    await new Promise((res) => setTimeout(res, 1500));
    return {
      success: true,
      confidence: 0.9991,
      hash: 'PALM_HASH_PRANAV_99812',
      matchedStudent: demoStudent,
      message: `Welcome, ${demoStudent.name}! Identity confirmed.`
    };
  }

  getEnrollmentStatus(userId: string): boolean {
    return this.enrolledUsers.has(userId);
  }
}

export const PalmService = new PalmServiceImpl();
