import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { Modal } from '../ui/Modal';
import { MatteButton } from '../ui/MatteButton';
import { Badge } from '../ui/Badge';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/formatters';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const addToast = useToastStore((s) => s.addToast);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${product.title} (${quantity}) added to cart.`,
    });
    onClose();
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    navigate('/checkout');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-ink">
        {/* Left Gallery */}
        <div className="md:col-span-6 flex flex-col gap-3">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-warm border border-sand">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-ink' : 'border-sand opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="md:col-span-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">{product.category?.name}</Badge>
              {product.stock > 0 ? (
                <Badge variant="success">IN STOCK ({product.stock})</Badge>
              ) : (
                <Badge variant="danger">OUT OF STOCK</Badge>
              )}
            </div>

            <h2 className="text-2xl font-black text-ink tracking-tight font-serif">{product.title}</h2>
            <p className="text-xs text-stone mt-1 font-semibold">{product.subtitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-gold' : 'text-sand'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-ink">{product.rating}</span>
              <span className="text-xs text-stone">({product.reviewsCount} verified reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-3xl font-black text-ink">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-stone line-through font-semibold">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-stone leading-relaxed line-clamp-3 mb-4">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-stone uppercase tracking-wider">Quantity</span>
              <div className="flex items-center rounded-lg border border-sand bg-warm p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center font-bold text-ink hover:bg-card rounded"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center font-bold text-ink hover:bg-card rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-sand">
            <div className="flex gap-3">
              <MatteButton
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="flex-1"
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Add to Bag
              </MatteButton>

              <MatteButton
                onClick={handleBuyNow}
                variant="accent"
                size="lg"
                className="flex-1"
              >
                Buy Now
              </MatteButton>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-lg border transition-all ${
                  wishlisted ? 'bg-ink text-white border-ink' : 'bg-card text-stone hover:text-ink border-sand'
                }`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/product/${product.slug}`);
              }}
              className="w-full text-xs font-bold text-stone hover:text-ink flex items-center justify-center gap-1 transition-colors py-1 uppercase tracking-wider"
            >
              View Full Specifications <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
