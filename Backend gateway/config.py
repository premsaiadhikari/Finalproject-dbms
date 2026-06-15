import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application Configuration"""
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    TOKEN_EXPIRE_HOURS = int(os.getenv("TOKEN_EXPIRE_HOURS", "24"))
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    
    class Settings:
        title = "DBMS Final Project API"
        description = "Backend API for Database Management System"
        version = "1.0.0"

config = Config()
