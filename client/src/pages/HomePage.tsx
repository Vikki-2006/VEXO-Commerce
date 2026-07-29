import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { MatteButton } from '../components/ui/MatteButton';
import { StudioCard } from '../components/ui/StudioCard';
import { Badge } from '../components/ui/Badge';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { SEO } from '../components/common/SEO';
import { useToastStore } from '../store/useToastStore';
import { api } from '../services/api';
import { Product, Category } from '../types';


import { formatCurrency } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          api.getProducts({ sort: 'featured' }),
          api.getCategories(),
        ]);
        setFeaturedProducts(prodData.products);
        setCategories(catData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const ramsPrinciples = [
    {
      number: '01',
      title: 'Good design is innovative',
      description: 'Planar magnetic acoustic drivers engineered from custom 50mm beryllium composite transducers.',
    },
    {
      number: '02',
      title: 'Good design makes a product useful',
      description: 'Master 4K QD-OLED visual accuracy with 99% DCI-P3 native color spectrum for digital artists.',
    },
    {
      number: '03',
      title: 'Good design is aesthetic',
      description: 'Solid CNC 6063 aerospace aluminum enclosures milled from single 3.2kg metal billets.',
    },
    {
      number: '04',
      title: 'Good design is unobtrusive',
      description: 'Tactile magnetic Hall Effect switches with sub-millimeter rapid-trigger precision.',
    },
  ];

  const testimonials = [
    {
      name: 'Frederik Lindqvist',
      role: 'Principal Acoustic Architect, Stockholm',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      comment: 'VEXO Soundstage One is a masterpiece of acoustic engineering. The planar magnetic transducer clarity surpasses studio monitors twice the price.',
      rating: 5,
    },
    {
      name: 'Evelina Thorne',
      role: 'Industrial Designer, Copenhagen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      comment: 'The QD-OLED calibration and anodized aluminum enclosure speak the language of Leica and Braun. True luxury hardware.',
      rating: 5,
    },
    {
      name: 'Henrik Vang',
      role: 'Creative Director, Oslo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      comment: 'Every tactile touchpoint on the VEXO Keydeck feels handcrafted. An indispensable tool in our industrial studio.',
      rating: 5,
    },
  ];

  return (
    <div className="relative min-h-screen bg-ivory text-ink overflow-x-hidden theme-transition">
      <SEO
        title="VEXO Systems | Industrial Technology & Acoustic Hardware"
        description="VEXO Systems architects planar magnetic transducers, QD-OLED master displays, and milled aluminum keydecks."
      />
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Editorial Magazine Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-gold uppercase tracking-[0.25em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              SYSTEM RELEASE 2026 • STOCKHOLM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl 3xl:text-8xl font-extrabold tracking-tight text-ink editorial-display font-serif"
            >
              ACOUSTIC & VISUAL PRECISION.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed font-semibold"
            >
              VEXO Systems architects planar magnetic transducers, QD-OLED master displays, and milled aluminum keydecks for international technologists.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4"
            >
              <MatteButton
                onClick={() => navigate('/shop')}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Catalogue Index
              </MatteButton>

              <MatteButton
                onClick={() => navigate('/shop?category=acoustic-architecture')}
                variant="secondary"
                size="lg"
              >
                Planar Acoustics
              </MatteButton>
            </motion.div>

            {/* Spec Ticker */}
            <div className="pt-8 border-t border-sand flex items-center gap-6 text-[11px] sm:text-xs font-mono text-stone">
              <div>
                <span className="block text-ink font-bold">50mm Beryllium</span>
                <span>Planar Transducers</span>
              </div>
              <div className="h-6 w-[1px] bg-sand" />
              <div>
                <span className="block text-ink font-bold">4K QD-OLED</span>
                <span>240Hz Master Display</span>
              </div>
              <div className="h-6 w-[1px] bg-sand" />
              <div>
                <span className="block text-ink font-bold">CNC 6063</span>
                <span>Aerospace Aluminum</span>
              </div>
            </div>
          </div>

          {/* Right Full-Bleed Imagery Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] 3xl:aspect-[16/11] rounded-2xl overflow-hidden studio-card border border-sand bg-warm shadow-card">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1600"
                alt="VEXO Soundstage One"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-card/95 backdrop-blur-md border border-sand shadow-subtle flex items-center justify-between">
                <div>
                  <Badge variant="gold" className="mb-1">FLAGSHIP ACOUSTICS</Badge>
                  <h3 className="text-base font-bold text-ink">VEXO Soundstage One</h3>
                  <p className="text-[11px] text-stone">Planar magnetic transducers • {formatCurrency(41999)}</p>
                </div>
                <MatteButton
                  onClick={() => navigate('/product/vexo-soundstage-one')}
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Device
                </MatteButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Devices Section */}
      <section className="py-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 border-t border-sand">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-serif">
              Flagship Hardware Devices
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-ink hover:text-gold uppercase tracking-wider transition-colors"
          >
            Explore Full Index <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>

        {/* Responsive Grid up to 5 cols on 3xl */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-6">
          {featuredProducts.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Bento Categories Magazine Spread */}
      <section className="py-24 bg-warm border-y border-sand">
        <div className="max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-16">
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
              SYSTEM DIVISIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-serif">
              Architectural Product Categories
            </h2>
            <p className="text-stone text-xs sm:text-sm mt-2 font-semibold leading-relaxed">
              Explore hardware systems tailored for soundstages, visual color grading, and tactile desk infrastructures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((cat, idx) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/shop?category=${cat.slug}`)}
                className={`group relative rounded-2xl overflow-hidden studio-card border border-sand cursor-pointer p-8 flex flex-col justify-end min-h-[380px] bg-card ${
                  idx === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-1">
                    {cat._count?.products || 3} DEVICES
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white font-serif">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-200 mt-1 line-clamp-2">{cat.description}</p>

                  <div className="inline-flex items-center gap-2 text-xs font-bold text-white mt-4 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                    Explore Index <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dieter Rams 10 Principles Section */}
      <section className="py-24 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-16">
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
            INDUSTRIAL PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-ink tracking-tight font-serif">
            Inspired by Dieter Rams Principles
          </h2>
          <p className="text-stone text-xs sm:text-sm mt-2 font-semibold">
            Less, but better. Handcrafted with honest materials and functional simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ramsPrinciples.map((item, idx) => (
            <StudioCard key={idx} hoverEffect className="p-6 flex flex-col justify-between bg-card border border-sand">
              <div>
                <span className="text-2xl font-black font-mono text-gold block mb-4">{item.number}</span>
                <h4 className="text-base font-bold text-ink mb-2">{item.title}</h4>
                <p className="text-xs text-stone leading-relaxed font-semibold">{item.description}</p>
              </div>
            </StudioCard>
          ))}
        </div>
      </section>

      {/* Editorial Testimonials */}
      <section className="py-24 bg-warm border-t border-sand">
        <div className="max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
              INTERNATIONAL REVIEWS
            </span>
            <h2 className="text-3xl font-black text-ink tracking-tight font-serif">
              Trusted by Architects & Engineers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <StudioCard key={idx} hoverEffect className="p-6 flex flex-col justify-between bg-card">
                <div>
                  <div className="flex text-gold gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-stone italic leading-relaxed font-semibold">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-sand mt-6">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover border border-sand"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-ink flex items-center gap-1">
                      {t.name} <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </h5>
                    <p className="text-[10px] text-stone font-semibold">{t.role}</p>
                  </div>
                </div>
              </StudioCard>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 border-t border-sand bg-card">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Badge variant="gold">VEXO DISPATCH</Badge>
          <h2 className="text-3xl font-black text-ink font-serif tracking-tight uppercase">
            Subscribe to VEXO System Releases
          </h2>
          <p className="text-xs sm:text-sm text-stone max-w-md mx-auto font-semibold leading-relaxed">
            Receive exclusive priority access to new planar magnetic acoustic drops, firmware updates, and limited hardware editions.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
};

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('vexo_newsletter_subscribers') || '[]');
  });
  const addToast = useToastStore((s) => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      addToast({
        type: 'error',
        title: 'Invalid Email Address',
        message: 'Please enter a valid email address (e.g. name@domain.com).',
      });
      return;
    }

    if (subscribedEmails.includes(trimmed)) {
      addToast({
        type: 'info',
        title: 'Already Subscribed',
        message: 'This email is already registered for VEXO System releases.',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const updated = [...subscribedEmails, trimmed];
      setSubscribedEmails(updated);
      localStorage.setItem('vexo_newsletter_subscribers', JSON.stringify(updated));

      addToast({
        type: 'success',
        title: 'Subscribed Successfully',
        message: 'You have been registered for exclusive VEXO system release dispatches.',
      });
      setEmail('');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
      <input
        type="email"
        placeholder="Enter your email address..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg bg-warm border border-sand text-xs font-semibold text-ink placeholder:text-stone/60 focus:outline-none focus:border-ink transition-colors"
      />
      <MatteButton type="submit" variant="primary" size="md" isLoading={isSubmitting}>
        Subscribe
      </MatteButton>
    </form>
  );
};
