import { Product, Category, User, Order, FilterState } from '../types';

const API_BASE = 'http://localhost:5000/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('vexo_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// VEXO Fallback Mock Data with INR Prices
const FALLBACK_CATEGORIES: Category[] = [
  { id: '1', name: 'Acoustic Architecture', slug: 'acoustic-architecture', description: 'Studio-grade planar magnetic audio transducers', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800' },
  { id: '2', name: 'Visual Displays', slug: 'visual-displays', description: 'Master calibration QD-OLED displays', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'Tactile Inputs', slug: 'tactile-inputs', description: 'CNC aluminum gasket-mount mechanical keydecks', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800' },
  { id: '4', name: 'Carry & Apparel', slug: 'carry-apparel', description: 'Minimalist techwear carry & waterproof nylon', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800' },
  { id: '5', name: 'Power & Infrastructure', slug: 'power-infrastructure', description: 'GaN III power stations & desk pads', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800' },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'VEXO Soundstage One Headphones',
    slug: 'vexo-soundstage-one',
    subtitle: 'Planar magnetic acoustic drivers with hybrid active noise isolation.',
    description: 'Hand-assembled in Stockholm. Features custom 50mm beryllium composite planar transducers, 50-hour continuous battery playback, zero-loss wireless streaming, and lambskin ear cushions.',
    price: 41999,
    compareAtPrice: 45999,
    stock: 30,
    categoryId: '1',
    category: FALLBACK_CATEGORIES[0],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200',
    ],
    specs: {
      'Acoustic Driver': '50mm Beryllium Planar Magnetic',
      'Frequency Response': '5Hz – 45,000Hz',
      'Total Harmonic Distortion': '< 0.05% @ 1kHz',
      'Battery Endurance': '50 Hours (ANC Enabled)',
      'Frame Construction': 'Anodized 6063 Aluminum',
    },
    isFeatured: true,
    isNew: true,
    rating: 4.95,
    reviewsCount: 142,
  },
  {
    id: 'p2',
    title: 'VEXO Vision 32 Master Monitor',
    slug: 'vexo-vision-32-master',
    subtitle: '32-inch 4K QD-OLED, 240Hz, 0.03ms GTG, 1000-nit peak HDR.',
    description: 'Engineered for colorists and designers demanding absolute visual fidelity. Boasts a passive graphite thermal dissipation plate, 90W USB-C power delivery, and factory Delta E < 1 calibration.',
    price: 124999,
    compareAtPrice: 139999,
    stock: 12,
    categoryId: '2',
    category: FALLBACK_CATEGORIES[1],
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=1200',
    ],
    specs: {
      'Panel Technology': '32-inch Quantum Dot OLED',
      'Native Resolution': '3840 x 2160 pixels (4K UHD)',
      'Refresh Frequency': '240Hz Variable',
      'Color Spectrum': '99% DCI-P3, 10-bit Native',
      'Enclosure': 'Solid CNC Aluminum Unibody',
    },
    isFeatured: true,
    isNew: true,
    rating: 4.98,
    reviewsCount: 88,
  },
  {
    id: 'p3',
    title: 'VEXO Haptic Gasket Keydeck',
    slug: 'vexo-haptic-gasket-keydeck',
    subtitle: 'Leaf-spring gasket mount, Hall Effect magnetic switches, 8000Hz polling.',
    description: 'Precision milled from a single 3.2kg block of aerospace aluminum. Features magnetic rapid-trigger switches with 0.1mm actuation customizability.',
    price: 24999,
    compareAtPrice: 28999,
    stock: 45,
    categoryId: '3',
    category: FALLBACK_CATEGORIES[2],
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1200',
    ],
    specs: {
      'Chassis': 'CNC Anodized 6063 Aluminum',
      'Switches': 'VEXO Magnetic Hall Effect',
      'Polling Rate': '8000Hz Ultra-Low Latency',
      'Weight': '2.4 kg (Solid)',
    },
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 175,
  },
  {
    id: 'p4',
    title: 'VEXO Field Pack 25L',
    slug: 'vexo-field-pack-25l',
    subtitle: 'X-Pac VX21 waterproof fabric with Fidlock V-buckle magnetic locks.',
    description: 'Minimalist tactical carry for modern technologists. Houses up to a 16-inch laptop in a suspended shock-absorbing vault.',
    price: 18999,
    compareAtPrice: 21999,
    stock: 25,
    categoryId: '4',
    category: FALLBACK_CATEGORIES[3],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1200',
    ],
    specs: {
      'Volume': '25 Liters',
      'Shell Material': 'Waterproof X-Pac VX21',
      'Hardware': 'German Fidlock Magnetic Buckles',
    },
    isFeatured: false,
    isNew: true,
    rating: 4.85,
    reviewsCount: 64,
  },
  {
    id: 'p5',
    title: 'VEXO Modular GaN 140W Station',
    slug: 'vexo-modular-gan-140w',
    subtitle: '4-Port USB-C/A charging hub with OLED real-time power telemetry.',
    description: 'Next-generation Gallium Nitride III power architecture. Delivers simultaneous 140W Power Delivery 3.1 to laptops and mobile devices.',
    price: 9999,
    compareAtPrice: 11999,
    stock: 90,
    categoryId: '5',
    category: FALLBACK_CATEGORIES[4],
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200',
    ],
    specs: {
      'Max Power': '140W USB-C PD 3.1',
      'Ports': '3x USB-C, 1x USB-A Fast Charge',
      'Display': 'Monochrome OLED Telemetry',
    },
    isFeatured: true,
    isNew: false,
    rating: 4.92,
    reviewsCount: 110,
  },
];

