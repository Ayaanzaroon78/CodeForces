import React from 'react';
import { GitPullRequest, Heart, Terminal, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-20 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-300">FirstPR AI</span>
          <span>— Your AI guide to your first open-source contribution.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            MIT License
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Open-Weight AI Hack Day
          </span>
        </div>
      </div>
    </footer>
  );
}
