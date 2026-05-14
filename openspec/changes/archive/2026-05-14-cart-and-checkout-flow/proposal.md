# Proposal: cart-and-checkout-flow

## Why

Las paginas /carrito y /checkout existian con funcionalidad pero sin la estetica Dark Street Food glassmorphism. Faltaban thumbnails, exclusion de ingredientes en texto gris, telefono, zona de envio, y metodo de pago.

## What Changes

- Redisenar CartPage: glass card, thumbnails, excluded ingredients en text-gray-400, subtotal/envio/total, boton "Proceder al Pago"
- Redisenar CheckoutPage: glass card, formulario con telefono + zona + metodo pago, inputs bg-black/50 focus:border-[#FF5100]
- Agregar telefono y zona_envio a PedidoCreate type

## Files

- frontend/src/pages/CartPage.tsx - redesign glassmorphism
- frontend/src/pages/CheckoutPage.tsx - redesign with form fields
- frontend/src/types/index.ts - PedidoCreate with telefono?, zona_envio?
