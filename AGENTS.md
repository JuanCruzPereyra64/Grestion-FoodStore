# 🍔 Food Store v5.0 — Cognitive Routing (Change 0)

Este archivo actúa como el enrutador maestro (Lightweight Router) para agentes LLM en el proyecto Food Store. Cuando se te asigne una tarea, primero identifica a qué dominio pertenece y luego lee el skill correspondiente en la carpeta `skills/` antes de escribir cualquier código.

## 🎯 Objetivo del Sistema (Spec-Driven Development)
Food Store es una aplicación web full-stack para gestión de comidas. 
- **Backend:** FastAPI + PostgreSQL + SQLModel (Arquitectura en capas, Unit of Work).
- **Frontend:** React + TypeScript + Vite + Zustand + TanStack Query (Feature-Sliced Design).
- **Dominio:** Catálogo de productos, carrito persistente, gestión de pedidos (FSM) y pagos (MercadoPago).

## 🧭 Tabla de Enrutamiento de Skills

Si tu tarea está relacionada con... 👉 Lee primero este archivo:

| Tarea / Dominio | Skill File a Consultar | Descripción Breve |
|-----------------|------------------------|-------------------|
| **Base de Datos, ERD, Transacciones** | `skills/database-sqlmodel.md` | Esquema ERD v5, Tercera Forma Normal, Soft Delete, Patrón Snapshot, CTE recursivas, Audit Trail. |
| **API, Endpoints, Lógica de Negocio** | `skills/backend-fastapi.md` | Capas Router → Service → UoW, prohibido commits fuera de UoW, validación Pydantic, doble JWT. |
| **Interfaz de Usuario, Componentes** | `skills/frontend-fsd.md` | Feature-Sliced Design, Separación estado Cliente (Zustand) vs Servidor (TanStack Query), Tailwind. |
| **Entorno e Integración Continua** | `skills/mcp-config.md` | Configuración de Model Context Protocol (MCP), variables de entorno, y setup de herramientas. |

## ⚠️ Reglas de Oro Globales
1. **No inventes patrones:** Si la especificación (Food Store v5.0) dicta Unit of Work o FSD, síguelo al pie de la letra.
2. **Feature-First:** El código se organiza por módulos funcionales (ej. `auth`, `pedidos`, `productos`), no por tipos técnicos.
3. **No rompas código existente:** Existe código adelantado en `backend/` y `frontend/`. Respeta lo ya implementado y acompáñalo con las reglas de los skills.
