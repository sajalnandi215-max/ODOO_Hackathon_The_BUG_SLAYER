import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Clock, 
  Calendar, 
  DollarSign, 
  Award, 
  Laptop, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  role, 
  isCollapsed, 
  setIsCollapsed,
  onLogout,
  isMobileOpen = false
}) => {
  const getUserProfile = () => {
    switch (role) {
      case 'Employee':
        return { name: 'Employee', title: 'Staff Member', avatar: '' };
      case 'HR Manager':
        return { name: 'HR Manager', title: 'Human Resources', avatar: '' };
      case 'Department Manager':
        return { name: 'Dept Manager', title: 'Operations Management', avatar: '' };
      case 'Team Lead':
        return { name: 'Team Lead', title: 'Technical Operations', avatar: '' };
      default:
        return { name: 'Helix Admin', title: 'System Control', avatar: '' };
    }
  };
  const userProfile = getUserProfile();

  // Defined navigation items with allowed roles
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'employees', name: 'Employees', icon: Users, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead'] },
    { id: 'recruitment', name: 'Recruitment', icon: Briefcase, roles: ['Super Admin', 'HR Manager'] },
    { id: 'attendance', name: 'Attendance', icon: Clock, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'leave', name: 'Leave Hub', icon: Calendar, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'payroll', name: 'Payroll & Compensation', icon: DollarSign, roles: ['Super Admin', 'HR Manager', 'Employee'] },
    { id: 'performance', name: 'Performance', icon: Award, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'helpdesk', name: 'IT Assets & Support', icon: Laptop, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'settings', name: 'Settings', icon: Settings, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] }
  ];

  // Filter menu items by role
  const allowedMenuItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className={`fixed top-0 left-0 z-30 h-screen pt-16 border-r border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 flex flex-col justify-between transition-all duration-300 md:translate-x-0 ${isCollapsed ? 'w-16' : 'w-64'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Brand Logo Header */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-650 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-500/20">
              H
            </div>
            <span className="font-outfit font-extrabold text-[15px] tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Helix HRMS
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-650 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm">
            H
          </div>
        )}
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-1">
        {allowedMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                  : 'text-slate-500 dark:text-slate-450 hover:bg-slate-100/70 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col space-y-3">
        {/* Dynamic User Profile Card + Log Out button */}
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2 py-1">
            <div 
              className="h-7 w-7 rounded-lg bg-slate-150 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-500"
              title={userProfile.name}
            >
              <User className="h-4 w-4" />
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/35 border border-slate-200/25 dark:border-slate-850">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-slate-150 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0 shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 leading-tight">
                <span className="text-[10.5px] font-bold text-slate-850 dark:text-white block truncate">{userProfile.name}</span>
                <span className="text-[9px] text-slate-450 dark:text-slate-500 block truncate">{userProfile.title}</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-lg text-slate-450 hover:text-rose-600 hover:bg-rose-500/5 dark:hover:bg-rose-955/15 border border-transparent hover:border-rose-200/20 transition-all duration-200"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/40 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : (
            <div className="flex items-center space-x-2 text-xs font-medium">
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>

        {/* AI Insight Badge */}
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0 animate-pulse" />
            <div className="text-[11px] leading-relaxed text-indigo-900 dark:text-indigo-300">
              <span className="font-semibold block">HelixAI Operational Tip:</span>
              Leave pattern detection active. 1 anomaly flagged in Finance.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
