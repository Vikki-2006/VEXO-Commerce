import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useToastStore } from '../../store/useToastStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const addToast = useToastStore((s) => s.addToast);
  const isDark = theme === 'dark';

  const handleToggle = () => {
    toggleTheme();
    addToast({
      type: 'info',
      title: `Activated ${!isDark ? 'Dark' : 'Light'} Mode`,
      message: `Switched visual theme to ${!isDark ? 'Matte Obsidian' : 'Warm Sandstone'}.`,
    });
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 rounded-full bg-card border border-sand text-stone hover:text-ink hover:border-ink transition-all shadow-subtle flex items-center justify-center cursor-pointer"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme mode"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-gold fill-gold/20" />
        ) : (
          <Moon className="w-4 h-4 text-stone" />
        )}
      </motion.div>
    </button>
  );
};
