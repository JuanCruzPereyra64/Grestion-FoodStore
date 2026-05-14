# Tasks: force-absolute-routing

## 1. Verificación de Código

- [x] 1.1 Verificar que ClientLayout.tsx usa `<Link to="/productos">` para el logo
- [x] 1.2 Verificar que ProductoDetallePage.tsx usa `<Link to="/productos">` para "Volver"
- [x] 1.3 Verificar que no hay `router.back()` ni `history.go()` en ningún componente

## 2. Limpieza de Cache

- [x] 2.1 Recrear container frontend desde cero (detener, remover, rebuild, crear nuevo)
- [x] 2.2 Correr `tsc --noEmit` para confirmar que no hay errores
- [x] 2.3 Hard refresh del browser (Ctrl+F5 / Ctrl+Shift+R) ⬅️ pendiente del usuario
