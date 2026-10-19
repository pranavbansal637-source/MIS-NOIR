import React from 'react';
import { useApp } from '../context/AppContext';
import { Award } from 'lucide-react';

export const GradesPage: React.FC = () => {
  const { examGrades, student } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Academic Examination & Gradebook</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Mid-term, End-term & Internal assessment scorecards
        </p>
      </div>

      <div className="noir-card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>SEMESTER 2 AGGREGATE CGPA</span>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--brand-primary)', marginTop: 2 }}>
              {student.cgpa} / 4.00
            </div>
          </div>
          <span className="badge badge-success" style={{ fontSize: 14, padding: '8px 16px' }}>
            <Award size={16} /> DEAN'S HONOR LIST
          </span>
        </div>
      </div>

      <div className="noir-card">
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Scorecard Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>CODE</th>
                <th style={{ padding: '10px' }}>SUBJECT</th>
                <th style={{ padding: '10px' }}>CREDITS</th>
                <th style={{ padding: '10px' }}>MID-SEM (/30)</th>
                <th style={{ padding: '10px' }}>END-SEM (/50)</th>
                <th style={{ padding: '10px' }}>INTERNAL (/20)</th>
                <th style={{ padding: '10px' }}>TOTAL (/100)</th>
                <th style={{ padding: '10px' }}>GRADE</th>
              </tr>
            </thead>
            <tbody>
              {examGrades.map((g) => (
                <tr key={g.code} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--brand-primary)' }}>{g.code}</td>
                  <td style={{ padding: '12px', fontWeight: 700 }}>{g.subjectName}</td>
                  <td style={{ padding: '12px' }}>{g.credits}</td>
                  <td style={{ padding: '12px' }}>{g.midSemMarks}</td>
                  <td style={{ padding: '12px' }}>{g.endSemMarks}</td>
                  <td style={{ padding: '12px' }}>{g.internalMarks}</td>
                  <td style={{ padding: '12px', fontWeight: 800 }}>{g.totalMarks}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge badge-success">{g.gradeLetter}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
