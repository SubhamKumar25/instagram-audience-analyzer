import React from 'react';

export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
}
