from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Coupon, User
from app.schemas import CouponValidateSchema, CouponCreateSchema
from app.middleware.auth import require_admin

router = APIRouter(prefix="/api/v1/coupons", tags=["Coupons"])

@router.post("/validate")
def validate_coupon(payload: CouponValidateSchema, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=404, detail="Invalid or inactive coupon code")

    if not payload.code:
        raise HTTPException(status_code=400, detail="Coupon code required")

    coupon = db.query(Coupon).filter(Coupon.code == payload.code.upper()).first()
    if not coupon or not coupon.isActive:
        raise HTTPException(status_code=404, detail="Invalid or inactive coupon code")

    if coupon.expiresAt:
        expires_at = coupon.expiresAt.replace(tzinfo=timezone.utc) if coupon.expiresAt.tzinfo is None else coupon.expiresAt
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Coupon code has expired")

    if payload.cartTotal < coupon.minOrderValue:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order value of ₹{coupon.minOrderValue} required for this coupon"
        )

    discount_amount = 0.0
    if coupon.discountType == "PERCENTAGE":
        discount_amount = (payload.cartTotal * coupon.discountValue) / 100.0
    else:
        discount_amount = coupon.discountValue

    return {
        "valid": True,
        "code": coupon.code,
        "discountType": coupon.discountType,
        "discountValue": coupon.discountValue,
        "discountAmount": discount_amount,
    }

@router.get("")
def get_coupons(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    if db is None:
        return []
    return db.query(Coupon).order_by(Coupon.createdAt.desc()).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def create_coupon(
    payload: CouponCreateSchema,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    coupon = Coupon(
        code=payload.code.upper(),
        discountType=payload.discountType or "PERCENTAGE",
        discountValue=float(payload.discountValue),
        minOrderValue=float(payload.minOrderValue or 0.0),
        maxUses=int(payload.maxUses or 1000),
        expiresAt=payload.expiresAt
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon

@router.delete("/{coupon_id}")
def delete_coupon(coupon_id: str, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")

    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted successfully"}
