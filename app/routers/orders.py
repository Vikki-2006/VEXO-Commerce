import json
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Order, OrderItem, Product, Coupon, User
from app.schemas import OrderCreateSchema
from app.middleware.auth import get_current_user, require_admin
from app.routers.products import format_product

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])

def format_order(order: Order):
    shipping = json.loads(order.shippingAddress) if isinstance(order.shippingAddress, str) else order.shippingAddress

    items_data = []
    for it in order.items:
        items_data.append({
            "id": it.id,
            "orderId": it.orderId,
            "productId": it.productId,
            "product": format_product(it.product) if it.product else None,
            "price": it.price,
            "quantity": it.quantity,
            "color": it.color,
            "size": it.size,
        })

    user_data = None
    if hasattr(order, 'user') and order.user:
        user_data = {
            "id": order.user.id,
            "name": order.user.name,
            "email": order.user.email,
            "avatar": order.user.avatar,
        }

    return {
        "id": order.id,
        "orderNumber": order.orderNumber,
        "userId": order.userId,
        "user": user_data,
        "totalAmount": order.totalAmount,
        "discountAmount": order.discountAmount,
        "shippingFee": order.shippingFee,
        "status": order.status,
        "paymentStatus": order.paymentStatus,
        "shippingAddress": shipping,
        "items": items_data,
        "createdAt": order.createdAt.isoformat() if order.createdAt else None,
        "updatedAt": order.updatedAt.isoformat() if order.updatedAt else None,
    }

@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreateSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    if not payload.items or len(payload.items) == 0:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    subtotal = 0.0
    items_to_create = []

    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.productId).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.productId} not found")

        item_total = product.price * item.quantity
        subtotal += item_total

        items_to_create.append({
            "product_obj": product,
            "price": product.price,
            "quantity": item.quantity,
            "color": item.color,
            "size": item.size,
        })

    discount_amount = 0.0
    coupon = None
    if payload.couponCode:
        coupon = db.query(Coupon).filter(Coupon.code == payload.couponCode.upper()).first()
        if coupon and coupon.isActive:
            if coupon.discountType == "PERCENTAGE":
                discount_amount = (subtotal * coupon.discountValue) / 100.0
            else:
                discount_amount = coupon.discountValue
            coupon.usedCount += 1

    shipping_fee = 0.0 if subtotal >= 15000 else 1500.0
    total_amount = max(0.0, subtotal - discount_amount + shipping_fee)

    order_num = f"ORD-{int(datetime.now(timezone.utc).timestamp())}-{uuid.uuid4().hex[:6].upper()}"

    shipping_address_str = payload.shippingAddress if isinstance(payload.shippingAddress, str) else json.dumps(payload.shippingAddress)

    order = Order(
        orderNumber=order_num,
        userId=current_user.id,
        totalAmount=total_amount,
        discountAmount=discount_amount,
        shippingFee=shipping_fee,
        shippingAddress=shipping_address_str,
        status="CONFIRMED",
        paymentStatus="PAID",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item_data in items_to_create:
        order_item = OrderItem(
            orderId=order.id,
            productId=item_data["product_obj"].id,
            price=item_data["price"],
            quantity=item_data["quantity"],
            color=item_data["color"],
            size=item_data["size"]
        )
        db.add(order_item)

        # Decrement stock
        item_data["product_obj"].stock = max(0, item_data["product_obj"].stock - item_data["quantity"])

    db.commit()

    full_order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order.id).first()

    return format_order(full_order)

@router.get("/my-orders")
def get_user_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if db is None:
        return []

    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.userId == current_user.id).order_by(Order.createdAt.desc()).all()

    return [format_order(o) for o in orders]

@router.get("/admin/all")
@router.get("/all")
def get_all_orders(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    if db is None:
        return []

    orders = db.query(Order).options(
        joinedload(Order.user),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).order_by(Order.createdAt.desc()).all()

    return [format_order(o) for o in orders]

@router.get("/{order_id}")
def get_order_by_id(order_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=404, detail="Order not found")

    order = db.query(Order).options(
        joinedload(Order.user),
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return format_order(order)

@router.put("/admin/{order_id}/status")
@router.patch("/admin/{order_id}/status")
@router.put("/{order_id}/status")
@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    data: dict,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if "status" in data:
        order.status = data["status"]
        db.commit()
        db.refresh(order)

    return format_order(order)
