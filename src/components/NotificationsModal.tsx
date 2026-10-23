import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X, BookOpen, GraduationCap, DollarSign, ShieldAlert, Sparkles } from 'lucide-react';

interface NotificationsModalProps {
  onNavigate?: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onNavigate }) => {
  const {
    activeModal,
    setModal,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  if (activeModal !== 'NOTIFICATIONS') return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ACADEMIC':
      case 'EXAM':
        return <GraduationCap size={16} color="#2563EB" />;
      case 'FEES':
        return <DollarSign size={16} color="#059669" />;
      case 'LIBRARY':
        return <BookOpen size={16} color="#7C3AED" />;
      case 'ATTENDANCE':
        return <Sparkles size={16} color="#2563EB" />;
      case 'SHOP':
        return <Sparkles size={16} color="#D97706" />;
      default:
        return <ShieldAlert size={16} color="#DC2626" />;
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.targetTab && onNavigate) {
      onNavigate(notif.targetTab);
      setModal(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 540, maxHeight: '85vh', padding: 0, display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} color="var(--brand-primary)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)' }}>
                  Campus Notifications
                </h3>
                {unreadNotificationCount > 0 && (
                  <span className="badge badge-primary" style={{ fontSize: 11, padding: '2px 8px' }}>
                    {unreadNotificationCount} New
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Official university circulars, lecture alerts & deadlines
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, gap: 4 }}
                title="Mark all as read"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button onClick={() => setModal(null)} className="btn btn-ghost btn-icon btn-sm">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            gap: 8,
            background: 'var(--bg-surface)'
          }}
        >
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 16, fontSize: 11, padding: '4px 12px' }}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`btn btn-sm ${filter === 'UNREAD' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 16, fontSize: 11, padding: '4px 12px' }}
          >
            Unread Only ({unreadNotificationCount})
          </button>
        </div>

        {/* Notification Items List */}
        <div
          style={{
            padding: 16,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: 'var(--bg-surface)'
          }}
        >
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              <Bell size={36} color="var(--text-muted)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>No Notifications</div>
              <p style={{ fontSize: 13, marginTop: 4 }}>
                {filter === 'UNREAD' ? 'You have read all current alerts.' : 'No recent campus circulars found.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: notif.read ? 'var(--bg-subtle)' : 'rgba(37, 99, 235, 0.06)',
                  border: notif.read ? '1px solid var(--border-color)' : '1px solid rgba(37, 99, 235, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                  }}
                >
                  {getCategoryIcon(notif.category)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: notif.read ? 700 : 900,
                        color: 'var(--text-primary)'
                      }}
                    >
                      {notif.title}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
                      {notif.timestamp}
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                    {notif.message}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span
                      className="badge badge-neutral"
                      style={{ fontSize: 10, padding: '2px 8px' }}
                    >
                      {notif.category}
                    </span>

                    {notif.targetTab && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--brand-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        View Details ›
                      </span>
                    )}
                  </div>
                </div>

                {!notif.read && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'var(--brand-primary)',
                      flexShrink: 0,
                      marginTop: 6
                    }}
                    title="Unread"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
