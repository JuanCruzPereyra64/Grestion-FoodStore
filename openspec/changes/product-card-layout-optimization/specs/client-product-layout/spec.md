# Spec: client-product-layout

## Overview

Layout optimizado del detalle de producto para cliente con flujo vertical: ingredientes → personalización → compra.

## ADDED Requirements

### Requirement: Botón de exclusión con ícono de tacho

Cada ingrediente DEBE mostrar un botón con ícono `Trash2` (lucide) en color `text-red-500` para excluirlo del pedido. Cuando el ingrediente está excluido, el botón DEBE mostrar un ícono de check (`Check`) y un fondo rojo.

#### Scenario: Excluir ingrediente
- **WHEN** el usuario clickea el ícono Trash2 en un ingrediente
- **THEN** el ingrediente se marca como excluido con fondo rojo
- **THEN** el ícono cambia a Check

#### Scenario: Re-incluir ingrediente
- **WHEN** el usuario clickea el ícono Check en un ingrediente excluido
- **THEN** el ingrediente vuelve a estado normal
- **THEN** el ícono vuelve a Trash2

### Requirement: CTA en columna derecha

El botón "Agregar al carrito" DEBE estar ubicado debajo de la lista de ingredientes, en la misma columna derecha, ocupando el ancho completo de la tarjeta. Los controles de cantidad (+/−) DEBEN estar junto al botón cuando el producto ya está en el carrito.

#### Scenario: Producto sin carrito
- **WHEN** el producto no está en el carrito
- **THEN** el botón "Agregar al carrito" se muestra al final de la columna derecha
- **THEN** NO hay controles de cantidad visibles

#### Scenario: Producto en carrito
- **WHEN** el producto ya está en el carrito
- **THEN** se muestran los controles de cantidad (+/−) junto al botón
- **THEN** el botón dice "Agregar otro"

### Requirement: Sin CTA en columna izquierda

La columna izquierda NO DEBE contener el Card de "¿Listo para pedir?" ni ningún botón de compra.

#### Scenario: Columna izquierda limpia
- **WHEN** el usuario ve la columna izquierda
- **THEN** solo ve: nombre, badge de stock, precio, imagen, descripción
- **THEN** NO hay ningún botón de agregar al carrito ni controles de cantidad
