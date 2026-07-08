// Usando import.meta.env (Angular 17+ con Vite/esbuild)
export const environment = {
  baseUrl: import.meta.env?.['NG_APP_BASE_URL'],
  posthogApiKey: import.meta.env?.['NG_APP_POSTHOG_API_KEY'],
  posthogApiHost: import.meta.env?.['NG_APP_POSTHOG_API_HOST'],
  production: false
};
