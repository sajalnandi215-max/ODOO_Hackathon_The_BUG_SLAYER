import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Plus, 
  X
} from 'lucide-react';
import { mockAssets, mockTickets, type Asset, type Ticket } from '../data/mockData';

interface AssetHelpdeskProps {
  role: string;
  defaultSubTab?: 'assets' | 'tickets';
}

export const AssetHelpdesk: React.FC<AssetHelpdeskProps> = ({ role, defaultSubTab = 'assets' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'assets' | 'tickets'>(defaultSubTab);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  useEffect(() => {
    setActiveSubTab(defaultSubTab);
  }, [defaultSubTab]);

  // Help Desk states
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tCategory, setTCategory] = useState<'IT support' | 'HR Query' | 'Payroll issues' | 'Facilities'>('IT support');
  const [tPriority, setTPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Asset Assignment states
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [aName, setAName] = useState('');
  const [aType, setAType] = useState<'Laptop' | 'Mobile' | 'Monitor' | 'Accessories' | 'License'>('Laptop');
  const [aSerial, setASerial] = useState('');
  const [aValue, setAValue] = useState(1200);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle) return;

    const newTicket: Ticket = {
      id: `TCK-${Math.floor(Math.random() * 9000) + 1000}`,
      employeeName: "Vikram Mehta", // sandbox user
      title: tTitle,
      category: tCategory,
      priority: tPriority,
      status: "Open",
      assignedTo: "Unassigned",
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    setShowTicketModal(false);
    setTTitle('');
    alert("Support ticket raised. You will be notified when it is assigned to an IT/HR representative.");
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aName || !aSerial) return;

    const newAsset: Asset = {
      id: `AST-${Math.floor(Math.random() * 9000) + 1000}`,
      name: aName,
      type: aType,
      serialNumber: aSerial,
      value: aValue,
      status: "Available",
      purchaseDate: new Date().toISOString().split('T')[0]
    };

    setAssets([newAsset, ...assets]);
    setShowAssetModal(false);
    setAName('');
    setASerial('');
    setAValue(1200);
    alert("New asset added to system registry catalog.");
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'Resolved' };
      }
      return t;
    }));
    alert("Ticket resolved successfully.");
  };

  const myAssets = role === 'Employee' 
    ? assets.filter(a => a.assignedTo === 'Vikram Mehta') 
    : assets;

  const filteredTickets = role === 'Employee'
    ? tickets.filter(t => t.employeeName === 'Vikram Mehta')
    : tickets;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Operations</span>
          <h2 className="font-outfit text-xl font-bold text-slate-950 dark:text-white">Assets & Support Tickets</h2>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('assets')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'assets' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              Assets Inventory
            </button>
            <button
              onClick={() => setActiveSubTab('tickets')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeSubTab === 'tickets' ? 'bg-white dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
            >
              IT & HR Help Desk
            </button>
          </div>

          {activeSubTab === 'assets' && role !== 'Employee' && (
            <button
              onClick={() => setShowAssetModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Register Asset</span>
            </button>
          )}

          {activeSubTab === 'tickets' && (
            <button
              onClick={() => setShowTicketModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Raise Ticket</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'assets' ? (
        /* Assets Tab */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {role === 'Employee' ? (
              <>
                <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 glass-card text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">My Assigned Devices</span>
                  <span className="text-xl font-extrabold font-outfit text-slate-900 dark:text-white">{myAssets.length} Items</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 glass-card text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">My Hardware Value</span>
                  <span className="text-xl font-extrabold font-outfit text-indigo-650 dark:text-indigo-400">
                    ${myAssets.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 glass-card text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Total Catalog Value</span>
                  <span className="text-xl font-extrabold font-outfit text-slate-900 dark:text-white">$12,494</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 glass-card text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Assigned Hardware Assets</span>
                  <span className="text-xl font-extrabold font-outfit text-indigo-600 dark:text-indigo-400">4 Items</span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 glass-card text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Under Maintenance</span>
                  <span className="text-xl font-extrabold font-outfit text-amber-500">1 Item</span>
                </div>
              </>
            )}
          </div>

          <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
            <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white mb-4">
              {role === 'Employee' ? 'My Assigned Assets' : 'Hardware Assets Catalog'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myAssets.map((asset) => (
                <div key={asset.id} className="p-4 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col justify-between h-40">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Laptop className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">{asset.type}</span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{asset.name}</h4>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border
                      ${asset.status === 'Assigned'
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-250/30'
                        : asset.status === 'Available'
                        ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 border-indigo-250/30'
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-250/30'}`}>
                      {asset.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 space-y-1 mt-4">
                    <div className="flex justify-between"><span>Serial:</span> <span className="font-mono">{asset.serialNumber}</span></div>
                    <div className="flex justify-between"><span>Purchased:</span> <span>{asset.purchaseDate}</span></div>
                    {asset.assignedTo && <div className="flex justify-between"><span>Assigned To:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{asset.assignedTo}</span></div>}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-900 mt-2 flex justify-between items-center text-[10px]">
                    <span className="font-bold font-mono text-slate-400">{asset.id}</span>
                    <span className="font-bold text-slate-800 dark:text-white">${asset.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Tickets Tab */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
          <div className="xl:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card">
            <h3 className="font-outfit text-sm font-bold text-slate-950 dark:text-white mb-4">
              {role === 'Employee' ? 'My Support Tickets' : 'Support Ticket Backlog'}
            </h3>

            <div className="space-y-3">
              {filteredTickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider border
                        ${t.priority === 'High'
                          ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-250/30'
                          : t.priority === 'Medium'
                          ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-250/30'
                          : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {t.priority} Priority
                      </span>
                      <span className="text-[10px] font-bold text-slate-450">{t.category}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</h4>
                    <span className="text-[10px] text-slate-400 block">Raised by: {t.employeeName} • {t.createdDate}</span>
                  </div>

                  <div className="flex items-center space-x-3.5 text-xs">
                    <div className="text-right">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded border block text-center
                        ${t.status === 'Resolved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-250/30'
                          : t.status === 'In-Progress'
                          ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 border-indigo-250/30'
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-250/30'}`}>
                        {t.status}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 block">Assigned: {t.assignedTo}</span>
                    </div>

                    {t.status !== 'Resolved' && role !== 'Employee' && (
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[10px] font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ / Knowledge Base */}
          <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 glass-card space-y-4">
            <h4 className="font-outfit text-sm font-bold text-slate-950 dark:text-white">Help Desk Knowledge Base</h4>
            <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Quick guides to help resolve common employee questions.</p>

            <div className="space-y-3 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 cursor-pointer hover:bg-slate-100/50 transition-colors">
                <span className="font-bold text-slate-800 dark:text-white block">How do I verify W2 Tax Docs?</span>
                <p className="text-[10px] text-slate-500 mt-1">Navigate to the Payroll module and click the "Downloads" tab for verified files.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/20 cursor-pointer hover:bg-slate-100/50 transition-colors">
                <span className="font-bold text-slate-800 dark:text-white block">Resetting Biometric Camera Profile</span>
                <p className="text-[10px] text-slate-500 mt-1">Open the Settings menu on the Helix mobile app and trigger camera calibration.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleCreateTicket}
            className="w-full max-w-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
              <h3 className="font-outfit text-sm font-bold text-slate-900 dark:text-white">Raise Support Ticket</h3>
              <button 
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g. Mismatched Tax deduction components on payslip"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={tCategory}
                    onChange={(e) => setTCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="IT support">IT Support</option>
                    <option value="HR Query">HR Query</option>
                    <option value="Payroll issues">Payroll Issues</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Priority</label>
                  <select
                    value={tPriority}
                    onChange={(e) => setTPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Asset Modal */}
      {showAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <form 
            onSubmit={handleAddAsset}
            className="w-full max-w-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
              <h3 className="font-outfit text-sm font-bold text-slate-900 dark:text-white">Register Hardware Asset</h3>
              <button 
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={aName}
                  onChange={(e) => setAName(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 14-inch"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Type</label>
                  <select
                    value={aType}
                    onChange={(e) => setAType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Mobile">Mobile Device</option>
                    <option value="Monitor">Monitor screen</option>
                    <option value="Accessories">Accessories</option>
                    <option value="License">Software License</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    value={aSerial}
                    onChange={(e) => setASerial(e.target.value)}
                    placeholder="e.g. SN-KJD829103"
                    className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Asset Value ($)</label>
                <input
                  type="number"
                  value={aValue}
                  onChange={(e) => setAValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100/55 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
              >
                Register Asset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
