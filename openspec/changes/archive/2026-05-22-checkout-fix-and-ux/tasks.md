## 1. Bugfix — MercadoPago Service

- [x] 1.1 En `backend/services/mercadopago_service.py`, eliminar la función `transicionar_estado` local e importar `transicionar_estado` desde `backend.services.pedido_service`
- [x] 1.2 En `create_preference`, reemplazar `pedido.estado` por `pedido.estado_codigo` en la verificación `if pedido.estado_codigo != "PENDIENTE"`
- [x] 1.3 En `_process_payment_notification`, reemplazar la llamada a la función local `transicionar_estado` por la importada de `pedido_service`
- [x] 1.4 Verificar que `registrar_historial` ya no se llama directamente desde `mercadopago_service` (la lógica queda en `pedido_service.transicionar_estado`)

## 2. Bugfix — CheckoutPage error feedback

- [x] 2.1 En `frontend/src/pages/CheckoutPage.tsx`, agregar un bloque condicional para `createMutation.isError` que muestre una pantalla de error con `createMutation.error?.message` y un botón para reintentar (volver al formulario con `createMutation.reset()`)

## 3. Frontend — hook de direcciones

- [x] 3.1 En `frontend/src/services/api.ts`, agregar `direccionesApi.getByUsuario(usuarioId: number)` que llame a `GET /api/v1/direcciones?usuario_id={usuarioId}`
- [x] 3.2 Crear `frontend/src/hooks/useDirecciones.ts` con `useDirecciones(usuarioId: number | null)` usando `useQuery`, habilitado solo cuando `usuarioId !== null`
- [x] 3.3 En `frontend/src/types/index.ts`, agregar la interfaz `DireccionEntrega` con campos `id`, `alias`, `linea1`, `ciudad`, `cp`, `es_principal`

## 4. Frontend — CheckoutPage smart prefill

- [x] 4.1 En `CheckoutPage`, importar `useAuth` y obtener el usuario autenticado actual
- [x] 4.2 Inicializar `clienteNombre` y `telefono` con los valores del usuario autenticado (si existen) usando los valores iniciales del `useState`
- [x] 4.3 Importar `useDirecciones` y llamarlo con `auth.state.user?.id ?? null`
- [x] 4.4 Agregar estado local `selectedDireccionId` (`number | null`, default `null`)
- [x] 4.5 Cuando `direcciones.data` tenga resultados, pre-seleccionar la dirección con `es_principal: true` (o la primera si ninguna es principal) en el `useEffect`
- [x] 4.6 Reemplazar el input de texto libre de dirección por un `<select>` condicional: si hay direcciones disponibles, mostrar selector; si no, mostrar el input de texto libre original

## 5. Frontend — payload modo vinculado

- [x] 5.1 En `handleSubmit`, construir el payload con modo vinculado (`usuario_id` + `direccion_id`) cuando hay `selectedDireccionId` y usuario autenticado; con modo libre en caso contrario
- [x] 5.2 Actualizar la validación `isValid`: cuando hay direcciones disponibles, `selectedDireccionId !== null` reemplaza la validación de `direccion.trim().length > 0`

## 6. Verificación

- [x] 6.1 Probar flujo completo sin login: el checkout muestra campos vacíos y envía modo libre
- [x] 6.2 Probar flujo con usuario autenticado con direcciones: nombre/teléfono pre-rellenos, selector de direcciones visible, payload en modo vinculado
- [x] 6.3 Probar flujo con usuario autenticado sin direcciones: nombre/teléfono pre-rellenos, campo de texto libre visible
- [x] 6.4 Probar que `POST /api/v1/pagos/create_preference` ya no devuelve 500 para un pedido PENDIENTE
- [x] 6.5 Probar que al fallar `createMutation`, el checkout muestra el error en lugar de silenciarlo

