import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.database import engine, Base, SessionLocal
from app.seed import seed_db
from app.models import User
from app.routers import auth, products, categories, orders, reviews, coupons, admin, telemetry
from app.views import pages, auth_views, account_views, cart_views, admin_views

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed database if empty
    db: Session = SessionLocal()
    try:
        if db.query(User).count() == 0:
            seed_db()
    except Exception as e:
        print(f"Seed warning: {e}")
    finally:
        db.close()
        
    yield

app = FastAPI(
    title="VEXO Luxury E-Commerce Platform",
    description="Python Full Stack E-Commerce Platform built with FastAPI, Jinja2, PostgreSQL, SQLAlchemy 2.0, Alembic, HTML5, CSS3, and Vanilla JavaScript.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request counter telemetry middleware
@app.middleware("http")
async def count_requests(request: Request, call_next):
    telemetry.increment_request_counter()
    response = await call_next(request)
    return response

# Serve static files & uploads
app.mount("/static", StaticFiles(directory="app/static"), name="static")

uploads_dir = os.path.join(os.path.dirname(__file__), "../uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include HTML Frontend Views
app.include_router(pages.router)
app.include_router(auth_views.router)
app.include_router(account_views.router)
app.include_router(cart_views.router)
app.include_router(admin_views.router)

# Include REST API Routers
app.include_router(telemetry.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(reviews.router)
app.include_router(coupons.router)
app.include_router(admin.router)

templates = Jinja2Templates(directory="app/templates")

# Custom Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    accept = request.headers.get("accept", "")
    if "text/html" in accept and not request.url.path.startswith("/api/"):
        return templates.TemplateResponse(request=request, name="errors/404.html", status_code=exc.status_code)
    return JSONResponse(status_code=exc.status_code, content={"message": exc.detail})

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    accept = request.headers.get("accept", "")
    if "text/html" in accept and not request.url.path.startswith("/api/"):
        return templates.TemplateResponse(request=request, name="errors/404.html", status_code=404)
    return JSONResponse(status_code=404, content={"success": False, "message": "API route not found"})
