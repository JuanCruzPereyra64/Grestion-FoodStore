# Proposal: Fix API Contract Alignment

## Intent

Align frontend types and form data with the backend schemas to fix the `422 Unprocessable Entity` errors when creating/updating products. The backend expects `precio_base` and `categoria_ids` (list), while the frontend is sending `precio` and `categoria_id` (single).

## Scope

### In Scope
- Update `frontend/src/types/index.ts`: Sync `Producto` and `ProductoCreate` interfaces with backend.
- Update `frontend/src/pages/ProductosPage.tsx`: Adjust form state, field names, and submission logic.
- Update `frontend/src/pages/ProductoDetallePage.tsx`: Ensure compatibility with updated field names.
- Fix UI mapping in product list and details.

### Out of Scope
- Backend schema changes (backend is considered the source of truth).
- New feature additions.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- product-management: Align data structures between frontend and backend.

## Approach

1. **Type Synchronization**: Rename `precio` to `precio_base` and change `categoria_id` (number) to `categoria_ids` (number[]) in TypeScript definitions.
2. **Form Adjustment**: Modify `ProductosPage.tsx` to handle a list of categories (currently supports one in UI, so we'll wrap it in an array for now).
3. **Data Mapping**: Ensure the table and detail view use `precio_base`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `frontend/src/types/index.ts` | Modified | Sync interfaces with backend schemas |
| `frontend/src/pages/ProductosPage.tsx` | Modified | Update form logic and field names |
| `frontend/src/pages/ProductoDetallePage.tsx` | Modified | Update display of product data |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| UI break in other pages | Low | Search and replace field names globally in frontend |

## Rollback Plan

Use `git checkout .` to revert changes to a known working state.

## Success Criteria

- [ ] Product creation succeeds without validation errors (422).
- [ ] Product update succeeds and persists correctly.
- [ ] Prices and categories display correctly in the table and details.
