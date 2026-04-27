# Sistema de Gestión de Productos — UTN 1er Parcial

Aplicación fullstack para gestión de productos con categorías e ingredientes.

**Stack**: FastAPI + SQLModel + PostgreSQL | React + TypeScript + Tailwind CSS 4 + TanStack Query

## Setup

### Requisitos
- Python 3.11+
- Node.js 18+
- Docker

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Crear archivo `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parcial_db
```

### Base de datos

```bash
docker compose up -d
```

### Correr el backend

```bash
# Desde la raíz del proyecto
PYTHONPATH=. uvicorn backend.main:app --reload
```

Swagger disponible en: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en: http://localhost:5173

## Video

[Link al video — pendiente de grabación]
