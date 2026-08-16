import os
from typing import Optional
from dotenv import load_dotenv
load_dotenv()

class Settings:
    PROJECT_NAME: str = "VEXO Luxury E-Commerce Platform"
    VERSION: str = "2.0.0"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "vexo_super_secret_jwt_key_2026_secure!!")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    CORS_ORIGINS: list = ["*"]
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

settings = Settings()
