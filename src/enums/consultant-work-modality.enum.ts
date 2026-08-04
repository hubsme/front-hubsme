import type { ApiBody } from 'api/backend.api';

export type ConsultantWorkModality = NonNullable<ApiBody<'consultant', 'create'>['workModality']>;

export const DEFAULT_CONSULTANT_WORK_MODALITY: ConsultantWorkModality = 'remote';

export const CONSULTANT_WORK_MODALITY_OPTIONS = [
  { value: 'remote', label: 'Remoto' },
] as const satisfies readonly { value: ConsultantWorkModality; label: string }[];

export function normalizeConsultantWorkModality(
  _value: string | null | undefined,
): ConsultantWorkModality {
  return DEFAULT_CONSULTANT_WORK_MODALITY;
}

export function consultantWorkModalityLabel(value: string | null | undefined): string {
  return value ? 'Remoto' : '-';
}
