import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MatteButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const MatteButton: React.FC<MatteButtonProps> = ({
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
    'relative inline-flex items-center justify-center font-bold tracking-tight rounded-lg transition-all duration-300 focus:outline-none cursor-pointer overflow-hidden border';

  const variants = {
    primary:
      'bg-ink hover:bg-titanium text-ivory border-ink shadow-subtle hover:shadow-card',
    secondary:
      'bg-card hover:bg-warm text-ink border-sand shadow-subtle hover:border-ink',
    accent:
      'bg-gold hover:bg-gold-hover text-white border-gold shadow-gold-glow',
    outline:
      'bg-transparent hover:bg-ink/5 text-ink border-sand hover:border-ink',
    ghost:
      'bg-transparent hover:bg-ink/5 text-stone hover:text-ink border-transparent',
    danger:
      'bg-danger/10 hover:bg-danger/20 text-danger border-danger/20',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 font-semibold',
    md: 'text-xs px-5 py-2.5 gap-2 uppercase tracking-wider',
    lg: 'text-sm px-7 py-3.5 gap-2.5 uppercase tracking-wider',
  };

  return (
    <motion.button
      whileHover={{ y: disabled || isLoading ? 0 : -2, scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
