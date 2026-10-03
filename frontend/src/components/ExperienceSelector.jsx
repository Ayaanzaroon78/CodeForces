import React from 'react';
import { Sparkles, Layers, Award } from 'lucide-react';

const TIERS = [
  {
    id: 'Beginner',
    label: 'Beginner',
    desc: 'First time contributing. Prefers documentation, small bug fixes, or minor tweaks.',
    icon: Sparkles,
  },
  {
    id: 'Intermediate',
    label: 'Intermediate',
    desc: 'Comfortable with language basics & Git. Can handle isolated components or refactors.',
    icon: Layers,
  },
  {
    id: 'Advanced',
    label: 'Advanced',
    desc: 'Experienced engineer. Ready for core architecture, performance, or complex features.',
    icon: Award,
  },
];

export default function ExperienceSelector({ experience, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-200">
        Experience Level <span className="text-rose-400">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TIERS.map((tier) => {
          const isSelected = experience === tier.id;
          const Icon = tier.icon;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onChange(tier.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {tier.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-snug">{tier.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
