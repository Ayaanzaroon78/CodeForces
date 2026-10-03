import React from 'react';
import { FileCode, ExternalLink, Folder } from 'lucide-react';

export default function RelevantFiles({ relevantFiles, repository }) {
  if (!relevantFiles || relevantFiles.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Folder className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Where You'll Probably Work</h3>
          <p className="text-xs text-slate-400">Key files identified from repository architecture analysis</p>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {relevantFiles.map((file, idx) => {
          const defaultBranch = repository?.default_branch || 'main';
          const fileUrl =
            file.github_url ||
            (repository?.html_url
              ? `${repository.html_url}/blob/${defaultBranch}/${file.path}`
              : null);

          return (
            <div
              key={idx}
              className="group p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-mono text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {file.path}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">{file.reason}</p>
              </div>

              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex-shrink-0"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
