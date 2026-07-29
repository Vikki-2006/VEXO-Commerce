import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  SlidersHorizontal,
  Menu,
  X,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCompareStore } from '../../store/useCompareStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useCommandPaletteStore } from '../../store/useCommandPaletteStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';

export const Header: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartCount = useCartStore((s) => s.getItemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);
  const openCommandPalette = useCommandPaletteStore((s) => s.open);

  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INDEX', path: '/' },
    { name: 'CATALOGUE', path: '/shop' },
    { name: 'CATEGORIES', path: '/shop?view=categories' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-ivory/95 backdrop-blur-md border-b border-sand py-3 shadow-subtle'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-[0.15em] text-ink font-serif uppercase">
                VEXO
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-stone uppercase -mt-1">
                SYSTEMS • EST. 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-card border border-sand rounded-full px-5 py-1.5 shadow-subtle">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-1 text-xs font-extrabold tracking-wider transition-colors ${
                    isActive ? 'text-ink' : 'text-stone hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-warm rounded-full"
                      transition={{ type: 'spring', duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher Toggle */}
            <ThemeToggle />

            {/* Command Palette Trigger */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCommandPalette}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-sand text-ink hover:border-ink transition-all text-xs font-semibold shadow-subtle cursor-pointer"
              title="Search catalog (Ctrl+K)"
              aria-label="Search catalog"
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                <Search className="w-3.5 h-3.5 text-stone" />
              </motion.div>
              <span className="hidden sm:inline text-[11px] font-extrabold uppercase tracking-wider text-ink">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-warm rounded border border-sand text-stone font-bold">
                ⌘K
              </kbd>
            </motion.button>

            {/* Compare Badge */}
            {compareCount > 0 && (
              <Link
                to="/compare"
                className="relative p-2 rounded-full text-stone hover:text-ink hover:bg-warm transition-colors"
                title="Compare Matrix"
              >
                <SlidersHorizontal className="w-4 h-4 text-gold" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-white text-[9px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              </Link>
            )}

            {/* Wishlist Button */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-full text-stone hover:text-ink hover:bg-warm transition-colors"
              title="Wishlist"
            >
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.3 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Heart className="w-4 h-4" />
              </motion.div>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ink text-ivory text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <motion.button
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative px-4 py-2 rounded-full bg-ink text-ivory hover:bg-titanium transition-all shadow-subtle flex items-center gap-2 text-xs font-black uppercase tracking-wider cursor-pointer"
              title="Open Shopping Bag"
            >
              <motion.div whileHover={{ y: -2 }} transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.3 }}>
                <ShoppingBag className="w-4 h-4 text-gold shrink-0" />
              </motion.div>
              <span className="hidden sm:inline text-ivory font-extrabold">Bag</span>
              {cartCount > 0 ? (
                <span className="w-4 h-4 rounded-full bg-gold text-white font-extrabold text-[10px] flex items-center justify-center ml-0.5">
                  {cartCount}
                </span>
              ) : (
                <span className="text-[11px] text-gold font-mono font-bold">(0)</span>
              )}
            </motion.button>

            {/* User Profile Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-0.5 rounded-full border border-sand hover:border-ink transition-all cursor-pointer"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </motion.button>
              ) : (
                <Link
                  to="/auth"
                  className="p-2 rounded-full text-stone hover:text-ink hover:bg-warm transition-colors block"
                >
                  <motion.div whileHover={{ scale: 1.15 }}>
                    <User className="w-4 h-4 text-ink" />
                  </motion.div>
                </Link>
              )}

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-card border border-sand rounded-xl p-2 shadow-modal z-50 text-ink"
                  >
                    <div className="px-3 py-2 border-b border-sand mb-1">
                      <p className="text-xs font-bold text-ink leading-tight">{user?.name}</p>
                      <p className="text-[11px] text-stone truncate">{user?.email}</p>
                      {user?.role === 'ADMIN' && (
                        <Badge variant="gold" className="mt-1">
                          Admin Privileges
                        </Badge>
                      )}
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone hover:text-ink hover:bg-warm rounded-lg transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-stone" />
                      Account Settings
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-ink hover:bg-warm rounded-lg transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                        Admin Command Center
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-danger hover:bg-danger/10 rounded-lg transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone hover:text-ink"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-ink" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-sand bg-ivory/98 backdrop-blur-xl overflow-hidden px-6 py-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-black text-ink hover:text-gold py-1 uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-black text-gold py-1 flex items-center gap-2 uppercase tracking-wider"
                >
                  <ShieldCheck className="w-5 h-5" /> Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
