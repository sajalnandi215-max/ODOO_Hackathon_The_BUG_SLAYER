import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Clock, 
  Calendar, 
  DollarSign, 
  Award, 
  GraduationCap, 
  HelpCircle, 
  Laptop, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  role: string;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  role, 
  isCollapsed, 
  setIsCollapsed,
  onLogout
}) => {
  const getUserProfile = () => {
    switch (role) {
      case 'Employee':
        return { name: 'Employee', title: 'Staff Member', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };
      case 'HR Manager':
        return { name: 'HR Manager', title: 'Human Resources', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };
      case 'Department Manager':
        return { name: 'Dept Manager', title: 'Operations Management', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };
      case 'Team Lead':
        return { name: 'Team Lead', title: 'Technical Operations', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };
      default:
        return { name: 'Helix Admin', title: 'System Control', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };
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
    { id: 'performance', name: 'Performance OKRs', icon: Award, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'lms', name: 'Learning LMS', icon: GraduationCap, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'assets', name: 'Asset Management', icon: Laptop, roles: ['Super Admin', 'HR Manager', 'Employee'] },
    { id: 'helpdesk', name: 'Help Desk', icon: HelpCircle, roles: ['Super Admin', 'HR Manager', 'Department Manager', 'Team Lead', 'Employee'] },
    { id: 'settings', name: 'System Settings', icon: Settings, roles: ['Super Admin'] },
  ];

  // Filter items by current role
  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside 
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 border-r border-slate-200/50 dark:border-slate-800/50 
        glass-panel flex flex-col justify-between pt-16
        ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 group text-left
                ${isActive 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/10' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
              {!isCollapsed && (
                <span className="text-sm font-medium transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col space-y-3">
        {/* Dynamic User Profile Card + Log Out button */}
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2 py-1">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="h-7 w-7 rounded-lg object-cover border border-slate-250 dark:border-slate-800 shadow-sm"
              title={userProfile.name}
            />
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
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name}
                className="h-7 w-7 rounded-lg object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
              />
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
    </aside>
  );
};
