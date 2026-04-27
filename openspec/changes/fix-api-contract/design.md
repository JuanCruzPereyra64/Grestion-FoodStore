# Design: Fix API Contract Alignment

## Context

The frontend and backend contracts are currently decoupled due to independent evolution. The FastAPI backend now requires `precio_base` and `categoria_ids` (list of integers), whereas the React frontend is sending `precio` and a single `categoria_id`. This causes `422 Unprocessable Entity` errors on write operations.

## Goals / Non-Goals

**Goals:**
- Align `Producto` and `ProductoCreate` types in TypeScript with SQLModel schemas.
- Update `ProductosPage.tsx` to handle the new field names and list-based category selection.
- Update `ProductoDetallePage.tsx` and any other component displaying product prices.

**Non-Goals:**
- Changing backend logic or database schema.
- Implementing multi-category selection in the UI (for now, we'll keep the single-choice UI but send it as a single-item list).

## Decisions

- **Type Renaming**: Use `precio_base` across the entire frontend to maintain consistency with the API.
- **Category List Adaptation**: The form will store a single `categoria_id` for simplicity in the UI state, but the submission payload will wrap it in an array: `categoria_ids: [form.categoria_id]`.
- **Default Values**: Ensure `stock_cantidad` and `disponible` are sent or handled by defaults to avoid validation issues if the backend becomes stricter.

## Risks / Trade-offs

- **Risk**: Missing a field in a secondary page (like a "Featured Products" section).
- **Mitigation**: Perform a global search for `.precio` and `.categoria_id` within the `Producto` context.
- **Trade-off**: Keeping a single-select UI while the backend supports multi-select is a temporary simplification to speed up the fix.
