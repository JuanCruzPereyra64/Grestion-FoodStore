# Design: logo-home-link

## Context

El logo `ClientLayout.tsx:88` ya tiene `<Link to="/productos">`. Se cambia a `/` porque esa es la landing page del cliente post-login.

## Decisions

### D1. Ruta `/` en vez de `/productos`
- Home (`/`) es la página principal del cliente (ClientHomePage). Tiene sentido que el logo lleve ahí.
- `/productos` ya está accesible desde el NavLink "Productos" y desde botones de CTA en el home.

## Risks

Ninguno — cambio de 1 carácter.
