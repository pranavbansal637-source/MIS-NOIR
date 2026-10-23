import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { TerminalDevice } from '../types';
import {
  Plus,
  Wrench,
  RefreshCw,
  Trash2,
  X,
  AlertTriangle,
  History,
  Activity
} from 'lucide-react';

export const PalmTerminalsPage: React.FC = () => {
  const {
    terminals,
    registerDetailedTerminal,
    markTerminalMaintenance,
    restoreTerminalFromMaintenance,
    removeTerminal,
    showToast
  } = useApp();

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newTermCode, setNewTermCode] = useState('');
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newBuilding, setNewBuilding] = useState('Academic Block A');
  const [newScannerId, setNewScannerId] = useState('');
  const [newDept, setNewDept] = useState('Computer Science & Engg');
  const [newType, setNewType] = useState<TerminalDevice['type']>('CLASSROOM');

  // Maintenance Modal
  const [maintModalTerm, setMaintModalTerm] = useState<TerminalDevice | null>(null);
  const [maintReason, setMaintReason] = useState('Optical Sensor Recalibration');
  const [maintTechnician, setMaintTechnician] = useState('Arun Kumar (Hardware Support)');
  const [maintRestorationDate, setMaintRestorationDate] = useState('24 Oct 2026');

  // Deactivate Modal
  const [deletingTerminalId, setDeletingTerminalId] = useState<string | null>(null);

  // History Modal
  const [viewingHistoryTerm, setViewingHistoryTerm] = useState<TerminalDevice | null>(null);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newTermCode.trim()) {
      showToast('Please provide both terminal name and code');
      return;
    }
    const res = registerDetailedTerminal({
      terminalCode: newTermCode.trim().toUpperCase(),
      locationName: newLocName.trim(),
      roomNumber: newRoomNo.trim() || 'Ground Kiosk',
      building: newBuilding,
      scannerHardwareId: newScannerId.trim() || `SN-PLM-${Date.now().toString().slice(-4)}`,
      type: newType,
      department: newDept,
      status: 'ONLINE'
    });
    if (res.success) {
      setShowRegisterModal(false);
      setNewLocName('');
      setNewTermCode('');
      setNewRoomNo('');
      setNewScannerId('');
    }
  };

  const handleLogMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintModalTerm) return;
    markTerminalMaintenance(maintModalTerm.id, maintReason, maintTechnician, maintRestorationDate);
    setMaintModalTerm(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div
        className="noir-card"
        style={{
          padding: 24,
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            PEHCHAAN BIOMETRIC INFRASTRUCTURE
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginTop: 2 }}>
            Palm Scan Terminal Hardware Manager
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
            Physical optical palm scanners deployed in lecture halls, turnstiles, library gates & cafeterias
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="btn btn-primary"
          style={{ gap: 6, fontWeight: 800 }}
        >
          <Plus size={16} /> Register New Terminal
        </button>
      </div>

      {/* Terminal Cards Grid */}
      <div className="grid-2">
        {terminals.map((t) => {
          const isOnline = t.status === 'ONLINE';
          const isMaintenance = t.status === 'MAINTENANCE';
          return (
            <div
              key={t.id}
              className="noir-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
                borderTop: isOnline ? '4px solid #059669' : isMaintenance ? '4px solid #D97706' : '4px solid #DC2626'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="badge badge-primary">{t.type} TERMINAL</span>
                  <span
                    className={`badge ${
                      isOnline ? 'badge-success' : isMaintenance ? 'badge-warning' : 'badge-danger'
                    }`}
                  >
                    ● {t.status}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{t.locationName}</h3>
                <div style={{ fontSize: 13, color: '#0284C7', fontWeight: 700, marginTop: 2 }}>
                  Terminal Code: {t.terminalCode} • Room: {t.roomNumber} ({t.building || 'Campus'})
                </div>

                {isMaintenance && t.maintenanceHistory && t.maintenanceHistory[0] && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#92400E'
                    }}
                  >
                    <strong>Under Maintenance:</strong> {t.maintenanceHistory[0].reason}
                    <div style={{ fontSize: 11, color: '#B45309', marginTop: 2 }}>
                      Assigned: {t.maintenanceHistory[0].assignedTechnician} • Target: {t.maintenanceHistory[0].expectedRestorationDate}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    marginTop: 12,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 8,
                    fontSize: 12,
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    padding: 12,
                    borderRadius: 10,
                    color: '#0F172A'
                  }}
                >
                  <div>
                    <strong>IP Address:</strong> {t.ipAddress}
                  </div>
                  <div>
                    <strong>MAC Address:</strong> {t.macAddress}
                  </div>
                  <div>
                    <strong>Hardware ID:</strong> {t.scannerHardwareId || 'NEX-PLM-V3'}
                  </div>
                  <div>
                    <strong>Firmware:</strong> {t.firmwareVersion}
                  </div>
                  <div>
                    <strong>Last Heartbeat:</strong> {t.lastPing}
                  </div>
                  <div>
                    <strong>Baud Rate:</strong> 115200 bps
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #E2E8F0',
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', gap: 6 }}>
                  {t.maintenanceHistory && t.maintenanceHistory.length > 0 && (
                    <button
                      onClick={() => setViewingHistoryTerm(t)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 11, gap: 4 }}
                      title="View Breakdown History"
                    >
                      <History size={13} /> Logs ({t.maintenanceHistory.length})
                    </button>
                  )}
                  <button
                    onClick={() => showToast(`Ping diagnostic sent to ${t.terminalCode}: 2ms latency, optical sensor nominal.`)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: 11, gap: 4 }}
                  >
                    <Activity size={13} color="#0284C7" /> Ping Test
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {isOnline ? (
                    <button
                      onClick={() => setMaintModalTerm(t)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: 11, gap: 4 }}
                    >
                      <Wrench size={12} color="#D97706" /> Breakdown
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreTerminalFromMaintenance(t.id, 'Routine diagnostic completed. Biometric sensor operational.')}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: 11, gap: 4, backgroundColor: '#059669' }}
                    >
                      <RefreshCw size={12} /> Restore Online
                    </button>
                  )}

                  <button
                    onClick={() => setDeletingTerminalId(t.id)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: 11, color: '#DC2626' }}
                    title="Safely Deactivate Terminal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* REGISTER TERMINAL MODAL */}
      {/* ======================================================== */}
      {showRegisterModal && (
        <div className="modal-backdrop" onClick={() => setShowRegisterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Register Palm Terminal</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>Add a physical optical palm scanner to Pehchaan network</p>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Terminal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lecture Hall A401 Palm Kiosk"
                  className="input-field"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Terminal Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PLM-A401"
                    className="input-field"
                    value={newTermCode}
                    onChange={(e) => setNewTermCode(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Room Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A401"
                    className="input-field"
                    value={newRoomNo}
                    onChange={(e) => setNewRoomNo(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Building
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Hardware Scanner ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NEX-PLM-V3-SN8902"
                    className="input-field"
                    value={newScannerId}
                    onChange={(e) => setNewScannerId(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Department
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                    Terminal Type
                  </label>
                  <select
                    className="input-field"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                  >
                    <option value="CLASSROOM">Classroom / Lecture Hall</option>
                    <option value="GATE">Campus Gate</option>
                    <option value="LIBRARY">Central Library Turnstile</option>
                    <option value="SHOP">Canteen / POS Terminal</option>
                    <option value="EVENT">Auditorium / Event</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setShowRegisterModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAINTENANCE LOGGING MODAL */}
      {/* ======================================================== */}
      {maintModalTerm && (
        <div className="modal-backdrop" onClick={() => setMaintModalTerm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={18} /> Log Breakdown & Maintenance
                </h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>
                  {maintModalTerm.locationName} ({maintModalTerm.terminalCode})
                </p>
              </div>
              <button onClick={() => setMaintModalTerm(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLogMaintenance} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Reported Issue / Reason *
                </label>
                <select
                  className="input-field"
                  value={maintReason}
                  onChange={(e) => setMaintReason(e.target.value)}
                >
                  <option value="Optical Sensor Recalibration">Optical Sensor Recalibration</option>
                  <option value="Ethernet Cable / Network Timeout">Ethernet Cable / Network Timeout</option>
                  <option value="Touch Display & Biometric Glare">Touch Display & Biometric Glare</option>
                  <option value="Firmware Update In Progress">Firmware Update In Progress</option>
                  <option value="Power Supply Surge Anomaly">Power Supply Surge Anomaly</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Assigned Hardware Technician *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={maintTechnician}
                  onChange={(e) => setMaintTechnician(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                  Expected Restoration Date *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={maintRestorationDate}
                  onChange={(e) => setMaintRestorationDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" onClick={() => setMaintModalTerm(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" style={{ fontWeight: 800 }}>
                  Mark Under Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEACTIVATE CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {deletingTerminalId && (
        <div className="modal-backdrop" onClick={() => setDeletingTerminalId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#DC2626', marginBottom: 8 }}>Deactivate Palm Terminal?</h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
              This will safely remove the terminal from live operational status. Historical attendance records will remain preserved in the registrar database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setDeletingTerminalId(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={() => {
                  removeTerminal(deletingTerminalId);
                  setDeletingTerminalId(null);
                }}
                className="btn btn-danger"
                style={{ fontWeight: 800 }}
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAINTENANCE HISTORY LOG MODAL */}
      {/* ======================================================== */}
      {viewingHistoryTerm && (
        <div className="modal-backdrop" onClick={() => setViewingHistoryTerm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Maintenance History Log</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>
                  {viewingHistoryTerm.locationName} ({viewingHistoryTerm.terminalCode})
                </p>
              </div>
              <button onClick={() => setViewingHistoryTerm(null)} className="btn btn-ghost btn-icon btn-sm">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto' }}>
              {viewingHistoryTerm.maintenanceHistory?.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: 12,
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: 10,
                    fontSize: 12
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span style={{ color: '#0F172A' }}>{log.reason}</span>
                    <span className={`badge ${log.status === 'RESTORED' ? 'badge-success' : 'badge-warning'}`}>
                      {log.status}
                    </span>
                  </div>
                  <div style={{ color: '#64748B', marginTop: 4 }}>
                    Technician: <strong>{log.assignedTechnician}</strong> • Reported: {log.reportedTime}
                  </div>
                  {log.restorationNotes && (
                    <div style={{ color: '#059669', marginTop: 4, fontWeight: 600 }}>
                      Restored: {log.restorationNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
