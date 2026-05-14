# Spec: client-product-detail

## Overview

La vista de detalle de producto para el cliente muestra la información del producto (nombre, imagen, precio, descripción), una lista de ingredientes personalizable, y un botón para agregar al carrito. Excluye controles de administración de recetas y datos técnicos de inventario.

## ADDED Requirements

### Requirement: Mostrar información básica del producto

El sistema DEBE mostrar el nombre, categoría, badge de stock dinámico, precio, imagen y descripción del producto.

#### Scenario: Producto con stock disponible
- **WHEN** el usuario accede a `/productos/{id}` de un producto con `puede_prepararse = true`
- **THEN** el sistema muestra el badge verde "En stock"

#### Scenario: Producto sin stock
- **WHEN** el usuario accede a `/productos/{id}` de un producto con `puede_prepararse = false`
- **THEN** el sistema muestra el badge rojo "Sin stock"

### Requirement: Lista de ingredientes cliente-friendly

El sistema DEBE mostrar la lista de ingredientes del producto sin cantidades técnicas. El nombre de cada ingrediente DEBE mostrarse en `dark:text-white`. Los alérgenos DEBEN mostrar el badge "Alérgeno".

#### Scenario: Visualizar ingredientes
- **WHEN** el usuario ve la lista de ingredientes
- **THEN** cada ingrediente muestra solo su nombre y el badge de alérgeno si corresponde
- **THEN** NO se muestra la cantidad requerida (ej: "200g", "1 unidad")

### Requirement: Exclusión permanente de ingredientes

El sistema DEBE permitir al cliente excluir ingredientes de su pedido en cualquier momento (incluso sin tener el producto en el carrito). Cada ingrediente DEBE tener un toggle visual que permita marcarlo como excluido.

#### Scenario: Excluir ingrediente sin carrito
- **WHEN** el usuario hace click en "Excluir" en un ingrediente sin tener el producto en el carrito
- **THEN** el sistema agrega el producto al carrito con ese ingrediente excluido
- **THEN** el ingrediente se muestra con estilo visual de excluido (fondo rojo)

#### Scenario: Re-incluir ingrediente
- **WHEN** el usuario hace click en "Incluir" en un ingrediente previamente excluido
- **THEN** el sistema remueve ese ingrediente de la lista de excluidos
- **THEN** el ingrediente vuelve a su estilo visual normal

### Requirement: Sin controles de administración

El sistema NO DEBE mostrar la sección "Añadir a la receta", el selector de ingredientes disponibles, ni el botón "Agregar Ingrediente". Tampoco DEBE mostrar el botón de eliminar ingrediente (Trash2).

#### Scenario: Vista cliente sin controles admin
- **WHEN** el usuario navega a `/productos/{id}`
- **THEN** NO hay un select para elegir ingredientes nuevos
- **THEN** NO hay un botón "Agregar Ingrediente"
- **THEN** NO hay un ícono de tacho de basura en ningún ingrediente

### Requirement: Botón Agregar al carrito deshabilitado sin stock

El sistema DEBE deshabilitar el botón "Agregar al carrito" cuando el producto no se puede preparar (`puede_prepararse = false`).

#### Scenario: Producto sin stock
- **WHEN** el producto tiene `puede_prepararse = false`
- **THEN** el botón "Agregar al carrito" está deshabilitado
- **THEN** se muestra visualmente atenuado (opacidad reducida, sin hover interactivo)

#### Scenario: Producto con stock
- **WHEN** el producto tiene `puede_prepararse = true`
- **THEN** el botón "Agregar al carrito" está habilitado
- **THEN** funciona normalmente agregando el producto al carrito
