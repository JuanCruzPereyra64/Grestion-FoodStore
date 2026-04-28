# Configuración MCP y Entorno

Este skill resume las políticas para la integración del Model Context Protocol (MCP) y configuraciones generales del entorno de ejecución de Food Store v5.0.

## 1. Configuración MCP (Model Context Protocol)

El entorno del agente está preparado para funcionar mediante servidores de contexto o herramientas integradas de lectura. Cuando necesites investigar problemas:
- Lee SIEMPRE primero los logs o archivos relevantes usando las herramientas nativas proporcionadas (por ej., `view_file`, `list_dir`).
- Busca referencias a "Food Store v5.0" o los documentos parseados en `backend/DOCUMENTACION/` si el LLM necesita mayor contexto de reglas de negocio específicas que no se resuman en la carpeta de `skills`.

## 2. Variables de Entorno y Setup (Seguridad)
**Regla Estricta:** Nunca hagas commit del archivo `.env` al repositorio. Utiliza `.env.example` para documentar la estructura de los secretos.

Variables críticas del Backend:
- `DATABASE_URL`: URI de conexión PostgreSQL.
- `SECRET_KEY`: Para la firma de los JWT.
- `MERCADOPAGO_ACCESS_TOKEN` y `MERCADOPAGO_PUBLIC_KEY`: Para integración de pagos.
- `CORS_ORIGINS`: Crucial para la comunicación frontend/backend.

Variables del Frontend:
- `VITE_API_BASE_URL`: Endpoint de FastAPI.
- `VITE_MERCADOPAGO_PUBLIC_KEY`: Clave pública para tokenización PCI-compliant en el lado del cliente.

## 3. Comandos Importantes
- **Backend**: `uvicorn main:app --reload` (Desarrollo).
- **Alembic**: `alembic revision --autogenerate -m "Mensaje"` y `alembic upgrade head`.
- **Frontend**: `npm run dev` (Vite).
