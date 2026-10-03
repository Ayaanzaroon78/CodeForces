import React from 'react';
import { AlertCircle, RotateCcw, Key, HelpCircle, ExternalLink } from 'lucide-react';

export default function ErrorState({ error, onRetry, onSelectDemo }) {
  if (!error) return null;

  const isRateLimit = error.code === 'GITHUB_RATE_LIMIT' || error.message?.toLowerCase().includes('rate limit');
  const isNotFound = error.code === 'REPOSITORY_NOT_FOUND';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-rose-950/20 border-2 border-rose-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md text-left">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isRateLimit
                  ? 'GitHub Rate Limit Reached'
                  : isNotFound
                  ? 'Repository Not Found'
                  : 'Analysis Error'}
              </h3>
              {error.code && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  {error.code}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {error.message || 'An error occurred while evaluating the repository.'}
            </p>

            {/* Helpful advice for rate limit */}
            {isRateLimit && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                  <Key className="w-3.5 h-3.5" />
                  <span>How to resolve rate limits:</span>
                </div>
                <p className="text-slate-400">
                  GitHub unauthenticated IP limit is 60 requests/hr. Add a free personal GitHub access token to your backend <code className="text-indigo-300 font-mono">.env</code>:
                </p>
                <div className="p-2 rounded bg-slate-900 font-mono text-[11px] text-slate-200">
                  GITHUB_TOKEN=ghp_your_token_here
                </div>
                <p className="text-slate-400 pt-1">
                  Or test immediately using our pre-curated demo repositories:
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectDemo('https://github.com/pallets/flask', ['Python', 'Testing'], 'Beginner')}
                    className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
                  >
                    Load pallets/flask Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectDemo('https://github.com/fastapi/fastapi', ['Python', 'FastAPI'], 'Beginner')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
                  >
                    Load fastapi/fastapi Demo
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
