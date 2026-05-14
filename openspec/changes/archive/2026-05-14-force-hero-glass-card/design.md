# Design: force-hero-glass-card

## Context

Force override de la glass card con las clases exactas especificadas por el usuario.

## Goals / Non-Goals

**Goals:**
- Glass card centrada: `w-[90%] max-w-5xl mx-auto`
- Glassmorphism: `bg-black/60 backdrop-blur-md rounded-3xl border border-white/10`
- Flex centrado: `flex flex-col items-center`
- Padding responsive: `p-8 md:p-12`

**Non-Goals:**
- NO usar blur layer separado
- NO modificar el CTA section
- NO tocar el fondo global

## Decisions

### D1. Clases exactas del usuario
- Se aplica la cadena completa sin modificaciones

### D2. Eliminar blur layer
- Se remueve la capa `fixed` con `backdrop-blur-md` y gradient mask
- El blur vuelve a estar en la card via `backdrop-blur-md`
