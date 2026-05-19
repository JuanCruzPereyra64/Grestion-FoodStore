## Context

Las cards del grid en `ProductosPage.tsx` tienen `bg-slate-800/40` (40% opacidad) sobre el fondo de ladrillos. El texto blanco/naranja/gris compite visualmente. La card de detalle (`ProductoDetallePage.tsx`) usa el componente `Card` con `dark:bg-[#1a1a1a]` sólido y no sufre el mismo problema, pero en la imagen del usuario se ve igual afectada — agregaremos `backdrop-blur-lg` ahí también como safety net.

## Goals / Non-Goals

**Goals:**
- Fondo más opaco + desenfoque en grid cards para aislar texto del fondo de ladrillos
- Panel de contenido inferior con fondo propio que se superpone a la imagen
- Textos secundarios más legibles (descripciones, conteo de ingredientes)
- Backdrop blur en `.premium-card` como safety net global

**Non-Goals:**
- No se cambia el layout ni la estructura de las cards
- No se tocan colores primarios ni hover states
- No se modifica la card de detalle individual más allá del CSS global

## Decisions

### DEC-001: Cambio en 3 niveles

**Decisión:** Aplicar la mejora en 3 capas:

1. **Contenedor de card** (`div.group`): `bg-slate-800/40` → `bg-neutral-950/80 backdrop-blur-lg` — el fondo base de toda la card es más oscuro y borroso

2. **Panel de contenido** (`div.p-5`): Agregar `bg-black/60 backdrop-blur-md -mt-8 pt-12 rounded-b-2xl relative z-10` — esto crea un panel flotante que:
   - Tapa el borde inferior de la imagen con `-mt-8 pt-12`
   - Tiene su propio blur para aislar el texto
   - `rounded-b-2xl` para mantener bordes redondeados
   - `relative z-10` para estar sobre cualquier elemento

3. **CSS global** (`.premium-card`): Agregar `backdrop-blur-lg` como safety net para todas las cards del sitio

**Razón:** 3 niveles porque cada uno cubre un escenario distinto. El contenedor protege el borde exterior, el panel protege el contenido textual, y el CSS global protege cualquier card que pueda estar sobre el fondo.

### DEC-002: Bump de contraste en textos secundarios

**Decisión:**
- Descripción: `text-slate-400` → `text-gray-300` (más claro, mejor contraste contra fondo oscuro)
- Conteo de ingredientes: `text-slate-500` → `text-slate-400` (sube un nivel)

**Razón:** `text-slate-400` es #94a3b8, `text-gray-300` es #d1d5db — notablemente más claro. `text-slate-500` (#64748b) es muy gris contra fondo oscuro, subiendo a `text-slate-400` mejora legibilidad.

## Cambios en el código

### ProductosPage.tsx
```tsx
// Antes:
<div className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300">

// Después:
<div className="group relative bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300">

// Antes (content):
<div className="p-5 space-y-3">

// Después:
<div className="p-5 space-y-3 bg-black/60 backdrop-blur-md -mt-8 pt-12 rounded-b-2xl relative z-10">

// Antes (descripción):
<p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">

// Después:
<p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">

// Antes (ingredientes):
<div className="flex items-center gap-1.5 text-xs text-slate-500">

// Después:
<div className="flex items-center gap-1.5 text-xs text-slate-400">
```

### index.css
```css
.premium-card {
  @apply bg-white dark:bg-[#1a1a1a] rounded-2xl border ... backdrop-blur-lg;
  /*                                                ↑ agregado */
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `-mt-8 pt-12` puede solaparse mal con imágenes de distinta relación de aspecto | El `aspect-[4/3]` de la imagen es fijo, todas las cards tienen la misma altura de imagen. El offset es consistente. |
| `backdrop-blur-lg` en `.premium-card` puede ser un falso positivo si hay cards que no están sobre el fondo de ladrillos | No hay — todas las cards del sitio se renderizan sobre el `body::before` con el fondo de ladrillos. El blur no duele si el bg es sólido. |
