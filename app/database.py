import os
import shutil
from typing import Optional
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL
engine = None
SessionLocal = None

if db_url:
    connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
    try:
        temp_engine = create_engine(
            db_url,
            connect_args=connect_args,
            pool_pre_ping=True
        )
        with temp_engine.connect() as conn:
            pass
        engine = temp_engine
    except Exception as e:
        print(f"[DATABASE WARNING] Could not connect to primary database '{db_url}': {e}")
        if settings.ENVIRONMENT != "production":
            print("[DATABASE] Falling back to SQLite database ('sqlite:///./vexo.db')...")
            try:
                engine = create_engine(
                    "sqlite:///./vexo.db",
                    connect_args={"check_same_thread": False},
                    pool_pre_ping=True
                )
            except Exception as se:
                print(f"[DATABASE WARNING] SQLite fallback failed: {se}")
                engine = None
        else:
            engine = None
else:
    # No DATABASE_URL configured (e.g. showcase deployment on Vercel)
    # Check if bundled vexo.db exists
    bundled_db = os.path.join(os.path.dirname(os.path.dirname(__file__)), "vexo.db")
    if not os.path.exists(bundled_db) and os.path.exists("vexo.db"):
        bundled_db = "vexo.db"

    if os.path.exists(bundled_db):
        try:
            # Copy to writable /tmp directory for serverless environments
            tmp_db_path = "/tmp/vexo.db"
            if not os.path.exists(tmp_db_path):
                os.makedirs("/tmp", exist_ok=True)
                shutil.copy2(bundled_db, tmp_db_path)
            engine = create_engine(
                f"sqlite:///{tmp_db_path}",
                connect_args={"check_same_thread": False},
                pool_pre_ping=True
            )
            print(f"[DATABASE] Showcase SQLite database loaded from {tmp_db_path}")
        except Exception as e:
            print(f"[DATABASE WARNING] Could not load showcase SQLite database: {e}")
            engine = None
    else:
        print("[DATABASE] No DATABASE_URL configured and no vexo.db found. Running in showcase mode without persistent database.")

if engine is not None:
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    if SessionLocal is None:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
