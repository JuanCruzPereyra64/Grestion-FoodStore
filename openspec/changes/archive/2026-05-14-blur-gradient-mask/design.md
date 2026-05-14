# Design: blur-gradient-mask

## Context

La glass card con `backdrop-blur-md` crea un efecto de blur rectangular que se corta abruptamente en los bordes de la card (`rounded-3xl`). Se necesita que el blur se desvanezca suavemente.

## Goals / Non-Goals

**Goals:**
- Blur más fuerte en el centro, que se desvanece hacia los costados
- Sin bordes duros de blur visibles
- Glass card mantiene `bg-black/60` para oscurecer el contenido

**Non-Goals:**
- NO cambiar el contenido o layout de la card
- NO modificar el CTA
- NO tocar otros componentes

## Decisions

### D1. Capa fixed separada para el blur
- `div` con `fixed inset-0 pointer-events-none backdrop-blur-md`
- `mask-image: radial-gradient(ellipse 70% 55% at center, black 30%, transparent 65%)`
- La card y CTA tienen `relative z-10` para estar encima

### D2. Parámetros del gradiente
- `70% 55%` mantiene el blur proporcionado (más ancho que alto)
- `black 30%` área central con blur completo
- `transparent 65%` el blur se desvanece desde 30% hasta 65%
