import React from 'react';

export default function AudienceQualityChart({ breakdown }) {
  const { real = 0, suspicious = 0, bots = 0, inactive = 0 } = breakdown || {};

  return (
    <div className="w-full mt-4 space-y-4">
      {/* Dynamic Stacked Bar */}
      <div className="h-5 w-full rounded-full flex overflow-hidden bg-slate-800 light:bg-slate-200">
        <div 
          style={{ width: `${real}%` }} 
          className="bg-purple-500 h-full transition-all duration-500" 
          title={`Real: ${real}%`} 
        />
        <div 
          style={{ width: `${inactive}%` }} 
          className="bg-blue-400 h-full transition-all duration-500" 
          title={`Inactive: ${inactive}%`} 
        />
        <div 
          style={{ width: `${suspicious}%` }} 
          className="bg-amber-400 h-full transition-all duration-500" 
          title={`Suspicious: ${suspicious}%`} 
        />
        <div 
          style={{ width: `${bots}%` }} 
          className="bg-rose-500 h-full transition-all duration-500" 
          title={`Bots: ${bots}%`} 
        />
      </div>

      {/* Grid Legend Elements */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Real</span>
            <span className="text-sm font-bold text-white light:text-slate-900">{real}%</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Inactive</span>
            <span className="text-sm font-bold text-white light:text-slate-900">{inactive}%</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Suspicious</span>
            <span className="text-sm font-bold text-white light:text-slate-900">{suspicious}%</span>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Bots</span>
            <span className="text-sm font-bold text-white light:text-slate-900">{bots}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
