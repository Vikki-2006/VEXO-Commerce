import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  hoverEffect = true,
  glow = false,
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={cn(
        'glass-card rounded-2xl p-6 relative overflow-hidden',
        glow && 'before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/20 before:to-indigo-500/0 before:-z-10',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
