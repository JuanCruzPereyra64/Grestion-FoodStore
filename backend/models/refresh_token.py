from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_tokens"

    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(max_length=36, unique=True, index=True)
    usuario_id: int = Field(foreign_key="usuarios.id", index=True)
    expira_en: datetime
    revocado_en: Optional[datetime] = None
    creado_en: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
