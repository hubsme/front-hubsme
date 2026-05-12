# Frontend Agent Rules

Reglas clave e imprescindibles para cambios en `frontend-hubsme`.

## Angular

- El proyecto usa Angular 20.
- Usar buenas practicas modernas de Angular.
- Preferir `signal`, `computed` y `effect` para variables, estados y derivaciones cuando aplique.
- Usar sintaxis actual de templates:
  - `@if () {}` en lugar de `*ngIf`.
  - `@for () {}` en lugar de `*ngFor`.

## Tipado

- Esta prohibido usar `any`.
- Si aparece `any`, reemplazarlo por tipos concretos, interfaces, genericos seguros o tipos generados.

## Estructura

- `src/api`: contiene `backend.api.ts`, archivo autogenerado desde backend. No editar manualmente.
- `src/services`: contiene servicios conectados con `backend.api.ts` y servicios externos.
- `src/components`: componentes generales reutilizables, como alertas y toasts.
- `src/guards`: permisos y bloqueos de acceso.
- `src/routes`: infraestructura y helpers de rutas.
- `src/app`: configuracion global, routing, modo servidor/cliente y permisos.
- `src/modules`: arbol de componentes y rutas del aplicativo.

## Estilos

- No usar CSS nativo para nuevos estilos.
- Usar Tailwind.
- No usar colores nativos de Tailwind directamente.
- No usar tipografias que no esten declaradas en `src/styles.css`.
- Respetar nomenclatura, metodos, esquema y patrones existentes.

## API Generada

- No editar manualmente `src/api/backend.api.ts`.
- Cuando el backend cambie modelos, DTOs, interfaces o endpoints, ejecutar `npm run generate:types` desde backend al final.
