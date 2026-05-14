import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from backend.database import get_uow
from backend.models.usuario import Usuario
from backend.uow.unit_of_work import UnitOfWork

SECRET_KEY = os.getenv("JWT_SECRET", "foodstore-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()


def crear_access_token(usuario_id: int, email: str, roles: list[str]) -> str:
    payload = {
        "sub": str(usuario_id),
        "email": email,
        "roles": roles,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def crear_refresh_token() -> str:
    import uuid
    return str(uuid.uuid4())


def decodificar_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    uow: UnitOfWork = Depends(get_uow),
) -> Usuario:
    payload = decodificar_token(credentials.credentials)
    usuario_id = int(payload["sub"])
    usuario = uow.usuarios.get_by_id(usuario_id)
    if not usuario or usuario.eliminado_en:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o desactivado",
        )
    return usuario


def require_role(roles_permitidos: list[str]):
    async def role_checker(
        current_user: Usuario = Depends(get_current_user),
        uow: UnitOfWork = Depends(get_uow),
    ):
        roles_usuario = uow.usuarios.get_roles(current_user.id)
        if not any(r in roles_permitidos for r in roles_usuario):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tenés permisos para acceder a este recurso",
            )
        return current_user
    return role_checker
