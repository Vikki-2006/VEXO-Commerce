import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { api } from '../services/api';
import { MinimalInput } from '../components/ui/MinimalInput';
import { MatteButton } from '../components/ui/MatteButton';
import { Badge } from '../components/ui/Badge';
import { SEO } from '../components/common/SEO';
import { formatCurrency } from '../utils/formatters';


export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getShippingFee, discountAmount, couponCode, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  // Form State
  const [street, setStreet] = useState('Strandvägen 45');
  const [city, setCity] = useState('Stockholm');
  const [state, setState] = useState('ST');
  const [zipCode, setZipCode] = useState('114 56');
  const [country, setCountry] = useState('Sweden');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');

  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9824');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('999');
  const [cardName, setCardName] = useState(user?.name || 'Astrid Lindqvist');

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const shippingFees = {
    standard: getShippingFee(),
    express: 1500,
    overnight: 2500,
  };

  const currentShippingFee = shippingFees[shippingMethod];
  const finalTotal = Math.max(0, getSubtotal() - discountAmount + currentShippingFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: items.map((it) => ({
          productId: it.product.id,
          price: it.product.price,
          quantity: it.quantity,
          color: it.color,
          size: it.size,
        })),
        shippingAddress: { street, city, state, zipCode, country },
        couponCode: couponCode || undefined,
        shippingFee: currentShippingFee,
      };

      const newOrder = await api.createOrder(orderPayload);

      addToast({
        type: 'success',
        title: 'Order Confirmed',
        message: `Reference ${newOrder.orderNumber} successfully processed.`,
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F0E0D', '#C5A059', '#1B7A4B', '#FFFFFF'],
      });

      setCompletedOrder(newOrder);
      clearCart();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Order Placement Error', message: err.message });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center text-ink theme-transition">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="studio-card rounded-2xl p-10 border border-sand bg-card space-y-6 shadow-modal"
        >
          <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>

          <div>
            <Badge variant="success" className="mb-2">ORDER CONFIRMED</Badge>
            <h1 className="text-3xl font-black text-ink font-serif">Thank You for Your Order</h1>
            <p className="text-xs text-stone mt-1 font-semibold">
              Dispatch Reference: <strong className="text-gold">{completedOrder.orderNumber}</strong>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-warm border border-sand text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone">Destination Address:</span>
              <span className="font-bold text-ink">{street}, {city}, {country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone">Total Amount Paid:</span>
              <span className="font-extrabold text-gold">{formatCurrency(completedOrder.totalAmount || finalTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone">Estimated Dispatch:</span>
              <span className="font-bold text-ink">2-3 Business Days</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <MatteButton
              onClick={() => navigate('/account')}
              variant="primary"
              className="flex-1"
            >
              Track Order Status
            </MatteButton>
            <MatteButton
              onClick={() => navigate('/')}
              variant="secondary"
              className="flex-1"
            >
              Return to Index
            </MatteButton>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 text-ink theme-transition">
      <SEO
        title="Express Checkout | VEXO Systems"
        description="Encrypted 256-bit SSL express checkout for VEXO Systems hardware orders."
      />
      <div className="mb-8">
        <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
          256-BIT SSL ENCRYPTED
        </span>
        <h1 className="text-3xl font-black text-ink tracking-tight font-serif flex items-center gap-2">
          Express Checkout <Lock className="w-5 h-5 text-gold" />
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Address & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address */}
          <div className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-4">
            <h3 className="text-base font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" /> Shipping Address
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <MinimalInput
                label="Street Address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <MinimalInput
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <MinimalInput
                  label="State / Region"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MinimalInput
                  label="Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
                <MinimalInput
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Speed */}
          <div className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-4">
            <h3 className="text-base font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-ink" /> Delivery Speed
            </h3>

            <div className="space-y-2">
              {[
                { id: 'standard', title: 'Standard Express Courier', time: '3-5 Business Days', price: getShippingFee() === 0 ? 'FREE' : formatCurrency(1500) },
                { id: 'express', title: 'Priority Air Freight', time: '1-2 Business Days', price: formatCurrency(1500) },
                { id: 'overnight', title: 'Overnight Air Dispatch', time: 'Next Day Guarantee', price: formatCurrency(2500) },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setShippingMethod(method.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    shippingMethod === method.id
                      ? 'bg-warm border-ink text-ink font-bold'
                      : 'bg-card border-sand text-stone hover:text-ink'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{method.title}</h4>
                    <p className="text-[11px] text-stone font-semibold">{method.time}</p>
                  </div>
                  <span className="text-xs font-black text-gold">{method.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Credit Card */}
          <div className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-4">
            <h3 className="text-base font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" /> Payment Telemetry
            </h3>

            <div className="space-y-4">
              <MinimalInput
                label="Cardholder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
              <MinimalInput
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <MinimalInput
                  label="Expires"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                />
                <MinimalInput
                  label="CVC / CVV"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-6">
            <h3 className="text-sm font-bold text-ink border-b border-sand pb-4 uppercase tracking-wider">
              Order Summary ({items.length} items)
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={it.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-sand shrink-0 bg-card" />
                    <div>
                      <h5 className="font-bold text-ink line-clamp-1">{it.product.title}</h5>
                      <span className="text-stone">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-ink">{formatCurrency(it.product.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs font-semibold text-stone pt-4 border-t border-sand">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink font-bold">{formatCurrency(getSubtotal())}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-ink font-bold">
                  {currentShippingFee === 0 ? 'FREE' : formatCurrency(currentShippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-black text-ink pt-3 border-t border-sand">
                <span>Total Due</span>
                <span className="text-gold">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <MatteButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isPlacingOrder}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Pay {formatCurrency(finalTotal)} & Complete Order
            </MatteButton>
          </div>
        </div>
      </form>
    </div>
  );
};
