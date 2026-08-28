import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceGaugeProps {
  percentage: number;
  label: string;
  color?: string;
  size?: number;
}

export function ConfidenceGauge({ percentage, label, color = '#22D3EE', size = 120 }: ConfidenceGaugeProps) {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-white/10" />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: "easeOut" }} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-tx-primary font-mono tracking-tighter">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-tx-secondary uppercase tracking-wider">{label}</span>
    </div>
  );
}
