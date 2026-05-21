import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ title, value, unit = "%", icon: Icon, description, color = "text-purple-400" }) {
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:scale-[1.01]">
      <div className="flex-1 pr-4">
        <span className="text-xs font-semibold text-gray-400 light:text-gray-500 uppercase tracking-widest">{title}</span>
        <div className="flex items-baseline mt-2">
          <span className="text-4xl font-bold tracking-tight text-white light:text-gray-900">{value}</span>
          <span className="text-xl font-medium text-gray-400 ml-0.5">{unit}</span>
        </div>
        {description && <p className="text-xs text-gray-500 light:text-gray-400 mt-2 leading-relaxed">{description}</p>}
      </div>
      
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="light:stroke-black/5"
          />
          {/* Animated progress circle */}
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className={`${color} circular-progress`}
          />
        </svg>
        <div className="absolute flex items-center justify-center">
          {Icon && <Icon className={`w-5 h-5 ${color}`} />}
        </div>
      </div>
    </div>
  );
}
