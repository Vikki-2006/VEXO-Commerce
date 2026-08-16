from typing import Optional
from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Product, Category
from app.routers.products import format_product

router = APIRouter(tags=["Frontend Views"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
def view_home(request: Request, db: Session = Depends(get_db)):
    featured_products = []
    categories = []

    if db is not None:
        try:
            featured_products_raw = db.query(Product).options(joinedload(Product.category)).filter(Product.isFeatured == True).limit(8).all()
            featured_products = [format_product(p) for p in featured_products_raw]

            categories_raw = db.query(Category).options(joinedload(Category.products)).all()
            for c in categories_raw:
                categories.append({
                    "id": c.id,
                    "name": c.name,
                    "slug": c.slug,
                    "description": c.description,
                    "image": c.image,
                    "_count": {"products": len(c.products)}
                })
        except Exception as e:
            print(f"[PAGE VIEW WARNING] Database query failed in view_home: {e}")

    # Fallback to static showcase data if empty/unavailable
    if not featured_products:
        from app.fallback_data import FALLBACK_PRODUCTS
        featured_products = [p for p in FALLBACK_PRODUCTS if p.get("isFeatured")][:8]

    if not categories:
        from app.fallback_data import FALLBACK_CATEGORIES
        categories = FALLBACK_CATEGORIES

    return templates.TemplateResponse(
        request=request,
        name="home.html",
        context={
            "featured_products": featured_products,
            "categories": categories
        }
    )

@router.get("/shop", response_class=HTMLResponse)
def view_shop(
    request: Request,
    search: Optional[str] = None,
    category: Optional[str] = None,
    maxPrice: Optional[float] = None,
    rating: Optional[float] = None,
    sort: str = "featured",
    page: int = 1,
    db: Session = Depends(get_db)
):
    products = []
    categories_raw = []
    total = 0
    limit = 12

    if db is not None:
        try:
            query = db.query(Product).options(joinedload(Product.category))

            if search:
                term = f"%{search}%"
                query = query.filter(Product.title.ilike(term) | Product.description.ilike(term))
            if category:
                query = query.join(Category).filter(Category.slug == category)
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
            else:
                query = query.order_by(Product.isFeatured.desc(), Product.createdAt.desc())

            total = query.count()
            skip = (page - 1) * limit
            products_raw = query.offset(skip).limit(limit).all()
            products = [format_product(p) for p in products_raw]
            categories_raw = db.query(Category).all()
        except Exception as e:
            print(f"[PAGE VIEW WARNING] Database query failed in view_shop: {e}")

    # Fallback to static showcase data if empty/unavailable
    if not products:
        from app.fallback_data import get_fallback_products_filtered
        products, total = get_fallback_products_filtered(
            search=search,
            category=category,
            maxPrice=maxPrice,
            rating=rating,
            sort=sort,
            page=page,
            limit=limit
        )

    if not categories_raw:
        from app.fallback_data import FALLBACK_CATEGORIES
        categories_raw = FALLBACK_CATEGORIES

    return templates.TemplateResponse(
        request=request,
        name="shop.html",
        context={
            "products": products,
            "categories": categories_raw,
            "search": search,
            "category": category,
            "maxPrice": maxPrice,
            "rating": rating,
            "sort": sort,
            "pagination": {
                "total": total,
                "page": page,
                "totalPages": (total + limit - 1) // limit if limit > 0 else 1
            }
        }
    )

@router.get("/product/{slug}", response_class=HTMLResponse)
def view_product_detail(request: Request, slug: str, db: Session = Depends(get_db)):
    product = None
    related_products = []

    if db is not None:
        try:
            product_raw = db.query(Product).options(
                joinedload(Product.category),
                joinedload(Product.reviews)
            ).filter((Product.slug == slug) | (Product.id == slug)).first()

            if product_raw:
                product = format_product(product_raw)
                
                # Query related products (frequently bought together)
                related_raw = db.query(Product).options(joinedload(Product.category)).filter(
                    Product.categoryId == product_raw.categoryId,
                    Product.id != product_raw.id
                ).limit(5).all()
                related_products = [format_product(p) for p in related_raw]
        except Exception as e:
            print(f"[PAGE VIEW WARNING] Database query failed in view_product_detail: {e}")

    # Fallback to static showcase data if empty/unavailable
    if not product:
        from app.fallback_data import FALLBACK_PRODUCTS
        found = [p for p in FALLBACK_PRODUCTS if p["slug"] == slug or p["id"] == slug]
        if found:
            product = found[0]
            related_products = [p for p in FALLBACK_PRODUCTS if p["categoryId"] == product["categoryId"] and p["id"] != product["id"]][:5]
        else:
            return templates.TemplateResponse(request=request, name="errors/404.html", status_code=404)

    return templates.TemplateResponse(
        request=request,
        name="product_detail.html",
        context={
            "product": product,
            "related_products": related_products
        }
    )

@router.get("/categories", response_class=HTMLResponse)
def view_categories(request: Request, db: Session = Depends(get_db)):
    categories = []

    if db is not None:
        try:
            categories_raw = db.query(Category).options(joinedload(Category.products)).all()
            for c in categories_raw:
                categories.append({
                    "id": c.id,
                    "name": c.name,
                    "slug": c.slug,
                    "description": c.description,
                    "image": c.image,
                    "_count": {"products": len(c.products)}
                })
        except Exception as e:
            print(f"[PAGE VIEW WARNING] Database query failed in view_categories: {e}")

    # Fallback to static showcase data if empty/unavailable
    if not categories:
        from app.fallback_data import FALLBACK_CATEGORIES
        categories = FALLBACK_CATEGORIES

    return templates.TemplateResponse(
        request=request,
        name="categories.html",
        context={"categories": categories}
    )

@router.get("/compare", response_class=HTMLResponse)
def view_compare(request: Request):
    return templates.TemplateResponse(request=request, name="compare.html")
