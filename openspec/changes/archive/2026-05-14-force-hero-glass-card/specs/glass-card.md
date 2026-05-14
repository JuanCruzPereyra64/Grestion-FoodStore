# Spec: force-hero-glass-card

## Overview

Glass card wrapper with exact classes for centered hero content.

## ADDED Requirements

### Requirement: Exact wrapper classes

Hero and Features content SHALL be wrapped in a div with `w-[90%] max-w-5xl mx-auto bg-black/60 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 my-10 flex flex-col items-center`.

#### Scenario: Centered glass card visible

- **WHEN** the user loads the home page
- **THEN** Hero + Features are inside a centered glass card
- **AND** the brick wall background is visible outside the card
- **AND** no blur layer exists outside the card
