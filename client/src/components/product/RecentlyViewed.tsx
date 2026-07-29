import React from 'react';
import { ProductCard } from './ProductCard';
import { Clock } from 'lucide-react';
import { useRecentlyViewedStore } from '../../store/useRecentlyViewedStore';

interface RecentlyViewedProps {
  currentProductId?: string;
  onQuickView?: (product: any) => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId, onQuickView }) => {
  const items = useRecentlyViewedStore((s) => s.items);
  const recentProducts = items.filter((p) => p.id !== currentProductId).slice(0, 6);

  if (recentProducts.length === 0) return null;

  return (
    <div className="py-12 border-t border-sand">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-4 h-4 text-gold" />
        <h3 className="text-xl font-black text-ink font-serif uppercase tracking-wider">
          Recently Viewed Hardware
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-6">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </div>
  );
};
