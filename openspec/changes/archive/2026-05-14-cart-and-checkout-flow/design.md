# Design: cart-and-checkout-flow

## Context

Rediseno completo de las paginas de carrito y checkout para matchear la estetica Dark Street Food del resto del proyecto.

## Goals / Non-Goals

**Goals:**
- CartPage: glass card, thumbnails, excluded ingredients gris, subtotal/envio/total
- CheckoutPage: glass card, telefono, zona envio select, metodo pago radios
- Inputs dark con focus naranja

**Non-Goals:**
- NO cambiar la logica de mutations/hooks
- NO cambiar el store del carrito
- NO cambiar rutas existentes

## Decisions

### D1. Efectivo skip MP
- Si el usuario elige efectivo, crear pedido y redirigir a home
- Si elige MP, crear pedido y luego crear preferencia MP

### D2. Envio fijo $0
- Sin calculo de costo de envio por ahora
- Se muestra como linea en el resumen para preparar el UI

### D3. PedidoCreate extendido
- telefono?: string - opcional para compatibilidad con backend
- zona_envio?: string - opcional
