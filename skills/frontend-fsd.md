# Frontend Skill: React, TypeScript & FSD

Este skill define las directrices estrictas para el frontend de Food Store v5.0.

## 1. Feature-Sliced Design (FSD)
El frontend debe estructurarse usando **Feature-Sliced Design**. Los imports fluyen **solo hacia abajo**:
`app` → `pages` → `widgets` → `features` → `entities` → `shared`.

- **`shared/`**: Utilidades, UI genérica (botones, inputs), configuración global de Axios, tipos, constantes.
- **`entities/`**: Modelos de dominio y estado puramente de visualización.
- **`features/`**: Lógica de interacción ("Agregar al Carrito", "Filtros").
- **`widgets/`**: Composición de features y entities.
- **`pages/`**: Vistas ruteables que ensamblan widgets.
- **`app/`**: Configuración global, providers, router y estilos base.

⚠️ **Prohibido**: Importar de una capa superior o depender circularmente entre slices de la misma capa.

## 2. Segregación de Estado (Zustand vs TanStack Query)

Es un error arquitectónico mezclar estado remoto y local en la misma librería. Respeta esta separación:

### ⚡ Zustand (Estado del CLIENTE)
Úsalo **únicamente** para datos que viven en el navegador del usuario:
- `cartStore`: Manejo del carrito de compras (con middleware de persistencia en localStorage).
- `authStore`: Sesión del usuario (Access/Refresh Tokens), roles (persistencia selectiva).
- `uiStore` / `paymentStore`: Temas, sidebars, modales, y progreso en el embudo de pago.

### 🌐 TanStack Query (Estado del SERVIDOR)
Úsalo **únicamente** para sincronizar datos remotos del backend (FastAPI):
- Listado de productos, detalle de pedidos, dashboard, categorías.
- Delega el caché automático, refetching, y loading states a TanStack Query.
- Utiliza **Optimistic Updates** en mutations importantes (ej. "Agregar a favoritos" o avance rápido de estado) con `onMutate`.

## 3. Manejo de Formularios
- Utiliza **TanStack Form** para la gestión de estados y validación declarativa. Fuerte integración con TypeScript.

## 4. UI y Estilos
- **Tailwind CSS**: Estilos utility-first. No crees archivos `.css` separados salvo para el root (`index.css`).
- Asegurar diseños "Premium", componentes dinámicos con micro-interacciones.

## 5. Integración con Axios
- Emplear **Interceptors** de Axios para adjuntar el JWT Access Token (`Authorization: Bearer <token>`).
- El interceptor de respuesta debe manejar de forma transparente los errores `401 Unauthorized` solicitando un nuevo token vía el endpoint `/auth/refresh` y reintentando la petición.
