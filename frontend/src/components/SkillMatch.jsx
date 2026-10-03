import React from 'react';
import { Check, Sparkles, BookOpen } from 'lucide-react';

export default function SkillMatch({ userSkills, skillsRequired, skillsToLearn }) {
  const userSkillsSet = new Set((userSkills || []).map((s) => s.toLowerCase()));

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Skill Match Matrix</h3>
          <p className="text-xs text-slate-400">Comparing your capabilities with issue prerequisites</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Your Existing Skills */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Your Skills Match
          </h4>
          <div className="flex flex-wrap gap-2">
            {(userSkills || []).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills to Learn / Prerequisites */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Skills You'll Practice or Learn
          </h4>
          <div className="flex flex-wrap gap-2">
            {(skillsToLearn || []).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                <BookOpen className="w-3 h-3 text-amber-400" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
