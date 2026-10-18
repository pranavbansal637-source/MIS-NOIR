import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  CreditCard,
  Calendar,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const StudentActivityPage: React.FC = () => {
  const { auditLogs, transactions, events, books } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ATTENDANCE' | 'PAYMENTS' | 'EVENTS' | 'LIBRARY'>('ALL');

  // Combine activity feed items
  const attendanceItems = auditLogs.map((log) => ({
    id: `att-${log.id}`,
    category: 'ATTENDANCE' as const,
    title: log.action.replace(/_/g, ' '),
    subtitle: log.target,
    timestamp: log.timestamp,
    status: log.result,
    icon: CheckSquare,
    color: '#F59E0B'
  }));

  const paymentItems = transactions.map((tx) => ({
    id: `pay-${tx.id}`,
    category: 'PAYMENTS' as const,
    title: `${tx.merchantName} (${tx.type === 'CREDIT' ? '+' : '-'}₹${tx.amount})`,
    subtitle: tx.itemsSummary || `Category: ${tx.category}`,
    timestamp: tx.timestamp,
    status: tx.status,
    icon: CreditCard,
    color: tx.type === 'CREDIT' ? '#10B981' : '#38BDF8'
  }));

  const eventItems = events
    .filter((e) => e.isRegistered)
    .map((e) => ({
      id: `evt-${e.id}`,
      category: 'EVENTS' as const,
      title: `Event Pass Issued: ${e.title}`,
      subtitle: `${e.date} • ${e.venue}`,
      timestamp: 'Registered',
      status: 'CONFIRMED',
      icon: Calendar,
      color: '#FBBF24'
    }));

  const libraryItems = books
    .filter((b) => b.isReserved)
    .map((b) => ({
      id: `lib-${b.id}`,
      category: 'LIBRARY' as const,
      title: `Book Reserved: ${b.title}`,
      subtitle: `Author: ${b.author} • Location: ${b.location}`,
      timestamp: 'Reserved',
      status: 'READY FOR PICKUP',
      icon: BookOpen,
      color: '#F59E0B'
    }));

  const allFeed = [...attendanceItems, ...paymentItems, ...eventItems, ...libraryItems];

  const filteredFeed = allFeed.filter((item) => {
    if (filter === 'ALL') return true;
    return item.category === filter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--brand-primary, #F59E0B)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          UNIFIED CAMPUS ACTIVITY LOG
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main, #F8FAFC)', marginTop: 4 }}>
          Activity Timeline
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary, #94A3B8)', marginTop: 4 }}>
          Real-time activity stream combining attendance check-ins, wallet payments, event tickets and library records.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <Filter size={16} color="var(--brand-primary, #F59E0B)" style={{ marginRight: 4 }} />
        {(['ALL', 'ATTENDANCE', 'PAYMENTS', 'EVENTS', 'LIBRARY'] as const).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#F59E0B' : 'var(--text-secondary, #94A3B8)',
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Unified Feed Timeline */}
      <div className="noir-card">
        {filteredFeed.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary, #94A3B8)' }}>
            No activity records found for this filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredFeed.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 12,
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: `${item.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={20} color={item.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main, #F8FAFC)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary, #94A3B8)', marginTop: 2 }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-success" style={{ fontSize: 11 }}>
                      <CheckCircle2 size={12} style={{ marginRight: 4 }} /> {item.status}
                    </span>
                    <div style={{ fontSize: 12, color: 'var(--text-muted, #64748B)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <Clock size={12} /> {item.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
