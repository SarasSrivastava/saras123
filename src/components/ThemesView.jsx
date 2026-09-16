// Project LOOP - Themes & AI Clustering View (React JavaScript)
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  MessageSquare,
  BarChart2
} from 'lucide-react';

export default function ThemesView({
  feedbackList = [],
  themesList = [],
  currentUser,
  checkPermission,
  onSelectFeedback,
  onCreateTheme
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeDesc, setNewThemeDesc] = useState('');
  const [newThemeColor, setNewThemeColor] = useState('#6366f1');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;
    if (!checkPermission('create custom theme clusters', ['ADMIN', 'ANALYST'])) return;

    const theme = {
      id: `thm_${Date.now()}`,
      name: newThemeName.trim(),
      description: newThemeDesc.trim() || 'Custom user-created feedback theme cluster.',
      color: newThemeColor
    };

    onCreateTheme(theme);
    setNewThemeName('');
    setNewThemeDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Theme Clusters & Trends (AI2)</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {themesList.length} Active Themes
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Automated topic synthesis clustering multi-channel customer signals into actionable product domains.
          </p>
        </div>

        <button
          onClick={() => {
            if (checkPermission('create new theme clusters', ['ADMIN', 'ANALYST'])) {
              setIsCreateModalOpen(true);
            }
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Theme Cluster</span>
        </button>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themesList.map((t) => {
          const items = feedbackList.filter((f) => f.themeId === t.id);
          const pos = items.filter((f) => f.sentiment === 'POS').length;
          const neg = items.filter((f) => f.sentiment === 'NEG').length;
          const neu = items.filter((f) => f.sentiment === 'NEU').length;
          const posPct = items.length ? Math.round((pos / items.length) * 100) : 0;
          const negPct = items.length ? Math.round((neg / items.length) * 100) : 0;

          return (
            <div
              key={t.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full ring-4 ring-slate-800"
                      style={{ backgroundColor: t.color || '#6366f1' }}
                    ></span>
                    <h3 className="font-bold text-white text-sm">{t.name}</h3>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    {items.length} items
                  </span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-normal">
                  {t.description}
                </p>

                {/* Sentiment Ratio Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span className="text-emerald-400">{posPct}% Positive</span>
                    <span className="text-red-400">{negPct}% Critical</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${posPct}%` }} className="bg-emerald-500 h-full transition-all"></div>
                    <div style={{ width: `${100 - posPct - negPct}%` }} className="bg-slate-600 h-full transition-all"></div>
                    <div style={{ width: `${negPct}%` }} className="bg-red-500 h-full transition-all"></div>
                  </div>
                </div>
              </div>

              {/* Sample feedback previews */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Recent Mentions
                </div>
                {items.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectFeedback(item)}
                    className="p-2 bg-slate-800/60 hover:bg-slate-800 rounded-lg cursor-pointer text-[11px] text-gray-300 line-clamp-1 border border-slate-700/50 hover:text-white transition-colors"
                  >
                    <span className="font-mono font-bold text-indigo-400 mr-1">{item.id}</span>
                    "{item.content}"
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Theme Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-extrabold text-white">Create New Theme Cluster</h3>
            <p className="text-gray-400 text-xs">
              Add a new thematic category for automated AI customer signal classification.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Theme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Copilot Latency"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what customer topics fall under this theme..."
                  value={newThemeDesc}
                  onChange={(e) => setNewThemeDesc(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-xl p-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Badge Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newThemeColor}
                    onChange={(e) => setNewThemeColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-gray-300">{newThemeColor}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newThemeName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Create Theme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
