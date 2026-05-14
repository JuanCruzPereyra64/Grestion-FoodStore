# Design: navbar-routing-layout-fix

## Context

El `ClientLayout.tsx` renderiza un navbar fijo con 3 secciones horizontales: dropdown de usuario (izquierda), links de navegación flanqueando el logo, y un spacer vacío a la derecha. Actualmente usa `justify-between` que distribuye los elementos al máximo ancho disponible, resultando en espacios excesivos entre los grupos de links. El logo "DISTRITO FOOD" no es un link navegable y usa `text-2xl`.

No hay cambios de backend, DB, ni API — es únicamente markup JSX + estilos Tailwind.

## Goals / Non-Goals

**Goals:**
- Hacer que el logo "DISTRITO FOOD" navegue a `/productos` al hacer clic
- Compactar los grupos de links con un layout centrado y gap controlado
- Aumentar jerarquía visual del logo a `text-3xl`
- Mantener el efecto neón existente (`neon-title`, `neon-flicker`)

**Non-Goals:**
- NO cambiar la estructura del dropdown de usuario
- NO modificar el sidebar admin (`MainLayout.tsx`)
- NO tocar el enrutamiento ni guards de rutas
- NO modificar el contenido de `ProductoDetallePage.tsx` (ya usa enlace absoluto correcto)

## Decisions

### D1. Logo como Link con `<Link>` de React Router
- **Decisión**: Envolver `<h1>` en `<Link to="/productos">` de `react-router-dom`
- **Por qué**: Es el mecanismo estándar del proyecto (ya se usa `NavLink`, `Link` en todo el frontend). No agrega dependencies nuevas. El `to="/productos"` es consistente con el resto de la navegación del cliente.
- **Alternativa considerada**: `useNavigate` con `onClick` — descartada porque `Link` es semánticamente correcto (hipervínculo), accesible (navegación por teclado), y no require event handlers.

### D2. Layout centrado con gap controlado
- **Decisión**: Reemplazar `justify-between` por una estructura donde los tres grupos (izquierdo/logo/derecho) usen `flex items-center justify-center gap-8` o similar, con el spacer `w-[42px]` eliminado
- **Por qué**: Elimina el espacio muerto a los costados y agrupa los links más cerca del logo, mejorando la cohesión visual. El `w-[42px]` era un hack para balancear el dropdown izquierdo — se reemplaza con espaciado simétrico real.
- **Alternativa considerada**: `justify-evenly` — descartada porque distribuye equitativamente en vez de agrupar por sección.

### D3. Solo se modifica `ClientLayout.tsx`
- **Decisión**: Todos los cambios son en un solo archivo
- **Por qué**: El navbar del cliente es auto-contenido. No hay componentes hijos compartidos que tocar.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| El layout centrado puede comprimir demasiado los links en `md` (tablet) | Los links se ocultan con `hidden md:flex`, el breakpoint `md` sigue siendo seguro. En mobile no hay links, solo logo y dropdown |
| El aumento a `text-3xl` puede hacer que el logo se superponga con links en pantallas estrechas | Verificar con `md` breakpoint activo. Si ocurre, usar `text-2xl md:text-3xl` responsive |
| El spacer `w-[42px]` eliminado puede desbalancear el layout si el dropdown izquierdo cambia de tamaño | El dropdown tiene ancho fijo interno, y al estar centrado con gap, la simetría es visual y no matemática |
