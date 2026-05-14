# Distrito Food — Sistema de Gestión de Comidas

Aplicación fullstack para gestión de comidas estilo street food.

**Stack**: FastAPI + SQLModel + PostgreSQL | React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + Zustand

## Setup rápido (Docker)

```bash
# Clonar y entrar
git clone https://github.com/JuanCruzPereyra64/Grestion-FoodStore.git
cd Grestion-FoodStore

# Levantar todo (PostgreSQL + Backend + Frontend)
docker compose up -d --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Swagger**: http://localhost:8000/docs

## Seed de datos

Poblá la base de datos con categorías, ingredientes y productos:

```bash
docker compose exec backend python -m backend.seed
```

Esto crea los 3 productos del menú:
| Producto | Precio | Categoría |
|----------|--------|-----------|
| Distrito Smash | $15.000 | Hamburguesas |
| Neon Dog | $8.000 | Panchos |
| Urbana 426 | $20.000 | Pizzas |

> Si ya existen, los salta automáticamente (idempotente). Es seguro ejecutarlo múltiples veces.

## Setup manual (sin Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt

# Variables de entorno
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parcial_db

# Correr
PYTHONPATH=. uvicorn backend.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Imágenes de productos

Las imágenes se sirven desde `Imagenes_produtos/` y se montan como volumen en Docker. Agregá archivos `.png` ahí y referencialos como `/imagenes/<nombre>.png` al crear productos.

## Funcionalidades

- Catálogo de productos con fotos e ingredientes
- Carrito de compras con personalización (excluir ingredientes)
- Checkout con zona de envío y métodos de pago (Efectivo / Mercado Pago)
- Panel de administración con sidebar fijo
- Gestión de ingredientes, productos, pedidos y reportes
- Autenticación JWT con roles (Admin, Gestor de Stock, Gestor de Pedidos)
- Dark Street Food UI con glassmorphism
