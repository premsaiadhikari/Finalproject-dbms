from fastapi import APIRouter
from models.schemas import SigninSchema, SignupSchema, TokenResponse
from datetime import datetime, timedelta
import jwt

router = APIRouter(prefix="/user")

# Secret key for JWT - change this in production
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

def create_jwt_token(data: dict, expires_in_hours: int = 24) -> str:
    """Generate JWT token"""
    payload = data.copy()
    payload["iat"] = datetime.utcnow()
    payload["exp"] = datetime.utcnow() + timedelta(hours=expires_in_hours)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.post("/signup", response_model=TokenResponse)
async def signup(U: SignupSchema):
    # Generate JWT token
    token = create_jwt_token({"sub": U.email, "fullname": U.fullname})
    return {
        "code": 200,
        "message": "Signup successful",
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/signin", response_model=TokenResponse)
async def signin(U: SigninSchema):
    # Generate JWT token
    token = create_jwt_token({"sub": U.username})
    return {
        "code": 200,
        "message": "Signin successful",
        "access_token": token,
        "token_type": "bearer"
    }