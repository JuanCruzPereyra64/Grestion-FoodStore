from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Session, select
from backend.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_token(self, token: str) -> Optional[RefreshToken]:
        statement = select(RefreshToken).where(RefreshToken.token == token)
        return self.session.exec(statement).first()

    def add(self, refresh_token: RefreshToken) -> None:
        self.session.add(refresh_token)

    def revocar(self, refresh_token: RefreshToken) -> None:
        refresh_token.revocado_en = datetime.now(timezone.utc)
        self.session.add(refresh_token)
