import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  status?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, status = 'info', className }: MetricCardProps) {
  const statusColors = {
    success: 'text-st-success',
    warning: 'text-st-warning',
    danger: 'text-st-danger',
    info: 'text-cyan-acc',
  };

  return (
    <GlassCard className={cn("flex flex-col relative overflow-hidden group", className)}>
      <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <Icon className="w-32 h-32" />
      </div>
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="p-2.5 rounded-lg bg-glass-bg border border-glass-border">
          <Icon className={cn("w-5 h-5", statusColors[status])} />
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend >= 0 ? "text-st-success bg-st-success/10" : "text-st-danger bg-st-danger/10"
          )}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="z-10">
        <h3 className="text-tx-muted text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-tx-primary tracking-tight">{value}</p>
      </div>
    </GlassCard>
  );
}
