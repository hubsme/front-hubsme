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

## Running the SSR server

After building, start the SSR server with:

```bash
npm run serve:ssr:front-hubsme
```

The project does not currently define an end-to-end test script.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
