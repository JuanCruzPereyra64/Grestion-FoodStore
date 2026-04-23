from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from backend.models.producto import Producto, ProductoIngrediente
from backend.schemas.producto import ProductoCreate, ProductoUpdate
from backend.services import categoria_service, ingrediente_service


def get_all(session: Session, categoria_id: Optional[int] = None, offset: int = 0, limit: int = 100) -> list[Producto]:
    # Usamos selectinload para cargar relaciones de forma eficiente y evitar el problema de "no se ven"
    statement = (
        select(Producto)
        .options(selectinload(Producto.ingredientes), selectinload(Producto.categoria))
    )
    if categoria_id:
        statement = statement.where(Producto.categoria_id == categoria_id)
    
    return session.exec(statement.offset(offset).limit(limit)).all()


def get_by_id(session: Session, producto_id: int) -> Producto:
    # session.get no admite options directamente de forma sencilla en SQLModel para relaciones links
    # así que usamos una query con selectinload
    statement = (
        select(Producto)
        .where(Producto.id == producto_id)
        .options(selectinload(Producto.ingredientes), selectinload(Producto.categoria))
    )
    producto = session.exec(statement).first()
    
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


def create(session: Session, data: ProductoCreate) -> Producto:
    # Validar categoría
    categoria_service.get_by_id(session, data.categoria_id)
    
    # Validar que los ingredientes existan
    for ing_id in data.ingrediente_ids:
        ingrediente_service.get_by_id(session, ing_id)
        
    producto = Producto.model_validate(data, update={"ingredientes": []})
    session.add(producto)
    session.commit()
    session.refresh(producto)
    
    # Unir ingredientes
    for ing_id in data.ingrediente_ids:
        link = ProductoIngrediente(producto_id=producto.id, ingrediente_id=ing_id)
        session.add(link)
    
    session.commit()
    # Cargamos el producto completo con sus relaciones antes de devolverlo
    return get_by_id(session, producto.id)


def update(session: Session, producto_id: int, data: ProductoUpdate) -> Producto:
    producto = get_by_id(session, producto_id)
    
    if data.categoria_id is not None:
        categoria_service.get_by_id(session, data.categoria_id)
    
    # Manejo de ingredientes si se proporcionan
    if data.ingrediente_ids is not None:
        # Validar que todos existan
        for ing_id in data.ingrediente_ids:
            ingrediente_service.get_by_id(session, ing_id)
        
        # Eliminar relaciones actuales
        statement = select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
        existing_links = session.exec(statement).all()
        for link in existing_links:
            session.delete(link)
        
        # Crear nuevas relaciones
        for ing_id in data.ingrediente_ids:
            link = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id)
            session.add(link)

    # Actualizar otros campos
    for key, value in data.model_dump(exclude_unset=True, exclude={"ingrediente_ids"}).items():
        setattr(producto, key, value)
    
    session.add(producto)
    session.commit()
    session.refresh(producto)
    
    # Devolver actualizado con relaciones cargadas
    return get_by_id(session, producto_id)


def delete(session: Session, producto_id: int) -> None:
    producto = get_by_id(session, producto_id)
    session.delete(producto)
    session.commit()


def add_ingrediente(session: Session, producto_id: int, ingrediente_id: int) -> Producto:
    producto = get_by_id(session, producto_id)
    ingrediente = ingrediente_service.get_by_id(session, ingrediente_id)
    
    # Verificar si ya existe
    existing = session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if existing:
        return producto

    link = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ingrediente_id)
    session.add(link)
    session.commit()
    
    return get_by_id(session, producto_id)


def remove_ingrediente(session: Session, producto_id: int, ingrediente_id: int) -> Producto:
    link = session.get(ProductoIngrediente, (producto_id, ingrediente_id))
    if not link:
        raise HTTPException(status_code=404, detail="Ingrediente no presente en el producto")
    session.delete(link)
    session.commit()
    return get_by_id(session, producto_id)
