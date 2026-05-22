import uuid
from pathlib import Path
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, Query, Request, UploadFile, File, HTTPException
from backend.database import get_uow
from backend.dependencies.auth import require_role
from backend.schemas.producto import AsociarIngrediente, ProductoCreate, ProductoIngredienteRead, ProductoRead, ProductoUpdate
from backend.services import producto_service
from backend.uow.unit_of_work import UnitOfWork

router = APIRouter(prefix="/productos", tags=["Productos"])

UPLOAD_DIR = Path(__file__).parent.parent.parent / "Imagenes_produtos"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

_STOCK_ROLES = ["ADMIN", "STOCK"]


@router.post("/imagen")
async def upload_imagen(
    request: Request,
    file: UploadFile = File(...),
    _: None = Depends(require_role(_STOCK_ROLES)),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp", "image/gif"):
        raise HTTPException(status_code=400, detail="Formato no soportado. Usá JPG, PNG, WebP o GIF.")
    ext = Path(file.filename).suffix if file.filename else ".jpg"
    nombre = f"{uuid.uuid4().hex}{ext}"
    ruta = UPLOAD_DIR / nombre
    content = await file.read()
    ruta.write_bytes(content)
    base = str(request.base_url).rstrip("/")
    return {"url": f"{base}/imagenes/{nombre}"}


@router.get("/", response_model=list[ProductoRead])
def get_productos(
    uow: UnitOfWork = Depends(get_uow),
    categoria_id: Annotated[Optional[int], Query(description="Filtrar por categoría")] = None,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 100,
):
    return producto_service.get_all(uow, categoria_id, offset, limit)


@router.get("/{producto_id}", response_model=ProductoRead)
def get_producto(producto_id: int, uow: UnitOfWork = Depends(get_uow)):
    return producto_service.get_by_id(uow, producto_id)


@router.post("/", response_model=ProductoRead, status_code=201)
def create_producto(
    data: ProductoCreate,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(_STOCK_ROLES)),
):
    return producto_service.create(uow, data)


@router.put("/{producto_id}", response_model=ProductoRead)
def update_producto(
    producto_id: int,
    data: ProductoUpdate,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(_STOCK_ROLES)),
):
    return producto_service.update(uow, producto_id, data)


@router.delete("/{producto_id}", status_code=204)
def delete_producto(
    producto_id: int,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(_STOCK_ROLES)),
):
    producto_service.delete(uow, producto_id)


@router.get("/{producto_id}/ingredientes", response_model=list[ProductoIngredienteRead])
def get_ingredientes(producto_id: int, uow: UnitOfWork = Depends(get_uow)):
    return producto_service.get_ingredientes(uow, producto_id)


@router.post("/{producto_id}/ingredientes", response_model=ProductoRead, status_code=201)
def add_ingrediente(
    producto_id: int,
    data: AsociarIngrediente,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(_STOCK_ROLES)),
):
    return producto_service.add_ingrediente(uow, producto_id, data.ingrediente_id, data.cantidad_requerida, data.es_removible)


@router.delete("/{producto_id}/ingredientes/{ingrediente_id}", response_model=ProductoRead)
def remove_ingrediente(
    producto_id: int,
    ingrediente_id: int,
    uow: UnitOfWork = Depends(get_uow),
    _: None = Depends(require_role(_STOCK_ROLES)),
):
    return producto_service.remove_ingrediente(uow, producto_id, ingrediente_id)
