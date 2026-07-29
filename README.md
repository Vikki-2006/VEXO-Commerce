# VEXO Systems — Python Full Stack E-Commerce Platform

A 100% Python Full Stack E-Commerce Platform built with **FastAPI**, **Jinja2**, **PostgreSQL**, **SQLAlchemy 2.0**, **Alembic**, **HTML5**, **CSS3**, and **Vanilla JavaScript**.

---

## 🏛 Architecture Overview

VEXO Systems is architected as a pure Python application serving both server-rendered Jinja2 HTML templates and REST API endpoints.

```
project/
│
├── app/
│   ├── routers/       # REST API Endpoints (/api/v1/...)
│   ├── views/         # Jinja2 Template View Controllers
│   ├── models/        # SQLAlchemy 2.0 ORM Models
│   ├── schemas/       # Pydantic Schemas
│   ├── middleware/    # JWT Authentication & Telemetry Middleware
│   ├── templates/     # Jinja2 HTML Templates
│   ├── static/        # CSS, Vanilla JS, and Image Assets
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   ├── database.py    # Database Session & Fallback Configuration
│   ├── seed.py        # Automated Database Seeding Engine
│   └── main.py        # Main FastAPI Application Initialization
│
├── alembic/           # Database Migration Scripts
├── alembic.ini        # Alembic Configuration
├── main.py            # Application Server Entrypoint
├── requirements.txt   # Python Dependencies
├── README.md          # Project Documentation
└── .env.example       # Environment Variable Template
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.13+ installed
- PostgreSQL (optional — automatic SQLite fallback included for local development)

### 2. Installation
Clone the repository and set up a virtual environment:

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and set your credentials:

```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
The database tables and seed data (products, categories, demo users) are generated automatically on startup.

To manage migrations via Alembic:

```bash
alembic upgrade head
```

### 5. Running the Application

```bash
python main.py
# OR
uvicorn app.main:app --reload --port 5000
```

Open your browser at:
- **Web Application**: `http://localhost:5000`
- **Interactive OpenAPI Documentation**: `http://localhost:5000/docs`

---

## 👤 Demo Access Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Administrator** | `admin@vexo.systems` | `admin123` | Full Admin Dashboard & Device Control |
| **Customer** | `user@vexo.systems` | `user123` | Full Checkout & Dispatch Telemetry |

---

## 💻 Tech Stack Summary

- **Backend Framework**: FastAPI
- **Templating Engine**: Jinja2
- **Database ORM**: SQLAlchemy 2.0
- **Database Migrations**: Alembic
- **Primary Database**: PostgreSQL (SQLite fallback)
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Frontend Styling**: HTML5, CSS3, Tailwind CSS (via CDN)
- **Frontend Scripting**: Vanilla JavaScript
