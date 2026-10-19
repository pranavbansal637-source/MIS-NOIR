import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const PollsPage: React.FC = () => {
  const { campusPolls, votePollOption } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800 }}>Campus Sentiment & Student Polls</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Cast your vote on university policies, canteen menus & event choices
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {campusPolls.map((poll) => (
          <div key={poll.id} className="noir-card">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>{poll.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {poll.options.map((opt, idx) => {
                const isSelected = poll.userVotedOption === idx;
                const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                return (
                  <button
                    key={idx}
                    onClick={() => votePollOption(poll.id, idx)}
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 14,
                      borderColor: isSelected ? '#F59E0B' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#FBBF24' : '#F8FAFC'
                    }}
                  >
                    <span style={{ fontWeight: isSelected ? 800 : 600 }}>{opt.text}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#F59E0B' : '#94A3B8' }}>{pct}% ({opt.votes} votes)</span>
                      {isSelected && <CheckCircle2 size={16} color="#F59E0B" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Total Campus Votes Cast: {poll.totalVotes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
