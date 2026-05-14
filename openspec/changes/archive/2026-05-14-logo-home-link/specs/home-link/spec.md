# Spec: home-link

## Overview

El logo del navbar debe navegar al home del cliente.

## ADDED Requirements

### Requirement: Logo navega a home

The logo "DISTRITO FOOD" SHALL link to `/` via `<Link to="/">`.

#### Scenario: Click en logo va al home

- **WHEN** el usuario hace clic en "DISTRITO FOOD"
- **THEN** la URL cambia a `/`
- **AND** la página de inicio se renderiza
