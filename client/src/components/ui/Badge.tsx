import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger' | 'titanium' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className,
}) => {
  const variants = {
    default: 'bg-warm text-ink border-sand',
    gold: 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-sm backdrop-blur-sm',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    titanium: 'bg-titanium text-white border-titanium',
    outline: 'bg-transparent text-stone border-sand',
  };

  const sizes = {
    sm: 'text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-widest',
    md: 'text-xs px-3 py-1 font-bold tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
