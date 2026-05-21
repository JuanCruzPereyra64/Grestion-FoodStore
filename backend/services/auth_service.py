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
from backend.models.pedido import EstadoPedido, FormaPago
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
    {"codigo": "ADMIN", "descripcion": "Acceso total al sistema"},
    {"codigo": "STOCK", "descripcion": "Gestión de catálogo e inventario"},
    {"codigo": "PEDIDOS", "descripcion": "Gestión operativa de pedidos"},
    {"codigo": "CLIENT", "descripcion": "Cliente de la tienda"},
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
        uow.session.add(UsuarioRol(usuario_id=usuario.id, rol_codigo="CLIENT"))

        access_token, refresh_token = AuthService._generar_tokens(uow, usuario)

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


def seed_initial_data():
    """Crea roles y usuarios por defecto si no existen (idempotente)."""
    from backend.database import engine
    from sqlmodel import Session

    with Session(engine) as session:
        # Crear roles
        for rol_data in ROLES_FIJOS:
            existing = session.exec(
                select(Rol).where(Rol.codigo == rol_data["codigo"])
            ).first()
            if not existing:
                session.add(Rol(**rol_data))

        session.commit()

        # Mapa de roles (codigo -> codigo, para idempotencia de asociaciones)
        roles_map = {
            r.codigo: r.codigo
            for r in session.exec(select(Rol)).all()
        }

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
            if not existing:
                usuario = Usuario(
                    nombre=user_data["nombre"],
                    email=user_data["email"],
                    password_hash=pwd_context.hash(user_data["password"]),
                )
                session.add(usuario)
                session.flush()
            else:
                usuario = existing

            for rol_codigo in user_data["roles"]:
                if rol_codigo not in roles_map:
                    continue
                ya_tiene = session.exec(
                    select(UsuarioRol).where(
                        UsuarioRol.usuario_id == usuario.id,
                        UsuarioRol.rol_codigo == rol_codigo,
                    )
                ).first()
                if not ya_tiene:
                    session.add(UsuarioRol(usuario_id=usuario.id, rol_codigo=rol_codigo))

        session.commit()

        # Sembrar EstadoPedido
        estados = ["PENDIENTE", "CONFIRMADO", "EN_PREPARACION", "EN_CAMINO", "LISTO", "ENTREGADO", "FACTURADO", "CANCELADO"]
        for codigo in estados:
            if not session.exec(select(EstadoPedido).where(EstadoPedido.codigo == codigo)).first():
                session.add(EstadoPedido(codigo=codigo))

        # Sembrar FormaPago
        formas = ["EFECTIVO", "MERCADOPAGO"]
        for codigo in formas:
            if not session.exec(select(FormaPago).where(FormaPago.codigo == codigo)).first():
                session.add(FormaPago(codigo=codigo))

        session.commit()
