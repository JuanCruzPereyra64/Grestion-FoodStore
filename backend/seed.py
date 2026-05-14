"""
Seed: categorías, ingredientes y los 3 productos del menú.

Uso:
    cd /app && python -m backend.seed
"""

from sqlmodel import Session, select
from backend.database import engine
from backend.models.categoria import Categoria
from backend.models.ingrediente import Ingrediente
from backend.models.producto import Producto, ProductoCategoria, ProductoIngrediente


def _ensure(session, model, nombre, **extra):
    inst = session.exec(select(model).where(model.nombre == nombre)).first()
    if not inst:
        inst = model(nombre=nombre, **extra)
        session.add(inst)
    return inst


# ── Definición de productos ──────────────────────────────────────────
# (nombre, precio, descripcion, [categorías], [(ing_nombre, cant_req)], stock, [imgs])
PRODUCT_DEFS = [
    (
        "Distrito Smash", 15000.0,
        "Smash burger con cheddar feta, panceta crocante y cebolla caramelizada.",
        ["Hamburguesas"],
        [
            ("Pan brioche negro", 1),
            ("Carne Molida", 200),
            ("Queso Cheddar Feta", 2),
            ("Panceta", 2),
            ("Cebolla Caramelizada", 30),
        ],
        50,
        ["/imagenes/1cb57c73c7f9414696a2d8b9e51bd58d.png"],
    ),
    (
        "Neon Dog", 8000.0,
        "Pancho con cheddar líquido, panceta, papas pai y pepino. Experiencia única.",
        ["Panchos"],
        [
            ("Salchicha", 1),
            ("Pan de pancho", 1),
            ("Cheddar liquido", 10),
            ("Papas pai", 5),
            ("Panceta", 1),
            ("Rodajas de Pepino", 2),
        ],
        50,
        ["/imagenes/448186223efa4896ba08eb25105d4673.png"],
    ),
    (
        "Urbana 426", 20000.0,
        "Pizza con pepperoni, muzzarella y hot honey. La firma del distrito.",
        ["Pizzas"],
        [
            ("Masa", 500),
            ("Queso Mozzarella", 300),
            ("Pepperoni", 10),
            ("Hot Honey", 20),
        ],
        30,
        ["/imagenes/49c24a2c5e884a2b969fb4688a350023.png"],
    ),
]


def seed():
    with Session(engine) as session:
        # ── Categorías ──────────────────────────────────────────────
        for nombre in [
            "Hamburguesas", "Panchos", "Pizzas", "Lomitos",
            "Bebidas", "Papas fritas", "Ensaladas", "Postres",
        ]:
            _ensure(session, Categoria, nombre)
        session.commit()

        # ── Ingredientes ────────────────────────────────────────────
        ingredientes = [
            Ingrediente(nombre="Pan brioche negro", unidad_medida="u", es_alergeno=False, stock=100),
            Ingrediente(nombre="Carne Molida", unidad_medida="g", es_alergeno=False, stock=10000),
            Ingrediente(nombre="Queso Cheddar Feta", unidad_medida="f", es_alergeno=True, stock=60),
            Ingrediente(nombre="Panceta", unidad_medida="f", es_alergeno=False, stock=60),
            Ingrediente(nombre="Cebolla Caramelizada", unidad_medida="g", es_alergeno=False, stock=3000),
            Ingrediente(nombre="Masa", unidad_medida="g", es_alergeno=False, stock=20000),
            Ingrediente(nombre="Queso Mozzarella", unidad_medida="g", es_alergeno=True, stock=10000),
            Ingrediente(nombre="Pepperoni", unidad_medida="f", es_alergeno=False, stock=100),
            Ingrediente(nombre="Albaca", unidad_medida="g", es_alergeno=False, stock=500),
            Ingrediente(nombre="Salchicha", unidad_medida="u", es_alergeno=False, stock=100),
            Ingrediente(nombre="Pan de pancho", unidad_medida="u", es_alergeno=False, stock=100),
            Ingrediente(nombre="Cheddar liquido", unidad_medida="g", es_alergeno=True, stock=5000),
            Ingrediente(nombre="Papas pai", unidad_medida="g", es_alergeno=False, stock=5000),
            Ingrediente(nombre="Rodajas de Pepino", unidad_medida="u", es_alergeno=False, stock=100),
            Ingrediente(nombre="Hot Honey", unidad_medida="g", es_alergeno=False, stock=2000),
        ]
        for ing in ingredientes:
            existing = session.exec(select(Ingrediente).where(Ingrediente.nombre == ing.nombre)).first()
            if not existing:
                session.add(ing)
        session.commit()

        # ── Productos ───────────────────────────────────────────────
        ing_map = {r.nombre: r.id for r in session.exec(select(Ingrediente)).all()}
        cat_map = {r.nombre: r.id for r in session.exec(select(Categoria)).all()}

        created = 0
        skipped = 0
        for nombre, precio, descripcion, cat_nombres, ing_list, stock, imagenes in PRODUCT_DEFS:
            already = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
            if already:
                print(f"  → Saltado: {nombre}")
                skipped += 1
                continue

            prod = Producto(
                nombre=nombre,
                precio_base=precio,
                descripcion=descripcion,
                stock_cantidad=stock,
                imagenes_url=imagenes,
            )
            session.add(prod)
            session.commit()
            session.refresh(prod)

            for cn in cat_nombres:
                session.add(ProductoCategoria(producto_id=prod.id, categoria_id=cat_map[cn]))

            for ing_nombre, cant in ing_list:
                session.add(ProductoIngrediente(
                    producto_id=prod.id,
                    ingrediente_id=ing_map[ing_nombre],
                    cantidad_requerida=cant,
                ))

            session.commit()
            created += 1
            print(f"  ✔ Creado: {nombre} (${precio:.0f})")

        print(f"\n✅ Seed completado. Creados: {created} | Saltados: {skipped}")


if __name__ == "__main__":
    seed()