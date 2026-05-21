import React from 'react';
import { Terminal } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { API_BASE_URL } from '../config';

export default function ApiDocs() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 space-y-8 select-none">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">Developer API</h1>
        <p className="text-xs sm:text-sm text-slate-400 light:text-slate-500 max-w-md mx-auto leading-relaxed">
          Integrate our high-performance audience scoring and fake follower classifier into your applications.
        </p>
      </div>

      <GlassCard className="space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2 text-purple-400">
            <Terminal className="w-4.5 h-4.5" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Analyze Profile</h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-bold text-purple-400 uppercase tracking-widest">
            POST
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-300 uppercase tracking-wider">Endpoint</h4>
            <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 font-mono text-[11px] text-purple-300 mt-2 select-all">
              {API_BASE_URL}/api/v1/analyze
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-300 uppercase tracking-wider">Request JSON Payload</h4>
            <pre className="bg-slate-950/40 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-slate-300 mt-2 overflow-x-auto select-all">
{`{
  "profile_url": "https://instagram.com/therock"
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-slate-300 uppercase tracking-wider">Response JSON Schema</h4>
            <pre className="bg-slate-950/40 rounded-xl p-3 border border-white/5 font-mono text-[9px] text-slate-300 mt-2 overflow-x-auto select-all">
{`{
  "profile": {
    "username": "therock",
    "followers": 397000000,
    "following": 420,
    "posts": 7500,
    "is_verified": true
  },
  "analysis": {
    "fake_percentage": 14.5,
    "organic_percentage": 85.5,
    "trust_score": 88.0,
    "bot_probability": 11.2,
    "countries_json": [
      { "country": "United States", "percentage": 62.4 }
    ]
  },
  "cached": true,
  "source": "scraped"
}`}
            </pre>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
