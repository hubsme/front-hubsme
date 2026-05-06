// Usando import.meta.env (Angular 17+ con Vite/esbuild)
export const environment = {
  baseUrl: import.meta.env?.['NG_APP_BASE_URL'],
  production: false
};
