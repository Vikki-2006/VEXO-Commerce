# VEXO Systems — Luxury Hardware & E-Commerce Platform

A production-grade luxury hardware and planar acoustics e-commerce platform built with a **React 19 + TypeScript** frontend and a **Python FastAPI** backend powered by **PostgreSQL**, **SQLAlchemy ORM**, and **Alembic** migrations.

---

## 🏛️ Project Structure

```
E-Commerce website/
├── client/                         # React 19 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/             # UI components (common, product, ui)
│   │   ├── pages/                  # Route pages
│   │   ├── services/api.ts         # API client (targets port 5000)
│   │   ├── store/                  # Zustand state stores
│   │   └── types/                  # TypeScript type definitions
│   ├── package.json
│   └── vite.config.ts
│
└── server/                         # Python FastAPI backend
    ├── app/
    │   ├── main.py                 # FastAPI app instance, routers, CORS, lifespan
    │   ├── config.py               # Settings (DATABASE_URL, JWT_SECRET)
    │   ├── database.py             # SQLAlchemy engine, SessionLocal, Base
    │   ├── models.py               # SQLAlchemy ORM models
    │   ├── schemas.py              # Pydantic request/response schemas
    │   ├── seed.py                 # Database seeder (admin, products, coupons)
    │   ├── middleware/
    │   │   └── auth.py             # JWT utils, get_current_user, require_admin
    │   └── routers/
    │       ├── auth.py             # /api/v1/auth/*
    │       ├── products.py         # /api/v1/products/*
    │       ├── categories.py       # /api/v1/categories/*
    │       ├── orders.py           # /api/v1/orders/*
    │       ├── reviews.py          # /api/v1/reviews/*
    │       ├── coupons.py          # /api/v1/coupons/*
    │       ├── admin.py            # /api/v1/admin/*
    │       └── telemetry.py        # /api/v1/health, /api/v1/telemetry
    ├── alembic/                    # Alembic database migrations
    │   ├── env.py
    │   ├── script.py.mako
    │   └── versions/
    │       └── 001_initial_migration.py
    ├── uploads/                    # Static file storage for product images
    ├── alembic.ini                 # Alembic configuration
    ├── main.py                     # Uvicorn entry point (port 5000)
    ├── requirements.txt            # Python dependencies
    ├── .env                        # Environment variables
    └── vexo.db                     # SQLite fallback (auto-used if no PostgreSQL)
```

---

## 🚀 Quick Start

### Backend (FastAPI + PostgreSQL)

```bash
cd server

# Install Python dependencies
pip install -r requirements.txt

# Configure environment (optional — defaults to local PostgreSQL)
# Edit .env:  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vexo_db

# Apply schema migrations to PostgreSQL
alembic upgrade head

# Seed initial data (admin, products, categories, coupons)
python -m app.seed

# Start the FastAPI server on port 5000
python main.py
```

> **No PostgreSQL?** The backend automatically falls back to `vexo.db` (SQLite) — no configuration needed for local development.

### Frontend (React 19 + TypeScript)

```bash
cd client
npm install
npm run dev     # http://localhost:5173
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@vexo.systems` | `admin123` |
| Customer | `user@vexo.systems` | `user123` |

**Coupons:**
- `VEXO20` — 20% off orders over ₹10,000
- `LAUNCH50` — ₹2,500 off orders over ₹20,000

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | — | Developer telemetry dashboard |
| `GET` | `/docs` | — | Swagger interactive UI |
| `GET` | `/redoc` | — | ReDoc API reference |
| `GET` | `/api/v1/health` | — | Health check |
| `GET` | `/api/v1/telemetry` | — | Memory, uptime, DB status |
| `POST` | `/api/v1/auth/register` | — | Customer registration |
| `POST` | `/api/v1/auth/login` | — | JWT authentication |
| `GET` | `/api/v1/auth/profile` | Bearer | Current user profile |
| `PUT` | `/api/v1/auth/profile` | Bearer | Update profile |
| `POST` | `/api/v1/auth/address` | Bearer | Add shipping address |
| `DELETE` | `/api/v1/auth/address/{id}` | Bearer | Delete address |
| `GET` | `/api/v1/products` | — | Filterable catalog |
| `GET` | `/api/v1/products/{slug}` | — | Product detail |
| `POST` | `/api/v1/products` | Admin | Create product |
| `PUT` | `/api/v1/products/{id}` | Admin | Update product |
| `DELETE` | `/api/v1/products/{id}` | Admin | Delete product |
| `GET` | `/api/v1/categories` | — | All categories |
| `POST` | `/api/v1/categories` | Admin | Create category |
| `PUT` | `/api/v1/categories/{id}` | Admin | Update category |
| `DELETE` | `/api/v1/categories/{id}` | Admin | Delete category |
| `POST` | `/api/v1/orders` | Bearer | Create order |
| `GET` | `/api/v1/orders/my-orders` | Bearer | User order history |
| `GET` | `/api/v1/orders/{id}` | Bearer | Order detail |
| `GET` | `/api/v1/orders/admin/all` | Admin | All orders |
| `PATCH` | `/api/v1/orders/admin/{id}/status` | Admin | Update order status |
| `POST` | `/api/v1/reviews` | Bearer | Post review |
| `GET` | `/api/v1/reviews/product/{id}` | — | Product reviews |
| `POST` | `/api/v1/coupons/validate` | — | Validate coupon |
| `GET` | `/api/v1/coupons` | Admin | All coupons |
| `POST` | `/api/v1/coupons` | Admin | Create coupon |
| `DELETE` | `/api/v1/coupons/{id}` | Admin | Delete coupon |
| `GET` | `/api/v1/admin/metrics` | Admin | Revenue & analytics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4, Framer Motion, Zustand |
| **Backend** | Python FastAPI, Uvicorn, Pydantic v2 |
| **ORM** | SQLAlchemy 2.0 |
| **Migrations** | Alembic |
| **Database** | PostgreSQL (primary) / SQLite (dev fallback) |
| **Auth** | JWT (PyJWT), bcrypt |
| **API Docs** | Auto-generated OpenAPI 3.0 / Swagger |

---

## 📜 Alembic Migration Commands

```bash
# Apply all pending migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# Auto-generate a new migration from model changes
alembic revision --autogenerate -m "describe_change"

# View migration history
alembic history
```

---

© 2026 VEXO Systems. All rights reserved.
