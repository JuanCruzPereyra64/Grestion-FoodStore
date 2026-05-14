# Spec: about-us-page

## Overview

About us page with glass card layout and full content.

## ADDED Requirements

### Requirement: Route and NavLink

The app SHALL have a /conocenos route using ClientShell, and the navbar SHALL use NavLink with isActive styling.

#### Scenario: Navigation to About Us

- **WHEN** the user clicks "Conocenos" in the navbar
- **THEN** the user navigates to /conocenos
- **AND** the navbar link shows active state (text-primary)

### Requirement: Glass card layout

The page SHALL use a centered glass card with max-w-4xl mx-auto mt-20 p-8 md:p-12 bg-black/70 backdrop-blur-md rounded-3xl border border-white/10

#### Scenario: Glass card visible

- **WHEN** the user loads /conocenos
- **THEN** all content is inside a dark glass card with backdrop blur
- **AND** the brick wall background is visible outside the card
