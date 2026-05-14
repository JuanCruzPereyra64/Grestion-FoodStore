from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import create_db_and_tables
from backend.routers import auth, categorias, ingredientes, pagos, pedidos, productos, reportes
from backend.services.auth_service import seed_initial_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_initial_data()
    yield


app = FastAPI(title="Parcial UTN — Sistema de Productos", lifespan=lifespan)

static_dir = Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

imagenes_dir = Path(__file__).parent.parent / "Imagenes_produtos"
imagenes_dir.mkdir(exist_ok=True)
app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categorias.router)
app.include_router(ingredientes.router)
app.include_router(pagos.router)
app.include_router(pedidos.router)
app.include_router(productos.router)
app.include_router(reportes.router)
