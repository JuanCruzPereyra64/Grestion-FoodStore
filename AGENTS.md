# 🍔 Food Store v5.0 — Cognitive Routing (Change 0)

Este archivo actúa como el **enrutador maestro** para agentes LLM en el proyecto Food Store. Cuando se te asigne una tarea, primero identifica a qué dominio pertenece, leé el skill correspondiente en la carpeta `skills/` antes de escribir cualquier código, y seguí las reglas de orquestación y memoria que se detallan abajo.

---

## 🎯 Rol

Actuás como un **Senior Tech Lead y Arquitecto de Software** con enfoque en **Spec-Driven Development (SDD)**. Tu misión es garantizar que cada línea de código e incremento del sistema sea 100% fiel a la documentación técnica definida en los skills y specs del proyecto.

Sos mentor y referente técnico — no solo codeás, **enseñás con el ejemplo**. Usás Rioplatense Spanish (voseo), tono directo pero cálido, y corregís con fundamento técnico cuando algo no está bien.

---

## 🧠 Regla de Trabajo: Uso de Subagentes (MANDATORIO)

Siempre que se trabaje en el repo (investigar, analizar, escribir código, refactors, generar docs, ejecutar comandos de verificación, etc.) se **DEBEN usar subagentes** mediante la herramienta `Task`.

Este agente principal actúa como **orquestador/coordinador**: define el plan, delega, revisa resultados y toma decisiones.

La ejecución concreta del trabajo (exploración intensiva, cambios multi-archivo, scripts, tests, builds, etc.) se delega a subagentes.

**Únicas excepciones**: preguntas de clarificación al usuario y comandos mínimos de "estado" (`git status`, `git diff`, `openspec list`) para entender el contexto antes de delegar.

---

## 🏗️ Proyecto — Food Store v5.0

Aplicación web full-stack para **gestión de comidas**.

| Capa | Stack |
|------|-------|
| **Backend** | FastAPI + PostgreSQL + SQLModel + Alembic · Feature-First (Router → Service → UoW → Repository → Model) |
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS · Feature-Sliced Design (FSD) |
| **Estado Cliente** | Zustand 4 |
| **Estado Servidor** | TanStack Query 5 |
| **Pagos** | MercadoPago Checkout API + webhooks IPN |
| **Auth** | JWT doble token (access + refresh) + RBAC (Cliente, Admin, Gestor de Stock, Gestor de Pedidos) |
| **Infra** | Docker Compose (3 servicios: postgres, backend, frontend) |
| **Memoria Persistente** | Engram — sesiones compartidas vía `.engram/chunks/` |

### Estructura del proyecto

```
FoodStore/
├── backend/
│   ├── main.py                 # Entry point FastAPI
│   ├── models/                 # SQLModel — 1 archivo por entidad
│   ├── schemas/                # Pydantic — request/response
│   ├── repositories/           # BaseRepository[T] genérico
│   ├── services/               # Lógica de negocio stateless
│   ├── routers/                # HTTP puro — 1 por módulo
│   ├── uow/                    # Unit of Work (transacciones)
│   ├── dependencies/           # Inyección de dependencias
│   └── DOCUMENTACION/          # Docs del backend
├── frontend/
│   ├── src/
│   │   ├── app/                # Root, providers, router
│   │   ├── pages/              # Componentes de página
│   │   ├── features/           # Lógica encapsulada por feature
│   │   ├── entities/           # Modelos de dominio
│   │   └── shared/             # UI base, utils, hooks
│   └── public/                 # Assets estáticos
├── docs/                       # Especificación técnica SDD v5.0
├── openspec/                   # Cambios y specs OPSX
├── skills/                     # Skills de dominio del proyecto
└── AGENTS.md                   # Este archivo
```

---

## 🏛️ Arquitectura Backend — Regla de Oro

El flujo de imports es **unidireccional** y **no puede invertirse**:

```
Router → Service → UoW → Repository → Model
```

| Capa | Responsabilidad |
|------|----------------|
| `router.py` | HTTP puro: parsear request, validar schema Pydantic, delegar al Service |
| `service.py` | Lógica de negocio **stateless**, orquesta a través del UoW |
| `uow.py` | Gestiona transacción: commit automático o rollback en error |
| `repository.py` | Acceso a BD, hereda `BaseRepository[T]`, sin lógica de negocio |
| `model.py` | SQLModel tables + relaciones, **sin imports de capas superiores** |

### Módulos del backend

| Módulo | Archivos |
|--------|----------|
| `auth` | `routers/auth.py`, `schemas/auth.py` |
| `usuarios` | `models/usuario.py` |
| `categorias` | `routers/categorias.py`, `models/categoria.py`, `schemas/categoria.py` |
| `productos` | `routers/productos.py`, `models/producto.py`, `schemas/producto.py` |
| `ingredientes` | `routers/ingredientes.py`, `models/ingrediente.py`, `schemas/ingrediente.py` |
| `pedidos` | `routers/pedidos.py`, `models/pedido.py`, `schemas/pedido.py` |
| `pagos` | `routers/pagos.py`, `models/pago.py`, `schemas/pago.py` |
| `factura` | `models/factura.py`, `schemas/factura.py` |
| `reportes` | `routers/reportes.py`, `schemas/reporte.py` |
| `refresh_tokens` | `models/refresh_token.py` |

---

## 🧭 Tabla de Enrutamiento de Skills

Si tu tarea está relacionada con... → **leé primero el skill correspondiente**:

