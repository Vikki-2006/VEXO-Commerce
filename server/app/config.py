import os

class Settings:
    PROJECT_NAME: str = "VEXO Luxury E-Commerce API"
    VERSION: str = "1.0.0"
    # Must be >= 32 bytes for HS256 — override via JWT_SECRET env var in production
    SECRET_KEY: str = os.getenv("JWT_SECRET", "vexo_super_secret_jwt_key_2026_secure!!")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/vexo_db")
    CORS_ORIGINS: list = ["*"]

settings = Settings()
