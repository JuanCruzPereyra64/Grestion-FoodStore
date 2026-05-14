# Design: immersive-hero-blur-overlay

## Context

Actualmente `ClientHomePage.tsx` tiene `<div className="min-h-screen">` como wrapper y las secciones (hero, features, CTA) como hijos directos. No hay un panel contenedor con blur/opacidad.

## Goals / Non-Goals

**Goals:**
- Panel oscuro translúcido que envuelva todo el contenido
- Efecto glassmorphism con `backdrop-blur-md` sobre el fondo de ladrillos
- Texto con `text-white` para máximo contraste

**Non-Goals:**
- NO cambiar el fondo global de la página (body::before)
- NO modificar las tarjetas/componentes internos
- NO tocar otros archivos

## Decisions

### D1. Un solo contenedor glass envolvente
- Se agrega `<div className="bg-black/60 backdrop-blur-md min-h-screen">` justo dentro del `min-h-screen` existente
- Todo el contenido se mueve dentro de este contenedor
- `max-w-7xl mx-auto` centra el contenido

### D2. text-white en lugar de text-slate-300
- El texto descriptivo del hero pasa a `text-white` para garantizar contraste sobre el fondo oscuro

## Risks

- `backdrop-blur-md` puede no tener efecto visible en algunos browsers si el stacking context de body::before no es accesible — en ese caso solo aplica `bg-black/60` que igual mejora la legibilidad
