import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Search, ArrowRight } from 'lucide-react';
import { MatteButton } from './MatteButton';

interface EmptyStateProps {
  type: 'wishlist' | 'cart' | 'search' | 'generic';
  title?: string;
  subtitle?: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  subtitle,
  actionText = 'Continue Shopping',
  actionPath = '/shop',
  onAction,
}) => {
  const configs = {
    wishlist: {
      icon: <Heart className="w-10 h-10 text-stone/40 stroke-[1.5]" />,
      defaultTitle: 'Your wishlist is empty',
      defaultSubtitle: 'Discover handcrafted premium products and save your favorites.',
    },
    cart: {
      icon: <ShoppingBag className="w-10 h-10 text-stone/40 stroke-[1.5]" />,
      defaultTitle: 'Your shopping bag is empty',
      defaultSubtitle: 'Explore our architectural hardware collection and elevate your space.',
    },
    search: {
      icon: <Search className="w-10 h-10 text-stone/40 stroke-[1.5]" />,
      defaultTitle: 'No products found',
      defaultSubtitle: 'Try searching for another term or browse our main category collection.',
    },
    generic: {
      icon: <Search className="w-10 h-10 text-stone/40 stroke-[1.5]" />,
      defaultTitle: 'Nothing here yet',
      defaultSubtitle: 'We could not find any items matching your current view.',
    },
  };

  const config = configs[type] || configs.generic;
  const displayTitle = title || config.defaultTitle;
  const displaySubtitle = subtitle || config.defaultSubtitle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-card border border-sand shadow-subtle max-w-md mx-auto my-8 theme-transition"
    >
      <div className="w-20 h-20 rounded-full bg-warm border border-sand flex items-center justify-center mb-5 shadow-inner">
        {config.icon}
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{displayTitle}</h3>
      <p className="text-xs text-stone leading-relaxed max-w-sm mb-6 font-semibold">{displaySubtitle}</p>
      
      {onAction ? (
        <MatteButton onClick={onAction} className="flex items-center gap-2">
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </MatteButton>
      ) : (
        <Link to={actionPath}>
          <MatteButton className="flex items-center gap-2">
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </MatteButton>
        </Link>
      )}
    </motion.div>
  );
};
