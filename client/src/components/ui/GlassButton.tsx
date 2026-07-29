import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none cursor-pointer overflow-hidden backdrop-blur-md border';

  const variants = {
    primary:
      'bg-accent hover:bg-accent-hover text-white border-purple-500/30 shadow-accent-glow hover:shadow-[0_0_35px_rgba(124,58,237,0.7)]',
    secondary:
      'bg-surface/80 hover:bg-card text-white border-white/10 hover:border-white/20 shadow-glass',
    outline:
      'bg-transparent hover:bg-white/5 text-white border-white/15 hover:border-white/30',
    ghost:
      'bg-transparent hover:bg-white/10 text-secondary hover:text-white border-transparent',
    danger:
      'bg-danger/20 hover:bg-danger/30 text-danger border-danger/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
      whileHover={{ y: disabled || isLoading ? 0 : -1 }}
      className={cn(baseStyles, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
