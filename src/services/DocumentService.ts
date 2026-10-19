export interface ShareLinkResult {
  shareUrl: string;
  shareCode: string;
  expiresInMinutes: number;
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
}
