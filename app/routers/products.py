import json
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from app.database import get_db
from app.models import Product, Category, Review, User
from app.schemas import ProductCreateSchema
from app.middleware.auth import require_admin

router = APIRouter(prefix="/api/v1/products", tags=["Products"])

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def format_product(product: Product):
    images = json.loads(product.images) if isinstance(product.images, str) else product.images
    specs = json.loads(product.specs) if isinstance(product.specs, str) else product.specs
    
    category_data = None
    if product.category:
        category_data = {
            "id": product.category.id,
            "name": product.category.name,
            "slug": product.category.slug,
            "description": product.category.description,
            "image": product.category.image,
            "createdAt": product.category.createdAt.isoformat() if product.category.createdAt else None,
        }

    reviews_data = []
    if hasattr(product, 'reviews') and product.reviews:
        for r in product.reviews:
            reviews_data.append({
                "id": r.id,
                "userId": r.userId,
                "productId": r.productId,
                "rating": r.rating,
                "title": r.title,
                "comment": r.comment,
                "isVerified": r.isVerified,
                "createdAt": r.createdAt.isoformat() if r.createdAt else None,
                "user": {
                    "id": r.user.id,
                    "name": r.user.name,
                    "avatar": r.user.avatar
                } if r.user else None
            })

    return {
        "id": product.id,
        "title": product.title,
        "slug": product.slug,
        "subtitle": product.subtitle,
        "description": product.description,
        "price": product.price,
        "compareAtPrice": product.compareAtPrice,
        "stock": product.stock,
        "categoryId": product.categoryId,
        "category": category_data,
        "images": images,
        "specs": specs,
        "isFeatured": product.isFeatured,
        "isNew": product.isNew,
        "rating": product.rating,
        "reviewsCount": product.reviewsCount,
        "reviews": reviews_data,
        "createdAt": product.createdAt.isoformat() if product.createdAt else None,
        "updatedAt": product.updatedAt.isoformat() if product.updatedAt else None,
    }

@router.get("")
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    rating: Optional[float] = None,
    sort: str = "featured",
    page: int = 1,
    limit: int = 12,
    db: Session = Depends(get_db)
):
    products = []
    total = 0

    if db is not None:
        try:
            query = db.query(Product).options(joinedload(Product.category))

            if search:
                term = f"%{search}%"
                query = query.filter(
                    or_(
                        Product.title.ilike(term),
                        Product.description.ilike(term),
                        Product.subtitle.ilike(term)
                    )
                )

            if category:
                query = query.join(Category).filter(Category.slug == category)

            if minPrice is not None:
                query = query.filter(Product.price >= minPrice)
            if maxPrice is not None:
                query = query.filter(Product.price <= maxPrice)

            if rating is not None:
                query = query.filter(Product.rating >= rating)

            if sort == "price-asc":
                query = query.order_by(Product.price.asc())
            elif sort == "price-desc":
                query = query.order_by(Product.price.desc())
            elif sort == "rating":
                query = query.order_by(Product.rating.desc())
            elif sort == "featured":
                query = query.order_by(Product.isFeatured.desc(), Product.createdAt.desc())
            else:
                query = query.order_by(Product.createdAt.desc())

            total = query.count()
            skip = (page - 1) * limit
            products = query.offset(skip).limit(limit).all()
        except Exception as e:
            print(f"[API PRODUCTS WARNING] Database query failed: {e}")

    formatted = []
    if products:
        formatted = [format_product(p) for p in products]
    else:
        from app.fallback_data import get_fallback_products_filtered
        formatted, total = get_fallback_products_filtered(
            search=search,
            category=category,
            minPrice=minPrice,
            maxPrice=maxPrice,
            rating=rating,
            sort=sort,
            page=page,
            limit=limit
        )

    return {
        "products": formatted,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": (total + limit - 1) // limit if limit > 0 else 1,
        }
    }

@router.get("/{slug}")
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = None
    if db is not None:
        try:
            product = db.query(Product).options(
                joinedload(Product.category),
                joinedload(Product.reviews).joinedload(Review.user)
            ).filter(or_(Product.slug == slug, Product.id == slug)).first()
        except Exception as e:
            print(f"[API PRODUCT DETAIL WARNING] Database query failed: {e}")

    if product:
        return format_product(product)

    # Fallback to static data
    from app.fallback_data import FALLBACK_PRODUCTS
    found = [p for p in FALLBACK_PRODUCTS if p["slug"] == slug or p["id"] == slug]
    if found:
        return found[0]

    raise HTTPException(status_code=404, detail="Product not found")

@router.post("", status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreateSchema,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    slug = slugify(payload.title)

    images_str = payload.images if isinstance(payload.images, str) else json.dumps(payload.images)
    specs_str = payload.specs if isinstance(payload.specs, str) else json.dumps(payload.specs or {})

    product = Product(
        title=payload.title,
        slug=slug,
        subtitle=payload.subtitle,
        description=payload.description,
        price=float(payload.price),
        compareAtPrice=float(payload.compareAtPrice) if payload.compareAtPrice else None,
        stock=int(payload.stock),
        categoryId=payload.categoryId,
        images=images_str,
        specs=specs_str,
        isFeatured=bool(payload.isFeatured),
        isNew=bool(payload.isNew)
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return format_product(product)

@router.put("/{product_id}")
def update_product(
    product_id: str,
    data: dict,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, val in data.items():
        if key in ["price", "compareAtPrice"] and val is not None:
            setattr(product, key, float(val))
        elif key == "stock" and val is not None:
            setattr(product, key, int(val))
        elif key in ["images", "specs"]:
            setattr(product, key, val if isinstance(val, str) else json.dumps(val))
        elif hasattr(product, key):
            setattr(product, key, val)

    db.commit()
    db.refresh(product)
    return format_product(product)

@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
