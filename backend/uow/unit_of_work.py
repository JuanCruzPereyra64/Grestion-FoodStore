from sqlmodel import Session
from backend.database import engine
from backend.repositories.categoria_repository import CategoriaRepository
from backend.repositories.factura_repository import FacturaRepository
from backend.repositories.ingrediente_repository import IngredienteRepository
from backend.repositories.pedido_repository import PedidoRepository
from backend.repositories.producto_repository import ProductoRepository
from backend.repositories.refresh_token_repository import RefreshTokenRepository
from backend.repositories.usuario_repository import UsuarioRepository

class UnitOfWork:
    def __init__(self):
        self.session: Session = None
        self.categorias: CategoriaRepository = None
        self.facturas: FacturaRepository = None
        self.ingredientes: IngredienteRepository = None
        self.pedidos: PedidoRepository = None
        self.productos: ProductoRepository = None
        self.refresh_tokens: RefreshTokenRepository = None
        self.usuarios: UsuarioRepository = None

    def __enter__(self):
        self.session = Session(engine)
        self.categorias = CategoriaRepository(self.session)
        self.facturas = FacturaRepository(self.session)
        self.ingredientes = IngredienteRepository(self.session)
        self.pedidos = PedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        self.refresh_tokens = RefreshTokenRepository(self.session)
        self.usuarios = UsuarioRepository(self.session)
        return self

    def commit(self):
        self.session.commit()

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.session.rollback()
        self.session.close()
