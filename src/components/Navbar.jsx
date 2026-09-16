// Project LOOP - Modern Top Navigation Bar Component (React JavaScript)
import React from 'react';
import { 
  BarChart3, 
  Inbox, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Users, 
  Settings, 
  Plus, 
  RotateCcw, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { DEMO_USERS, INITIAL_WORKSPACES } from '../data/mockData';

export default function Navbar({
  currentTab,
  setCurrentTab,
  activeWorkspace,
  setActiveWorkspace,
  currentUser,
  setCurrentUser,
  feedbackCount,
  newFeedbackCount,
  onOpenIngest,
  onResetSeedData,
  showToast
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: newFeedbackCount },
    { id: 'themes', label: 'Themes & Trends', icon: TrendingUp },
    { id: 'ask', label: 'Ask LOOP (RAG)', icon: Sparkles, highlight: true },
    { id: 'reports', label: 'VoC Reports', icon: FileText },
    { id: 'team', label: 'Team & RBAC', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/95 backdrop-blur-xl shadow-lg shadow-black/20">
      {/* Top Demo & RBAC Switcher Ribbon */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/40 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600/90 text-white font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Enterprise Demo
          </span>
          <span className="text-gray-300 font-medium hidden sm:inline text-[11px]">
            AI Customer-Feedback Intelligence Platform · Pure React JS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-gray-400 text-[11px] hidden md:inline">Switch Active Role:</span>
          </div>

          <div className="flex bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/80">
            {DEMO_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  showToast(`Switched active session to ${user.name} (${user.role})`, 'info');
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  currentUser.id === user.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/50'
                }`}
              >
                {user.role} <span className="hidden sm:inline font-normal opacity-80">({user.name.split(' ')[0]})</span>
              </button>
            ))}
          </div>

          <button
            onClick={onResetSeedData}
            title="Reset database to fresh 135+ realistic records"
            className="bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Workspace Selector */}
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentTab('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                ⟳
              </div>
              <div>
                <div className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
                  LOOP
                </div>
                <div className="text-[9px] text-indigo-400 -mt-1 font-bold tracking-widest uppercase">
                  FEEDBACK INTELLIGENCE
                </div>
              </div>
            </div>

            {/* Workspace Select */}
            <div className="hidden md:flex items-center ml-2 pl-3 border-l border-slate-800">
              <div className="relative">
                <select
                  value={activeWorkspace.id}
                  onChange={(e) => {
                    const ws = INITIAL_WORKSPACES.find(w => w.id === e.target.value);
                    if (ws) {
                      setActiveWorkspace(ws);
                      showToast(`Scoped context to workspace: ${ws.name}`, 'info');
                    }
                  }}
                  className="bg-slate-900/90 text-gray-200 text-xs font-semibold rounded-xl px-3 py-1.5 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 cursor-pointer"
                >
                  {INITIAL_WORKSPACES.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name} ({ws.plan})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? tab.highlight 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : tab.highlight
                        ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 border border-indigo-500/20'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-indigo-400' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold border border-amber-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button & User Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenIngest}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 border border-indigo-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest Feedback</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-indigo-500 object-cover shadow-sm"
              />
              <div className="hidden xl:block text-left text-xs leading-tight">
                <div className="font-semibold text-gray-200">{currentUser.name}</div>
                <div className="text-[10px] text-indigo-400 font-bold">{currentUser.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
