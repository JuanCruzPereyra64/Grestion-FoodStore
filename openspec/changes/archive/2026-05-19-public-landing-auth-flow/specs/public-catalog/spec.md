# Spec: public-catalog

## Overview

El catálogo de productos — listado (`/productos`) y detalle individual (`/productos/:id`) — debe ser accesible sin autenticación. Los usuarios pueden explorar productos, ver detalles y agregar items al carrito (client-side) sin necesidad de login.

## ADDED Requirements

### Requirement: Listado de productos público

La ruta `/productos` SHALL mostrar el listado de productos disponibles sin redirigir a `/login`.

#### Scenario: Visitante anónimo ve el catálogo
- **WHEN** un usuario no autenticado navega a `/productos`
- **THEN** ve la grilla de productos con imágenes, nombres, precios y categorías
- **AND** puede usar los filtros de búsqueda y categoría
- **AND** NO es redirigido a `/login`

### Requirement: Detalle de producto público

La ruta `/productos/:id` SHALL mostrar el detalle del producto sin redirigir a `/login`.

#### Scenario: Visitante anónimo ve detalle de producto
- **WHEN** un usuario no autenticado navega a `/productos/1`
- **THEN** ve la página de detalle con ingredientes, precio, imagen y botón "Agregar al carrito"
- **AND** NO es redirigido a `/login`

### Requirement: Agregar al carrito sin autenticación

El botón "Agregar al carrito" en páginas públicas SHALL funcionar utilizando el carrito client-side (localStorage) sin requerir login.

#### Scenario: Anónimo agrega producto al carrito
- **WHEN** un usuario no autenticado hace clic en "Agregar al carrito" en `/productos` o `/productos/:id`
- **THEN** el producto se agrega al carrito (localStorage)
- **AND** el badge del carrito en el navbar se actualiza

#### Scenario: Carrito persistente post-login
- **WHEN** un usuario no autenticado agrega productos al carrito y luego inicia sesión
- **THEN** los items del carrito están disponibles después del login (sin pérdida de datos)

### Requirement: Checkout protegido

La ruta `/checkout` SHALL redirigir a `/login` si el usuario no está autenticado.

#### Scenario: Anónimo intenta checkout
- **WHEN** un usuario no autenticado navega directamente a `/checkout`
- **THEN** es redirigido a `/login`
