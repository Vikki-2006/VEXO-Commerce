import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, SlidersHorizontal } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCompareStore } from '../../store/useCompareStore';
import { useToastStore } from '../../store/useToastStore';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { toggleCompare, isCompared } = useCompareStore();
  const addToast = useToastStore((s) => s.addToast);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const wishlisted = isWishlisted(product.id);
  const compared = isCompared(product.id);

  // Deterministic luxury badge lookup matching prompt specs
  const getBadgeLabel = () => {
    const badges = [
      'JUST ARRIVED',
      'BEST SELLER',
      'LIMITED',
      "EDITOR'S PICK",
      'PREMIUM',
      'HOT',
      'TRENDING',
      'EXCLUSIVE',
    ];
    if (product.price > 120000) return 'EXCLUSIVE';
    if (product.isNew) return 'JUST ARRIVED';
    if (product.rating >= 4.9) return 'BEST SELLER';
    if (product.reviewsCount > 150) return "EDITOR'S PICK";
    if (product.stock < 5) return 'LIMITED';
    // Hash id for consistent display
    const charCodeSum = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return badges[charCodeSum % badges.length];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 8, y: y * 8 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.title} successfully added to your bag.`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast({
      type: wishlisted ? 'info' : 'success',
      title: wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
      message: product.title,
    });
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative studio-card rounded-xl p-4 flex flex-col justify-between border border-sand bg-card hover:border-gold/40 hover:shadow-modal transition-all duration-300 overflow-hidden text-ink theme-transition"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-warm mb-4 border border-sand/60">
        <Link to={`/product/${product.slug}`}>
          <motion.img
            animate={{
              x: mousePos.x,
              y: mousePos.y,
            }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <Badge variant="gold">{getBadgeLabel()}</Badge>
        </div>

        {/* Wishlist Pop Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 1.25 }}
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full border transition-all z-10 ${
            wishlisted
              ? 'bg-ink text-ivory border-ink shadow-md'
              : 'bg-card/90 text-stone hover:text-ink border-sand hover:bg-card'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-ivory' : ''}`} />
        </motion.button>

        {/* Quick View Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-ink hover:bg-titanium text-ivory text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          )}

          <button
            onClick={handleCompareToggle}
            className={`p-2 rounded-lg border transition-colors ${
              compared
                ? 'bg-gold text-white border-gold'
                : 'bg-card text-stone hover:text-ink border-sand'
            }`}
            title={compared ? 'In Compare' : 'Add to Compare'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[10px] font-bold text-stone uppercase tracking-widest mb-1">
            <span>{product.category?.name || 'Hardware'}</span>
            <div className="flex items-center gap-1 text-ink font-extrabold">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-bold text-ink group-hover:text-gold transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          <p className="text-[11px] text-stone line-clamp-1 mt-0.5 font-semibold">{product.subtitle}</p>
        </div>

        {/* Pricing & Cart Trigger */}
        <div className="flex items-center justify-between pt-3 border-t border-sand mt-auto">
          <div className="flex flex-col">
            <span className="text-sm font-black text-ink">{formatCurrency(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-[10px] text-stone line-through font-semibold">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="p-2.5 rounded-lg bg-warm hover:bg-ink hover:text-ivory border border-sand text-ink transition-all shadow-subtle flex items-center justify-center cursor-pointer"
            title="Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
