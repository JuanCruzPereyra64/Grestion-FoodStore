from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlmodel import select

from backend.dependencies.auth import (
    REFRESH_TOKEN_EXPIRE_DAYS,
    crear_access_token,
    crear_refresh_token,
    decodificar_token,
)
from backend.models.refresh_token import RefreshToken
from backend.models.usuario import Rol, Usuario, UsuarioRol
from backend.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from backend.uow.unit_of_work import UnitOfWork

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Roles predefinidos del sistema
ROLES_FIJOS = [
    {"nombre": "ADMIN", "descripcion": "Acceso total al sistema"},
    {"nombre": "STOCK", "descripcion": "Gestión de catálogo e inventario"},
    {"nombre": "PEDIDOS", "descripcion": "Gestión operativa de pedidos"},
    {"nombre": "CLIENT", "descripcion": "Cliente de la tienda"},
]


class AuthService:

    @staticmethod
    def _hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def _verify_password(password: str, password_hash: str) -> bool:
        return pwd_context.verify(password, password_hash)

    @staticmethod
    def _generar_tokens(uow: UnitOfWork, usuario: Usuario) -> tuple[str, str]:
        roles = uow.usuarios.get_roles(usuario.id)
        access_token = crear_access_token(usuario.id, usuario.email, roles)
        refresh_token_str = crear_refresh_token()

        rt = RefreshToken(
            token=refresh_token_str,
            usuario_id=usuario.id,
            expira_en=datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        )
        uow.refresh_tokens.add(rt)

        return access_token, refresh_token_str

    @staticmethod
    def login(uow: UnitOfWork, data: LoginRequest) -> TokenResponse:
        usuario = uow.usuarios.get_by_email(data.email)
        if not usuario or not AuthService._verify_password(data.password, usuario.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos",
            )

        if usuario.eliminado_en:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario desactivado",
            )

        access_token, refresh_token = AuthService._generar_tokens(uow, usuario)
        uow.commit()

        roles = uow.usuarios.get_roles(usuario.id)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                telefono=usuario.telefono,
                roles=roles,
            ),
        )

    @staticmethod
    def register(uow: UnitOfWork, data: RegisterRequest) -> TokenResponse:
        existente = uow.usuarios.get_by_email(data.email)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El email ya está registrado",
            )

        usuario = Usuario(
            nombre=data.nombre,
            email=data.email,
            password_hash=AuthService._hash_password(data.password),
        )
        uow.usuarios.add(usuario)
        uow.session.flush()

        # Asignar rol CLIENT por defecto
        statement = select(Rol).where(Rol.nombre == "CLIENT")
        rol_cliente = uow.session.exec(statement).first()
        if rol_cliente:
            uow.session.add(UsuarioRol(usuario_id=usuario.id, rol_id=rol_cliente.id))

        access_token, refresh_token = AuthService._generar_tokens(uow, usuario)
        uow.commit()

        roles = uow.usuarios.get_roles(usuario.id)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                telefono=usuario.telefono,
                roles=roles,
            ),
        )

    @staticmethod
    def refresh(uow: UnitOfWork, refresh_token_str: str) -> TokenResponse:
        rt = uow.refresh_tokens.get_by_token(refresh_token_str)
        if not rt or rt.revocado_en:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token inválido o revocado",
            )
        if rt.expira_en < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expirado",
            )

        # Revocar token anterior (rotación)
        uow.refresh_tokens.revocar(rt)

        usuario = uow.usuarios.get_by_id(rt.usuario_id)
        if not usuario or usuario.eliminado_en:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
            )

        access_token, new_refresh_token = AuthService._generar_tokens(uow, usuario)
        uow.commit()

        roles = uow.usuarios.get_roles(usuario.id)
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            user=UserResponse(
                id=usuario.id,
                nombre=usuario.nombre,
                email=usuario.email,
                telefono=usuario.telefono,
                roles=roles,
            ),
        )

    @staticmethod
    def logout(uow: UnitOfWork, refresh_token_str: str) -> None:
        rt = uow.refresh_tokens.get_by_token(refresh_token_str)
        if rt and not rt.revocado_en:
            uow.refresh_tokens.revocar(rt)
            uow.commit()


def seed_initial_data():
    """Crea roles y usuarios por defecto si no existen (idempotente)."""
    from backend.database import engine
    from sqlmodel import Session

    with Session(engine) as session:
        # Crear roles
        for rol_data in ROLES_FIJOS:
            existing = session.exec(
                select(Rol).where(Rol.nombre == rol_data["nombre"])
            ).first()
            if not existing:
                session.add(Rol(**rol_data))

        session.commit()

        # Mapa de roles
        roles_map = {}
        for r in session.exec(select(Rol)).all():
            roles_map[r.nombre] = r.id

        # Usuarios por defecto
        default_users = [
            {
                "nombre": "Admin FoodStore",
                "email": "admin@foodstore.com",
                "password": "admin123",
                "roles": ["ADMIN", "STOCK", "PEDIDOS"],
            },
            {
                "nombre": "Cliente FoodStore",
                "email": "cliente@foodstore.com",
                "password": "cliente123",
                "roles": ["CLIENT"],
            },
        ]

        for user_data in default_users:
            existing = session.exec(
                select(Usuario).where(Usuario.email == user_data["email"])
            ).first()
            if existing:
                continue

            usuario = Usuario(
                nombre=user_data["nombre"],
                email=user_data["email"],
                password_hash=pwd_context.hash(user_data["password"]),
            )
            session.add(usuario)
            session.flush()

            for rol_nombre in user_data["roles"]:
                rol_id = roles_map.get(rol_nombre)
                if rol_id:
                    session.add(UsuarioRol(usuario_id=usuario.id, rol_id=rol_id))

        session.commit()
