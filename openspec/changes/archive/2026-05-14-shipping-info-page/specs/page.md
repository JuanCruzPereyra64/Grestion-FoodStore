## ADDED Requirements

### Requirement: NavLink and route

The app SHALL have a /envios route using ClientShell, and the navbar SHALL use NavLink to="/envios" with isActive styling.

#### Scenario: Navigation to Envios

- WHEN the user clicks "Envios" in the navbar
- THEN the user navigates to /envios
- AND the navbar link shows active state (text-primary)

### Requirement: Glass card layout

The page SHALL use max-w-4xl mx-auto mt-20 p-8 md:p-12 bg-black/80 backdrop-blur-md rounded-3xl border border-white/10

#### Scenario: Glass card with content

- WHEN the user loads /envios
- THEN all content is inside a dark glass card
- AND the brick wall background is visible outside
