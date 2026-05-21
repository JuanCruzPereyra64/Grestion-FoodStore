## Context

El backend sigue el patrón Repository + UoW + Service + Router establecido en `core-uow-roles`. Los modelos usan SQLModel con `table=True`. Los schemas de entrada/salida son clases SQLModel sin `table`. El UoW auto-commitea en `__exit__` si no hay excepción.

Actualmente no existen modelos `DireccionEntrega`, `EstadoPedido` ni `FormaPago`. El seed solo crea roles y usuarios.

## Goals / Non-Goals

**Goals:**
- Modelo `DireccionEntrega` persistido con FK a `usuarios`
- Un usuario puede tener N direcciones, exactamente una `es_principal=True`
- CRUD completo expuesto en `/api/v1/direcciones`
- Catálogos `EstadoPedido` y `FormaPago` sembrados al inicio (desbloquean `pedido-usuario-link`)

**Non-Goals:**
- Autenticación en los endpoints (eso es `security-rbac-complete`)
- Vincular direcciones a pedidos (eso es `pedido-usuario-link`)
- Frontend para gestión de direcciones

## Decisions

### D1: Modelo DireccionEntrega

```python
class DireccionEntrega(SQLModel, table=True):
    __tablename__ = "direcciones_entrega"

    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuarios.id")
    alias: str = Field(max_length=100)          # "Casa", "Trabajo"
    linea1: str = Field(max_length=300)          # calle + número
    ciudad: str = Field(max_length=100)
    cp: str = Field(max_length=20)
    es_principal: bool = Field(default=False)
```

### D2: Lógica de dirección principal

`PATCH /{id}/principal` debe garantizar exactamente una principal por usuario:
1. `UPDATE direcciones_entrega SET es_principal=False WHERE usuario_id=?`
2. `UPDATE direcciones_entrega SET es_principal=True WHERE id=?`

Ambas operaciones dentro del mismo UoW (auto-commit al salir).

### D3: Catálogos EstadoPedido y FormaPago

Tablas simples con PK semántica `codigo: str`, igual que `Rol`. Se siembran en `seed_initial_data()`.

```python
class EstadoPedido(SQLModel, table=True):
    __tablename__ = "estados_pedido"
    codigo: str = Field(max_length=30, primary_key=True)
    descripcion: Optional[str] = None

class FormaPago(SQLModel, table=True):
    __tablename__ = "formas_pago"
    codigo: str = Field(max_length=30, primary_key=True)
    descripcion: Optional[str] = None
```

Valores seed:
- `EstadoPedido`: PENDIENTE, CONFIRMADO, EN_PREPARACION, LISTO, ENTREGADO, CANCELADO
- `FormaPago`: EFECTIVO, MERCADOPAGO

### D4: Dónde definir los modelos

`EstadoPedido` y `FormaPago` van en `backend/models/pedido.py` (mismo módulo, mismo dominio). `DireccionEntrega` va en `backend/models/direccion.py` (nuevo archivo).

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| `is_principal` inconsistente si hay error a mitad de operación | UoW garantiza transacción — si falla el segundo UPDATE, el primero hace rollback |
| Seed no idempotente rompe al reiniciar | Seed usa `SELECT` antes de `INSERT` igual que `seed_initial_data` actual |
