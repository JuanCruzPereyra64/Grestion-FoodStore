# Design — Mejorar visibilidad de barra de búsqueda y filtros

## Enfoque Técnico

Modificación exclusivamente de clases Tailwind CSS en `ProductosPage.tsx`. No se toca lógica, hooks, ni se agregan componentes nuevos. Se envuelve la barra de búsqueda y los filtros en un contenedor glass consistente con las cards de producto.

## Cambios en ProductosPage.tsx

### 1. Envolver search + filtros en glass container

**Antes** (líneas 60-93):
```tsx
<section className="max-w-6xl mx-auto px-6 pb-8">
  <div className="flex flex-col md:flex-row gap-4 items-center">
    {/* search input */}
    {/* category filters */}
  </div>
</section>
```

**Después**:
```tsx
<section className="max-w-6xl mx-auto px-6 pb-8">
  <div className="bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 md:p-6">
    <div className="flex flex-col md:flex-row gap-4 items-center">
      {/* search input */}
      {/* category filters */}
    </div>
  </div>
</section>
```

### 2. Barra de búsqueda (línea 69)

**Antes**: `bg-slate-800/50 border border-slate-700`
**Después**: `bg-black/60 border border-slate-600/50`

### 3. Filtros no seleccionados (líneas 76, 86)

**Antes**: `bg-slate-800/50 text-slate-300 border border-slate-700`
**Después**: `bg-black/60 text-white border border-slate-600/50`

### 4. Placeholder del input

Agregar `placeholder:text-gray-400` a las clases del input.

## Resumen de cambios de clases

| Elemento | Antes | Después |
|----------|-------|---------|
| Contenedor filters | `flex flex-col md:flex-row gap-4` (sin bg) | `bg-neutral-950/80 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 md:p-6` + flex interno |
| Search input bg | `bg-slate-800/50` | `bg-black/60` |
| Search input border | `border-slate-700` | `border-slate-600/50` |
| Search placeholder | (sin clase explícita) | `placeholder:text-gray-400` |
| Filtro no seleccionado | `bg-slate-800/50 text-slate-300 border border-slate-700` | `bg-black/60 text-white border border-slate-600/50` |
| Filtro seleccionado | `bg-primary text-white` | Sin cambios |

## Impacto

- **Cero** cambios en lógica de negocio
- **Cero** cambios en backend
- **Cero** cambios en tipos o hooks
- Solo clases CSS en un único archivo
