# Design: discounts-page

## Context

Pagina estatica con promociones y descuentos. Misma arquitectura que about-us-page y shipping-info-page.

## Goals / Non-Goals

**Goals:**
- Pagina /descuentos con glass card
- NavLink activo en el navbar
- Contenido: Martes de Reset, Combos Permanentes

**Non-Goals:**
- NO tocar otros links del navbar
- NO cambiar el layout global

## Decisions

### D1. Misma estructura que las otras pages
- Glass card con bg-black/80
- Iconos de lucide-react por seccion
- Framer-motion fade-in

### D2. NavLink con isActive
- Descuentos pasa de <a href="#descuentos"> a <NavLink to="/descuentos">
- Misma convencion que los otros links
