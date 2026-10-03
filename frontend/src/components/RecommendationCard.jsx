import React from 'react';
import { Target, ExternalLink, Tag, Clock, BookOpen, Layers } from 'lucide-react';
import MatchScore from './MatchScore';
import { getDifficultyColor } from '../utils/helpers';

export default function RecommendationCard({ recommendedIssue, repository }) {
  if (!recommendedIssue) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-900/90 border-2 border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <Target className="w-3.5 h-3.5" />
          <span>Recommended First Contribution</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(recommendedIssue.difficulty)}`}>
            {recommendedIssue.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {recommendedIssue.contribution_type || 'Contribution'}
          </span>
        </div>
      </div>

      {/* Issue Title & Number */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            <span className="text-indigo-400 font-mono mr-2">#{recommendedIssue.number}</span>
            {recommendedIssue.title}
          </h2>
        </div>

        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          {recommendedIssue.reason}
        </p>
      </div>

      {/* Grid of Match Score & Quick Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <MatchScore score={recommendedIssue.match_score} />

        <div className="grid grid-cols-2 gap-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs">
          <div>
            <span className="text-slate-500 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5" /> Est. Scope:
            </span>
            <span className="text-slate-200 font-medium">{recommendedIssue.estimated_scope || 'Small'}</span>
          </div>

          <div>
            <span className="text-slate-500 flex items-center gap-1 mb-1">
              <BookOpen className="w-3.5 h-3.5" /> Repo Knowledge:
            </span>
            <span className="text-slate-200 font-medium">{recommendedIssue.repository_knowledge_required || 'Basic'}</span>
          </div>

          <div className="col-span-2 pt-2 border-t border-slate-800/80">
            <span className="text-slate-500 flex items-center gap-1 mb-1">
              <Tag className="w-3.5 h-3.5" /> Skills Required:
            </span>
            <div className="flex flex-wrap gap-1">
              {(recommendedIssue.skills_required || []).map((sk) => (
                <span key={sk} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
        <span className="text-xs text-slate-400">
          Ready to review the discussion on GitHub?
        </span>

        <a
          href={recommendedIssue.issue_url || `https://github.com/${repository?.full_name}/issues/${recommendedIssue.number}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>View GitHub Issue #{recommendedIssue.number}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
