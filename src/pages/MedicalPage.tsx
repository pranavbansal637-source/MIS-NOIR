import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export const MedicalPage: React.FC = () => {
  const { medicalRecord, student } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--state-danger)', textTransform: 'uppercase' }}>
          CAMPUS HEALTH & MEDICAL VAULT
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Student Medical & Health Records</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Encrypted clinic visits, prescriptions, immunization history & emergency medical ID
        </p>
      </div>

      {/* Emergency Health Badge Banner */}
      <div className="noir-card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 100%)', border: '1px solid #FECACA', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={30} color="#DC2626" />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                {student.name} • Blood Group: <span style={{ color: '#DC2626' }}>{medicalRecord.bloodGroup}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Policy No: {medicalRecord.insurancePolicyNo} • Student ID: {student.studentId}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>EMERGENCY CONTACT</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>{medicalRecord.emergencyContact}</div>
          </div>
        </div>
      </div>

      {/* Vitals & Allergies Grid */}
      <div className="grid-3">
        <div className="noir-card">
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>ALLERGIES & RESTRICTIONS</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {medicalRecord.allergies.map((a, i) => (
              <span key={i} className="badge badge-danger">{a}</span>
            ))}
          </div>
        </div>

        <div className="noir-card">
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>CHRONIC CONDITIONS</h4>
          <span className="badge badge-success">✓ None Documented</span>
        </div>

        <div className="noir-card">
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>HEALTH INSURANCE</h4>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#2563EB' }}>Star Health University Plan</div>
        </div>
      </div>

      {/* Clinical Consultation Logs */}
      <div className="noir-card">
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Campus Clinic Consultations & Prescriptions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {medicalRecord.recentVisits.map((visit, i) => (
            <div key={i} style={{ padding: 14, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong style={{ fontSize: 15, color: '#0F172A' }}>{visit.diagnosis}</strong>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{visit.date}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Attending Physician: {visit.doctorName}
              </div>
              <div style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, marginTop: 4 }}>
                Prescription: {visit.prescription}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Vitals: BP {visit.vitalBP} • Temp {visit.temperature}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
