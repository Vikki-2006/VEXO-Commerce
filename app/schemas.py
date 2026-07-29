from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime

# Auth Schemas
class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str

class LoginSchema(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    createdAt: Optional[datetime] = None
    addresses: Optional[List[Any]] = []

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    user: UserResponse
    token: str

# Address Schemas
class AddressCreateSchema(BaseModel):
    street: str
    city: str
    state: str
    zipCode: str
    country: Optional[str] = "United States"
    isDefault: Optional[bool] = False

class AddressResponse(BaseModel):
    id: str
    userId: str
    type: str
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    isDefault: bool
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)

# Category Schemas
class CategoryCreateSchema(BaseModel):
    name: str
    description: Optional[str] = None
    image: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    createdAt: datetime
    _count: Optional[Dict[str, int]] = None

    model_config = ConfigDict(from_attributes=True)

# Product Schemas
class ProductCreateSchema(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: str
    price: float
    compareAtPrice: Optional[float] = None
    stock: int = 100
    categoryId: str
    images: Any
    specs: Any
    isFeatured: Optional[bool] = False
    isNew: Optional[bool] = True

class ProductResponse(BaseModel):
    id: str
    title: str
    slug: str
    subtitle: Optional[str] = None
    description: str
    price: float
    compareAtPrice: Optional[float] = None
    stock: int
    categoryId: str
    category: Optional[CategoryResponse] = None
    images: Any
    specs: Any
    isFeatured: bool
    isNew: bool
    rating: float
    reviewsCount: int
    reviews: Optional[List[Any]] = []

    model_config = ConfigDict(from_attributes=True)

# Review Schemas
class ReviewCreateSchema(BaseModel):
    productId: str
    rating: int
    title: Optional[str] = None
    comment: str

class ReviewResponse(BaseModel):
    id: str
    userId: str
    productId: str
    rating: int
    title: Optional[str] = None
    comment: str
    isVerified: bool
    createdAt: datetime
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

# Order Schemas
class OrderItemCreateSchema(BaseModel):
    productId: str
    quantity: int = 1
    price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None

class OrderCreateSchema(BaseModel):
    items: List[OrderItemCreateSchema]
    shippingAddress: Any
    couponCode: Optional[str] = None
    shippingFee: Optional[float] = 0.0

# Coupon Schemas
class CouponValidateSchema(BaseModel):
    code: str
    cartTotal: float = 0.0

class CouponCreateSchema(BaseModel):
    code: str
    discountType: str = "PERCENTAGE"
    discountValue: float
    minOrderValue: Optional[float] = 0.0
    maxUses: Optional[int] = 1000
    expiresAt: Optional[datetime] = None
