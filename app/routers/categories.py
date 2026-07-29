import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Category, Product, User
from app.schemas import CategoryCreateSchema
from app.middleware.auth import require_admin

router = APIRouter(prefix="/api/v1/categories", tags=["Categories"])

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

@router.get("")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).options(joinedload(Category.products)).all()
    result = []
    for c in categories:
        result.append({
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "image": c.image,
            "createdAt": c.createdAt.isoformat() if c.createdAt else None,
            "_count": {"products": len(c.products)},
        })
    return result

@router.post("", status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreateSchema,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    slug = slugify(payload.name)
    category = Category(
        name=payload.name,
        slug=slug,
        description=payload.description,
        image=payload.image
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/{category_id}")
def update_category(
    category_id: str,
    data: dict,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if "name" in data and data["name"]:
        category.name = data["name"]
        category.slug = slugify(data["name"])
    if "description" in data:
        category.description = data["description"]
    if "image" in data:
        category.image = data["image"]

    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}")
def delete_category(
    category_id: str,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}
