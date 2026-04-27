# Tasks: Fix API Contract Alignment

## 1. Types & Definitions

- [x] 1.1 Update `frontend/src/types/index.ts`: Rename `precio` to `precio_base` in `Producto` and `ProductoCreate`.
- [x] 1.2 Update `frontend/src/types/index.ts`: Change `categoria_id` to `categoria_ids: number[]` in `ProductoCreate`.
- [x] 1.3 Update `frontend/src/types/index.ts`: Add missing fields to `ProductoCreate` if necessary (`stock_cantidad`, `disponible`, `imagenes_url`).

## 2. Service Layer

- [x] 2.1 Update `frontend/src/services/api.ts`: Verify `productosApi` methods use the updated types and parameters.

## 3. UI Implementation (ProductosPage)

- [x] 3.1 Update `frontend/src/pages/ProductosPage.tsx`: Adjust `form` state keys to match new types (`precio` -> `precio_base`).
- [x] 3.2 Update `frontend/src/pages/ProductosPage.tsx`: Update `handleSubmit` logic to map UI state to API-ready payload (wrap category in array).
- [x] 3.3 Update `frontend/src/pages/ProductosPage.tsx`: Update table display to use `p.precio_base`.
- [x] 3.4 Update `frontend/src/pages/ProductosPage.tsx`: Update `openEdit` logic to correctly map backend model to frontend form state.

## 4. UI Implementation (ProductoDetallePage)

- [x] 4.1 Update `frontend/src/pages/ProductoDetallePage.tsx`: Adjust field names for data display.

## 5. Verification

- [x] 5.1 Create a new product and verify it appears in the list (201 Created).
- [x] 5.2 Edit an existing product and verify changes persist.
- [x] 5.3 Verify that no other frontend components are broken by the type change.
