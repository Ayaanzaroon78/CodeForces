import React from 'react';
import { Compass, Target, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function HeroSection({ onSelectDemo }) {
  return (
    <div className="relative pt-8 pb-12 text-center max-w-4xl mx-auto px-4">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
        <Compass className="w-3.5 h-3.5" />
        <span>Open-Source AI Hack Day Challenge</span>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
        Your AI guide to your <br />
        <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
          first open-source contribution.
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Find an open-source issue that matches your skills, understand where to start, and get an AI-powered contribution roadmap.
      </p>

      {/* Value Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs text-slate-300">Skill-matched issue recommendations</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <Target className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs text-slate-300">Exact file paths & line targets</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-xs text-slate-300">Step-by-step verified roadmap</span>
        </div>
      </div>

      {/* Quick Demo Pre-fill Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-400">
        <span>Try popular repositories:</span>
        <button
          type="button"
          onClick={() => onSelectDemo('https://github.com/pallets/flask', ['Python', 'Testing'], 'Beginner')}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          pallets/flask
        </button>
        <button
          type="button"
          onClick={() => onSelectDemo('https://github.com/fastapi/fastapi', ['Python', 'FastAPI'], 'Beginner')}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          fastapi/fastapi
        </button>
        <button
          type="button"
          onClick={() => onSelectDemo('https://github.com/encode/httpx', ['Python', 'AsyncIO'], 'Intermediate')}
          className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          encode/httpx
        </button>
      </div>
    </div>
  );
}
