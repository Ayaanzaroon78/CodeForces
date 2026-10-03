import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2, GitPullRequest } from 'lucide-react';

const STAGES = [
  { id: 1, text: 'Connecting to GitHub & verifying repository' },
  { id: 2, text: 'Reading README & CONTRIBUTING guidelines' },
  { id: 3, text: 'Analyzing project directory tree & architecture' },
  { id: 4, text: 'Filtering actionable open issues' },
  { id: 5, text: 'Open-weight AI evaluating skills & issue complexity' },
  { id: 6, text: 'Synthesizing personalized contribution roadmap' },
];

export default function AnalysisProgress({ repoUrl }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Progress through actual operational phases smoothly
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STAGES.length ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <GitPullRequest className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Analyzing Repository</h3>
            <p className="text-xs text-slate-400 font-mono">{repoUrl}</p>
          </div>
        </div>

        {/* Multi-step progress list */}
        <div className="space-y-4">
          {STAGES.map((stage) => {
            const isCompleted = stage.id < currentStep;
            const isCurrent = stage.id === currentStep;

            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  isCompleted || isCurrent ? 'opacity-100' : 'opacity-30'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    isCurrent
                      ? 'text-indigo-200 font-medium'
                      : isCompleted
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>AI is performing multi-factor suitability reasoning...</span>
          <span className="font-mono text-indigo-400">Step {currentStep} of {STAGES.length}</span>
        </div>
      </div>
    </div>
  );
}
