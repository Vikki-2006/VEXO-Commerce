export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  createdAt?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  userId?: string;
  type: 'SHIPPING' | 'BILLING';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  categoryId: string;
  category?: Category;
  images: string[];
  specs: Record<string, string>;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  createdAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  shippingAddress: Address;
  items: OrderItem[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

export interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  inStockOnly: boolean;
}
