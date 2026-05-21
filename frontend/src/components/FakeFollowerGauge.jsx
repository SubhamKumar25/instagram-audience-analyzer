import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function FakeFollowerGauge({ fakePercentage }) {
  const realPercentage = 100 - fakePercentage;
  const data = [
    { name: 'Fake & Suspicious', value: fakePercentage },
    { name: 'Organic & Authentic', value: realPercentage }
  ];

  // Colors: Fake (Vibrant Rose), Real (Sleek Royal Violet)
  const COLORS = ['#EF4444', '#8B5CF6'];

  const riskLabel = fakePercentage > 50 
    ? 'High Risk' 
    : fakePercentage > 25 
      ? 'Medium Risk' 
      : 'Healthy Profile';

  const riskColor = fakePercentage > 50 
    ? 'text-red-400 font-bold' 
    : fakePercentage > 25 
      ? 'text-yellow-400 font-semibold' 
      : 'text-emerald-400 font-semibold';

  return (
    <div className="relative w-full h-44 mt-2 flex items-center justify-center select-none">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="80%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Absolute positioned dashboard overlay */}
      <div className="absolute bottom-[10%] flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-white light:text-slate-900 tracking-tight leading-none">
          {fakePercentage}%
        </span>
        <span className="text-slate-400 light:text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">
          Fake Est.
        </span>
        <span className={`text-xs mt-1 uppercase tracking-wider ${riskColor}`}>
          {riskLabel}
        </span>
      </div>
    </div>
  );
}
