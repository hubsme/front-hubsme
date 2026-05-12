---
name: angular-style
description: ESPAÑOL - Guía de ESTILOS GLOBALES y TIPOGRAFÍA.
  Usa esta skill cuando el usuario pida: cambiar fuentes, configurar colores base,
  variables CSS, reset CSS, estilos de scrollbar, o configuración global de UI.
---

# Angular Global Styles & Design System

This skill enforces the structure of the `src/styles.css` file and the rules for using the design system in the application.

## 1. Strict Usage Rules

1.  **Exclusively Use CSS Variables**: In HTML templates and component CSS, **NEVER** hardcode hex colors or fonts. ALWAYS use the Tailwind utility classes mapped to the variables defined below (e.g., `bg-primary`, `text-text`, `font-inter-regular`).
2.  **No Exceptions**: All colors and fonts must come from this central configuration to ensure consistency and Dark Mode support.
3.  **Structure**: The `styles.css` file must strictly follow the order: Tailwind Setup -> Fonts -> Variables -> Theme Configuration -> Utilities -> Animations -> Global Reset.

## 2. Standard `styles.css` Configuration

**File**: `src/styles.css`

```css
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));

/* --- 1. Custom Fonts Configuration --- */
@font-face {
  font-family: 'Anton SC';
  src: url('/font/AntonSC-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'Inter Light';
  src: url('/font/Inter-Light.ttf') format('truetype');
}
@font-face {
  font-family: 'Inter Regular';
  src: url('/font/Inter-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'Inter Medium';
  src: url('/font/Inter-Medium.ttf') format('truetype');
}
@font-face {
  font-family: 'Inter SemiBold';
  src: url('/font/Inter-SemiBold.ttf') format('truetype');
}
@font-face {
  font-family: 'Inter Bold';
  src: url('/font/Inter-Bold.ttf') format('truetype');
}

/* --- 2. Color Palette (Variables) --- */
:root {
  /* LIGHT MODE (Default) */
  --color-primary: #35b2c0;
  --color-secondary: #a8be04;
  --color-accent: #f2788f;
  --color-background: #ffffff;
  --color-text: #000000;

  --color-danger: #c90d0d;
  --color-warning: #f8a50d;
  --color-success: #34a851;
  --color-info: #4590f2;
}

/* DARK MODE Overrides */
[data-theme='dark'] {
  --color-primary: #3fbcca;
  --color-secondary: #e5fb41;
  --color-accent: #870d24;
  --color-background: #000000;
  --color-text: #ffffff;

  --color-danger: #f05252;
  --color-warning: #c27803;
  --color-success: #0e9f6e;
  --color-info: #3f83f8;
}

/* --- 3. Tailwind Theme Mapping --- */
@theme {
  /* Dynamic Colors mapped to variables */
  --color-primary: var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
  --color-background: var(--color-background);
  --color-text: var(--color-text);
  --color-neutral: var(--color-neutral); /* Ensure this var exists or remove */

  --color-danger: var(--color-danger);
  --color-warning: var(--color-warning);
  --color-success: var(--color-success);
  --color-info: var(--color-info);

  /* Typography */
  --font-anton: 'Anton SC', sans-serif;
  --font-inter-light: 'Inter Light', sans-serif;
  --font-inter-regular: 'Inter Regular', sans-serif;
  --font-inter-medium: 'Inter Medium', sans-serif;
  --font-inter-semibold: 'Inter SemiBold', sans-serif;
  --font-inter-bold: 'Inter Bold', sans-serif;
}

/* --- 4. Global Utilities --- */

/* Placeholder visibility */
::placeholder {
  color: var(--color-text);
  opacity: 0.4;
}

/* Scrollbar Customization */
[data-theme='dark'] * {
  scrollbar-color: var(--color-text) var(--color-background);
}
[data-theme='dark'] ::-webkit-scrollbar-track {
  background: var(--color-background);
}
[data-theme='dark'] ::-webkit-scrollbar-thumb {
  background: var(--color-text);
}
[data-theme='dark'] ::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary);
}

/* Form Elements Consistency in Dark Mode */
[data-theme='dark'] select option {
  background-color: var(--color-background);
  color: var(--color-text);
}

/* --- 5. Animations --- */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* --- 6. Global Reset / Transitions --- */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```
