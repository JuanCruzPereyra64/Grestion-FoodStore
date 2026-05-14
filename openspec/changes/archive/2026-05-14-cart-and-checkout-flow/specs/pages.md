## ADDED Requirements

### Requirement: Glass card cart

CartPage SHALL use max-w-5xl mx-auto mt-10 p-8 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10 with product thumbnails, excluded ingredients in text-gray-400, and subtotal/envio/total breakdown.

#### Scenario: Cart with items

- WHEN the user has items in cart
- THEN each item shows thumbnail, title, price, excluded ingredients as gray text
- AND quantity controls [-]/[+] and red trash icon
- AND summary shows subtotal, envio, total

### Requirement: Glass card checkout

CheckoutPage SHALL have glass card layout with form fields (nombre, telefono, direccion, zona), metodo de pago radios, and order summary.

#### Scenario: Checkout form

- WHEN the user proceeds to checkout
- THEN the form has nombre, telefono, direccion, zona select
- AND payment method radios for Efectivo or MercadoPago
- AND confirm button with bg-[#FF5100]
