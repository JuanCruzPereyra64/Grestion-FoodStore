from fastapi import APIRouter, Depends, Request
from fastapi.security import HTTPBearer
from sqlmodel import SQLModel, Field

from backend.database import get_uow
from backend.dependencies.limiter import limiter
from backend.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)
from backend.services.auth_service import AuthService
from backend.uow.unit_of_work import UnitOfWork

router = APIRouter(prefix="/auth", tags=["Auth"])
security = HTTPBearer(auto_error=False)


class RefreshRequest(SQLModel):
    refresh_token: str


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/15minutes")
def login(request: Request, data: LoginRequest, uow: UnitOfWork = Depends(get_uow)):
    return AuthService.login(uow, data)


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(data: RegisterRequest, uow: UnitOfWork = Depends(get_uow)):
    return AuthService.register(uow, data)


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, uow: UnitOfWork = Depends(get_uow)):
    return AuthService.refresh(uow, data.refresh_token)


@router.post("/logout", status_code=204)
def logout(data: RefreshRequest, uow: UnitOfWork = Depends(get_uow)):
    AuthService.logout(uow, data.refresh_token)
