import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Gift, 
  Briefcase,
  ChevronRight,
  IndianRupee,
  User
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  mockAnnouncements 
} from '../../data/mockData';
import { dbService } from '../../services/dbService';

interface DashboardProps {
  role: string;
  setCurrentTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ role, setCurrentTab }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

  useEffect(() => {
    dbService.getEmployees().then(setEmployees);
    dbService.getLeaveRequests().then(setLeaveRequests);
  }, []);

  // Compute analytics numbers based on database
  const totalEmployees = employees.length;
  const activeLeaves = employees.filter(e => e.status === 'On-Leave').length;
  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending').length;
  const attendanceRate = employees.length > 0 ? 100 : 0;

  // Chart data 1: Attendance Trends
  const attendanceData = [
    { name: 'Mon', Present: 0, Target: 95 },
    { name: 'Tue', Present: 0, Target: 95 },
    { name: 'Wed', Present: 0, Target: 95 },
    { name: 'Thu', Present: 0, Target: 95 },
    { name: 'Fri', Present: 0, Target: 95 },
  ];

  // Chart data 2: Department Headcount Distribution
  const getDeptHeadcount = () => {
    const counts: Record<string, number> = {
      'Engineering': 0,
      'Sales': 0,
      'Product': 0,
      'Marketing': 0,
      'HR': 0,
      'Finance': 0
    };
    employees.forEach(e => {
      if (counts[e.department] !== undefined) {
        counts[e.department]++;
      }
    });
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  };
  const departmentData = getDeptHeadcount();

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#f59e0b'];

  // System statistics display config based on current role
  const getOverviewStats = () => {
    const isEmployee = role === 'Employee';

    if (isEmployee) {
      return [
        { title: "My Attendance Rate", value: "0%", icon: Clock, change: "No logs recorded", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
        { title: "Leave Balance (Earned)", value: "0 Days", icon: Calendar, change: "Casual: 0 | Sick: 0", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
        { title: "Assigned Assets", value: "0 Devices", icon: Briefcase, change: "No hardware assigned", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
        { title: "Current KPI Progress", value: "0%", icon: Sparkles, change: "No OKRs set", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/20" },
      ];
    }

    return [
      { title: "Total Headcount", value: totalEmployees, icon: Users, change: "No new hires this month", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
      { title: "Today's Attendance", value: `${attendanceRate}%`, icon: Clock, change: `${employees.length}/${employees.length} present`, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
      { title: "Employees on Leave", value: activeLeaves, icon: Calendar, change: `${pendingLeaves} requests pending`, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/20" },
      { title: "Payroll Invoiced (Q3)", value: "Rs. 0.00", icon: IndianRupee, change: "No payroll processed", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/20" },
    ];
  };

  const overviewStats = getOverviewStats();

  return (
    <div className="space-y-6">
      {/* Welcome Card & Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-transparent border border-indigo-100/30 dark:border-indigo-950/20">
        <div>
          <h1 className="font-outfit text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back, {role}! 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {role === 'Employee' 
              ? 'Here is an overview of your work statistics, tasks, and calendar events for today.'
              : `You have administrative control enabled. ${pendingLeaves} leave approvals require review.`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-4 py-2.5 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">HQ Status: Operational</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">{stat.value}</span>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div> {role === 'Employee' ? (
        /* Clean, Employee-Focused Personal Dashboard */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Column 1: Personal Profile & Assigned Hardware */}
          <div className="space-y-6">
            {/* Profile Summary Card */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
              <h3 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">My Profile Overview</h3>
              <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-outfit font-bold text-slate-900 dark:text-white text-sm">Employee</h4>
                  <p className="text-xs text-slate-500">Staff Member</p>
                  <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">EMP-NEW</span>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-350">
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Department:</span><span>Operations</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Reporting Manager:</span><span>None</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Work Email:</span><span>employee@company.com</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-medium">Joining Date:</span><span>Today</span></div>
              </div>
            </div>

            {/* My Assigned Assets */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-3">
              <h3 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">My Assigned Assets</h3>
              <p className="text-xs text-slate-400 text-center py-6">No hardware assets assigned yet.</p>
            </div>
          </div>

          {/* Column 2: Attendance & Leave History */}
          <div className="space-y-6">
            {/* Recent Attendance Console */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100/50 dark:border-slate-900/50">
                <h3 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">My Recent Attendance</h3>
                <button 
                  onClick={() => setCurrentTab('attendance')}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Manage Attendance
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center py-6">No recent attendance records found.</p>
            </div>

            {/* Leave Tracker summary */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100/50 dark:border-slate-900/50">
                <h3 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">My Time Off Requests</h3>
                <button 
                  onClick={() => setCurrentTab('leave')}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Apply Leave
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center py-6">No time off requests filed.</p>
            </div>
          </div>

          {/* Column 3: Payslips & Corporate Alerts */}
          <div className="space-y-6">
            {/* Payslips widget */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100/50 dark:border-slate-900/50">
                <h3 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">My Payslips</h3>
                <button 
                  onClick={() => setCurrentTab('payroll')}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Payslip Vault
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center py-6">No payslips available yet.</p>
            </div>

            {/* General Corporate Announcements */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
              <h3 className="font-outfit text-xs font-bold text-slate-400 uppercase tracking-wider">Announcements</h3>
              <div className="space-y-4">
                {mockAnnouncements.length > 0 ? mockAnnouncements.map(ann => (
                  <div key={ann.id} className="space-y-1">
                    <span className="font-bold text-xs text-slate-850 dark:text-white block leading-tight">{ann.title}</span>
                    <span className="text-[9px] text-slate-400 block font-mono">{ann.date} • {ann.author}</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{ann.content}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 text-center py-6">No announcements posted yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Management Dashboard (Master charts, stats, Approvals grid, AI Insights) */
        <>
          {/* Charts & Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Area Chart */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Operational Health</span>
                  <h3 className="text-sm font-bold font-outfit text-slate-950 dark:text-white">Weekly Attendance Trends</h3>
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-semibold">
                  <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-indigo-500 mr-1.5"></span>Present %</span>
                  <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 mr-1.5"></span>Target %</span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(9, 13, 22, 0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#818cf8', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="Present" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                    <Area type="monotone" dataKey="Target" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Headcount Pie Chart */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Demographics</span>
                <h3 className="text-sm font-bold font-outfit text-slate-950 dark:text-white">Department Headcount</h3>
              </div>
              <div className="h-64 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {departmentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(9, 13, 22, 0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center statistics in donut */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">145</span>
                  <span className="text-[9px] text-slate-400 font-medium">FTE Employees</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-[9px] font-semibold text-slate-500">
                {departmentData.map((d, i) => (
                  <span key={i} className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full mr-1 flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                    {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Bottom: AI insights, announcement, approvals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left: AI HR Insights */}
            <div className="lg:col-span-1 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 dark:from-indigo-950/10 dark:to-violet-950/5 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl animate-pulse-slow"></div>
              <div>
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-4">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <h4 className="font-outfit text-sm font-bold">HelixAI Insights Platform</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                      <TrendingUp className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Hiring Velocity Increased</span>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Q3 technical recruiting lifecycle dropped from 32 to 24 days due to AI resume pre-screening filters.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mt-0.5">
                      <AlertCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Attrition Risk Flag (Sales)</span>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Machine learning metrics project an 8.2% flight risk probability in Sales within 60 days following commission rate changes.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mt-0.5">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Leave Pattern Warning</span>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Finance Department is exhibiting compressed WFH applications. Recommended to adjust shift caps for Q3 closing.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setCurrentTab('recruitment')}
                className="mt-6 flex items-center justify-center space-x-1 py-2 w-full text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
              >
                <span>Run Talent Analytics Report</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Center: Pending Approvals Widget */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Pending Approvals</h4>
                  <span className="text-[9px] font-semibold bg-amber-50 dark:bg-amber-955/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200/30 dark:border-amber-800/30">
                    Action Required
                  </span>
                </div>

                <div className="space-y-3">
                  {leaveRequests.filter((r: any) => r.status === 'Pending').slice(0, 2).map((req: any) => (
                    <div key={req.id} className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 dark:border-slate-800/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[11px] font-bold block text-slate-800 dark:text-white">{req.employeeName}</span>
                          <span className="text-[9px] text-slate-400 block">{req.department} • {req.leaveType} Leave</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{req.days} days</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1.5 leading-normal">"{req.reason}"</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <button 
                          onClick={() => alert(`Approved leave request ${req.id}`)}
                          className="px-2.5 py-1 text-[9px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => alert(`Rejected leave request ${req.id}`)}
                          className="px-2.5 py-1 text-[9px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setCurrentTab('leave')}
                className="mt-4 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                <span>View all leave requests ({leaveRequests.length})</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Upcoming celebrations & Announcements */}
            <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card flex flex-col justify-between">
              <div>
                <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white mb-4">Announcements & Events</h4>
                <div className="space-y-4">
                  {mockAnnouncements.slice(0, 2).map((ann) => (
                    <div key={ann.id} className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-lg mt-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500`}>
                        <Gift className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold block text-slate-800 dark:text-white leading-snug">{ann.title}</span>
                        <span className="text-[9px] text-slate-400">{ann.date} • {ann.author}</span>
                        <p className="text-[10px] text-slate-500 leading-normal mt-1 limit-lines-2">{ann.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Celebration Card */}
              <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold block text-slate-900 dark:text-white">Events Calendar</span>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">No upcoming celebrations or events scheduled for this week.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
