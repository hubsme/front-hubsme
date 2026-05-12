---
name: angular-architecture
description: ESPAÑOL - Guía de ESTRUCTURA DE CARPETAS y ARQUITECTURA Angular.
  Usa esta skill cuando el usuario pida: crear nuevo módulo, dónde poner un archivo,
  entender la estructura del proyecto, crear servicios globales vs locales,
  organizar componentes, o definir rutas de dominios.
---

# Angular Architecture

This skill defines the standard directory structure for the Angular frontend. This architecture promotes reusability, modularity, and clean separation of concerns.

## Directory Structure

All source code resides in `src/`.

```text
src/
├── api/                # API integration logic (setup, endpoints)
├── app/                # Main app component and root logic
├── components/         # Shared, reusable UI components (dumb components)
│   ├── [component]/    # e.g., alert, toast
│   └── ...
├── functions/          # Standalone utility functions
│   ├── date.function.ts
│   └── ...
├── guards/             # Route protection guards
│   ├── auth.guard.ts
│   └── ...
├── interfaces/         # Shared interfaces (models)
│   ├── [feature].interface.ts
│   └── ...
├── modules/            # Feature modules (Smart components / Views)
│   └── [feature]/
│       ├── components/ # Local components specific to this module
│       ├── content/    # Page views mapped to child routes
│       ├── layout/     # Structural components (Navbar, Sidebar)
│       ├── [feature].css
│       ├── [feature].html
│       └── [feature].component.ts
├── routes/             # Centralized route definitions
│   └── app.routes.ts   # Main routing map
├── services/           # Global singleton services (state, API calls, logic)
│   ├── session.service.ts
│   ├── theme.service.ts
│   ├── alert.service.ts
│   └── ...
└── styles.css          # Global styles, variables, and resets
```

## detailed Descriptions

### 1. Components (`src/components/`)

Contains **Dumb Components** that are reusable across the entire application.

- These components should receive data via `@Input()` and emit events via `@Output()`.
- They should **not** contain complex business logic or direct API calls usually.
- **Examples**: `Alert`, `Toast`, `Button`, `Modal`.

### 2. Services (`src/services/`)

Contains global, singleton services provided in the root.

- **Logic**: Session management, UI state (modals, themes), global wrappers.
- **Examples**:
  - `session.service.ts`: Manages user authentication state and tokens.
  - `theme.service.ts`: Handles light/dark mode toggling.
  - `alert.service.ts` / `toast.service.ts`: Helper services to trigger global UI feedback.

### 3. Modules (`src/modules/`)

Contains the application's **Feature Modules** (pages/views). The internal structure of a module is strictly hierarchical:

```text
src/modules/[module-name]/
├── components/      # Reusable components LOCAL to this module (e.g., search, pagination)
├── content/         # Route-specific views/pages (e.g., dashboard, user, pet)
│   └── [sub-feature]/ # Corresponds to a child route path
├── layout/          # Structural layout components (e.g., navbar, sidebar)
├── [module].css
├── [module].html
└── [module].component.ts
```

- **[layout]**: Contains structural components that define the shell of the module (e.g., sidebar, header) to keep views clean.
- **[content]**: Contains the actual page views mapped to child routes.
- **[components]**: Contains components used by multiple views _within_ this module but not globally.

### 4. Functions (`src/functions/`)

Pure utility functions that are not services.

- **Use Case**: Date formatting, string manipulation, validation helpers.
- **Naming**: `[name].function.ts` (e.g., `date.function.ts`).

### 5. Interfaces (`src/interfaces/`)

TypeScript definitions for shared data structures.

- **Use Case**: Defining the shape of objects used in shared services or components.
- **Naming**: `[name].interface.ts` (e.g., `toast.interface.ts`).

### 6. Guards (`src/guards/`)

Route guards to protect access to specific routes.

- **Use Case**: Checking if a user is logged in (`auth.guard.ts`) or has specific permissions.

### 7. Routes (`src/routes/`)

Contains the routing configuration.

- **Use Case**: Mapping URLs to Components/Modules.

### 8. App (`src/app/`)

The root application entry point.

- Contains `app.component` and `app.config` (for standalone application setup).

## File Naming Conventions

- **Components**: `[name].component.ts` | `.html` | `.css`
- **Services**: `[name].service.ts`
- **Interfaces**: `[name].interface.ts`
- **Guards**: `[name].guard.ts`
- **Modules/Routes**: `[name].routes.ts`
- **Functions**: `[name].function.ts`

## Path Aliases (tsconfig.app.json)

/_ To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. _/
/_ To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. _/

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": ["node"],
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@db/*": ["db/*"], // Only if backend logic is shared/mocked
      "@service/*": ["services/*"],
      "@type/*": ["types/*"],
      "@interface/*": ["interfaces/*"],
      "@function/*": ["functions/*"],
      "@enum/*": ["enums/*"],
      "@component/*": ["components/*"],
      "@module/*": ["modules/*"],
      "@core/*": ["core/*"],
      "@guard/*": ["guards/*"],
      "@route/*": ["routes/*"],
      "@interceptor/*": ["interceptors/*"],
      "@environment/*": ["environments/*"],
      "@template/*": ["templates/*"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```
