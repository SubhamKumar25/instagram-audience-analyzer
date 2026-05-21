import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, ShieldAlert, Award, Star, Compass, 
  MessageSquare, Zap, Activity, Globe, RefreshCw, Share2 
} from 'lucide-react';

import GlassCard from '../components/GlassCard';
import MetricCard from '../components/MetricCard';
import CountryChart from '../components/CountryChart';
import FakeFollowerGauge from '../components/FakeFollowerGauge';
import AudienceQualityChart from '../components/AudienceQualityChart';
import PDFReport from '../components/PDFReport';

export default function Dashboard({ data, onReset }) {
  if (!data) return null;

  const { profile, analysis, source } = data;

  const handleShare = () => {
    // Generate absolute path
    const shareUrl = `${window.location.origin}/?user=${profile.username}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Audit link copied to clipboard: ${shareUrl}`);
  };

  // Compact number formatting
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Upper Control Bar */}
      <div className="flex items-center justify-between no-print select-none">
        <button 
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer bg-white/5 px-3.5 py-2 rounded-xl border border-white/5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Audit New Profile</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 text-xs font-semibold text-white border border-white/5 cursor-pointer hover:bg-white/10"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Share Audit</span>
          </button>
          
          <PDFReport username={profile.username} />
        </div>
      </div>

      {/* Profile Header Summary */}
      <GlassCard className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 select-none">
        <img 
          src={profile.profile_pic_url} 
          alt="" 
          className="w-20 h-20 rounded-full border-4 border-purple-500/30 object-cover shrink-0" 
        />
        
        <div className="flex-1 text-center md:text-left space-y-2.5">
          <div className="flex flex-col md:flex-row md:items-center space-y-1.5 md:space-y-0 md:space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">@{profile.username}</h2>
            {profile.is_verified && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest mx-auto md:mx-0">
                Verified
              </span>
            )}
          </div>
          <h3 className="text-xs text-slate-400 font-semibold truncate max-w-sm">{profile.full_name}</h3>
          <p className="text-xs text-slate-400 light:text-slate-500 max-w-xl leading-relaxed">{profile.bio}</p>
        </div>

        {/* Profile Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 shrink-0 text-center select-none">
          <div>
            <div className="text-xl font-extrabold text-white">{formatNumber(profile.followers)}</div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">Followers</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{formatNumber(profile.following)}</div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">Following</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{formatNumber(profile.posts)}</div>
            <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mt-0.5">Posts</div>
          </div>
        </div>
      </GlassCard>

      {/* Disclaimers & Alert Indicators */}
      {source === "simulated" && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 flex items-center space-x-2 select-none no-print">
          <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>Instagram limits encountered.</strong> Scraping was blocked by Instagram walls. Gracefully generated high-fidelity public behavioral estimations.
          </span>
        </div>
      )}

      {/* Scoring Metrics Gauges Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Audience Trust Score" 
          value={analysis.trust_score} 
          icon={Award} 
          description="Estimates overall authenticity based on organic ratios, engagement consistency, and profile details."
          color="text-purple-400"
        />
        <MetricCard 
          title="Authenticity Score" 
          value={analysis.influencer_score} 
          icon={Star} 
          description="Evaluates quality based on average engagements compared against estimated follower count tiers."
          color="text-indigo-400"
        />
        <MetricCard 
          title="Active Followers" 
          value={analysis.activity_json.active} 
          icon={Activity} 
          description="Percentage of active accounts that interact, post content, and maintain consistent usernames."
          color="text-emerald-400"
        />
      </div>

      {/* Chart Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fake Follower Estimates */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center space-x-2 select-none">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fake Follower Estimator</h3>
          </div>
          <FakeFollowerGauge fakePercentage={analysis.fake_percentage} />
          <p className="text-[10px] text-slate-400 light:text-slate-500 leading-relaxed text-center mt-2 select-none">
            Estimated ratio of real followers versus suspected automated accounts, inactive shells, and bot-farms.
          </p>
        </GlassCard>

        {/* Top Follower Countries */}
        <GlassCard className="flex flex-col justify-between">
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Estimated Follower Countries</h3>
            </div>
            <span className="text-[9px] font-bold bg-white/5 border border-white/5 text-slate-400 px-2 py-0.5 rounded uppercase">
              NLP Decoded
            </span>
          </div>
          <CountryChart data={analysis.countries_json} />
          <p className="text-[10px] text-slate-400 light:text-slate-500 leading-relaxed text-center mt-2 select-none">
            Country distributions estimated from bio language, flag emoji indicators, hashtags, and regional time zones.
          </p>
        </GlassCard>
      </div>

      {/* Engagement & Quality Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quality classification */}
        <GlassCard className="md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center space-x-2 select-none">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Audience Quality Classification</h3>
          </div>
          <AudienceQualityChart breakdown={analysis.quality_breakdown_json} />
          <p className="text-[10px] text-slate-400 light:text-slate-500 leading-relaxed mt-2 select-none">
            Breakdown categorized by account behaviors: Active Real, Inactive Organic, Suspicious (no pic / random user), and Bots.
          </p>
        </GlassCard>

        {/* Engagement averages */}
        <GlassCard className="flex flex-col justify-between select-none">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Engagement Details</h3>
          </div>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Engagement Rate</span>
                <span className="text-xs font-bold text-white mt-0.5">{analysis.engagement_json.rate}%</span>
              </div>
              <Activity className="w-4 h-4 text-purple-400" />
            </div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Avg Likes / Post</span>
                <span className="text-xs font-bold text-white mt-0.5">{formatNumber(analysis.engagement_json.average_likes)}</span>
              </div>
              <Compass className="w-4 h-4 text-blue-400" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Avg Comments / Post</span>
                <span className="text-xs font-bold text-white mt-0.5">{formatNumber(analysis.engagement_json.average_comments)}</span>
              </div>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 light:text-slate-500 leading-relaxed select-none">
            Consistency level of engagement is estimated at <strong>{analysis.engagement_json.consistency}%</strong>.
          </p>
        </GlassCard>
      </div>

      {/* Informational Footer Statement */}
      <div className="text-center pt-8 text-[10px] text-slate-500 uppercase tracking-widest select-none no-print">
        <span>© 2026 Instagram Audience Analyzer • AI-Estimated Public Profile Audit</span>
      </div>

    </div>
  );
}
