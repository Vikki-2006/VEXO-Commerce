import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout & Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { CompareDrawer } from './components/product/CompareDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/ui/ToastContainer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { BackToTop } from './components/common/BackToTop';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { ComparePage } from './pages/ComparePage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Error500Page } from './pages/Error500Page';
import { OfflinePage } from './pages/OfflinePage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.995 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/500" element={<Error500Page />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollProgressBar />
      <div className="flex flex-col min-h-screen bg-ivory text-ink selection:bg-gold selection:text-white theme-transition">
        <Header />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <CompareDrawer />
        <CommandPalette />
        <ToastContainer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
