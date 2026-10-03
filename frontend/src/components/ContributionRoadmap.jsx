import React from 'react';
import { Map, CheckCircle2, FileText } from 'lucide-react';

export default function ContributionRoadmap({ roadmap }) {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Map className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Your Contribution Roadmap</h3>
          <p className="text-xs text-slate-400">Step-by-step progression from setup to pull request</p>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {roadmap.map((stepItem, idx) => (
          <div key={idx} className="relative group">
            {/* Step badge */}
            <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-500 flex items-center justify-center text-[11px] font-bold text-indigo-300 font-mono group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {stepItem.step || idx + 1}
            </div>

            {/* Content card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 group-hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-bold text-white mb-1 tracking-tight">
                {stepItem.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {stepItem.description}
              </p>

              {stepItem.files && stepItem.files.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2 border-t border-slate-800/60">
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span className="text-[11px] text-slate-500">Related files:</span>
                  {stepItem.files.map((file, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
