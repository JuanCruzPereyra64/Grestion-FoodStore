from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class LoginRequest(SQLModel):
    email: str = Field(max_length=200)
    password: str = Field(min_length=1)


class RegisterRequest(SQLModel):
    nombre: str = Field(min_length=2, max_length=200)
    email: str = Field(max_length=200)
    password: str = Field(min_length=6)


class UserResponse(SQLModel):
    id: int
    nombre: str
    email: str
    telefono: Optional[str] = None
    roles: list[str]


class TokenResponse(SQLModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    user: UserResponse
