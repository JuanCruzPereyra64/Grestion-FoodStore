# Spec: navbar-layout

## Overview

Define los requisitos de navegación y layout visual del navbar del cliente.

## ADDED Requirements

### Requirement: Logo como link de navegación

The logo "DISTRITO FOOD" in the client navbar SHALL be a link that navigates to `/productos` on click.

#### Scenario: Click en logo navega a productos

- **WHEN** el usuario hace clic en "DISTRITO FOOD" en el navbar
- **THEN** la aplicación navega a `/productos`
- **AND** la URL cambia a `/productos`

### Requirement: Layout flexbox centrado con gap controlado

Navigation link groups MUST be distributed with uniform spacing around the logo, replacing `justify-between` with a maximum gap of `gap-12`.

#### Scenario: Links flanquean el logo con espaciado cohesivo

- **WHEN** el navbar se renderiza en pantalla >= `md`
- **THEN** los enlaces "Conocenos" y "Productos" están a la izquierda del logo
- **AND** los enlaces "Descuentos" y "Envíos" están a la derecha del logo
- **AND** la distancia entre grupos no excede `gap-12`

### Requirement: Tamaño de logo aumentado

The logo "DISTRITO FOOD" SHALL use `text-3xl` as base size on desktop.

#### Scenario: Logo se ve más grande

- **WHEN** el navbar se renderiza
- **THEN** el texto "DISTRITO FOOD" tiene clase `text-3xl`

### Requirement: Efecto neón preservado

The logo MUST retain the existing `neon-title` and `neon-flicker` CSS classes.

#### Scenario: Efecto neón visible

- **WHEN** el navbar se renderiza
- **THEN** el logo tiene las clases `neon-title neon-flicker`
- **AND** el efecto de brillo naranja neón es visible
