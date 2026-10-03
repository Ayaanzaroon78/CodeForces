import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RiskSection({ risks }) {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Risks & Considerations</h3>
          <p className="text-xs text-slate-400">Common pitfalls to watch out for in this repository</p>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {risks.map((risk, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
            <span>{risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
