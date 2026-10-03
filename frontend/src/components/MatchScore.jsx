import React from 'react';
import { getMatchScoreColor } from '../utils/helpers';

export default function MatchScore({ score }) {
  const normalizedScore = Math.min(100, Math.max(0, score || 85));
  const strokeColor = normalizedScore >= 85 ? '#10b981' : normalizedScore >= 70 ? '#6366f1' : '#f59e0b';
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
      <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
          <circle
            cx="38"
            cy="38"
            r={radius}
            stroke="#1e293b"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="38"
            cy="38"
            r={radius}
            stroke={strokeColor}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white font-mono">{normalizedScore}%</span>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">Contribution Match</div>
        <div className="text-xs text-slate-300 mt-0.5">
          {normalizedScore >= 90
            ? 'Optimal first contribution'
            : normalizedScore >= 80
            ? 'Strong skill & scope alignment'
            : 'Moderate complexity match'}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">Based on AI reasoning across skills, scope & repo tree</div>
      </div>
    </div>
  );
}
