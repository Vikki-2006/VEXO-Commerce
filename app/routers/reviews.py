from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Review, Product, User
from app.schemas import ReviewCreateSchema
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews"])

@router.post("", status_code=status.HTTP_201_CREATED)
def add_review(
    payload: ReviewCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    if not payload.productId or not payload.rating or not payload.comment:
        raise HTTPException(status_code=400, detail="Product ID, rating, and comment are required")

    review = Review(
        userId=current_user.id,
        productId=payload.productId,
        rating=int(payload.rating),
        title=payload.title,
        comment=payload.comment,
        isVerified=True
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Recalculate average rating & reviewsCount for Product
    all_reviews = db.query(Review).filter(Review.productId == payload.productId).all()
    avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 5.0

    product = db.query(Product).filter(Product.id == payload.productId).first()
    if product:
        product.rating = round(avg_rating, 1)
        product.reviewsCount = len(all_reviews)
        db.commit()

    return {
        "id": review.id,
        "userId": review.userId,
        "productId": review.productId,
        "rating": review.rating,
        "title": review.title,
        "comment": review.comment,
        "isVerified": review.isVerified,
        "createdAt": review.createdAt.isoformat() if review.createdAt else None,
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "avatar": current_user.avatar
        }
    }

@router.get("/product/{product_id}")
def get_product_reviews(product_id: str, db: Session = Depends(get_db)):
    if db is None:
        return []

    reviews = db.query(Review).options(joinedload(Review.user)).filter(Review.productId == product_id).order_by(Review.createdAt.desc()).all()
    return [
        {
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
        }
        for r in reviews
    ]