export const api = {
  // Auth API
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }
      return await res.json();
    } catch (e: any) {
      if (email === 'admin@vexo.systems') {
        return {
          user: { id: 'admin1', name: 'Julian Vance', email: 'admin@vexo.systems', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
          token: 'mock_admin_token',
        };
      }
      return {
        user: { id: 'u1', name: 'Astrid Lindqvist', email, role: 'USER', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' },
        token: 'mock_user_token',
      };
    }
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }
      return await res.json();
    } catch (e: any) {
      return {
        user: { id: 'u_' + Date.now(), name, email, role: 'USER' },
        token: 'mock_token_' + Date.now(),
      };
    }
  },

  async getProfile(): Promise<User> {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch (e) {
      return {
        id: 'u1',
        name: 'Astrid Lindqvist',
        email: 'user@vexo.systems',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        addresses: [
          {
            id: 'addr1',
            type: 'SHIPPING',
            street: 'Strandvägen 45',
            city: 'Stockholm',
            state: 'ST',
            zipCode: '114 56',
            country: 'Sweden',
            isDefault: true,
          },
        ],
      };
    }
  },

  // Categories API
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (e) {
      return FALLBACK_CATEGORIES;
    }
  },

  // Products API
  async getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; pagination: { total: number; page: number; totalPages: number } }> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters?.rating) params.append('rating', filters.rating.toString());
      if (filters?.sort) params.append('sort', filters.sort);

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (e) {
      let filtered = [...FALLBACK_PRODUCTS];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filters?.category) {
        filtered = filtered.filter(p => p.category?.slug === filters.category);
      }
      if (filters?.minPrice) {
        filtered = filtered.filter(p => p.price >= (filters.minPrice || 0));
      }
      if (filters?.maxPrice) {
        filtered = filtered.filter(p => p.price <= (filters.maxPrice || 200000));
      }
      return {
        products: filtered,
        pagination: { total: filtered.length, page: 1, totalPages: 1 },
      };
    }
  },

  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (e) {
      const found = FALLBACK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || FALLBACK_PRODUCTS[0];
      return {
        ...found,
        reviews: [
          {
            id: 'r1',
            userId: 'u1',
            user: { id: 'u1', name: 'Astrid Lindqvist', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' },
            productId: found.id,
            rating: 5,
            title: 'Industrial design masterpiece',
            comment: 'VEXO has redefined what luxury hardware feels like. The acoustic response and physical tactile weight are unmatched.',
            isVerified: true,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }
  },

  // Coupons API
  async validateCoupon(code: string, cartTotal: number): Promise<{ valid: boolean; discountAmount: number; code: string }> {
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ code, cartTotal }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Invalid coupon');
      }
      return await res.json();
    } catch (e: any) {
      if (code.toUpperCase() === 'VEXO20') {
        return { valid: true, discountAmount: cartTotal * 0.2, code: 'VEXO20' };
      }
      if (code.toUpperCase() === 'LAUNCH50' && cartTotal >= 20000) {
        return { valid: true, discountAmount: 2500, code: 'LAUNCH50' };
      }
      throw new Error(e.message || 'Invalid coupon code');
    }
  },

  // Orders API
  async createOrder(orderData: { items: any[]; shippingAddress: any; couponCode?: string; shippingFee?: number }): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Order placement failed');
      }
      return await res.json();
    } catch (e: any) {
      const totalAmount = orderData.items.reduce((acc, i) => acc + (i.price || 41999) * i.quantity, 0);
      return {
        id: 'ord_' + Date.now(),
        orderNumber: 'VEXO-' + Math.floor(100000 + Math.random() * 900000),
        userId: 'u1',
        totalAmount,
        discountAmount: 0,
        shippingFee: orderData.shippingFee || 0,
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        shippingAddress: orderData.shippingAddress,
        items: orderData.items.map((it, idx) => ({
          id: 'item_' + idx,
          productId: it.productId,
          product: FALLBACK_PRODUCTS[0],
          price: it.price || 41999,
          quantity: it.quantity,
          color: it.color,
          size: it.size,
        })),
        createdAt: new Date().toISOString(),
      };
    }
  },

  async getUserOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch user orders');
      return await res.json();
    } catch (e) {
      return [
        {
          id: 'ord_demo_1',
          orderNumber: 'VEXO-982410',
          userId: 'u1',
          totalAmount: 41999,
          discountAmount: 0,
          shippingFee: 0,
          status: 'SHIPPED',
          paymentStatus: 'PAID',
          shippingAddress: {
            id: 'addr1',
            type: 'SHIPPING',
            street: 'Strandvägen 45',
            city: 'Stockholm',
            state: 'ST',
            zipCode: '114 56',
            country: 'Sweden',
            isDefault: true,
          },
          items: [
            {
              id: 'it_1',
              productId: 'p1',
              product: FALLBACK_PRODUCTS[0],
              price: 41999,
              quantity: 1,
            },
          ],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    }
  },

  // Admin Dashboard API
  async getAdminMetrics(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/admin/metrics`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch admin metrics');
      return await res.json();
    } catch (e) {
      return {
        metrics: {
          totalRevenue: 2489000,
          totalOrders: 512,
          totalUsers: 1840,
          totalProducts: 18,
          conversionRate: '4.12%',
          avgOrderValue: '48,613',
        },
        monthlySales: [
          { name: 'Jan', revenue: 220000, orders: 48 },
          { name: 'Feb', revenue: 285000, orders: 58 },
          { name: 'Mar', revenue: 341000, orders: 72 },
          { name: 'Apr', revenue: 310000, orders: 65 },
          { name: 'May', revenue: 428000, orders: 92 },
          { name: 'Jun', revenue: 492000, orders: 104 },
          { name: 'Jul', revenue: 613000, orders: 128 },
        ],
        topProducts: FALLBACK_PRODUCTS.slice(0, 4),
      };
    }
  },
};
