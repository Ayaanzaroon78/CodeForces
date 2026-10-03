import React from 'react';
import { PlayCircle, ArrowRight, Terminal } from 'lucide-react';

export default function FirstAction({ actionText }) {
  if (!actionText) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Start Here — Immediate First Step
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-white tracking-tight pt-1">
            {actionText}
          </p>
          <p className="text-xs text-slate-400">
            Take this single focused action before attempting full code modifications.
          </p>
        </div>

        <div className="flex-shrink-0 self-start sm:self-center">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Action 1/1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
