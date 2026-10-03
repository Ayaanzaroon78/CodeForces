import React, { useState } from 'react';
import { GitBranch, Search, Sparkles, AlertCircle } from 'lucide-react';
import SkillSelector from './SkillSelector';
import ExperienceSelector from './ExperienceSelector';

export default function RepositoryForm({
  repoUrl,
  setRepoUrl,
  skills,
  setSkills,
  experience,
  setExperience,
  learningGoal,
  setLearningGoal,
  onSubmit,
  isLoading,
}) {
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!repoUrl.trim()) {
      setValidationError('Please enter a GitHub repository URL.');
      return;
    }
    if (skills.length === 0) {
      setValidationError('Please select or enter at least one programming skill.');
      return;
    }
    if (!experience) {
      setValidationError('Please select your experience level.');
      return;
    }

    onSubmit();
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6"
      >
        {/* Repo Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200 flex items-center justify-between">
            <span>GitHub Repository <span className="text-rose-400">*</span></span>
            <span className="text-xs text-slate-400 font-normal">URL or owner/repo</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <GitBranch className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="https://github.com/owner/repository (e.g. pallets/flask)"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
            />
          </div>
        </div>

        {/* Skills Selector */}
        <SkillSelector skills={skills} onChange={setSkills} />

        {/* Experience Selector */}
        <ExperienceSelector experience={experience} onChange={setExperience} />

        {/* Optional Learning Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">
              Learning Goal <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <span className="text-xs text-slate-400">Helps AI align learning outcomes</span>
          </div>
          <input
            type="text"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. I want to improve my unit testing and understand project structure..."
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-colors"
          />
        </div>

        {/* Local Validation Error Banner */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Repository with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find My First PR</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
