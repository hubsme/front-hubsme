---
name: angular-route
description: ESPAÑOL - Guía para RUTAS y NAVEGACIÓN.
  Usa esta skill cuando el usuario pida: configurar router, agregar nueva página,
  lazy loading, guards de roles, constantes de rutas (PATH), routerLink,
  o redirecciones.
---

# Angular Routing Architecture

This skill defines the standard for configuring routes in Angular. The key principles are:

1.  **Centralized PATHs**: Use a helper file (`path.route.ts`) to define all URL segments and access rules.
2.  **Lazy Loading**: Use `loadComponent` with standard dynamic imports.
3.  **Role-Based Access**: Centralized access control logic reusable by guards.

---

## 1. Route Configuration (`path.route.ts`)

Define the URL structure recursively using `_path` properties to build type-safe route trees.

**File**: `src/routes/path.route.ts`

```typescript
import { userRoleEnum } from '@db/tables/user.table'; // Adjust import as needed

// Verify your ApiField type definition
// import { ApiField } from "api/backend.api";
// type Rol = ApiField<"user","findOne","role">
export type Rol = (typeof userRoleEnum.enumValues)[number];

export type PathNode = {
  _path: string;
  [key: string]: any;
};

export function buildPath(node: PathNode): string {
  const findFullPath = (obj: any, target: PathNode, path: string[] = []): string[] | null => {
    if (!obj || typeof obj !== 'object') return null;

    if (obj === target) {
      return path;
    }

    for (const key in obj) {
      if (key === '_path') continue;

      const value = obj[key];
      const nextPath =
        '_path' in obj && typeof obj._path === 'string' ? [...path, obj._path] : path;

      const result = findFullPath(value, target, nextPath);
      if (result) return result;
    }

    return null;
  };

  const fullPath = findFullPath(PATH, node);

  if (!fullPath) {
    return node._path ?? '';
  }

  return [...fullPath, node._path].filter(Boolean).join('/');
}

export function getPath(node: PathNode): string {
  return node._path;
}

export const PATH = {
  auth: {
    _path: 'auth',
    signIn: { _path: 'sign-in' },
    signUp: { _path: 'sign-up' },
  },
  admin: {
    _path: 'admin',
    dashboard: {
      _path: 'dashboard',
    },
    user: {
      _path: 'user',
      list: { _path: 'list' },
      edit: { _path: 'edit/:id' },
    },
    // Add other modules here...
  },
} as const;

export const ROUTE_CONFIG = {
  defaultRoutes: {
    admin: buildPath(PATH.admin.dashboard),
    employee: buildPath(PATH.admin.dashboard),
    viewer: buildPath(PATH.admin.dashboard),
  } as Record<Rol, string>,

  routeAccess: {
    [buildPath(PATH.admin.dashboard)]: ['admin', 'employee', 'viewer'],
    [buildPath(PATH.admin.user)]: ['admin', 'employee'],
    [buildPath(PATH.admin.user.edit)]: ['admin'],
  } as Record<string, Rol[]>,
};

export function canAccessRoute(route: string, roles: Rol[]): boolean {
  const allowedRols = ROUTE_CONFIG.routeAccess[route];
  if (!allowedRols) return true;
  return roles.some((role) => allowedRols.includes(role));
}

export function getDefaultRoute(roles: Rol[]): string {
  const role = roles.length > 0 ? roles[0] : ('viewer' as Rol);
  return ROUTE_CONFIG.defaultRoutes[role] || buildPath(PATH.admin.dashboard);
}
```

---

## 2. Router Definition (`app.routes.ts`)

Use the `PATH` constants and `getPath` helper to define the router tree.

**File**: `src/app/app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '@guard/auth.guard';
import { PATH, getPath } from '@route/path.route';

export const routes: Routes = [
  // --- Admin Module ---
  {
    path: getPath(PATH.admin),
    loadComponent: () => import('@module/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
    children: [
      {
        path: getPath(PATH.admin.dashboard),
        loadComponent: () =>
          import('@module/admin/content/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: getPath(PATH.admin.user),
        loadComponent: () => import('@module/admin/content/user/user').then((m) => m.User),
        children: [
          {
            path: getPath(PATH.admin.user.list),
            loadComponent: () =>
              import('@module/admin/content/user/content/user-list/user-list').then(
                (m) => m.UserList,
              ),
          },
          {
            path: getPath(PATH.admin.user.edit),
            loadComponent: () =>
              import('@module/admin/content/user/content/user-edit/user-edit').then(
                (m) => m.UserEdit,
              ),
          },
          {
            path: '**',
            redirectTo: getPath(PATH.admin.user.list),
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '**',
        redirectTo: getPath(PATH.admin.dashboard),
        pathMatch: 'full',
      },
    ],
  },

  // --- Auth Module ---
  {
    path: getPath(PATH.auth),
    children: [
      {
        path: getPath(PATH.auth.signIn),
        loadComponent: () => import('@module/auth/sing-in/sing-in').then((m) => m.SingIn),
      },
      { path: '**', redirectTo: getPath(PATH.auth.signIn), pathMatch: 'full' },
    ],
  },

  // --- Fallback ---
  { path: '**', redirectTo: getPath(PATH.auth), pathMatch: 'full' },
];
```

---

## 3. Auth Guard (`auth.guard.ts`)

Implements session validation and role-based redirection using the logic from `path.route.ts`.

**File**: `src/guards/auth.guard.ts`

```typescript
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, type CanActivateFn } from '@angular/router';
import { canAccessRoute, getDefaultRoute, buildPath, PATH } from '@route/path.route';
import { SessionService } from '@service/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Allow SSR to pass through or handle usually
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // 1. Restore/Check Session
  sessionService.restoreSession();
  const session = sessionService.session();

  if (!session) {
    router.navigate([buildPath(PATH.auth.root, PATH.auth.signIn)]); // Ensure full path
    return false;
  }

  // 2. Check Role Access
  const user = session.user;
  // Extract clean path from URL (remove query params and leading slash)
  const currentPath = state.url.split('?')[0].replace(/^\//, '');

  if (user && user.role && !canAccessRoute(currentPath, [user.role])) {
    console.warn(`Access denied for role ${user.role} to ${currentPath}`);
    const defaultRoute = getDefaultRoute([user.role]);
    router.navigate([defaultRoute]);
    return false;
  }

  return true;
};
```
