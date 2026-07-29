import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="USER")  # USER, ADMIN
    avatar = Column(String, nullable=True)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    wishlist = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")

class Address(Base):
    __tablename__ = "addresses"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, default="SHIPPING")  # SHIPPING, BILLING
    street = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zipCode = Column(String, nullable=False)
    country = Column(String, default="United States")
    isDefault = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="addresses")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    subtitle = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    compareAtPrice = Column(Float, nullable=True)
    stock = Column(Integer, default=100)
    categoryId = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    images = Column(Text, nullable=False)  # JSON string
    specs = Column(Text, nullable=False)   # JSON string
    isFeatured = Column(Boolean, default=False)
    isNew = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)
    reviewsCount = Column(Integer, default=0)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    orderItems = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")
    wishlistItems = relationship("WishlistItem", back_populates="product", cascade="all, delete-orphan")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    title = Column(String, nullable=True)
    comment = Column(Text, nullable=False)
    isVerified = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=generate_uuid)
    orderNumber = Column(String, unique=True, index=True, nullable=False)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    totalAmount = Column(Float, nullable=False)
    discountAmount = Column(Float, default=0.0)
    shippingFee = Column(Float, default=0.0)
    status = Column(String, default="PROCESSING")  # PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    paymentStatus = Column(String, default="PAID")  # PAID, PENDING, FAILED
    shippingAddress = Column(Text, nullable=False)  # JSON string
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updatedAt = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    orderId = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    color = Column(String, nullable=True)
    size = Column(String, nullable=True)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="orderItems")

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(String, unique=True, index=True, nullable=False)
    discountType = Column(String, default="PERCENTAGE")  # PERCENTAGE, FIXED
    discountValue = Column(Float, nullable=False)
    minOrderValue = Column(Float, default=0.0)
    maxUses = Column(Integer, default=1000)
    usedCount = Column(Integer, default=0)
    expiresAt = Column(DateTime, nullable=True)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    userId = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    createdAt = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="wishlist")
    product = relationship("Product", back_populates="wishlistItems")

    __table_args__ = (UniqueConstraint('userId', 'productId', name='_user_product_uc'),)
