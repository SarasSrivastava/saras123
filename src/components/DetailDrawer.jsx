// Project LOOP - Slide-Over Feedback Detail Drawer (React JavaScript)
import React from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Tag, 
  CheckCircle2, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export default function DetailDrawer({
  item,
  onClose,
  onUpdateStatus,
  onReclassify
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-end backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-slate-800 max-w-md w-full h-full p-6 space-y-6 text-xs overflow-y-auto custom-scrollbar shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-indigo-400 text-sm bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-800">
                {item.id}
              </span>
              <span className="bg-slate-800 text-gray-300 font-bold px-2 py-1 rounded-lg border border-slate-700">
                {item.channel}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Verbatim Content */}
          <div className="space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
              Verbatim Customer Feedback
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-sm text-gray-100 font-medium leading-relaxed shadow-inner">
              "{item.content}"
            </div>
            <div className="text-[11px] text-gray-400">
              Customer: <strong className="text-gray-200">{item.customerLabel || 'Direct Entry'}</strong>
            </div>
          </div>

          {/* AI Pipeline Insights */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3.5 shadow-md">
            <div className="flex items-center justify-between text-indigo-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Classification Analysis</span>
              </span>
              <button
                onClick={() => onReclassify(item.id)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                Re-classify
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="text-gray-400 text-[10px]">Sentiment Score</div>
                <div className="font-extrabold text-white text-sm mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      item.sentiment === 'POS'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.sentiment === 'NEG'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-slate-700 text-gray-300'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                  <span>{item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}</span>
                </div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="text-gray-400 text-[10px]">Product Feature</div>
                <div className="font-bold text-gray-200 text-xs mt-1 truncate">
                  {item.featureArea || 'General'}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="text-gray-400 text-[10px]">Thematic Category</div>
              <div className="font-bold text-white text-xs mt-0.5">{item.themeName}</div>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-[11px] text-gray-300">
              <div className="text-gray-400 text-[10px] mb-0.5 font-bold">AI Rationale</div>
              <div className="italic">💡 {item.aiRationale}</div>
            </div>
          </div>

          {/* Status Workflow Action */}
          <div className="space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
              Update Triage Workflow Status
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['NEW', 'REVIEWED', 'ACTIONED'].map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(item.id, st)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    item.status === st
                      ? st === 'NEW'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                        : st === 'REVIEWED'
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-md'
                        : 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-md'
                      : 'bg-slate-800 text-gray-400 border-slate-700 hover:text-white hover:bg-slate-750'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
