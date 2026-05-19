# Spec: public-content-pages

## Overview

Las páginas de contenido informativo — Conocenos (`/conocenos`), Envíos (`/envios`), Descuentos (`/descuentos`) — deben ser accesibles sin autenticación.

## ADDED Requirements

### Requirement: Páginas informativas públicas

Las rutas `/conocenos`, `/envios` y `/descuentos` SHALL renderizar su contenido sin redirigir a `/login` cuando el usuario no está autenticado.

#### Scenario: Visitante anónimo accede a Conocenos
- **WHEN** un usuario no autenticado navega a `/conocenos`
- **THEN** ve la página Conocenos con navbar de cliente completo
- **AND** NO es redirigido a `/login`

#### Scenario: Visitante anónimo accede a Envíos
- **WHEN** un usuario no autenticado navega a `/envios`
- **THEN** ve la página Envíos con navbar de cliente completo
- **AND** NO es redirigido a `/login`

#### Scenario: Visitante anónimo accede a Descuentos
- **WHEN** un usuario no autenticado navega a `/descuentos`
- **THEN** ve la página Descuentos con navbar de cliente completo
- **AND** NO es redirigido a `/login`

### Requirement: Navegación entre páginas públicas

Los links del navbar entre páginas públicas SHALL funcionar sin requerir autenticación.

#### Scenario: Navegación entre páginas públicas
- **WHEN** un usuario no autenticado navega de `/` a `/conocenos` usando el navbar
- **THEN** la transición es instantánea sin pasar por `/login`
