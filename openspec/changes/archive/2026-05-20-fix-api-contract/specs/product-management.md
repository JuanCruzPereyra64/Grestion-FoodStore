# Spec: product-management (Delta)

## ADDED Requirements

### Requirement: Alignment with Backend Schema
The frontend MUST use `precio_base` instead of `precio` and `categoria_ids` (array of numbers) instead of `categoria_id` (single number) to match the FastAPI backend contract.

#### Scenario: Successful Product Creation
- **WHEN** the user submits the new product form.
- **THEN** the frontend MUST send a POST request to `/productos/` containing the `precio_base` field and a `categoria_ids` array with at least one element.

#### Scenario: Successful Product Update
- **WHEN** the user saves changes to an existing product.
- **THEN** the frontend MUST send a PUT request to `/productos/{id}` including the updated `precio_base` and `categoria_ids`.

#### Scenario: Price and Category Display
- **WHEN** the product list or detail view is rendered.
- **THEN** the system MUST map the `precio_base` from the API to the displayed price and handle multiple `categorias` in the response.
