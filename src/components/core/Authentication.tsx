import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Globe, 
  Key, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  AlertCircle,
  X
} from 'lucide-react';

interface AuthenticationProps {
  onLoginSuccess: (role: string) => void;
}

export const Authentication: React.FC<AuthenticationProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'credentials' | 'empid'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId] = useState('');
  const [pin, setPin] = useState('');
  
  // Visibility & Strength
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 2FA step
  const [is2faRequired, setIs2faRequired] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');

  // Selected role for preview login
  const [loginRole, setLoginRole] = useState('Super Admin');

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPasswordStrength(score);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    calculatePasswordStrength(val);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'credentials' && (!email || !password)) return;
    if (activeTab === 'empid' && (!empId || !pin)) return;

    // Simulate requirement of 2FA
    setIs2faRequired(true);
  };

  const handle2faVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFaCode.length < 6) return;
    
    // Auth complete
    onLoginSuccess(loginRole);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    alert(`A password reset link has been dispatched to: ${forgotEmail}`);
    setShowForgot(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-grid-pattern relative overflow-hidden px-4">
      {/* Dynamic background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-650/10 blur-3xl animate-pulse-slow"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 rounded-3xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-xl shadow-2xl space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-white overflow-hidden p-1 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/10">
              <img src="/logo.png" alt="Helix Logo" className="h-full w-full object-contain rounded-xl" />
            </div>
            <h1 className="font-outfit text-2xl font-extrabold tracking-tight text-white">
              Helix HRMS
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
              Secure Enterprise HR Management
            </p>
          </div>

          {!is2faRequired ? (
            /* Log in inputs credentials/ID */
            <div className="space-y-5">
              {/* Tab Switches */}
              <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('credentials')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${activeTab === 'credentials' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                  Email Credentials
                </button>
                <button
                  onClick={() => setActiveTab('empid')}
                  className={`flex-1 py-2 rounded-lg transition-colors ${activeTab === 'empid' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                  Employee ID
                </button>
              </div>

              {/* Selected role switcher dropdown (convenience for demo sandbox!) */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-400">
                <span className="font-semibold text-[10px] text-indigo-400 uppercase tracking-wider block">Sandbox Role (Select role to login)</span>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full bg-transparent border-0 focus:ring-0 text-white font-medium cursor-pointer"
                >
                  <option value="Super Admin" className="bg-slate-950">Super Admin</option>
                  <option value="HR Manager" className="bg-slate-950">HR Manager</option>
                  <option value="Department Manager" className="bg-slate-950">Department Manager</option>
                  <option value="Team Lead" className="bg-slate-950">Team Lead</option>
                  <option value="Employee" className="bg-slate-950">Employee User</option>
                </select>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {activeTab === 'credentials' ? (
                  /* Standard email input */
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-slate-450 font-medium">Work Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-slate-455 font-medium">Password credentials</label>
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-[10px] font-bold text-indigo-400 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      {password.length > 0 && (
                        <div className="space-y-1 pt-1.5">
                          <div className="flex justify-between items-center text-[10px] text-slate-500">
                            <span>Password security level</span>
                            <span className="font-semibold">
                              {passwordStrength === 4 ? 'Very Strong' : passwordStrength === 3 ? 'Strong' : passwordStrength === 2 ? 'Fair' : 'Weak'}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${i < passwordStrength ? (passwordStrength >= 3 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-850'}`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* Employee ID login options */
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-slate-450 font-medium">Employee Identifier ID</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={empId}
                          onChange={(e) => setEmpId(e.target.value)}
                          placeholder="EMP-2026-XXXX"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-450 font-medium">Security Access PIN</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="password"
                          required
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="••••"
                          maxLength={4}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-650/15 transition-all duration-200 mt-2"
                >
                  Authorize System Session
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider py-1.5">
                <div className="flex-1 h-0.5 bg-slate-800"></div>
                <span>Or connect with SSO</span>
                <div className="flex-1 h-0.5 bg-slate-800"></div>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onLoginSuccess(loginRole)}
                  className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all"
                >
                  <Globe className="h-4 w-4" />
                  <span>Google Login</span>
                </button>
                <button
                  onClick={() => onLoginSuccess(loginRole)}
                  className="flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all"
                >
                  <ShieldCheck className="h-4 w-4 text-sky-500" />
                  <span>Microsoft SSO</span>
                </button>
              </div>
            </div>
          ) : (
            /* 2FA input stage */
            <form onSubmit={handle2faVerify} className="space-y-5 animate-in fade-in duration-200 text-xs">
              <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start space-x-2 text-[11px] text-indigo-300">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">2FA Verification Required</span>
                  Enter the 6-digit security token code from your authentication app (Google/Microsoft Auth).
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 font-medium">Authenticator Pin Code *</label>
                <input
                  type="text"
                  required
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-center font-mono text-xl tracking-widest focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-650/15 transition-all duration-200"
              >
                Verify & Grant Access
              </button>

              <button
                type="button"
                onClick={() => setIs2faRequired(false)}
                className="w-full text-slate-500 hover:text-white text-[10px] font-bold"
              >
                Cancel Authorization
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleForgotSubmit}
            className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-outfit text-sm font-bold text-white">Reset Account Access</h3>
              <button 
                type="button"
                onClick={() => setShowForgot(false)}
                className="p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4 text-slate-450" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Enter your corporate email address. If an account is associated with it, we will dispatch an encrypted reset link.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-400 font-medium">Work Email Address</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-950 text-slate-500 hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-650/10"
              >
                Request reset link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
