import React, { useState } from 'react';
import { 
  Shield, 
  History, 
  Database, 
  Check, 
  AlertTriangle
} from 'lucide-react';
import { mockAuditLogs, type AuditLog } from '../data/mockData';

export const AdminSettings: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'rbac' | 'logs' | 'backup'>('rbac');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Backup states
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Initial Permission settings matrix
  const [permissions, setPermissions] = useState([
    { module: 'Company Configuration', SuperAdmin: true, HRManager: false, DeptManager: false, TeamLead: false, Employee: false },
    { module: 'Employee Database Edit', SuperAdmin: true, HRManager: true, DeptManager: false, TeamLead: false, Employee: false },
    { module: 'Leave Approvals workflow', SuperAdmin: true, HRManager: true, DeptManager: true, TeamLead: true, Employee: false },
    { module: 'Payroll & Disbursals', SuperAdmin: true, HRManager: true, DeptManager: false, TeamLead: false, Employee: false },
    { module: 'Asset Assignment register', SuperAdmin: true, HRManager: true, DeptManager: false, TeamLead: false, Employee: false },
    { module: 'System Audit Logs access', SuperAdmin: true, HRManager: false, DeptManager: false, TeamLead: false, Employee: false },
  ]);

  const togglePermission = (index: number, role: 'SuperAdmin' | 'HRManager' | 'DeptManager' | 'TeamLead' | 'Employee') => {
    setPermissions(prev => prev.map((p, i) => {
      if (i === index) {
        const nextVal = !p[role];
        // log to audit logs
        const logEntry: AuditLog = {
          id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
          user: "Julia Roberts",
          role: "Super Admin",
          action: `Toggled Permission [${p.module}] for role [${role}] to [${nextVal}]`,
          ipAddress: "192.168.1.45",
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: "Success"
        };
        setAuditLogs([logEntry, ...auditLogs]);
        return { ...p, [role]: nextVal };
      }
      return p;
    }));
  };

  const startBackup = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          // log backup completion
          const logEntry: AuditLog = {
            id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
            user: "Julia Roberts",
            role: "Super Admin",
            action: "Triggered cloud cold-storage system backup",
            ipAddress: "192.168.1.45",
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            status: "Success"
          };
          setAuditLogs([logEntry, ...auditLogs]);
          alert("Helix cloud cold-storage backup successfully compiled and locked on AWS S3 glacier.");
          return 100;
        }
        return oldProgress + 20;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Console configuration</span>
          <h2 className="font-outfit text-xl font-bold text-slate-950 dark:text-white">Admin System Control Panel</h2>
        </div>

        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${activeSubTab === 'rbac' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Permissions RBAC</span>
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${activeSubTab === 'logs' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Audit & Logs</span>
          </button>
          <button
            onClick={() => setActiveSubTab('backup')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 ${activeSubTab === 'backup' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Backups System</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'rbac' && (
        /* RBAC Matrix Grid */
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Role-Based Access Control (RBAC)</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Toggle authorization parameters dynamically. Sandbox audit registers will record changes immediately.</p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/40 dark:border-slate-800/40 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3 text-left">Security Module</th>
                  <th className="pb-3 text-center">Super Admin</th>
                  <th className="pb-3 text-center">HR Manager</th>
                  <th className="pb-3 text-center">Dept Manager</th>
                  <th className="pb-3 text-center">Team Lead</th>
                  <th className="pb-3 text-center">Employee</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((p, index) => (
                  <tr key={index} className="border-b border-slate-100/50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors text-slate-700 dark:text-slate-350">
                    <td className="py-3.5 font-semibold text-slate-900 dark:text-white">{p.module}</td>
                    
                    {(['SuperAdmin', 'HRManager', 'DeptManager', 'TeamLead', 'Employee'] as const).map((roleKey) => (
                      <td key={roleKey} className="py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(index, roleKey)}
                          className={`h-5 w-5 rounded border transition-all duration-200 inline-flex items-center justify-center
                            ${p[roleKey]
                              ? 'bg-indigo-600 border-indigo-655 text-white'
                              : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50'}`}
                        >
                          {p[roleKey] && <Check className="h-3 w-3" />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'logs' && (
        /* Audit Logs Table */
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Security Audit Registry</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Automated logs capturing database actions, security triggers, and employee auth records.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/40 dark:border-slate-800/40 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3">Log ID</th>
                  <th className="pb-3">User (Role)</th>
                  <th className="pb-3">System Action details</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100/50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors text-slate-700 dark:text-slate-300">
                    <td className="py-3 font-mono font-bold text-[10px] text-slate-400">{log.id}</td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-900 dark:text-white block">{log.user}</span>
                      <span className="text-[9px] text-slate-450">{log.role}</span>
                    </td>
                    <td className="py-3 max-w-[200px] truncate" title={log.action}>{log.action}</td>
                    <td className="py-3 font-mono text-[10px] text-slate-500">{log.ipAddress}</td>
                    <td className="py-3 text-[10px] text-slate-450">{log.timestamp}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border
                        ${log.status === 'Success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-250/30'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-250/30'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'backup' && (
        /* Backup Recovery Controls */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          <div className="md:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-5">
            <div>
              <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Database Backup & Recovery points</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Compile manual backups of employee schemas, files databases, and logs history.</p>
            </div>

            {/* Progress status */}
            {isBackingUp && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/30 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                  <span>Compressing databases clusters...</span>
                  <span>{backupProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${backupProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={startBackup}
                disabled={isBackingUp}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-md shadow-indigo-650/10 disabled:opacity-50"
              >
                Trigger Manual Database Backup
              </button>
              <button
                onClick={() => alert("Checking PostgreSQL replication integrity: OK (Synced: 0ms ago).")}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 rounded-xl text-slate-700 dark:text-slate-350 font-semibold text-xs transition-colors"
              >
                Verify Replica Sync Integrity
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-amber-100 dark:border-amber-950 bg-amber-500/5 dark:bg-amber-950/10 space-y-3">
            <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4.5 w-4.5" />
              <h4 className="font-outfit text-xs font-bold">Restore warning controls</h4>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
              Restoring system recovery files overwrites active database records. Ensure all active employee log-ins are suspended beforehand.
            </p>
            <button
              onClick={() => {
                const conf = confirm("WARNING: This will overwrite postgresql records with the recovery snapshot. Do you want to proceed?");
                if (conf) alert("Db recovery snapshot applied successfully.");
              }}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] font-bold transition-colors"
            >
              Restore to last checkpoint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
