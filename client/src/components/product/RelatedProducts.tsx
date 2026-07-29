import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, onQuickView }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-12 border-t border-sand">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-4 h-4 text-gold" />
        <h3 className="text-xl font-black text-ink font-serif uppercase tracking-wider">
          Frequently Paired Hardware
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-6"
      >
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </motion.div>
    </div>
  );
};
