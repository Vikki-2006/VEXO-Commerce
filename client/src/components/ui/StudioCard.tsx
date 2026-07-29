import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface StudioCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  hoverEffect = true,
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={cn(
        'studio-card rounded-xl p-6 relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