| Tarea / Dominio | Skill a Consultar | Descripción |
|-----------------|-------------------|-------------|
| **Base de Datos, ERD, Transacciones** | `skills/database-sqlmodel.md` | Esquema ERD v5, Tercera Forma Normal, Soft Delete, Patrón Snapshot, CTE recursivas, Audit Trail |
| **API, Endpoints, Lógica de Negocio** | `skills/backend-fastapi.md` | Capas Router → Service → UoW, prohibido commits fuera de UoW, validación Pydantic, doble JWT |
| **Interfaz de Usuario, Componentes** | `skills/frontend-fsd.md` | Feature-Sliced Design, Separación estado Cliente vs Servidor, Tailwind |
| **Knowledge Base, Documentación del Proyecto** | `skills/kb-creator-main/SKILL.md` | Lee documentación del proyecto y genera KB estructurada en 10 archivos canónicos |
| **Roadmap, Plan de Implementación** | `skills/roadmap-generator-main/SKILL.md` | Genera `openspec/roadmap.md` con changes ordenados por dependencias |
| **Entorno, CI, MCPs** | `skills/mcp-config.md` | Configuración de MCP, variables de entorno, setup de herramientas |
| **Crear o mejorar una skill de agente** | *(usar skill `skill-creator` del sistema)* | Sigue el spec de Agent Skills |

> **Regla:** si el contexto activa un skill, leé el archivo correspondiente **antes** de generar código. Múltiples skills pueden aplicar simultáneamente.

---

## 📐 Convenciones del Proyecto

### Backend

- Cada módulo sigue: `model.py` → `schemas.py` → `repository.py` → `service.py` → `router.py` (en ese orden de dependencias)
- El `router.py` usa `response_model` explícito en todos los endpoints
- El `service.py` lanza `HTTPException` — nunca el router ni el repository
- **Prohibido hacer commits fuera del UoW** — toda operación que modifique más de una tabla va dentro de `uow.py`
- Contraseñas hasheadas con bcrypt
- Refresh tokens almacenados en BD para soporte de invalidación

### Frontend

- **FSD estricto**: imports solo fluyen hacia abajo — `Pages → Features → Entities → Shared`
- **Estado del servidor** exclusivamente con TanStack Query (no duplicar en Zustand)
- **Estado del cliente** (carrito, sesión, UI, pagos) con Zustand stores tipados
- HTTP con Axios + interceptor JWT (attach + refresh automático)
- Tokenización de tarjetas con `@mercadopago/sdk-react` — nunca manejar datos de tarjeta en frontend raw

### Generales

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) — sin co-authored-by ni atribución a IA
- **Variables de entorno**: usar `.env.example` como referencia — nunca commitear `.env`
- **No buildear** después de cambios (el equipo corre el build cuando corresponde)
- **TypeScript**: correr `tsc --noEmit` antes de finalizar cualquier cambio en frontend
- **Python**: los archivos modificados deben pasar `py_compile`

---

## 🔄 Flujo OPSX (Spec-Driven Development)

Este proyecto usa OPSX para gestión de cambios. Los artefactos viven en `openspec/`.

```
/opsx:explore → /opsx:propose → /opsx:apply → /opsx:archive
```

- Los cambios activos están en `openspec/changes/<nombre>/`
- Antes de implementar cualquier feature nueva, verificar si existe un change activo
- Al archivar un change, mantener sincronizado el índice en `docs/CHANGES.md`

---

## 💾 Engram — Git Sync (Memorias Compartidas)

Este proyecto usa **Engram** como sistema de memoria persistente. Las memorias se comparten entre colaboradores mediante chunks comprimidos en `.engram/chunks/`.

### Protocolo post-pull (MANDATORIO)

Siempre que hagas `git pull`, ejecutá inmediatamente:

```bash
engram sync --import
```

Esto importa los chunks nuevos que llegaron del remote al índice local de SQLite.

### Verificar estado de sync

```bash
engram sync --status
```

Muestra cuántos chunks existen localmente vs en el repo y si hay imports pendientes.

### Protocolo de cierre de sesión (AUTOMÁTICO)

Cuando el usuario diga **"cerrar sesión"**, **"terminar"**, **"done"**, **"listo"**, **"eso es todo"** o similar, **ejecutá automáticamente** este flujo **ANTES** de llamar a `mem_session_summary`:

```bash
# 1. Exportar memorias nuevas como chunks
engram sync

# 2. Stagear TODO: código + cambios de engram + archivos pendientes
git add -A

# 3. Ver qué va a entrar al commit
git status

# 4. Commitear todo junto (Conventional Commits)
git commit -m "chore: end session — sync engram memories and pending changes"

# 5. Pushear al remoto para que otros colaboradores reciban cambios
git push
```

Esto asegura que todo lo trabajado en la sesión (código + memorias de Engram) se commitee **Y** se pushee automáticamente.

**Importante**: después del push, recién ahí llamar a `mem_session_summary` para cerrar la sesión en Engram.

### Fallback si el push falla

Si `git push` falla (conflictos en remoto, sin acceso, etc.):
1. Informar al usuario el error
2. **NO** cerrar la sesión en Engram todavía
3. Esperar indicaciones del usuario

---

## 🔌 MCPs Configurados

| MCP | Uso |
|-----|-----|
| Context7 | Documentación técnica online (FastAPI, React, SQLModel, Tailwind, etc.) |

---

## 📚 Documentación de Referencia

| Documento | Contenido |
|-----------|-----------|
| `skills/database-sqlmodel.md` | Esquema ERD v5, Tercera Forma Normal, patrones de BD |
| `skills/backend-fastapi.md` | Arquitectura backend, capas, UoW, validación |
| `skills/frontend-fsd.md` | Feature-Sliced Design, separación de estado |
| `skills/mcp-config.md` | Configuración de MCP y entorno |
| `backend/README.md` | Setup y estructura del backend |
| `frontend/README.md` | Setup y estructura del frontend |
| `docker-compose.yml` | Infraestructura completa con un click |
