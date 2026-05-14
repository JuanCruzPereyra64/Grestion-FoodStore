# Design: about-us-page

## Context

La landing page actual tiene un hash link #conocenos que no es una ruta real. Se necesita una pagina dedicada con la historia del restaurante.

## Goals / Non-Goals

**Goals:**
- Pagina /conocenos con glass card centrada
- NavLink activo en el navbar
- Contenido textual completo con datos random

**Non-Goals:**
- NO tocar otros links del navbar (descuentos, envios)
- NO cambiar el layout global

## Decisions

### D1. React Router, no Next.js
- El proyecto usa React Router v6, no App Router de Next.js
- Se crea ConocenosPage.tsx en src/pages/
- Se agrega route en App.tsx con ClientShell

### D2. NavLink con isActive
- Conocenos pasa de <a href="#conocenos"> a <NavLink to="/conocenos">
- Misma convencion que Productos: texto primary cuando activo

### D3. Glass card centrada
- max-w-4xl mx-auto mt-20 p-8 md:p-12 bg-black/70 backdrop-blur-md rounded-3xl border border-white/10
- Mismo estilo que el hero del home pero con bg-black/70
