import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Git',
  'Go',
  'Rust',
  'HTML/CSS',
  'Documentation',
  'Testing',
  'SQL',
  'Docker',
];

export default function SkillSelector({ skills, onChange }) {
  const [customInput, setCustomInput] = useState('');

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      onChange(skills.filter((s) => s !== skill));
    } else {
      onChange([...skills, skill]);
    }
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (clean && !skills.includes(clean)) {
      onChange([...skills, clean]);
      setCustomInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-200">
          Your Skills <span className="text-rose-400">*</span>
        </label>
        <span className="text-xs text-slate-400">Select all that apply or add custom</span>
      </div>

      {/* Suggested skill chips */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_SKILLS.map((skill) => {
          const isSelected = skills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 ring-1 ring-indigo-400'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {isSelected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-slate-500" />}
              {skill}
            </button>
          );
        })}
      </div>

      {/* Custom skill input */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom(e)}
          placeholder="Add custom skill (e.g., PyTorch, GraphQL, Bash)..."
          className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!customInput.trim()}
          className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Active selected skills list */}
      {skills.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider font-semibold">Active Profile Skills ({skills.length}):</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-white p-0.5"
                  title="Remove skill"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
