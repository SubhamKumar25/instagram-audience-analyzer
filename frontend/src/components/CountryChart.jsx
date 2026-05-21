import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CountryChart({ data }) {
  // Extract and format top 5 countries
  const chartData = data
    ? [...data]
        .map(item => ({
          country: item.country,
          percentage: parseFloat(item.percentage)
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5)
    : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-700/50 rounded-xl p-3 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-white uppercase tracking-wider">{payload[0].payload.country}</p>
          <p className="text-xs text-purple-400 font-semibold mt-1">
            Followers: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const colors = ['#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171'];

  return (
    <div className="w-full h-64 mt-4 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="country"
            type="category"
            stroke="#9CA3AF"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={90}
            className="font-medium light:text-slate-700"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
          <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={14}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
