from pydantic import BaseModel
from typing import Optional

class SignupSchema(BaseModel):
    fullname: str
    phone: str
    email: str
    password: str

class SigninSchema(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    code: int
    message: str
    access_token: str
    token_type: str = "bearer"