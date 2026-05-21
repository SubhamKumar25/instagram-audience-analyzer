import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full space-y-6 animate-pulse select-none">
      {/* Profile Header Shimmer */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-20 h-20 rounded-full bg-white/5 light:bg-slate-300" />
        <div className="flex-1 space-y-3 w-full text-center md:text-left">
          <div className="h-5 bg-white/5 light:bg-slate-300 rounded w-1/4 mx-auto md:mx-0" />
          <div className="h-3.5 bg-white/5 light:bg-slate-300 rounded w-1/3 mx-auto md:mx-0" />
          <div className="h-3 bg-white/5 light:bg-slate-300 rounded w-1/2 mx-auto md:mx-0" />
        </div>
      </div>

      {/* Mini KPI Cards Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-28 rounded-2xl bg-white/5 light:bg-slate-300" />
        <div className="h-28 rounded-2xl bg-white/5 light:bg-slate-300" />
        <div className="h-28 rounded-2xl bg-white/5 light:bg-slate-300" />
      </div>

      {/* Large Grid Chart Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-72 rounded-2xl bg-white/5 light:bg-slate-300" />
        <div className="h-72 rounded-2xl bg-white/5 light:bg-slate-300" />
      </div>
    </div>
  );
}
