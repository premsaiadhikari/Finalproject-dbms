from fastapi import APIRouter
from models.schemas import SigninSchema, SignupSchema

router = APIRouter(prefix="/user")

@router.post("/signup")
async def signup(U: SignupSchema):
    return {
        "code": 200,
        "message": "Signup successful"
    }

@router.post("/signin")
async def signin(U: SigninSchema):
    return {
        "code": 200,
        "message": "Signin successful"
    }