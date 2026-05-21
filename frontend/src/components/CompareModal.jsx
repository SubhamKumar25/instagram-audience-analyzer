import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Scale, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function CompareModal({ isOpen, onClose }) {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [compareData, setCompareData] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!url1 || !url2) return;
    
    setLoading(true);
    setError('');
    setCompareData(null);
    
    try {
      // Direct call to running FastAPI port
      const response = await axios.post(`${API_BASE_URL}/api/v1/compare`, {
        profile_url_1: url1,
        profile_url_2: url2
      });
      setCompareData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to compare profiles. Ensure usernames are public.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Compare Profiles</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form setup */}
          {!compareData && (
            <form onSubmit={handleCompare} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">First Profile</label>
                  <input
                    type="text"
                    value={url1}
                    onChange={(e) => setUrl1(e.target.value)}
                    placeholder="https://instagram.com/therock"
                    className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Second Profile</label>
                  <input
                    type="text"
                    value={url2}
                    onChange={(e) => setUrl2(e.target.value)}
                    placeholder="https://instagram.com/cristiano"
                    className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl glass-button text-sm font-bold text-white flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Profiles...</span>
                  </>
                ) : (
                  <>
                    <span>Compare Audience Metrics</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Comparison Results */}
          {compareData && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 select-none">
                <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <img 
                    src={compareData.profile_1.profile_pic_url} 
                    alt="" 
                    className="w-14 h-14 rounded-full mx-auto border-2 border-purple-400 object-cover" 
                  />
                  <h3 className="text-sm font-bold text-white mt-2 truncate">@{compareData.profile_1.username}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{compareData.profile_1.full_name}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <img 
                    src={compareData.profile_2.profile_pic_url} 
                    alt="" 
                    className="w-14 h-14 rounded-full mx-auto border-2 border-blue-400 object-cover" 
                  />
                  <h3 className="text-sm font-bold text-white mt-2 truncate">@{compareData.profile_2.username}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{compareData.profile_2.full_name}</p>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-1.5 select-none bg-slate-950/20 rounded-2xl p-4 border border-white/5">
                <CompareMetricRow label="Followers" val1={formatCompact(compareData.profile_1.followers)} val2={formatCompact(compareData.profile_2.followers)} />
                <CompareMetricRow label="Trust Score" val1={`${compareData.analysis_1.trust_score}`} val2={`${compareData.analysis_2.trust_score}`} />
                <CompareMetricRow label="Fake %" val1={`${compareData.analysis_1.fake_percentage}%`} val2={`${compareData.analysis_2.fake_percentage}%`} />
                <CompareMetricRow label="Engagement" val1={`${compareData.analysis_1.engagement_json.rate}%`} val2={`${compareData.analysis_2.engagement_json.rate}%`} />
                <CompareMetricRow label="Authenticity" val1={`${compareData.analysis_1.influencer_score}`} val2={`${compareData.analysis_2.influencer_score}`} />
                <CompareMetricRow label="Active %" val1={`${compareData.analysis_1.activity_json.active}%`} val2={`${compareData.analysis_2.activity_json.active}%`} />
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setCompareData(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  New Compare
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CompareMetricRow({ label, val1, val2 }) {
  return (
    <div className="grid grid-cols-3 items-center py-2.5 border-b border-white/5 text-[11px]">
      <div className="font-bold text-slate-300 pl-2">{val1}</div>
      <div className="font-semibold text-slate-400 text-center uppercase tracking-wider">{label}</div>
      <div className="font-bold text-slate-300 text-right pr-2">{val2}</div>
    </div>
  );
}

function formatCompact(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
}
