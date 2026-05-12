---
name: angular-icon
description: ESPAÑOL - Guía para USAR ICONOS (FontAwesome/SVG).
  Usa esta skill cuando el usuario pida: agregar icono, cambiar icono,
  configurar librería de iconos, o usar iconos svg en botones y menús.
---

# Angular FontAwesome Setup

This skill configures FontAwesome (Free) to be used with standard HTML icon tags (e.g., `<i class="fa-solid fa-user"></i>`) without needing the specific Angular library wrapper, by injecting the CSS globally.

## 1. Install Dependencies

Install the free version of FontAwesome via npm:

```bash
npm install @fortawesome/fontawesome-free
```

## 2. Configure Global Styles (`angular.json`)

Add the FontAwesome CSS path to the `styles` array in your `angular.json` build configuration.

**File**: `angular.json`

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css",
              "./node_modules/@fortawesome/fontawesome-free/css/all.min.css"
            ]
          }
        }
      }
    }
  }
}
```

> **Note**: You may need to restart your `ng serve` process after modifying `angular.json`.

## 3. Usage in Components

You can now use standard FontAwesome classes in your templates.

**Example**: `user.html`

```html
<!-- Solid Icon -->
<i class="fa-solid fa-user"></i>

<!-- Regular Icon -->
<i class="fa-regular fa-envelope"></i>

<!-- Brand Icon -->
<i class="fa-brands fa-github"></i>

<!-- Sizing & Colors (Tailwind) -->
<i class="fa-solid fa-trash text-red-500 text-xl"></i>
```
