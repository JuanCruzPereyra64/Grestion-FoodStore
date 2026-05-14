# Spec: blur-gradient-mask

## Overview

Blur layer with radial gradient mask for smooth fade at edges.

## ADDED Requirements

### Requirement: Fading blur mask

The backdrop blur SHALL use a CSS `mask-image` with `radial-gradient` to fade the blur effect at the edges of the viewport.

#### Scenario: Blur fades at edges

- **WHEN** the user loads the home page
- **THEN** the backdrop blur effect is strongest at the center of the screen
- **AND** the blur gradually fades to transparent toward the edges
- **AND** no hard blur boundary is visible against the brick wall background

### Requirement: Card without blur

The glass card SHALL NOT have `backdrop-blur-md`; it SHALL only use `bg-black/60` for the dark overlay.

#### Scenario: Card with dark overlay only

- **WHEN** the user views the glass card
- **THEN** the card has a dark translucent background (`bg-black/60`)
- **AND** the blur effect behind the card comes from the separate blur layer
