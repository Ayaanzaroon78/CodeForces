import React from 'react';
import { CheckCircle, HelpCircle } from 'lucide-react';

export default function WhyRecommended({ reasons }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Why FirstPR AI Chose This</h3>
          <p className="text-xs text-slate-400">AI evaluation of candidate issues against your profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-200 leading-snug">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
