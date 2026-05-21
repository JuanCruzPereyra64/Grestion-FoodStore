from typing import Optional
from fastapi import HTTPException
from sqlmodel import select
from backend.models.ingrediente import Ingrediente
from backend.models.producto import Producto, ProductoIngrediente, ProductoCategoria
from backend.schemas.producto import (
    ProductoCreate,
    ProductoIngredienteRead,
    ProductoRead,
    ProductoUpdate,
)
from backend.services import categoria_service, ingrediente_service
from backend.uow.unit_of_work import UnitOfWork


def _build_ingredientes_read(uow: UnitOfWork, producto_id: int) -> list[ProductoIngredienteRead]:
    links = uow.session.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
    ).all()
    result = []
    for link in links:
        ing = uow.session.get(Ingrediente, link.ingrediente_id)
        if ing:
            result.append(ProductoIngredienteRead(
                ingrediente_id=ing.id,
                nombre=ing.nombre,
                cantidad_requerida=link.cantidad_requerida,
                unidad_medida=ing.unidad_medida,
                es_alergeno=ing.es_alergeno,
                stock_disponible=ing.stock,
            ))
    return result


def _build_producto_read(uow: UnitOfWork, producto: Producto) -> ProductoRead:
    ingredientes = _build_ingredientes_read(uow, producto.id)
    puede_prepararse = (
        all(
            ing.stock_disponible >= ing.cantidad_requerida
            for ing in ingredientes
        )
        if ingredientes
        else producto.stock_cantidad > 0
    )
    return ProductoRead(
        id=producto.id,
        nombre=producto.nombre,
        precio_base=producto.precio_base,
        descripcion=producto.descripcion,
        stock_cantidad=producto.stock_cantidad,
        disponible=producto.disponible,
        puede_prepararse=puede_prepararse,
        imagenes_url=producto.imagenes_url,
        categorias=producto.categorias,
        ingredientes=ingredientes,
    )


def get_all(uow: UnitOfWork, categoria_id: Optional[int] = None, offset: int = 0, limit: int = 100) -> list[ProductoRead]:
    productos = uow.productos.get_all(categoria_id, offset, limit)
    return [_build_producto_read(uow, p) for p in productos]


def get_by_id(uow: UnitOfWork, producto_id: int) -> ProductoRead:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _build_producto_read(uow, producto)


def create(uow: UnitOfWork, data: ProductoCreate) -> ProductoRead:
    for cat_id in data.categoria_ids:
        categoria_service.get_by_id(uow, cat_id)
    for ing in data.ingredientes:
        ingrediente_service.get_by_id(uow, ing.ingrediente_id)

    producto = Producto.model_validate(data, update={"categorias": [], "ingredientes": []})
    uow.productos.add(producto)
    uow.session.flush()
    uow.session.refresh(producto)

    for cat_id in data.categoria_ids:
        uow.session.add(ProductoCategoria(producto_id=producto.id, categoria_id=cat_id))

    for ing in data.ingredientes:
        uow.session.add(ProductoIngrediente(
            producto_id=producto.id,
            ingrediente_id=ing.ingrediente_id,
            cantidad_requerida=ing.cantidad_requerida,
        ))

    return get_by_id(uow, producto.id)


def update(uow: UnitOfWork, producto_id: int, data: ProductoUpdate) -> ProductoRead:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if data.categoria_ids is not None:
        for link in uow.session.exec(select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)).all():
            uow.session.delete(link)
        for cat_id in data.categoria_ids:
            categoria_service.get_by_id(uow, cat_id)
            uow.session.add(ProductoCategoria(producto_id=producto.id, categoria_id=cat_id))

    if data.ingredientes is not None:
        for link in uow.session.exec(select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)).all():
            uow.session.delete(link)
        for ing in data.ingredientes:
            ingrediente_service.get_by_id(uow, ing.ingrediente_id)
            uow.session.add(ProductoIngrediente(
                producto_id=producto_id,
                ingrediente_id=ing.ingrediente_id,
                cantidad_requerida=ing.cantidad_requerida,
            ))

    for key, value in data.model_dump(exclude_unset=True, exclude={"ingredientes", "categoria_ids"}).items():
        setattr(producto, key, value)

    uow.productos.add(producto)
    return get_by_id(uow, producto_id)


def delete(uow: UnitOfWork, producto_id: int) -> None:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    uow.productos.delete(producto)


def get_ingredientes(uow: UnitOfWork, producto_id: int) -> list[ProductoIngredienteRead]:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return _build_ingredientes_read(uow, producto_id)


def add_ingrediente(uow: UnitOfWork, producto_id: int, ingrediente_id: int, cantidad_requerida: float = 1.0, es_removible: bool = False) -> ProductoRead:
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    ingrediente_service.get_by_id(uow, ingrediente_id)

    existing = uow.session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if not existing:
        uow.session.add(ProductoIngrediente(
            producto_id=producto_id,
            ingrediente_id=ingrediente_id,
            cantidad_requerida=cantidad_requerida,
            es_removible=es_removible,
        ))

    return get_by_id(uow, producto_id)


def remove_ingrediente(uow: UnitOfWork, producto_id: int, ingrediente_id: int) -> ProductoRead:
    link = uow.session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if not link:
        raise HTTPException(status_code=404, detail="Ingrediente no presente en el producto")
    uow.session.delete(link)
    return get_by_id(uow, producto_id)