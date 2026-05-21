# zustand-client-state Specification

## Purpose
TBD - created by archiving change zustand-tanstack-migration. Update Purpose after archive.
## Requirements
### Requirement: Auth store como Zustand store con persist

El estado de autenticación (user, tokens, isAuthenticated) SHALL estar implementado como un Zustand store con middleware `persist` que sincroniza automáticamente con `localStorage` bajo la key `foodstore-auth`.

#### Scenario: Login persiste sesión en localStorage
- **WHEN** se llama a `login(user, accessToken, refreshToken)`
- **THEN** `isAuthenticated` pasa a `true`
- **AND** `user`, `accessToken`, `refreshToken` quedan disponibles en el store
- **AND** los valores se persisten automáticamente en `localStorage['foodstore-auth']`

#### Scenario: Logout limpia estado y localStorage
- **WHEN** se llama a `logout()`
- **THEN** `isAuthenticated` pasa a `false`
- **AND** `user`, `accessToken`, `refreshToken` pasan a `null`
- **AND** `localStorage['foodstore-auth']` es eliminado

#### Scenario: Hidratación al cargar la app
- **WHEN** la app carga y existe `localStorage['foodstore-auth']` con datos válidos
- **THEN** el store se inicializa con `isAuthenticated: true` y los datos del usuario
- **AND** no se requiere ningún `useEffect` explícito para cargar desde localStorage

#### Scenario: Expiración nocturna a las 3am
- **WHEN** la app carga y la hora local en Argentina es >= 3:00 AM
- **AND** existe una sesión guardada en localStorage
- **THEN** la sesión es descartada y el store se inicializa como no autenticado
- **AND** `localStorage['foodstore-auth']` es eliminado

### Requirement: Cart store como Zustand store con persist

El estado del carrito SHALL estar implementado como un Zustand store con middleware `persist` bajo la key `foodstore-cart`, sin depender de React Context para acceder al estado de autenticación.

#### Scenario: Carrito persiste items en localStorage
- **WHEN** un usuario autenticado agrega un producto al carrito
- **THEN** el item se agrega al store
- **AND** el estado se persiste automáticamente en `localStorage['foodstore-cart']`

#### Scenario: Acciones de carrito verifican auth directamente
- **WHEN** se llama a `addItem()` con un usuario no autenticado
- **THEN** la acción es ignorada (no se agrega el item)
- **AND** la verificación ocurre vía `useAuthStore.getState().isAuthenticated` sin necesidad de Context ni Provider

#### Scenario: Hidratación del carrito al cargar la app
- **WHEN** la app carga con un usuario autenticado y `localStorage['foodstore-cart']` contiene items
- **THEN** el carrito se restaura con los items previos

### Requirement: Sin Provider wrappers en el árbol de componentes

Las stores Zustand SHALL ser accesibles sin envolver el árbol de React con Providers.

#### Scenario: App.tsx no contiene AuthProvider ni CartProvider
- **WHEN** el árbol de componentes se renderiza
- **THEN** no existe `<AuthProvider>` ni `<CartProvider>` en `App.tsx`
- **AND** todos los componentes que usan `useAuth()` o `useCart()` funcionan correctamente sin providers

### Requirement: API pública idéntica a la implementación anterior

Los hooks `useAuth()` y `useCart()` SHALL exportar la misma interfaz que antes para garantizar que ningún consumidor requiera cambios.

#### Scenario: useAuth() mantiene su contrato
- **WHEN** un componente llama a `useAuth()`
- **THEN** recibe `{ state: { user, accessToken, refreshToken, isAuthenticated }, login, logout }`

#### Scenario: useCart() mantiene su contrato
- **WHEN** un componente llama a `useCart()`
- **THEN** recibe `{ items, totalItems, totalPrice, addItem, removeItem, updateCantidad, toggleExcludeIngrediente, clearCart, itemInCart }`

