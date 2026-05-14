# Design: shipping-info-page

## Context

Pagina estatica con informacion logistica de entregas. Misma arquitectura que about-us-page.

## Goals / Non-Goals

**Goals:**
- Pagina /envios con glass card
- NavLink activo en el navbar
- Contenido: zonas, compromisos, tarifas

**Non-Goals:**
- NO tocar otros links del navbar
- NO cambiar el layout global

## Decisions

### D1. Misma estructura que ConocenosPage
- Glass card con bg-black/80 (un poco mas oscuro que Conocenos)
- Cards internas para zonas y compromisos
- Iconos de lucide-react

### D2. NavLink con isActive
- Envios pasa de <a href="#envios"> a <NavLink to="/envios">
- Misma convencion que Productos y Conocenos
