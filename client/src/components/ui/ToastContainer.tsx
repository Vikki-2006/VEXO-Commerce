import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore, Toast } from '../../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-amber-500 shrink-0" />,
  };

  const barColors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-amber-500',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0" aria-live="polite" role="region" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map((toast: Toast) => {
          const duration = toast.duration || 3000;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="pointer-events-auto relative overflow-hidden flex items-center justify-between gap-3 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-sand shadow-modal text-ink theme-transition"
            >
              <div className="flex items-center gap-3">
                {icons[toast.type]}
                <div>
                  <h4 className="text-xs font-bold text-ink tracking-wide">{toast.title}</h4>
                  {toast.message && <p className="text-[11px] text-stone mt-0.5 font-semibold">{toast.message}</p>}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone hover:text-ink transition-colors p-1 rounded-full hover:bg-warm shrink-0 focus:outline-none focus:ring-1 focus:ring-gold"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Animated Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-[2px] ${barColors[toast.type]}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

