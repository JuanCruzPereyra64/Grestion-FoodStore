# Database Skill: SQLModel & PostgreSQL

Este skill abarca el diseño del Modelo de Datos (ERD v5) y las convenciones de base de datos para Food Store.

## 1. Patrones Fundamentales

### Soft Delete
- El borrado físico (`DELETE`) está generalmente prohibido. 
- Utiliza la columna `eliminado_en` (`TIMESTAMPTZ`, nullable).
- Por defecto, todos los repositorios deben incluir `WHERE eliminado_en IS NULL` en sus lecturas, a menos que el ADMIN solicite explícitamente incluir eliminados.

### Snapshot Pattern (Inmutabilidad de Pedidos)
- **Crítico:** Los precios y nombres de productos fluctúan. Las direcciones de entrega pueden ser modificadas por el usuario.
- En la creación de un Pedido, se debe capturar una **copia estática** de los valores actuales.
- Ejemplos en tabla `DetallePedido`: `precio_snapshot`, `nombre_snapshot`.
- Ejemplo en tabla `Pedido`: `total` se calcula usando los `precio_snapshot`.
- Nunca relacionar directamente mediante FK para consultas de lectura que puedan exponer un precio actual modificado. El historial es inmutable.

### Audit Trail (Append-Only)
- La tabla `HistorialEstadoPedido` gestiona el seguimiento del estado de los pedidos.
- **Regla Estricta:** Esta tabla es **Append-Only**. NUNCA se permiten operaciones `UPDATE` o `DELETE` sobre estos registros. Solo `INSERT`.
- El primer registro de historial para un nuevo pedido tendrá `estado_desde = NULL`.

## 2. Modelado y PostgreSQL
- **Tercera Forma Normal (3NF)**: Garantizar integridad referencial en todo momento.
- **CTE Recursivas**: La entidad `Categoria` usa un `padre_id` (auto-referencial). Para leer el árbol jerárquico eficientemente en una sola consulta, utiliza *Common Table Expressions (CTE)* recursivas.
- **Arrays Nativos**: En `DetallePedido`, el campo `personalizacion` se guarda como un `INTEGER[]` (Array de IDs de ingredientes excluidos) para mayor eficiencia de lectura.
- **Alembic**: Todos los cambios en los modelos deben estar respaldados por su correspondiente script de migración (`alembic revision --autogenerate`).

## 3. Máquina de Estados del Pedido (FSM)
Los pedidos deben seguir una secuencia de transiciones de estado estricta. El Backend (Service) debe bloquear transiciones inválidas:

| Estado Actual | Siguiente Estado Válido | Notas |
|---------------|-------------------------|-------|
| `PENDIENTE` | `CONFIRMADO` o `CANCELADO` | `CONFIRMADO` ocurre vía webhook MP automático. |
| `CONFIRMADO` | `EN_PREPARACIÓN` o `CANCELADO` | En `CONFIRMADO` ocurre el decremento atómico del stock. |
| `EN_PREPARACIÓN`| `EN_CAMINO` o `CANCELADO` | `CANCELADO` solo disponible para ADMIN. |
| `EN_CAMINO` | `ENTREGADO` | |
| `ENTREGADO` | Ninguno | Estado Terminal |
| `CANCELADO` | Ninguno | Estado Terminal (Se restaura stock si aplicaba) |
