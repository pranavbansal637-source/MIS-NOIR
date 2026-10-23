import type { DocumentItem, StudentProfile } from '../types';

export interface ShareLinkResult {
  shareUrl: string;
  shareCode: string;
  expiresInMinutes: number;
}

export interface DocumentPreviewData {
  id: string;
  title: string;
  category: string;
  issuer: string;
  issueDate: string;
  fileSize: string;
  verified: boolean;
  docNumber: string;
  studentName: string;
  studentId: string;
  program: string;
  department: string;
  bodySections: { heading: string; content: string }[];
  sealText: string;
}

export class DocumentService {
  static generateSecureShareLink(docId: string, _recipient: string, durationMinutes: number = 30): ShareLinkResult {
    const code = `SHARE-${docId.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
      shareUrl: `https://nexora.campus/verify/doc?code=${code}`,
      shareCode: code,
      expiresInMinutes: durationMinutes
    };
  }

  static verifyDocumentToken(code: string): { valid: boolean; docTitle?: string; verifiedBy?: string } {
    if (code.startsWith('SHARE-')) {
      return {
        valid: true,
        docTitle: 'Semester Official Academic Transcript',
        verifiedBy: 'NEXORA Cryptographic Issuer Signatory'
      };
    }
    return { valid: false };
  }

  static getDocumentPreview(doc: DocumentItem, student: StudentProfile): DocumentPreviewData {
    const docNumber = `NEXORA-DOC-${doc.id.toUpperCase()}-${student.studentId}`;
    
    let bodySections: { heading: string; content: string }[] = [];
    if (doc.category === 'Identity') {
      bodySections = [
        { heading: 'Identity Specification', content: `This document certifies that ${student.name} (Student ID: ${student.studentId}) is a verified bona fide student of ${student.department}, enrolled in ${student.program} (Batch: ${student.batch}).` },
        { heading: 'Biometric Credentials', content: 'Subdermal vascular palm pattern has been securely registered with NEXORA Pehchaan Biometric Core.' },
        { heading: 'Validity & Institutional Clearance', content: `Current Semester: ${student.semester} • Disciplinary Record: Clear • Library Dues: Settled` }
      ];
    } else if (doc.category === 'Academic') {
      bodySections = [
        { heading: 'Academic Performance Record', content: `Cumulative Grade Point Average (CGPA): ${student.cgpa} / 10.0 (Dean's List of Honor). Cumulative Attendance: ${student.attendanceOverall}%.` },
        { heading: 'Course Completion Status', content: 'Marketing Management: A (4 credits), Corporate Finance: A+ (4 credits), Micro Economics: A (3 credits), Organizational Management: A (3 credits).' },
        { heading: 'Institutional Verification', content: 'Issued under the authority of Controller of Examinations, University Senate Resolution 2026-B.' }
      ];
    } else {
      bodySections = [
        { heading: 'Certificate of Achievement', content: `Awarded to ${student.name} in recognition of outstanding academic distinction and continuous innovation leadership.` },
        { heading: 'Issuing Authority', content: `${doc.issuer} • Verified Digital Signature ID: #SIG-NX-99881` }
      ];
    }

    return {
      id: doc.id,
      title: doc.title,
      category: doc.category,
      issuer: doc.issuer,
      issueDate: doc.issueDate,
      fileSize: doc.fileSize,
      verified: doc.verified,
      docNumber,
      studentName: student.name,
      studentId: student.studentId,
      program: student.program,
      department: student.department,
      bodySections,
      sealText: 'OFFICIAL SEAL • NEXORA UNIVERSITY • VERIFIED CRYPTOGRAPHIC RECORD'
    };
  }

  static downloadDocument(doc: DocumentItem, student: StudentProfile): void {
    const preview = this.getDocumentPreview(doc, student);
    const textContent = `========================================================================
                      NEXORA CAMPUS OPERATING SYSTEM
                   OFFICIAL DIGITALLY VERIFIED DOCUMENT
========================================================================
Document Title   : ${preview.title}
Category         : ${preview.category}
Document Number  : ${preview.docNumber}
Issuer           : ${preview.issuer}
Issue Date       : ${preview.issueDate}
Verification     : ${preview.verified ? 'VERIFIED CRYPTOGRAPHIC SIGNATURE' : 'PENDING'}
------------------------------------------------------------------------
STUDENT INFORMATION:
Student Name     : ${preview.studentName}
Student ID       : ${preview.studentId}
Degree Program   : ${preview.program}
Department       : ${preview.department}
------------------------------------------------------------------------
CONTENT:
${preview.bodySections.map((s) => `[${s.heading}]\n${s.content}\n`).join('\n')}
------------------------------------------------------------------------
${preview.sealText}
Generated on     : ${new Date().toLocaleString()}
Integrity Hash   : SHA256-${Math.random().toString(36).substring(2, 14).toUpperCase()}
========================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${preview.title.replace(/[^a-zA-Z0-9]/g, '_')}_${preview.studentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

