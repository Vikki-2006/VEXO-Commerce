import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface MinimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MinimalInput = forwardRef<HTMLInputElement, MinimalInputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && <label className="text-[11px] font-bold text-stone uppercase tracking-wider">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3.5 text-stone pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn(
              'minimal-input w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-ink placeholder:text-stone/60 focus:outline-none transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger focus:border-danger',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3.5 text-stone cursor-pointer">{rightIcon}</div>}
        </div>
        {error && <span className="text-[11px] text-danger font-medium mt-0.5">{error}</span>}
      </div>
    );
  }
);

MinimalInput.displayName = 'MinimalInput';
