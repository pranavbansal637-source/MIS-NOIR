import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckSquare,
  Calendar,
  CreditCard,
  FileText,
  Hand,
  MapPin,
  X,
  BookOpen,
  Award,
  Heart,
  Bus,
  Building2,
  Users,
  Briefcase,
  HelpCircle,
  Vote,
  ShoppingBag
} from 'lucide-react';

interface CommandModalProps {
  onSelectTab: (tab: string) => void;
}

export const GlobalCommandModal: React.FC<CommandModalProps> = ({ onSelectTab }) => {
  const { activeModal, setModal } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setModal(activeModal === 'COMMAND_CENTER' ? null : 'COMMAND_CENTER');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setModal]);

  if (activeModal !== 'COMMAND_CENTER') return null;

  const commands = [
    { label: 'View Today\'s Attendance', tab: 'attendance', icon: CheckSquare, category: 'Academics' },
    { label: 'Campus Wallet & Payments', tab: 'pay', icon: CreditCard, category: 'Finances' },
    { label: 'View NEXORA HackSphere 2026', tab: 'events', icon: Calendar, category: 'Events' },
    { label: 'Open Document Vault & Transcripts', tab: 'documents', icon: FileText, category: 'Identity' },
    { label: 'Find Classroom A403 Map', tab: 'map', icon: MapPin, category: 'Campus Nav' },
    { label: 'University Fee Clearance & Dues', tab: 'fees', icon: CreditCard, category: 'Finances' },
    { label: 'Examination Scorecard & Gradebook', tab: 'grades', icon: Award, category: 'Academics' },
    { label: 'Student Health & Medical Records', tab: 'medical', icon: Heart, category: 'Wellness' },
    { label: 'Campus Shuttle GPS & Transport', tab: 'transport', icon: Bus, category: 'Campus Nav' },
    { label: 'Hostel Gate Pass & Outing Request', tab: 'hostel', icon: Building2, category: 'Campus Life' },
    { label: 'Student Chapters & Clubs', tab: 'clubs', icon: Users, category: 'Community' },
    { label: 'Corporate Placement Recruitment', tab: 'placements', icon: Briefcase, category: 'Career' },
    { label: 'Report Campus Issue / Maintenance', tab: 'complaints', icon: HelpCircle, category: 'Support' },
    { label: 'Campus Sentiment Polls', tab: 'polls', icon: Vote, category: 'Community' },
    { label: 'Central Library Catalogue Search', tab: 'library', icon: BookOpen, category: 'Academics' },
    { label: 'Canteen Food Court & Campus Store', tab: 'marketplace', icon: ShoppingBag, category: 'Commerce' },
    { label: 'Simulate Palm Biometric Scan', action: () => setModal('PALM_SCAN'), icon: Hand, category: 'Identity' }
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 580, padding: 0 }}
      >
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'rgba(18, 24, 36, 0.95)'
          }}
        >
          <Search size={20} color="var(--brand-primary)" />
          <input
            type="text"
            placeholder="Type a command or search (e.g., Attendance, A403, HackSphere)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'var(--font-family)',
              color: 'var(--text-primary)',
              backgroundColor: 'transparent'
            }}
          />
          <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ padding: 12, maxHeight: 360, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              No campus match found for "{query}".
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.tab) {
                      onSelectTab(item.tab);
                      setModal(null);
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  className="noir-card-interactive"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={18} color="var(--brand-primary)" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.label}
                    </span>
                  </div>
                  <span className="badge badge-neutral">{item.category}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
