## Context

El backend ya soporta dos modos de creación de pedido en `pedido_service.create`:
- **Modo libre**: `cliente_nombre`, `telefono`, `direccion`, `zona_envio` como texto libre (para usuarios anónimos).
- **Modo vinculado**: `usuario_id` + `direccion_id` para usar datos guardados en BD.

El frontend siempre usó el modo libre, incluso cuando el usuario estaba autenticado.
Adicionalmente, `mercadopago_service.py` fue escrito contra un campo `pedido.estado` que no existe en el modelo `Pedido` (el campo real es `estado_codigo`), causando un `AttributeError` silencioso al crear la preferencia de pago.

## Goals / Non-Goals

**Goals:**
- Corregir el campo `estado` → `estado_codigo` en `mercadopago_service.py`
- Eliminar la función `transicionar_estado` duplicada en `mercadopago_service` y reusar la de `pedido_service`
- Mostrar UI de error en `CheckoutPage` cuando falla `createMutation`
- Pre-rellenar nombre y teléfono desde `authStore` cuando el usuario está autenticado
- Mostrar direcciones guardadas del usuario en un selector, usando `GET /api/v1/direcciones?usuario_id=X`
- Enviar `usuario_id` + `direccion_id` cuando hay sesión activa (modo vinculado)

**Non-Goals:**
- Crear/editar/eliminar direcciones desde el checkout
- Cambiar el schema de la BD o las APIs existentes
- Soporte para usuarios anónimos con guardado de datos (guest checkout)
- Agregar campo `zona_envio` a `DireccionEntrega` (el modelo de dirección ya no lo necesita en modo vinculado)

## Decisions

### D1: Reusar `pedido_service.transicionar_estado` desde `mercadopago_service`

`mercadopago_service.py` tiene su propia copia de `transicionar_estado` con campos incorrectos (`pedido.estado`, `pedido.created_at`). 

**Decisión**: Eliminar la copia en `mercadopago_service` e importar `pedido_service.transicionar_estado`. Ambos servicios ya operan sobre el mismo `UnitOfWork`, por lo que no hay problema de ciclo de dependencias.

**Alternativa descartada**: Corregir los campos en la copia local — introduce duplicación de lógica que divergirá de nuevo en el futuro.

### D2: Pre-relleno con datos del authStore (no fetch adicional)

`nombre` y `telefono` ya están en el store de Zustand (`useAuth().state.user`). No hace falta un endpoint adicional.

**Decisión**: Leer directamente de `useAuth()` al montar el componente con `useEffect` (o inicializar el estado con los valores del store).

### D3: Selector de direcciones con `useQuery`

Cuando el usuario está autenticado, el checkout hace `GET /api/v1/direcciones?usuario_id=X` para traer sus direcciones guardadas.

**Decisión**: Usar un nuevo hook `useDirecciones(usuarioId)` con React Query. Si el usuario tiene direcciones, se muestra un `<select>` en lugar del input de texto libre. Si no tiene, se hace fallback al modo libre.

**Alternativa descartada**: Cargar las direcciones en el authStore — las direcciones cambian con más frecuencia que los datos de usuario y no deben estar en estado global persistido.

### D4: Modo de payload según estado de sesión

- Usuario autenticado con dirección seleccionada → envía `{ usuario_id, direccion_id, forma_pago_codigo, items }`
- Usuario autenticado sin direcciones guardadas → envía modo libre con `usuario_id` inyectado
- Usuario anónimo → envía modo libre sin `usuario_id`

El backend ya maneja estos tres casos en `pedido_service.create`.

### D5: UI de error para `createMutation`

Agregar un bloque condicional en `CheckoutPage` análogo al de `createPreferenceMutation.isError`, que muestre un mensaje de error legible y un botón para reintentar.

## Risks / Trade-offs

- **[Riesgo] `zona_envio` no existe en `DireccionEntrega`**: El backend en modo vinculado construye el `direccion_snapshot` sin zona. El campo `zona_envio` de `PedidoCreate` se ignora en ese modo. Esto es aceptable para el scope actual.
  → Mitigación: Si se requiere zona en el futuro, se agrega el campo a `DireccionEntrega` en una migración separada.

- **[Riesgo] Token expirado entre montar el checkout y confirmar**: El hook de direcciones puede fallar con 401 si el token venció durante la sesión.
  → Mitigación: El error del query se maneja mostrando el fallback al modo libre.

- **[Trade-off] No se crea dirección nueva desde checkout**: El usuario debe tener al menos una dirección guardada para usar el modo vinculado. Si no tiene ninguna, el checkout vuelve al modo libre.
  → Aceptable para el scope. La gestión de direcciones es una feature separada.
