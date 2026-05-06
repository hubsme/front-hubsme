import { ApiField } from 'api/backend.api';

type Rol = ApiField<'user', 'findOne', 'role'>;

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
  if (!fullPath) return node._path ?? '';
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
    dashboard: { _path: 'dashboard' },
    pymes: { _path: 'pymes' },
    consultants: { _path: 'consultants' },
    meetings: { _path: 'meetings' },
    tasks: { _path: 'tasks' },
    documents: { _path: 'documents' },
    diagnostics: { _path: 'diagnostics' },
    subscription: { _path: 'subscription' },
    users: { _path: 'users' },
  },
} as const;

export const ROUTE_CONFIG = {
  defaultRoutes: {
    admin: buildPath(PATH.admin.dashboard),
    pyme: buildPath(PATH.admin.dashboard),
    consultor: buildPath(PATH.admin.dashboard),
  } as Record<Rol, string>,

  routeAccess: {
    [buildPath(PATH.admin.dashboard)]: ['admin', 'pyme', 'consultor'],
    [buildPath(PATH.admin.pymes)]: ['admin', 'consultor'],
    [buildPath(PATH.admin.consultants)]: ['admin', 'pyme', 'consultor'],
    [buildPath(PATH.admin.meetings)]: ['admin', 'pyme', 'consultor'],
    [buildPath(PATH.admin.tasks)]: ['admin', 'pyme', 'consultor'],
    [buildPath(PATH.admin.documents)]: ['admin', 'pyme', 'consultor'],
    [buildPath(PATH.admin.diagnostics)]: ['admin', 'pyme'],
    [buildPath(PATH.admin.subscription)]: ['admin', 'consultor'],
    [buildPath(PATH.admin.users)]: ['admin'],
  } as Record<string, Rol[]>,
};

export function canAccessRoute(route: string, roles: Rol[]): boolean {
  const allowedRols = ROUTE_CONFIG.routeAccess[route];
  if (!allowedRols) return true;
  return roles.some((role) => allowedRols.includes(role));
}

export function getDefaultRoute(roles: Rol[]): string {
  const role = roles[0];
  return ROUTE_CONFIG.defaultRoutes[role] || buildPath(PATH.admin.dashboard);
}
