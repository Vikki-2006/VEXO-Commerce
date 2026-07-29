import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Plus,
  Minus,
  MessageSquare,
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { MatteButton } from '../components/ui/MatteButton';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { MinimalInput } from '../components/ui/MinimalInput';
import { ProductCard } from '../components/product/ProductCard';
import { RecentlyViewed } from '../components/product/RecentlyViewed';
import { SEO } from '../components/common/SEO';

import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useToastStore } from '../store/useToastStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping' | 'reviews'>('specs');
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const addToast = useToastStore((s) => s.addToast);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await api.getProductBySlug(slug);
        setProduct(prod);

        // Track in Recently Viewed
        const existingViewed = JSON.parse(localStorage.getItem('vexo_recently_viewed') || '[]');
        const filteredViewed = existingViewed.filter((p: Product) => p.id !== prod.id);
        localStorage.setItem('vexo_recently_viewed', JSON.stringify([prod, ...filteredViewed].slice(0, 6)));

        const rel = await api.getProducts({ category: prod.category?.slug });
        setRelatedProducts(rel.products.filter((p) => p.id !== prod.id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="pt-32 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-6 text-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone mt-4 font-bold">Loading VEXO device specifications...</p>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    addToast({
      type: 'success',
      title: 'Added to Bag',
      message: `${quantity}x ${product.title} added to cart.`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: product.subtitle,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // Fallback
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        title: 'Product Link Copied',
        message: 'Direct product link copied to clipboard.',
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast({ type: 'info', title: 'Sign In Required', message: 'Please sign in to post a review.' });
      navigate('/auth');
      return;
    }
    addToast({ type: 'success', title: 'Review Submitted', message: 'Thank you for your feedback!' });
    setReviewModalOpen(false);
  };

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 text-ink theme-transition">
      <SEO
        title={product.title}
        description={product.subtitle || product.description}
        image={product.images[0]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          image: product.images,
          description: product.description,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewsCount,
          },
        }}
      />

      {/* Breadcrumb & Share */}
      <div className="flex items-center justify-between gap-2 text-xs font-bold text-stone mb-8 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-ink">VEXO Index</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">Catalogue</Link>
          <span>/</span>
          <span className="text-ink">{product.title}</span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-sand hover:border-ink transition-colors text-ink text-[11px] font-bold"
        >
          <Share2 className="w-3.5 h-3.5 text-gold" /> Share Product
        </button>
      </div>

      {/* Product Split Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square 3xl:aspect-[4/3] rounded-2xl overflow-hidden studio-card border border-sand bg-warm">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <div className="absolute top-4 left-4">
                <Badge variant="gold">NEW RELEASE</Badge>
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-card ${
                    selectedImage === idx ? 'border-ink scale-95' : 'border-sand opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Buy Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">{product.category?.name}</Badge>
              <Badge variant="success">IN STOCK ({product.stock} UNITS)</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight font-serif">{product.title}</h1>
            <p className="text-xs sm:text-sm text-stone mt-1 font-semibold">{product.subtitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-gold' : 'text-sand'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-ink">{product.rating}</span>
              <span className="text-xs text-stone font-semibold">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 my-6">
              <span className="text-4xl sm:text-5xl font-black text-ink">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-stone line-through font-semibold">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone leading-relaxed font-semibold">{product.description}</p>
          </div>

          {/* Quantity Counter & Actions */}
          <div className="space-y-4 pt-6 border-t border-sand">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold text-stone uppercase tracking-wider">Quantity</span>
              <div className="flex items-center gap-3 bg-warm border border-sand rounded-lg px-3 py-1.5">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-stone hover:text-ink">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-ink px-2">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-stone hover:text-ink">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Instant Checkout
              </MatteButton>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-lg border transition-all ${
                  wishlisted ? 'bg-ink text-ivory border-ink' : 'bg-card text-stone hover:text-ink border-sand'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-ivory' : ''}`} />
              </button>
            </div>
          </div>

          {/* Shipping Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sand text-center">
            <div className="p-3.5 rounded-xl bg-card border border-sand shadow-subtle">
              <Truck className="w-4 h-4 text-gold mx-auto mb-1" />
              <span className="text-[10px] font-bold text-ink block uppercase">Free Dispatch</span>
              <span className="text-[9px] text-stone font-semibold">Orders over ₹15,000</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-sand shadow-subtle">
              <ShieldCheck className="w-4 h-4 text-ink mx-auto mb-1" />
              <span className="text-[10px] font-bold text-ink block uppercase">2-Year Warranty</span>
              <span className="text-[9px] text-stone font-semibold">Global Replacement</span>
            </div>
            <div className="p-3.5 rounded-xl bg-card border border-sand shadow-subtle">
              <RotateCcw className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-ink block uppercase">30-Day Return</span>
              <span className="text-[9px] text-stone font-semibold">Hassle-Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="studio-card rounded-2xl p-8 border border-sand bg-card mb-20">
        <div className="flex border-b border-sand gap-8 mb-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
              activeTab === 'specs' ? 'text-ink' : 'text-stone hover:text-ink'
            }`}
          >
            Technical Specifications
            {activeTab === 'specs' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
              activeTab === 'shipping' ? 'text-ink' : 'text-stone hover:text-ink'
            }`}
          >
            Delivery & Warranty
            {activeTab === 'shipping' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
              activeTab === 'reviews' ? 'text-ink' : 'text-stone hover:text-ink'
            }`}
          >
            Customer Reviews ({product.reviewsCount})
            {activeTab === 'reviews' && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink" />}
          </button>
        </div>

        {/* Tab 1: Specs */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {product.specs &&
              Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3.5 rounded-lg bg-warm border border-sand text-xs">
                  <span className="text-stone font-bold uppercase text-[10px]">{key}</span>
                  <span className="font-semibold text-ink">{value}</span>
                </div>
              ))}
          </div>
        )}

        {/* Tab 2: Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 text-xs text-stone font-semibold leading-relaxed">
            <p>• Dispatched within 24 hours from VEXO Systems fulfillment centers in Stockholm and San Francisco.</p>
            <p>• Priority air logistics takes 2-4 business days internationally with end-to-end telemetry tracking.</p>
            <p>• Covered under VEXO Global 2-Year Replacement Warranty for technical defects.</p>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-ink uppercase tracking-wider">Verified Customer Reviews</h4>
              <MatteButton
                onClick={() => setReviewModalOpen(true)}
                variant="primary"
                size="sm"
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Write Review
              </MatteButton>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-warm border border-sand space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-ink flex items-center gap-1">
                            {rev.user?.name} <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </h5>
                          <span className="text-[10px] text-stone font-semibold">{formatDate(rev.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex text-gold">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h6 className="text-xs font-bold text-ink mt-1">{rev.title}</h6>}
                    <p className="text-xs text-stone font-semibold">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone">No reviews published yet. Be the first to submit feedback.</p>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Write Verified Review">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-stone uppercase block mb-1">Rating</label>
            <div className="flex gap-2 text-gold">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star className={`w-5 h-5 ${star <= newRating ? 'fill-gold' : 'text-sand'}`} />
                </button>
              ))}
            </div>
          </div>

          <MinimalInput
            label="Review Title"
            placeholder="e.g. Masterpiece of industrial design"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <div>
            <label className="text-[10px] font-bold text-stone uppercase block mb-1">Comment</label>
            <textarea
              rows={4}
              placeholder="Describe your hands-on acoustic or visual experience..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="minimal-input w-full p-3 rounded-lg text-xs text-ink focus:outline-none"
            />
          </div>

          <MatteButton type="submit" variant="primary" className="w-full">
            Submit Review
          </MatteButton>
        </form>
      </Modal>

      {/* Recently Viewed Hardware */}
      <RecentlyViewed currentProductId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-12 border-t border-sand">
          <h3 className="text-xl font-black text-ink tracking-tight font-serif uppercase tracking-wider mb-6">Frequently Bought Together</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-6">
            {relatedProducts.slice(0, 5).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
