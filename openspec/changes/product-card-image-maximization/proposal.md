## Why

La imagen del producto en la tarjeta de detalle está limitada a `max-h-96` (384px) con `object-contain`, y tiene márgenes (`mt-6`) que la separan del header. La imagen debería ser el elemento hero de la página, ocupando casi todo el ancho disponible con altura generosa.

## What Changes

1. **Mover imagen al tope del Card**: Reubicar la imagen ANTES del nombre/precio/badges para que sea el primer elemento visual, maximizando su presencia.
2. **Eliminar márgenes laterales**: La imagen debe tocar los bordes izquierdo y derecho del Card (sin padding entre la imagen y el borde del Card).
3. **Incrementar altura**: Reemplazar `max-h-96` (384px) por `max-h-[32rem]` (512px) o mayor.
4. **Ajustar escala**: Usar `object-contain` para evitar recortes, con fondo oscuro que contraste.

## Impact

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/pages/ProductoDetallePage.tsx` | Modified | Reordenar secciones del Card: imagen al tope, luego header, luego descripción |
