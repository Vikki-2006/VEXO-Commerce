from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from urllib.parse import quote
from app.database import get_db
from app.models import User, Address
from app.schemas import RegisterSchema, LoginSchema, AddressCreateSchema
from app.middleware.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterSchema, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    if not payload.name or not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_pwd = hash_password(payload.password)
    user = User(
        name=payload.name,
        email=payload.email,
        password=hashed_pwd,
        avatar=f"https://api.dicebear.com/7.x/avataaars/svg?seed={quote(payload.name)}"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"id": user.id, "email": user.email, "role": user.role})
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "avatar": user.avatar,
        },
        "token": token,
    }

@router.post("/login")
def login(payload: LoginSchema, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable")

    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"id": user.id, "email": user.email, "role": user.role})
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "avatar": user.avatar,
        },
        "token": token,
    }

@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    addresses = db.query(Address).filter(Address.userId == current_user.id).all()
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "avatar": current_user.avatar,
        "createdAt": current_user.createdAt,
        "addresses": [
            {
                "id": a.id,
                "userId": a.userId,
                "type": a.type,
                "street": a.street,
                "city": a.city,
                "state": a.state,
                "zipCode": a.zipCode,
                "country": a.country,
                "isDefault": a.isDefault,
                "createdAt": a.createdAt,
            }
            for a in addresses
        ],
    }

@router.put("/profile")
def update_profile(data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if "name" in data:
        current_user.name = data["name"]
    if "avatar" in data:
        current_user.avatar = data["avatar"]
    db.commit()
    db.refresh(current_user)
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "avatar": current_user.avatar,
    }

@router.post("/address", status_code=status.HTTP_201_CREATED)
def add_address(payload: AddressCreateSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.isDefault:
        db.query(Address).filter(Address.userId == current_user.id).update({"isDefault": False})

    addr = Address(
        userId=current_user.id,
        street=payload.street,
        city=payload.city,
        state=payload.state,
        zipCode=payload.zipCode,
        country=payload.country or "United States",
        isDefault=payload.isDefault or False
    )
    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr

@router.delete("/address/{address_id}")
def delete_address(address_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Address).filter(Address.id == address_id, Address.userId == current_user.id).delete()
    db.commit()
    return {"message": "Address deleted successfully"}
