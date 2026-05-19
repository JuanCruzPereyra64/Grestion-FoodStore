# public-landing-page Specification

## Purpose
TBD - created by archiving change public-landing-auth-flow. Update Purpose after archive.
## Requirements
### Requirement: Landing page accesible sin autenticación

La ruta raíz `/` SHALL renderizar `ClientHomePage` sin redirigir a `/login` cuando el usuario no está autenticado.

#### Scenario: Visitante anónimo accede a la raíz
- **WHEN** un usuario no autenticado navega a `/`
- **THEN** ve la Landing Page con hero, features y CTA
- **AND** NO es redirigido a `/login`

#### Scenario: Usuario autenticado accede a la raíz
- **WHEN** un usuario autenticado (rol CLIENT) navega a `/`
- **THEN** ve la Landing Page con navbar en modo autenticado (dropdown de usuario visible)

### Requirement: Navbar completo en modo público

El navbar en rutas públicas SHALL mostrar todos los enlaces de navegación (Conocenos, Productos, Descuentos, Envíos, logo, carrito) y el avatar como link a `/login`.

#### Scenario: Avatar como link a login
- **WHEN** un usuario no autenticado visita cualquier ruta pública
- **THEN** el ícono `User` en el navbar funciona como un `<Link to="/login">`
- **AND** no abre ningún dropdown

### Requirement: Login redirect post-auth preservado

La ruta `/login` SHALL redirigir al `defaultPath` correspondiente si el usuario ya está autenticado.

#### Scenario: Usuario autenticado visita /login
- **WHEN** un usuario autenticado navega a `/login`
- **THEN** es redirigido a `/` (si es CLIENT) o `/admin` (si es ADMIN/GESTOR)

