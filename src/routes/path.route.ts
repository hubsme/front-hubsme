import { ApiField } from 'api/backend.api';

type Rol = ApiField<'user', 'findOne', 'role'>;

export type PathNode = {
  _path: string;
  [key: string]: unknown;
};

export function buildPath(node: PathNode): string {
  const findFullPath = (obj: unknown, target: PathNode, path: string[] = []): string[] | null => {
    if (!obj || typeof obj !== 'object') return null;
    const current = obj as Record<string, unknown>;

    if (current === target) {
      return path;
    }

    for (const key in current) {
      if (key === '_path') continue;
      const value = current[key];
      const nextPath =
        '_path' in current && typeof current['_path'] === 'string' ? [...path, current['_path']] : path;
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
  pyme: {
    _path: 'pyme',
    dashboard: { _path: 'dashboard' },
    pymes: { _path: 'pymes' },
    consultants: { _path: 'consultants' },
    inbox: { _path: 'inbox' },
    meetings: { _path: 'meetings' },
    tasks: { _path: 'tasks' },
    documents: { _path: 'documents' },
    diagnostics: { _path: 'diagnostics' },
    subscription: { _path: 'subscription' },
    profile: { _path: 'profile' },
  },
  consultor: {
    _path: 'consultor',
    dashboard: { _path: 'dashboard' },
    pymes: { _path: 'pymes' },
    consultants: { _path: 'consultants' },
    inbox: { _path: 'inbox' },
    meetings: { _path: 'meetings' },
    tasks: { _path: 'tasks' },
    documents: { _path: 'documents' },
    diagnostics: { _path: 'diagnostics' },
    subscription: { _path: 'subscription' },
    profile: { _path: 'profile' },
  },
} as const;

export const ROUTE_CONFIG = {
  defaultRoutes: {
    admin: '',
    pyme: buildPath(PATH.pyme.dashboard),
    consultor: buildPath(PATH.consultor.dashboard),
  } as Record<Rol, string>,

  routeAccess: {
    [buildPath(PATH.pyme.dashboard)]: ['pyme'],
    [buildPath(PATH.pyme.pymes)]: ['pyme'],
    [buildPath(PATH.pyme.consultants)]: ['pyme'],
    [buildPath(PATH.pyme.inbox)]: ['pyme'],
    [buildPath(PATH.pyme.meetings)]: ['pyme'],
    [buildPath(PATH.pyme.tasks)]: ['pyme'],
    [buildPath(PATH.pyme.documents)]: ['pyme'],
    [buildPath(PATH.pyme.diagnostics)]: ['pyme'],
    [buildPath(PATH.pyme.subscription)]: ['pyme'],
    [buildPath(PATH.pyme.profile)]: ['pyme'],
    [buildPath(PATH.consultor.dashboard)]: ['consultor'],
    [buildPath(PATH.consultor.pymes)]: ['consultor'],
    [buildPath(PATH.consultor.consultants)]: ['consultor'],
    [buildPath(PATH.consultor.inbox)]: ['consultor'],
    [buildPath(PATH.consultor.meetings)]: ['consultor'],
    [buildPath(PATH.consultor.tasks)]: ['consultor'],
    [buildPath(PATH.consultor.documents)]: ['consultor'],
    [buildPath(PATH.consultor.diagnostics)]: ['consultor'],
    [buildPath(PATH.consultor.subscription)]: ['consultor'],
    [buildPath(PATH.consultor.profile)]: ['consultor'],
  } as Record<string, Rol[]>,
};

export function canAccessRoute(route: string, roles: Rol[]): boolean {
  const allowedRols = ROUTE_CONFIG.routeAccess[route];
  if (!allowedRols) return true;
  return roles.some((role) => allowedRols.includes(role));
}

export function getDefaultRoute(roles: Rol[]): string {
  const role = roles[0];
  return ROUTE_CONFIG.defaultRoutes[role] || '';
}
