import React from 'react';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

export default function LearningSection({ learningItems }) {
  if (!learningItems || learningItems.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <GraduationCap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">What You'll Learn</h3>
          <p className="text-xs text-slate-400">Long-term engineering skills gained from completing this PR</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {learningItems.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
          >
            <ArrowUpRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slate-300 leading-snug">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
