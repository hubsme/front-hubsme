---
name: angular-api
description: ESPAÑOL - Guía para INTEGRAR CLIENTE API (Swagger/OpenAPI).
  Usa esta skill cuando el usuario pida: conectar con backend, configurar http client,
  manejar tokens de sesión, interceptores de error, usar endpoint generado,
  tipado estricto de requests/responses, o inyectar servicio Api.
---

# Angular API Integration

This skill details how to integrate the auto-generated `backend.api.ts` client (via swagger-typescript-api) into the Angular dependency injection system.

## 1. Provider Configuration (`app.config.ts`)

We provide the `Api` class using a factory to inject dependencies (`SessionService`, `Router`) and configure `HttpClient` for authentication and global error handling.

**File**: `src/app/app.config.ts`

```typescript
import { ApplicationConfig, inject, PLATFORM_ID } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Api, HttpClient } from 'api/backend.api'; // Ensure correct path to generated file
import { SessionService } from '@service/session.service';
import { buildPath, PATH } from '@route/path.route';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers

    // API Provider
    {
      provide: Api,
      useFactory: () => {
        const router = inject(Router);
        const platformId = inject(PLATFORM_ID);
        const sessionService = inject(SessionService);

        const http = new HttpClient({
          baseUrl: 'https://api.yourdomain.com', // Define your API URL

          // 1. Attach Token
          securityWorker: async () => {
            if (isPlatformBrowser(platformId)) {
              const session = localStorage.getItem('user_session');
              if (session) {
                const token = JSON.parse(session).accessToken;
                return { headers: { Authorization: `Bearer ${token}` } };
              }
            }
            return {};
          },

          // 2. Handle 401 Unauthorized
          customFetch: async (input, init) => {
            const response = await fetch(input, init);
            if (response.status === 401) {
              if (isPlatformBrowser(platformId)) {
                sessionService.removeSession();
                router.navigate([buildPath(PATH.auth.signIn)]);
              }
            }
            return response;
          },
        });

        return new Api(http);
      },
    },
  ],
};
```

## 2. Usage in Components

Inject the `Api` class directly. Use the generated helper types for strict typing of requests, responses, and queries.

### Available Helper Types

The generated `backend.api.ts` file includes powerful utility types to extract strict types from your API methods:

- **`ApiBody<Module, Method>`**: Extracts the payload type (e.g., for POST/PUT).
- **`ApiResponse<Module, Method>`**: Extracts the success response type.
- **`ApiQuery<Module, Method>`**: Extracts the query parameters object type.
- **`ApiField<Module, Method, Field>`**: Extracts the type of a specific field from the response.

### Example Implementation

**File**: `src/modules/[module]/[component].ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { Api, ApiBody, ApiResponse, ApiQuery } from 'api/backend.api';

@Component({
  // ...
})
export class SignInComponent {
  // Inject the configured API instance
  private api = inject(Api);

  // Example state with strict types
  users = signal<ApiResponse<'user', 'findAll'>['items']>([]);
  // users type is inferred as: UserResultDto[]

  loading = signal(false);

  fetchUsers(filters: ApiQuery<'user', 'findAll'>) {
    this.api.user.findAll(filters).then((res) => {
      this.users.set(res.data.items);
    });
  }

  onAction() {
    this.loading.set(true);

    // Strict typing for the payload: ApiBody<'auth', 'login'>
    const payload: ApiBody<'auth', 'login'> = {
      email: 'user@example.com',
      password: 'secretRequest',
    };

    // Call the API method (Promise-based)
    this.api.auth
      .login(payload)
      .then((res) => {
        if (res.error) {
          // Handle known backend errors
          console.error(res.error);
          return;
        }
        // Success logic
        console.log('Success:', res.data);
      })
      .catch((err) => {
        // Handle unexpected network errors
        console.error('Network error', err);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }
}
```
