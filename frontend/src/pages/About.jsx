import React from 'react';
import { Brain, Globe, Layers, Shield } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function About() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 space-y-8 select-none">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">How It Works</h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-500 max-w-md mx-auto leading-relaxed">
          Learn how our AI-powered behavioral scoring engine parses public profile parameters to estimate quality, trust, and risk metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-3">
          <div className="flex items-center space-x-2.5 text-purple-400">
            <Brain className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Weighted Scoring</h3>
          </div>
          <p className="text-[11px] text-slate-400 light:text-slate-500 leading-relaxed">
            Calculates Bot Probability using a multi-feature weighted heuristic evaluating username character entropy, follower-to-following ratios, posting frequency, and bio details.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex items-center space-x-2.5 text-blue-400">
            <Globe className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Demographics NLP</h3>
          </div>
          <p className="text-[11px] text-slate-400 light:text-slate-500 leading-relaxed">
            Runs natural language processing over biography texts, hashtag groupings, emoji flag pointers, and timing to estimate the likely geographical spread of followers.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex items-center space-x-2.5 text-emerald-400">
            <Layers className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Dual-Mode Driver</h3>
          </div>
          <p className="text-[11px] text-slate-400 light:text-slate-500 leading-relaxed">
            Employs a stealth Playwright scraper combined with a high-fidelity simulator. If blocked by rate walls, it generates a realistic distribution based on creator tiers.
          </p>
        </GlassCard>

        <GlassCard className="space-y-3">
          <div className="flex items-center space-x-2.5 text-amber-400">
            <Shield className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Disclosure</h3>
          </div>
          <p className="text-[11px] text-slate-400 light:text-slate-500 leading-relaxed">
            We do NOT claim impossible private values. All charts and percentages represent simulated AI-estimated public analytics to preserve transparency.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
