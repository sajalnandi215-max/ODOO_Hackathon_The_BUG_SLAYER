import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Shield, 
  User, 
  Command,
  HelpCircle,
  LogOut,
  Menu
} from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  role: string;
  setRole: (role: string) => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

// Maps role to active user detail for the mockup
export const roleUserMap: Record<string, { name: string; designation: string; avatar: string }> = {
  'Super Admin': {
    name: 'Administrator',
    designation: 'Super Admin',
    avatar: ''
  },
  'HR Manager': {
    name: 'HR Manager',
    designation: 'HR Department',
    avatar: ''
  },
  'Department Manager': {
    name: 'Dept Manager',
    designation: 'Operations Management',
    avatar: ''
  },
  'Team Lead': {
    name: 'Team Lead',
    designation: 'Technical Operations',
    avatar: ''
  },
  'Employee': {
    name: 'Employee',
    designation: 'Staff Member',
    avatar: ''
  }
};

export const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  setDarkMode, 
  role,
  setRole,
  onLogout,
  onToggleMobileSidebar
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const currentUser = roleUserMap[role] || roleUserMap['Employee'];
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-200/50 dark:border-slate-800/50 glass-panel flex items-center justify-between px-4 md:px-6">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 block md:hidden mr-1"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-white overflow-hidden p-0.5 border border-slate-200/55 dark:border-slate-800/40 shadow-sm flex-shrink-0">
          <img src="/logo.png" alt="Helix Logo" className="h-full w-full object-contain rounded-lg" />
        </div>
        <span className="font-outfit text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
          Helix
        </span>
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
          Enterprise
        </span>
      </div>

      {/* Global Search Bar Mockup */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees, files, tools..."
          className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
        />
        <div className="absolute right-3 flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-[10px] text-slate-500">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* RBAC Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifDropdown(false);
              setShowProfileDropdown(false);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900/50 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Role: {role}</span>
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Sandbox Role
              </div>
              {Object.keys(roleUserMap).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors
                    ${role === r ? 'text-violet-600 dark:text-violet-400 font-semibold bg-violet-50/50 dark:bg-violet-900/10' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Light/Dark Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/35 dark:border-slate-800/35 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowRoleDropdown(false);
              setShowProfileDropdown(false);
            }}
            className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/35 dark:border-slate-800/35 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white relative transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-900">
                <span className="text-xs font-semibold">Notifications</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-semibold">
                  {unreadCount} New
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 border-b border-slate-100/50 dark:border-slate-900/50 transition-colors last:border-0 ${!notif.read ? 'bg-slate-50/50 dark:bg-slate-900/20' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-slate-900 dark:text-white">{notif.title}</span>
                      <span className="text-[9px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowRoleDropdown(false);
              setShowNotifDropdown(false);
            }}
            className="flex items-center space-x-2 pl-1 pr-2 py-1 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/35 dark:border-slate-800/35 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-200"
          >
            <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-800">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden lg:flex flex-col items-start text-left">
              <span className="text-[11px] font-semibold leading-tight text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400">
                {currentUser.designation}
              </span>
            </div>
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-900">
                <span className="block text-xs font-semibold">{currentUser.name}</span>
                <span className="block text-[10px] text-slate-500">{currentUser.designation}</span>
              </div>
              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  alert("Opening User Profile Details...");
                }}
                className="flex items-center w-full px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-left"
              >
                <User className="mr-2 h-3.5 w-3.5" />
                My Profile
              </button>
              <button 
                onClick={() => {
                  setShowProfileDropdown(false);
                  alert("Opening User Preferences & Help...");
                }}
                className="flex items-center w-full px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-left"
              >
                <HelpCircle className="mr-2 h-3.5 w-3.5" />
                Help & Guides
              </button>
              <button
                onClick={() => {
                  setShowProfileDropdown(false);
                  onLogout();
                }}
                className="flex items-center w-full px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-900 text-left border-t border-slate-100 dark:border-slate-900"
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
