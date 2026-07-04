import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, AlertTriangle, Mail, Download, CheckCircle, Eye, Loader2
} from 'lucide-react';
import api from '../lib/api';
import { useApi, getApiError } from '../hooks/useApi';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';

interface PayrollProps { role?: string; }

interface ApiPayroll {
  _id: string;
  employee: { firstName: string; lastName: string; jobTitle: string; department: string; employeeCode: string; workEmail: string; bankDetails?: { accountNumber?: string } } | null;
  payPeriod: { month: number; year: number };
  earnings: { basicSalary: number; hra: number; allowances: number; overtime: number; grossSalary: number };
  deductions: { incomeTax: number; pf: number; esi: number; otherDeductions: number; totalDeductions: number };
  netSalary: number;
  status: string;
  paymentDate?: string;
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const Payroll: React.FC<PayrollProps> = ({ role }) => {
  const isEmployee = role === 'Employee';
  const [selectedPayroll, setSelectedPayroll] = useState<ApiPayroll | null>(null);
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  const endpoint = isEmployee ? '/payroll/my' : '/payroll';
  const { data, loading, error, refetch } = useApi<{ payrolls: ApiPayroll[] }>(
    () => api.get(endpoint).then(r => r.data.data),
    [role]
  );
  const payrolls = data?.payrolls ?? [];

  // Auto-select first record
  React.useEffect(() => {
    if (payrolls.length > 0 && !selectedPayroll) {
      setSelectedPayroll(payrolls[0]);
    }
  }, [payrolls]);

  const totalGross = payrolls.reduce((s, p) => s + (p.earnings?.grossSalary ?? 0), 0);
  const totalNet = payrolls.reduce((s, p) => s + (p.netSalary ?? 0), 0);
  const totalDeductions = payrolls.reduce((s, p) => s + (p.deductions?.totalDeductions ?? 0), 0);

  const handleMarkPaid = async (id: string) => {
    setMarkingPaid(id);
    try {
      await api.patch(`/payroll/${id}/pay`);
      refetch();
    } catch (err) {
      alert(getApiError(err));
    } finally {
      setMarkingPaid(null);
    }
  };

  const handleDownload = (p: ApiPayroll) => {
    const name = p.employee ? `${p.employee.firstName} ${p.employee.lastName}` : 'Employee';
    const period = `${MONTH_NAMES[(p.payPeriod?.month ?? 1) - 1]} ${p.payPeriod?.year}`;
    alert(`Generating payslip PDF for ${name} (Period: ${period})...`);
  };

  const handleEmail = (p: ApiPayroll) => {
    const name = p.employee ? `${p.employee.firstName} ${p.employee.lastName}` : 'Employee';
    const email = p.employee?.workEmail ?? '—';
    alert(`Payslip for ${name} dispatched to: ${email}`);
  };

  const active = selectedPayroll;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
          {isEmployee ? 'My Earnings' : 'Financials'}
        </span>
        <h2 className="font-outfit text-xl font-bold text-slate-950 dark:text-white">
          {isEmployee ? 'My Compensation & Payslips' : 'Payroll & Compensation'}
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">
              {isEmployee ? 'Gross Monthly Earnings' : 'Total Gross Outflow'}
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
              ${isEmployee ? (active?.earnings?.grossSalary ?? 0).toLocaleString() : totalGross.toLocaleString()}
            </span>
            <p className="text-[10px] text-emerald-500 mt-1 font-semibold flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> {isEmployee ? 'Basic + Allowances + HRA' : 'All employees this cycle'}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-rose-100 dark:border-rose-950 bg-rose-500/5 dark:bg-rose-950/10">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              {isEmployee ? 'Monthly Deductions' : 'Total Deductions'}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
              ${isEmployee ? (active?.deductions?.totalDeductions ?? 0).toLocaleString() : totalDeductions.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Tax + PF + ESI</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">
              {isEmployee ? 'Net Take-Home Pay' : 'Total Net Disbursed'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">
              ${isEmployee ? (active?.netSalary ?? 0).toLocaleString() : totalNet.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">
              {active ? `${MONTH_NAMES[(active.payPeriod?.month ?? 1) - 1]} ${active.payPeriod?.year}` : 'Current period'}
            </p>
          </div>
        </div>
      </div>

      {/* Table + Payslip Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Table */}
        <div className="xl:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
          <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white mb-4">
            {isEmployee ? 'My Payroll History' : 'Staff Compensation Directory'}
          </h3>

          {loading && <LoadingSpinner message="Loading payroll data..." />}
          {error && <ErrorMessage message={error} onRetry={refetch} />}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/40 dark:border-slate-800/40 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                    <th className="pb-3">{isEmployee ? 'Pay Cycle' : 'Employee'}</th>
                    <th className="pb-3">Basic</th>
                    <th className="pb-3">Allowances</th>
                    <th className="pb-3">Deductions</th>
                    <th className="pb-3">Net Salary</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map(p => {
                    const period = `${MONTH_NAMES[(p.payPeriod?.month ?? 1) - 1]} ${p.payPeriod?.year}`;
                    const name = p.employee ? `${p.employee.firstName} ${p.employee.lastName}` : '—';
                    const isSelected = selectedPayroll?._id === p._id;
                    return (
                      <tr key={p._id} className={`border-b border-slate-100/50 dark:border-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors text-slate-700 dark:text-slate-300 ${isSelected ? 'bg-indigo-500/5 dark:bg-indigo-950/10' : ''}`}>
                        <td className="py-3 font-semibold text-slate-900 dark:text-white">
                          {isEmployee ? period : name}
                          <span className="block text-[9px] text-slate-400 font-normal">
                            {isEmployee ? 'Monthly Salary Docket' : p.employee?.jobTitle ?? '—'}
                          </span>
                        </td>
                        <td className="py-3 font-mono">${p.earnings?.basicSalary?.toLocaleString() ?? '—'}</td>
                        <td className="py-3 font-mono text-emerald-600">+${p.earnings?.allowances?.toLocaleString() ?? '—'}</td>
                        <td className="py-3 font-mono text-rose-500">-${p.deductions?.totalDeductions?.toLocaleString() ?? '—'}</td>
                        <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">${p.netSalary?.toLocaleString() ?? '—'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border
                            ${p.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200/30'
                              : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200/30'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button onClick={() => setSelectedPayroll(p)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500" title="Preview">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDownload(p)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </button>
                            {!isEmployee && p.status !== 'paid' && (
                              <button onClick={() => handleMarkPaid(p._id)} disabled={markingPaid === p._id}
                                className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
                                {markingPaid === p._id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Pay'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {payrolls.length === 0 && (
                    <tr><td colSpan={7} className="py-8 text-center text-slate-400 text-[11px]">No payroll records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payslip Inspector */}
        <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 space-y-4 shadow-xl select-none relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-indigo-500/5 rounded-full blur-xl"></div>

          {active ? (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <span className="text-[13px] font-bold font-outfit text-slate-950 dark:text-white block">HELIX ENTERPRISE INC</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Disbursement Pay Docket</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold block">{active.employee?.employeeCode ?? '—'}</span>
                  <span className="text-[8px] text-slate-400 block">Period: {MONTH_NAMES[(active.payPeriod?.month ?? 1) - 1]} {active.payPeriod?.year}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] py-1">
                <div><span className="text-slate-400 font-medium">Employee:</span><span className="font-semibold text-slate-800 dark:text-white block">{active.employee ? `${active.employee.firstName} ${active.employee.lastName}` : '—'}</span></div>
                <div><span className="text-slate-400 font-medium">Designation:</span><span className="font-semibold text-slate-800 dark:text-white block">{active.employee?.jobTitle ?? '—'}</span></div>
                <div><span className="text-slate-400 font-medium">Bank A/C:</span><span className="font-mono block">{active.employee?.bankDetails?.accountNumber ?? '**********'}</span></div>
                <div><span className="text-slate-400 font-medium">Department:</span><span className="font-semibold block">{active.employee?.department ?? '—'}</span></div>
              </div>

              <div className="border border-slate-200/40 dark:border-slate-800/40 rounded-xl overflow-hidden text-[10px]">
                <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 font-bold border-b border-slate-200/40 dark:border-slate-800/40">
                  <span>Earnings</span><span>Deductions</span>
                </div>
                <div className="grid grid-cols-2 px-3 py-2 items-start">
                  <div className="space-y-1">
                    <div className="flex justify-between pr-2"><span>Basic Pay</span><span className="font-mono">${active.earnings?.basicSalary}</span></div>
                    <div className="flex justify-between pr-2"><span>HRA</span><span className="font-mono">${active.earnings?.hra}</span></div>
                    <div className="flex justify-between pr-2"><span>Allowances</span><span className="font-mono">${active.earnings?.allowances}</span></div>
                    {(active.earnings?.overtime ?? 0) > 0 && (
                      <div className="flex justify-between pr-2"><span>Overtime</span><span className="font-mono text-emerald-600">+${active.earnings?.overtime}</span></div>
                    )}
                  </div>
                  <div className="space-y-1 border-l border-slate-200/20 pl-2">
                    <div className="flex justify-between"><span>Income Tax</span><span className="font-mono text-rose-500">-${active.deductions?.incomeTax}</span></div>
                    <div className="flex justify-between"><span>PF</span><span className="font-mono text-rose-500">-${active.deductions?.pf}</span></div>
                    <div className="flex justify-between"><span>ESI</span><span className="font-mono text-rose-500">-${active.deductions?.esi}</span></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/10 rounded-xl text-[10px]">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>Gross Earnings:</span><span className="font-mono">${active.earnings?.grossSalary}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-500 mt-1">
                  <span>Total Deductions:</span><span className="font-mono">-${active.deductions?.totalDeductions}</span>
                </div>
                <div className="flex justify-between font-extrabold text-[12px] text-indigo-600 dark:text-indigo-400 mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                  <span>Net Pay:</span><span className="font-mono">${active.netSalary}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => handleDownload(active)}
                  className="flex items-center justify-center space-x-1.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-[10px] font-semibold transition-colors">
                  <Download className="h-3.5 w-3.5 text-slate-400" /><span>Download PDF</span>
                </button>
                <button onClick={() => handleEmail(active)}
                  className="flex items-center justify-center space-x-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-semibold transition-colors">
                  <Mail className="h-3.5 w-3.5" /><span>Email Payslip</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-xs">Select a payroll record to preview the payslip.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
