import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-xs font-semibold text-secondary tracking-wide uppercase">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-secondary pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn(
              'glass-input w-full px-4 py-2.5 rounded-xl text-sm font-medium placeholder:text-zinc-500 focus:outline-none transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-secondary cursor-pointer">{rightIcon}</div>}
        </div>
        {error && <span className="text-xs text-danger font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
