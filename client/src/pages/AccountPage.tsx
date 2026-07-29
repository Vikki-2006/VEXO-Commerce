import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Heart, MapPin, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { api } from '../services/api';
import { Order } from '../types';
import { MatteButton } from '../components/ui/MatteButton';
import { MinimalInput } from '../components/ui/MinimalInput';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/product/ProductCard';
import { formatCurrency, formatDate } from '../utils/formatters';


export const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'orders';

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuthStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getUserOrders();
        setOrders(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 min-h-screen text-ink theme-transition">
      <SEO
        title="Account & Logistics | VEXO Systems"
        description="Manage your VEXO Systems profile, orders, addresses, and saved hardware wishlist."
      />
      {/* Overview Header */}
      <div className="studio-card rounded-2xl p-6 sm:p-8 border border-sand bg-card mb-8 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-sand"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl font-black text-ink font-serif">{user?.name || 'Astrid Lindqvist'}</h1>
          <p className="text-xs text-stone mt-0.5 font-semibold">{user?.email || 'user@vexo.systems'}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
            <Badge variant="gold">VEXO PRO MEMBER</Badge>
            <Badge variant="success">2-YEAR WARRANTY ACTIVE</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 studio-card rounded-2xl p-3 border border-sand bg-card space-y-1">
          {[
            { id: 'orders', label: 'Dispatch History', icon: <Package className="w-4 h-4 text-ink" /> },
            { id: 'wishlist', label: `Saved Index (${wishlistItems.length})`, icon: <Heart className="w-4 h-4 text-gold" /> },
            { id: 'addresses', label: 'Logistics Addresses', icon: <MapPin className="w-4 h-4 text-stone" /> },
            { id: 'profile', label: 'Account Settings', icon: <Settings className="w-4 h-4 text-titanium" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? 'bg-warm text-ink border border-sand'
                  : 'text-stone hover:text-ink hover:bg-warm/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-ink font-serif mb-4">Dispatch History</h3>
              {orders.length === 0 ? (
                <div className="studio-card rounded-2xl p-8 text-center text-xs text-stone font-semibold bg-card">
                  No dispatch history recorded yet.
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sand pb-4 gap-2">
                      <div>
                        <span className="text-[10px] text-stone font-bold uppercase block">Dispatch Reference</span>
                        <h4 className="text-sm font-black text-ink">{ord.orderNumber}</h4>
                        <span className="text-[10px] text-stone">{formatDate(ord.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={ord.status === 'SHIPPED' ? 'success' : 'gold'}>
                          {ord.status}
                        </Badge>
                        <span className="text-base font-black text-ink">{formatCurrency(ord.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={it.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-sand shrink-0 bg-card" />
                            <div>
                              <h5 className="font-bold text-ink">{it.product.title}</h5>
                              <span className="text-stone">Qty: {it.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-ink">{formatCurrency(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="text-xl font-black text-ink font-serif mb-4">Saved Wishlist ({wishlistItems.length})</h3>
              {wishlistItems.length === 0 ? (
                <EmptyState
                  type="wishlist"
                  title="Your wishlist is empty"
                  subtitle="Discover handcrafted premium products and save your favorites."
                  actionText="Discover Hardware"
                  actionPath="/shop"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wishlistItems.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-4">
              <h3 className="text-xl font-black text-ink font-serif mb-4">Saved Shipping Address</h3>
              <div className="p-4 rounded-xl bg-warm border border-sand text-xs text-stone space-y-1 font-semibold">
                <p className="font-bold text-ink">Strandvägen 45</p>
                <p>Stockholm, 114 56</p>
                <p>Sweden</p>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="studio-card rounded-2xl p-6 border border-sand bg-card space-y-4">
              <h3 className="text-xl font-black text-ink font-serif mb-4">Profile Settings</h3>
              <div className="space-y-4 max-w-md">
                <MinimalInput label="Full Name" defaultValue={user?.name || 'Astrid Lindqvist'} />
                <MinimalInput label="Email Address" defaultValue={user?.email || 'user@vexo.systems'} disabled />
                <MatteButton variant="primary">Save Changes</MatteButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
