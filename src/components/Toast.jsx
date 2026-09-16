// Project LOOP - Animated Toast Alert Component (React JavaScript)
import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all transform animate-bounce">
      <div
        className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 ${
          toast.type === 'error'
            ? 'bg-red-950/95 border-red-800 text-red-100'
            : toast.type === 'info'
            ? 'bg-blue-950/95 border-blue-800 text-blue-100'
            : 'bg-emerald-950/95 border-emerald-800 text-emerald-100'
        }`}
      >
        {toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
