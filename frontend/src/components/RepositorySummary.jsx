import React from 'react';
import { Star, GitFork, AlertCircle, ExternalLink, Code } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

export default function RepositorySummary({ repository, isFallback, providerUsed }) {
  if (!repository) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">{repository.full_name}</h2>
            <a
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              title="Open in GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">{repository.description}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{formatNumber(repository.stars)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <GitFork className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatNumber(repository.forks)}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatNumber(repository.open_issues_count)} open</span>
          </div>
        </div>
      </div>

      {/* Language Breakdown & Provider Tag */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            {repository.primary_language || 'Codebase'}:
          </span>
          {Object.entries(repository.languages || {})
            .slice(0, 4)
            .map(([lang]) => (
              <span key={lang} className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[11px]">
                {lang}
              </span>
            ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Evaluated by:</span>
          <span className="text-indigo-300 font-mono text-[11px]">{providerUsed}</span>
        </div>
      </div>
    </div>
  );
}
