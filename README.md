# Hubsme

This project uses Angular 20.3 with server-side rendering (SSR), Tailwind CSS and the generated API client from the backend.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:6200/`. The application will automatically reload whenever you modify any of the source files.

The backend URL is configured with the `NG_APP_BASE_URL` environment variable, normally `http://localhost:6001` for local development.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This compiles the browser and server bundles, then creates the browser `index.html` expected by the SSR deployment in `dist/`.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

## Fechas y zona horaria

La zona de negocio de Hubsme es `America/Lima` (UTC-5). Las conversiones están centralizadas en `src/functions/date.function.ts`; los componentes y servicios no deben declarar offsets, zonas horarias ni formateadores equivalentes por su cuenta.

Contrato de fechas:

- Los timestamps recibidos del backend representan instantes UTC y se muestran con `formatInPeru()`.
- Las fechas calendario usan `YYYY-MM-DD`. Para enviarlas como instante se usa `peruDateOnlyToUtc()`; no usar `new Date('YYYY-MM-DD')`.
- Para valores de `<input type="datetime-local">` usar `formatDateForDatetimeLocal()` y `peruDateTimeInputToUtc()`.
- Para claves de día o mes usar `dateKeyInPeru()` y `monthKeyInPeru()`.
- Para sumar días o meses a una fecha calendario usar `addDaysToDateOnly()` y `addMonthsToDateOnly()`.
- `formatInUtc()` se reserva para calendarios neutrales o valores `date-only` cuya aritmética es deliberadamente UTC.

El `DatePipe` global ya usa `es-PE` y `America/Lima` desde `app.config.ts`. En templates basta con `{{ value | date: 'dd/MM/yyyy HH:mm' }}`. Solo debe indicarse `UTC` explícitamente cuando el dato sea una fecha calendario neutral.

Ejemplo:

```ts
import {
  dateKeyInPeru,
  formatInPeru,
  peruDateTimeInputToUtc,
} from '@function/date.function';

const today = dateKeyInPeru();
const label = formatInPeru(apiTimestamp, { dateStyle: 'long', timeStyle: 'short' });
const startsAt = peruDateTimeInputToUtc('2026-08-20T15:30')?.toISOString();
```

## Running the SSR server

After building, start the SSR server with:

```bash
npm run serve:ssr:front-hubsme
```

The project does not currently define an end-to-end test script.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
