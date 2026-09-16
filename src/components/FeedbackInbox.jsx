// Project LOOP - Feedback Triage Inbox Component (React JavaScript)
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Sparkles, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  CheckCircle,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function FeedbackInbox({
  feedbackList = [],
  themesList = [],
  currentUser,
  checkPermission,
  onUpdateStatus,
  onDelete,
  onReclassify,
  onSelectDetail,
  onOpenIngest
}) {
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('ALL');
  const [sentiment, setSentiment] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [themeFilter, setThemeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return feedbackList.filter((f) => {
      if (search) {
        const q = search.toLowerCase();
        const matchText = f.content?.toLowerCase().includes(q);
        const matchId = f.id?.toLowerCase().includes(q);
        const matchLabel = f.customerLabel?.toLowerCase().includes(q);
        if (!matchText && !matchId && !matchLabel) return false;
      }
      if (channel !== 'ALL' && f.channel !== channel) return false;
      if (sentiment !== 'ALL' && f.sentiment !== sentiment) return false;
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (themeFilter !== 'ALL' && f.themeId !== themeFilter) return false;
      return true;
    });
  }, [feedbackList, search, channel, sentiment, statusFilter, themeFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Feedback Triage Inbox</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-gray-300 border border-slate-700">
              {filtered.length} items
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Search, filter, update triage statuses, and trigger AI re-classification.
          </p>
        </div>

        <button
          onClick={onOpenIngest}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Feedback</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-3 text-xs shadow-md">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search verbatim text, customer ID, or tag..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-slate-800 text-white rounded-xl pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={channel}
          onChange={(e) => {
            setChannel(e.target.value);
            setPage(1);
          }}
          className="bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="ALL">All Channels</option>
          <option value="SUPPORT_TICKET">Support Ticket</option>
          <option value="APP_STORE">App Store</option>
          <option value="NPS_SURVEY">NPS Survey</option>
          <option value="SALES_CALL">Sales Call</option>
          <option value="COMMUNITY_POST">Community Post</option>
        </select>

        <select
          value={sentiment}
          onChange={(e) => {
            setSentiment(e.target.value);
            setPage(1);
          }}
          className="bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="ALL">All Sentiments</option>
          <option value="POS">Positive (POS)</option>
          <option value="NEU">Neutral (NEU)</option>
          <option value="NEG">Negative (NEG)</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="REVIEWED">REVIEWED</option>
          <option value="ACTIONED">ACTIONED</option>
        </select>

        <select
          value={themeFilter}
          onChange={(e) => {
            setThemeFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-800 text-white rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          <option value="ALL">All Themes</option>
          {themesList.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {(search || channel !== 'ALL' || sentiment !== 'ALL' || statusFilter !== 'ALL' || themeFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSearch('');
              setChannel('ALL');
              setSentiment('ALL');
              setStatusFilter('ALL');
              setThemeFilter('ALL');
              setPage(1);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold px-2 py-1 underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Feedback Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-slate-800/90 text-gray-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5 min-w-[280px]">Verbatim Content</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Sentiment (AI1)</th>
                <th className="p-3.5">Theme</th>
                <th className="p-3.5">Triage Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginated.length > 0 ? (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDetail(item)}
                    className="hover:bg-slate-800/60 cursor-pointer transition-colors group"
                  >
                    <td className="p-3.5 font-mono font-bold text-indigo-400 group-hover:underline whitespace-nowrap">
                      {item.id}
                    </td>

                    <td className="p-3.5">
                      <div className="line-clamp-2 text-gray-200 font-medium">
                        "{item.content}"
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {item.customerLabel || 'Anonymous Customer'}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-semibold border border-slate-700">
                        {item.channel}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.sentiment === 'POS'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.sentiment === 'NEG'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-700 text-gray-300'
                        }`}
                      >
                        {item.sentiment} ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-medium text-gray-200">
                      <span className="flex items-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: themesList.find(t => t.id === item.themeId)?.color || '#6366f1' }}
                        ></span>
                        {item.themeName}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <select
                        value={item.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateStatus(item.id, e.target.value);
                        }}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none ${
                          item.status === 'NEW'
                            ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                            : item.status === 'REVIEWED'
                            ? 'bg-blue-950/70 border-blue-800 text-blue-300'
                            : 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                        }`}
                      >
                        <option value="NEW" className="bg-slate-900 text-amber-300">NEW</option>
                        <option value="REVIEWED" className="bg-slate-900 text-blue-300">REVIEWED</option>
                        <option value="ACTIONED" className="bg-slate-900 text-emerald-300">ACTIONED</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onReclassify(item.id)}
                          title="Re-run Claude AI sentiment classification"
                          className="p-1.5 hover:bg-slate-700 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {currentUser.role === 'ADMIN' && (
                          <button
                            onClick={() => onDelete(item.id)}
                            title="Delete record (Admin permission)"
                            className="p-1.5 hover:bg-red-950 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 text-xs">
                    No feedback records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-800/50 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-gray-400">
          <div>
            Showing <span className="text-white font-bold">{filtered.length ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="text-white font-bold">{Math.min(page * pageSize, filtered.length)}</span> of{' '}
            <span className="text-white font-bold">{filtered.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg border border-slate-700 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <span className="px-2 font-bold text-gray-300">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg border border-slate-700 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
