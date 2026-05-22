import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from backend.database import run_migrations
from backend.dependencies.limiter import limiter
from backend.routers import auth, categorias, direcciones, ingredientes, pagos, pedidos, productos, reportes
from backend.services.auth_service import seed_initial_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    seed_initial_data()
    yield


app = FastAPI(title="Parcial UTN — Sistema de Productos", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

static_dir = Path(__file__).parent / "static"
static_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

imagenes_dir = Path(__file__).parent.parent / "Imagenes_produtos"
imagenes_dir.mkdir(exist_ok=True)
app.mount("/imagenes", StaticFiles(directory=str(imagenes_dir)), name="imagenes")

_cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/api/v1")
app.include_router(categorias.router,   prefix="/api/v1")
app.include_router(direcciones.router,  prefix="/api/v1")
app.include_router(ingredientes.router, prefix="/api/v1")
app.include_router(pagos.router,        prefix="/api/v1")
app.include_router(pedidos.router,      prefix="/api/v1")
app.include_router(productos.router,    prefix="/api/v1")
app.include_router(reportes.router,     prefix="/api/v1")
