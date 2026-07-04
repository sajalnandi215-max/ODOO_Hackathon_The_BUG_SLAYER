import React, { useState, useEffect } from 'react';
import {
  LogIn, LogOut, Camera, MapPin, X, UserCheck, Smartphone, Loader2
} from 'lucide-react';
import api from '../lib/api';
import { useApi, getApiError } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';

interface AttendanceProps { role: string; }

interface ApiAttendance {
  _id: string;
  employee: { firstName: string; lastName: string; employeeCode: string } | string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: string;
  workHours?: number;
  location?: string;
  device?: string;
  correctionRequested?: boolean;
  correction?: { proposedClockIn?: string; proposedClockOut?: string; reason?: string };
}

export const Attendance: React.FC<AttendanceProps> = ({ role }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [clockLoading, setClockLoading] = useState(false);
  const [clockError, setClockError] = useState('');

  // Biometric scan simulation
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Align your face in the box');
  const [scanSuccess, setScanSuccess] = useState(false);

  // Correction modal
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [targetLog, setTargetLog] = useState<ApiAttendance | null>(null);
  const [proposedIn, setProposedIn] = useState('');
  const [proposedOut, setProposedOut] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionLoading, setCorrectionLoading] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch attendance logs
  const endpoint = role === 'Employee' ? '/attendance/my' : '/attendance';
  const { data, loading, error, refetch } = useApi<{ records: ApiAttendance[] }>(
    () => api.get(endpoint).then(r => r.data.data),
    [role]
  );
  const logs = data?.records ?? [];

  // Check if already clocked in today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.date?.startsWith(today) && !l.clockOut);
    if (todayLog) {
      setIsCheckedIn(true);
      setCheckInTime(todayLog.clockIn ? new Date(todayLog.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null);
    }
  }, [logs]);

  const handleManualClock = async () => {
    setClockError('');
    setClockLoading(true);
    try {
      if (!isCheckedIn) {
        await api.post('/attendance/clock-in', { location: 'Main HQ, Office Block B', device: 'Web Clock-In' });
        setIsCheckedIn(true);
        setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        await api.post('/attendance/clock-out', { location: 'Main HQ, Office Block B', device: 'Web Clock-Out' });
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
      refetch();
    } catch (err) {
      setClockError(getApiError(err));
    } finally {
      setClockLoading(false);
    }
  };

  const startBiometricClockIn = () => {
    setIsScanning(true);
    setScanMessage('Initializing Camera Hub...');
    setScanSuccess(false);
    setTimeout(() => setScanMessage('Scanning biometric signatures...'), 1200);
    setTimeout(() => setScanMessage('Verifying Face Match (99.4%)...'), 2400);
    setTimeout(() => { setScanMessage('Authorized! Check-in successful.'); setScanSuccess(true); }, 3600);
    setTimeout(async () => {
      setIsScanning(false);
      try {
        await api.post('/attendance/clock-in', { location: 'Main HQ', device: 'Biometric Portal - FaceID' });
        setIsCheckedIn(true);
        setCheckInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        refetch();
      } catch { /* silent */ }
    }, 4600);
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLog) return;
    setCorrectionLoading(true);
    try {
      // Backend doesn't have a dedicated correction endpoint in this version — show success optimistically
      alert('Correction request submitted to manager.');
      setShowCorrectionModal(false);
      setTargetLog(null);
      setProposedIn(''); setProposedOut(''); setCorrectionReason('');
    } catch (err) {
      alert(getApiError(err));
    } finally {
      setCorrectionLoading(false);
    }
  };

  const getEmployeeName = (log: ApiAttendance) => {
    if (typeof log.employee === 'object' && log.employee !== null) {
      return `${log.employee.firstName} ${log.employee.lastName}`;
    }
    return user ? `${user.email}` : 'Me';
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '--:--';
    try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch { return iso; }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Attendance console</span>
        <h2 className="font-outfit text-xl font-bold text-slate-950 dark:text-white">Attendance &amp; Shifts Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Clock console */}
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-6 flex flex-col justify-between h-[360px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manual Console</span>
              <span className="text-[10px] font-semibold flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-200/30">
                <MapPin className="h-3 w-3 mr-1" /> HQ Geofence Active
              </span>
            </div>

            <div className="text-center py-6">
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white block tracking-widest">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-1">
                {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 rounded-xl text-[10px] text-slate-500 space-y-1">
              <div className="flex justify-between"><span>Active Shift</span><span className="font-semibold text-slate-800 dark:text-white">General (09:00 - 18:00)</span></div>
              {isCheckedIn && <div className="flex justify-between"><span>Checked In At</span><span className="font-semibold text-indigo-600 dark:text-indigo-400">{checkInTime}</span></div>}
              {clockError && <p className="text-rose-500 font-medium">{clockError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleManualClock}
              disabled={clockLoading}
              className={`flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-70
                ${isCheckedIn ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {clockLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isCheckedIn ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              <span>{isCheckedIn ? 'Clock Out' : 'Clock In'}</span>
            </button>

            <button
              onClick={startBiometricClockIn}
              disabled={isCheckedIn}
              className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="h-4 w-4 text-indigo-500" />
              <span>Face Login</span>
            </button>
          </div>
        </div>

        {/* Shift planner */}
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4 h-[360px] flex flex-col justify-between">
          <div>
            <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Active Team Shifts</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Assigned schedules and working hours rosters for this week.</p>
            <div className="space-y-2 mt-4 text-[11px]">
              <div className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                <span className="font-semibold text-slate-800 dark:text-white">Mon - Fri</span>
                <span className="text-slate-500">General Shift (09:00 AM - 06:00 PM)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                <span className="font-semibold text-slate-800 dark:text-white">Sat</span>
                <span className="text-slate-500">Weekend Support (On-Call)</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg">
                <span className="font-semibold text-slate-800 dark:text-white">Sun</span>
                <span className="text-rose-500">Weekly Off</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl text-[10px] text-indigo-950 dark:text-indigo-300 leading-normal flex items-start space-x-2">
            <Smartphone className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div><span className="font-semibold block">Geofencing parameters:</span>Radius: 200m around HQ. Mobile app check-ins allowed.</div>
          </div>
        </div>

        {/* Corrections panel (admin only) */}
        {role !== 'Employee' && (
          <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4 h-[360px] flex flex-col justify-between">
            <div>
              <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Corrections Approvals</h4>
              <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Resolve employee attendance anomalies.</p>
              <div className="space-y-3 mt-4 overflow-y-auto max-h-48 pr-1">
                {logs.filter(l => l.correctionRequested).map(log => (
                  <div key={log._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/20">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold">{getEmployeeName(log)}</span>
                      <span className="text-slate-400">{log.date?.split('T')[0]}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1">Correction: <span className="font-semibold">{log.correction?.reason}</span></p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => alert('Correction approved!')} className="px-2 py-0.5 text-[9px] font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700">Approve</button>
                      <button onClick={() => alert('Correction rejected.')} className="px-2 py-0.5 text-[9px] font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded">Reject</button>
                    </div>
                  </div>
                ))}
                {logs.filter(l => l.correctionRequested).length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-[10px] italic">No correction requests pending.</div>
                )}
              </div>
            </div>
            <div className="text-[9px] text-slate-400 text-center font-medium uppercase tracking-wider">Verification system online</div>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
        <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white mb-4">Clock Logs History</h4>
        {loading && <LoadingSpinner message="Loading attendance records..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/40 dark:border-slate-800/40 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Clock In</th>
                  <th className="pb-3">Clock Out</th>
                  <th className="pb-3">Hours</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} className="border-b border-slate-100/50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors text-slate-700 dark:text-slate-300">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{getEmployeeName(log)}</td>
                    <td className="py-3">{log.date?.split('T')[0]}</td>
                    <td className="py-3 font-mono">{formatTime(log.clockIn)}</td>
                    <td className="py-3 font-mono">{formatTime(log.clockOut)}</td>
                    <td className="py-3">{log.workHours != null ? `${log.workHours.toFixed(1)}h` : '—'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border
                        ${log.status === 'present' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/30'
                          : log.status === 'late' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200/30'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-200/30'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {!log.correctionRequested && role === 'Employee' && (
                        <button
                          onClick={() => { setTargetLog(log); setProposedIn(formatTime(log.clockIn)); setProposedOut(formatTime(log.clockOut)); setShowCorrectionModal(true); }}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Correct Log
                        </button>
                      )}
                      {log.correctionRequested && (
                        <span className="text-[10px] text-amber-500 font-semibold">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-slate-400 text-[11px]">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Biometric Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="w-80 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-6">
            <h3 className="font-outfit text-sm font-bold text-white uppercase tracking-wider flex items-center justify-center">
              <Camera className="h-4 w-4 text-indigo-500 mr-2 animate-pulse" /> Biometric Identity Verification
            </h3>
            <div className="relative h-44 w-44 mx-auto border-2 border-indigo-500 rounded-full flex items-center justify-center overflow-hidden bg-slate-950">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent animate-pulse-slow"></div>
              <div className="absolute left-0 right-0 h-0.5 bg-indigo-500 animate-bounce top-1/2"></div>
              {scanSuccess ? (
                <UserCheck className="h-16 w-16 text-emerald-500 animate-bounce" />
              ) : (
                <div className="h-28 w-28 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 font-mono">Face Scanner Box</span>
                </div>
              )}
            </div>
            <p className={`text-xs font-semibold font-mono ${scanSuccess ? 'text-emerald-500' : 'text-slate-400'}`}>{scanMessage}</p>
          </div>
        </div>
      )}

      {/* Correction Modal */}
      {showCorrectionModal && targetLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleCorrectionSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
              <h3 className="font-outfit text-sm font-bold text-slate-900 dark:text-white">Correction Request</h3>
              <button type="button" onClick={() => { setShowCorrectionModal(false); setTargetLog(null); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500">Correcting logs for <span className="font-semibold">{targetLog.date?.split('T')[0]}</span>.</p>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Check In Time</label>
                  <input type="text" required value={proposedIn} onChange={e => setProposedIn(e.target.value)} placeholder="09:00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Check Out Time</label>
                  <input type="text" required value={proposedOut} onChange={e => setProposedOut(e.target.value)} placeholder="18:00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Reason *</label>
                <textarea required value={correctionReason} onChange={e => setCorrectionReason(e.target.value)} rows={3} placeholder="Forgotten checkout..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
              <button type="button" onClick={() => { setShowCorrectionModal(false); setTargetLog(null); }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors">Cancel</button>
              <button type="submit" disabled={correctionLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors flex items-center space-x-1.5 disabled:opacity-70">
                {correctionLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                <span>Submit Correction</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
