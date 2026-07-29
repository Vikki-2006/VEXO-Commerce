import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Truck, Heart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';

import { api } from '../../services/api';
import { MatteButton } from '../ui/MatteButton';
import { MinimalInput } from '../ui/MinimalInput';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getShippingFee,
    shippingThreshold,
  } = useCartStore();

  const addToast = useToastStore((s) => s.addToast);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const taxAmount = Math.round(subtotal * 0.08); // 8% Tax estimate
  const shippingFee = getShippingFee();
  const total = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);
  const progressToFreeShipping = Math.min(100, (subtotal / shippingThreshold) * 100);
  const amountNeeded = Math.max(0, shippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await api.validateCoupon(couponInput, subtotal);
      applyCoupon(res.code, res.discountAmount);
      addToast({ type: 'success', title: 'Coupon Code Applied', message: `Saved ${formatCurrency(res.discountAmount)}` });
      setCouponInput('');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Coupon Invalid', message: err.message || 'Invalid coupon code' });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleMoveToWishlist = (item: any) => {
    toggleWishlist(item.product);
    removeItem(item.product.id, item.color, item.size);
    addToast({
      type: 'success',
      title: 'Moved to Wishlist',
      message: `${item.product.title} saved to wishlist.`,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Slide-out Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-card border-l border-sand h-full shadow-modal flex flex-col z-10 text-ink theme-transition"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-sand">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warm text-ink border border-sand">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-ink tracking-tight uppercase">Shopping Bag</h3>
                <p className="text-[11px] text-stone font-semibold">{items.length} unique items</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={() => {
                    clearCart();
                    addToast({ type: 'info', title: 'Cart Cleared', message: 'All items removed from cart.' });
                  }}
                  className="text-xs font-bold text-stone hover:text-rose-500 transition-colors px-2 py-1"
                  title="Clear entire cart"
                >
                  Clear
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-full text-stone hover:text-ink hover:bg-warm transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3.5 bg-warm border-b border-sand">
            <div className="flex items-center justify-between text-xs font-bold text-stone mb-1.5">
              <span className="flex items-center gap-1.5 text-ink">
                <Truck className="w-4 h-4 text-gold" />
                {amountNeeded === 0 ? (
                  <span className="text-emerald-500 font-bold">Free Express Delivery Unlocked</span>
                ) : (
                  <span>Add <strong className="text-ink">{formatCurrency(amountNeeded)}</strong> for Free Express Shipping</span>
                )}
              </span>
              <span className="text-[10px]">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-sand overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-warm border border-sand flex items-center justify-center mx-auto mb-4 text-stone text-2xl">
                    👜
                  </div>
                  <h4 className="text-base font-bold text-ink mb-1">Your shopping bag is empty</h4>
                  <p className="text-xs text-stone max-w-xs mb-6 font-semibold">
                    Discover handcrafted premium architectural hardware.
                  </p>
                  <MatteButton
                    onClick={() => {
                      closeCart();
                      navigate('/shop');
                    }}
                    variant="primary"
                  >
                    Continue Shopping
                  </MatteButton>
                </div>
              </div>
            ) : (
              items.map((item, idx) => (
                <motion.div
                  key={`${item.product.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 p-3.5 rounded-xl bg-warm/60 border border-sand group text-ink"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-lg object-cover border border-sand shrink-0 bg-card"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-bold text-ink line-clamp-1">{item.product.title}</h5>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="text-stone hover:text-ink transition-colors p-1"
                            title="Move to Wishlist"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id, item.color, item.size)}
                            className="text-stone hover:text-rose-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-extrabold text-gold mt-0.5">
                        {formatCurrency(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-card border border-sand rounded-md px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.color, item.size)}
                          className="text-stone hover:text-ink font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-ink px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.color, item.size)}
                          className="text-stone hover:text-ink font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-ink">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-sand bg-warm space-y-4">
              {/* Coupon Input */}
              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Coupon "{couponCode}" Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-500 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <MinimalInput
                    placeholder="Coupon code (e.g. VEXO20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="py-1 text-xs"
                  />
                  <MatteButton type="submit" variant="secondary" size="sm" isLoading={validatingCoupon}>
                    Apply
                  </MatteButton>
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs font-semibold text-stone">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-ink font-bold">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-ink font-bold">{formatCurrency(taxAmount)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-ink font-bold">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-ink pt-2 border-t border-sand">
                  <span>Grand Total</span>
                  <span className="text-gold">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <MatteButton
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </MatteButton>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
