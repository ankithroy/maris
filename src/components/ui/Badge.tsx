import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'unknown' | 'default';
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-glass-bg text-tx-primary',
    success: 'bg-st-success/20 text-st-success border-st-success/30',
    warning: 'bg-st-warning/20 text-st-warning border-st-warning/30',
    danger: 'bg-st-danger/20 text-st-danger border-st-danger/30',
    info: 'bg-st-info/20 text-st-info border-st-info/30',
    unknown: 'bg-st-unknown/20 text-st-unknown border-st-unknown/30',
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
