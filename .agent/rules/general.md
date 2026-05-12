# REGLAS DEL PROYECTO - Frontend Transporte Terrestre

## 🌐 IDIOMA

- Todo el código, comentarios, nombres de variables y mensajes deben estar en **ESPAÑOL**.
- Excepción: Imports, nombres de librerías, y palabras clave del lenguaje (Angular, TS).

## 🏛️ ARQUITECTURA DE COMPONENTES

El proyecto usa Angular 20 con Standalone Components.

1. **Módulos y Rutas** (`src/modules/*`)
   - Estructura lazy-loaded por dominios.
   - Cada módulo tiene su `*.routes.ts`.
   - Componentes "página" (vistas completas).

2. **Componentes UI** (`src/components/*`)
   - Componentes puramente visuales y reusables (Dumb components).
   - Uso de Signals para inputs (`input.required()`) y outputs (`output()`).

3. **Servicios** (`src/services/*`)
   - Lógica de negocio y gestión de estado con Signals.
   - Inyección con `providedIn: 'root'`.

## 📦 API & DATOS

- Cliente API autogenerado en `src/api/backend.api.ts`.
- NUNCA editar manualmente `src/api/backend.api.ts`; se actualiza desde el backend con `npm run generate:types`.
- Inyección: `private api = inject(Api)`.
- Uso de tipos estrictos: `ApiBody`, `ApiQuery`, `ApiResponse`.
- **NUNCA** hacer llamadas `HttpClient` manuales si existe el endpoint en `Api`.

## 💅 ESTILOS (Tailwind CSS v4)

- **Principal**: Usar clases utilitarias de Tailwind.
- **Config**: `src/styles.css` con directivas `@theme`.
- **Tema**: Colores semánticos (primary, accent, danger) definidos en CSS variables.
- No usar CSS nativo para nuevos estilos.
- No usar colores nativos de Tailwind directamente.
- No usar tipografias que no esten declaradas en `src/styles.css`.
- Respetar la nomenclatura y patrones visuales existentes.

## 📍 PATH ALIASES

Usar siempre los aliases definidos en tsconfig.app.json:

- `@app/*` → src/app/
- `@api/*` → src/api/
- `@service/*` → src/services/
- `@component/*` → src/components/
- `@module/*` → src/modules/
- `@core/*` → src/core/
- `@guard/*` → src/guards/
- `@route/*` → src/routes/
- `@template/*` → src/templates/

## ✅ CONVENCIONES DE CÓDIGO

- **Inyección**: Usar `private servicio = inject(Servicio)` (No constructor).
- **Reactividad**: Preferir `signal`, `computed` y `effect` para variables, estados y derivaciones cuando aplique.
- **Control Flow**: Usar `@if`, `@for`, `@switch` (nueva sintaxis).
- **Formularios**: Reactive Forms con tipado estricto o Signals.

## 🚫 PROHIBICIONES

- NO usar `any`.
- NO usar `*ngIf`; usar `@if`.
- NO usar `*ngFor`; usar `@for`.
- NO usar `ngOnChanges` (usar `computed` o `effect`).
- NO manipular el DOM directamente (`document.querySelector`), usar `ElementRef`.
- NO mezclar idiomas (español en código, inglés en librerías).
