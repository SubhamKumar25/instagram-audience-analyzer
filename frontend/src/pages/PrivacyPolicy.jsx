import React from 'react';
import { ShieldCheck } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 space-y-8 select-none">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-500 max-w-md mx-auto leading-relaxed">
          We protect user privacy and strictly scrape only publicly visible, non-private data.
        </p>
      </div>

      <GlassCard className="space-y-4 text-xs leading-relaxed text-slate-400 light:text-slate-500">
        <div className="flex items-center space-x-2 text-purple-400 border-b border-white/10 pb-3">
          <ShieldCheck className="w-5.5 h-5.5" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-white light:text-slate-900">Privacy Commitments</h3>
        </div>
        <p>
          1. <strong>No Private Credentials:</strong> We never request, collect, or store your Instagram credentials, passwords, or authentication keys. All analysis is triggered using public handle configurations.
        </p>
        <p>
          2. <strong>Public Scrapes Only:</strong> Our engine purely retrieves public information (usernames, follow metrics, bio descriptions, verified badge state) visible publicly on standard instagram profiles.
        </p>
        <p>
          3. <strong>Data Retentions:</strong> Analytics runs are cached temporarily on secure database nodes (PostgreSQL) solely to support historical history listings and limit query overhead on Instagram servers.
        </p>
      </GlassCard>
    </div>
  );
}
