# Frontend Rules

Este archivo define reglas imprescindibles para cambios en el frontend Angular.

## 1. Framework y Sintaxis

- El proyecto usa Angular 20.
- Usar buenas practicas modernas de Angular.
- Preferir `signal`, `computed` y `effect` para variables reactivas, estados y derivaciones cuando aplique.
- Usar la sintaxis actual de templates:
  - `@if () {}` en lugar de `*ngIf`.
  - `@for () {}` en lugar de `*ngFor`.

## 2. Tipado

- Esta prohibido usar `any`.
- Si existe `any`, buscar una alternativa tipada y estable.
- Usar interfaces, tipos generados o genericos concretos.

## 3. Estructura del Proyecto

- `src/api`: contiene `backend.api.ts`. Es autogenerado desde el backend y no debe editarse manualmente.
- `src/services`: contiene un servicio por cada controller usado desde el frontend. Aqui se declaran las APIs y se conecta con `backend.api.ts` o servicios externos.
- `src/components`: componentes generales reutilizables, incluyendo alertas y toasts personalizados.
- `src/guards`: metodos que bloquean o permiten accesos/permisos de la web.
- `src/routes`: infraestructura de rutas y helpers como `buildPath`, `getPath`, etc.
- `src/app`: configuracion global del sistema, modo servidor/cliente, routing y permisos.
- `src/modules`: arbol principal de componentes y rutas del aplicativo.
  - `content`: componentes que ocupan un path del sistema.
  - `layout`: componentes que forman parte de un path.

## 4. Estilos

- No usar CSS nativo para nuevos estilos.
- Usar clases de Tailwind.
- No usar colores nativos de Tailwind directamente.
- No usar tipografias que no esten declaradas en `src/styles.css`.
- Respetar la nomenclatura, tokens y patrones visuales existentes.
- Mantener consistencia con lo ya implementado en metodos, esquema y estructura.
- En formularios, separar el texto del label del input con clases Tailwind, preferentemente `mb-2 block`.

## 5. API Autogenerada

- No editar manualmente `src/api/backend.api.ts`.
- Cuando el backend cambie modelos, DTOs, interfaces o endpoints, se debe ejecutar `npm run generate:types` desde el backend al final del trabajo.
