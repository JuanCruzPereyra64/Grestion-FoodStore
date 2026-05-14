# Spec: glass-card

## Overview

Glass card centrada para mejorar legibilidad del contenido principal del home.

## ADDED Requirements

### Requirement: Glass card envolvente

Hero and Features sections SHALL be wrapped in a div with `max-w-5xl mx-auto w-[90%] bg-black/60 backdrop-blur-md rounded-3xl p-10 md:p-12 border border-white/10 my-10`.

#### Scenario: Card visible on home page

- **WHEN** the user loads the home page
- **THEN** Hero and Features content is inside a centered glass card
- **AND** the brick wall background is visible on both sides

### Requirement: Text contrast

Feature descriptions and CTA text SHALL use `text-gray-200`.

#### Scenario: Readable text

- **WHEN** the user views the home page
- **THEN** all descriptive text has `text-gray-200` color
