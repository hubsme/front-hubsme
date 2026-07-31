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
        '_path' in current && typeof current['_path'] === 'string'
          ? [...path, current['_path']]
          : path;
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
  policyPrivacy: { _path: 'politicas-de-privacidad' },
  termsConditions: { _path: 'terminos-y-condiciones' },
  dataDeletion: { _path: 'eliminacion-de-datos' },
  diagnostic: { _path: 'diagnostico' },
  meetingAccess: { _path: 'reuniones' },
  auth: {
    _path: 'auth',
    signIn: { _path: 'sign-in' },
    signUp: { _path: 'sign-up' },
    adminLogin: { _path: 'admin-login' },
    forgotPassword: { _path: 'forgot-password' },
    resetPassword: { _path: 'reset-password' },
  },
  backoffice: {
    _path: 'backoffice',
    promotionCodes: { _path: 'codigos-promocionales' },
    pymes: { _path: 'pymes' },
    consultants: { _path: 'consultores' },
    meetings: { _path: 'reuniones' },
  },
  admin: {
    _path: 'admin',
    pyme: {
      _path: 'pyme',
      dashboard: { _path: 'dashboard' },
      profile: { _path: 'profile' },
      diagnostics: { _path: 'diagnostics' },
      consultants: {
        _path: 'consultants',
        checkout: { _path: 'checkout' },
        profile: { _path: 'profile' },
        agendar: { _path: 'agendar' },
      },
      meetings: { _path: 'meetings' },
      tasks: { _path: 'tasks' },
      documents: { _path: 'documents' },
    },
    consultor: {
      _path: 'consultor',
      dashboard: { _path: 'dashboard' },
      profile: { _path: 'profile' },
      pymes: { _path: 'pymes' },
      meetings: { _path: 'meetings' },
      tasks: { _path: 'tasks' },
      documents: { _path: 'documents' },
      subscription: { _path: 'subscription' },
    },
  },
} as const;

export const ROUTE_CONFIG = {
  defaultRoutes: {
    admin: '',
    pyme: buildPath(PATH.admin.pyme.dashboard),
    consultor: buildPath(PATH.admin.consultor.dashboard),
  } as Record<Rol, string>,

  routeAccess: {
    [buildPath(PATH.diagnostic)]: ['pyme'],
    [buildPath(PATH.admin.pyme.dashboard)]: ['pyme'],
    [buildPath(PATH.admin.pyme.profile)]: ['pyme'],
    [buildPath(PATH.admin.pyme.diagnostics)]: ['pyme'],
    [buildPath(PATH.admin.pyme.consultants)]: ['pyme'],
    [buildPath(PATH.admin.pyme.consultants.agendar)]: ['pyme'],
    [buildPath(PATH.admin.pyme.consultants.profile)]: ['pyme'],
    [buildPath(PATH.admin.pyme.consultants.checkout)]: ['pyme'],
    [buildPath(PATH.admin.pyme.meetings)]: ['pyme'],
    [buildPath(PATH.admin.pyme.tasks)]: ['pyme'],
    [buildPath(PATH.admin.pyme.documents)]: ['pyme'],
    [buildPath(PATH.admin.consultor.dashboard)]: ['consultor'],
    [buildPath(PATH.admin.consultor.profile)]: ['consultor'],
    [buildPath(PATH.admin.consultor.pymes)]: ['consultor'],
    [buildPath(PATH.admin.consultor.meetings)]: ['consultor'],
    [buildPath(PATH.admin.consultor.tasks)]: ['consultor'],
    [buildPath(PATH.admin.consultor.documents)]: ['consultor'],
    [buildPath(PATH.admin.consultor.subscription)]: ['consultor'],
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
