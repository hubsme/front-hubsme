import { ApiResponse } from 'api/backend.api';

export type RecommendedConsultant = ApiResponse<'consultant', 'findAll'>['data'][number];
export type CriticalArea = ApiResponse<'diagnostic', 'findOne'>['result']['areasEvaluadas'][number];
export type AreaConsultantsMap = Record<string, RecommendedConsultant[]>;

const AREA_KEYWORDS: Record<string, string[]> = {
  estrategica: ['estrateg', 'gestion', 'negocio', 'planeac', 'crecimiento'],
  financiera: ['finan', 'caja', 'costo', 'presupuest', 'contab', 'tribut'],
  'comercial / ventas': ['vent', 'comerc', 'client', 'satisfac', 'lead', 'negoc'],
  marketing: ['market', 'vent', 'digital', 'comerc', 'redes', 'publicid'],
  'servicio al cliente': ['servi', 'client', 'satisfac', 'soporte'],
  operaciones: ['operac', 'logist', 'proces', 'calidad', 'inventar', 'producc'],
  'organizacional / rrhh': ['rrhh', 'talent', 'organiza', 'cultur', 'equip', 'funcion', 'rol'],
  tecnologia: ['tecnol', 'sistem', 'softw', 'digital', 'ti', 'it'],
  legal: ['legal', 'contrat', 'document', 'normat', 'cumplim'],
  laboral: ['labor', 'planilla', 'contrat', 'trabaj', 'cumplim'],
  'tributario / contable': ['tribut', 'contab', 'sunat', 'impuest', 'auditor'],
};

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const searchableProfile = (consultant: RecommendedConsultant): string =>
  [
    consultant.headline,
    consultant.bio,
    ...consultant.diagnosticAreas,
    ...consultant.specialties,
    ...consultant.sectors,
    ...consultant.industries,
    ...consultant.services,
    ...consultant.workedSectors,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalize)
    .join(' ');

export const recommendConsultantsByArea = (
  consultants: RecommendedConsultant[],
  criticalAreas: CriticalArea[],
  recommendationsPerArea = 3,
): AreaConsultantsMap => {
  const result: AreaConsultantsMap = {};
  const globallyUsedIds = new Set<number>();

  const rankedAreas = criticalAreas.map((area) => {
    const normalizedArea = normalize(area.area);
    const keywords = AREA_KEYWORDS[normalizedArea] ?? [normalizedArea];
    const ranked = consultants
      .map((consultant, originalIndex) => {
        const profile = searchableProfile(consultant);
        const hasDirectMatch = consultant.diagnosticAreas.some(
          (areaName) => normalize(areaName) === normalizedArea,
        );
        const keywordScore = keywords.reduce(
          (total, keyword) => total + (profile.includes(keyword) ? 1 : 0),
          0,
        );
        const score = hasDirectMatch ? 1000 + keywordScore : keywordScore;
        return { consultant, originalIndex, score };
      })
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score || left.originalIndex - right.originalIndex)
      .map(({ consultant }) => consultant);

    return { area, ranked };
  });

  for (const { area, ranked } of rankedAreas) {
    const selected = ranked
      .filter((consultant) => !globallyUsedIds.has(consultant.id))
      .slice(0, recommendationsPerArea);

    selected.forEach((consultant) => globallyUsedIds.add(consultant.id));
    result[area.area] = selected;
  }

  for (const { area } of rankedAreas) {
    const selected = result[area.area];
    const unused = consultants.filter((consultant) => !globallyUsedIds.has(consultant.id));

    for (const consultant of unused) {
      if (selected.length >= recommendationsPerArea) break;
      selected.push(consultant);
      globallyUsedIds.add(consultant.id);
    }
  }

  for (const { area, ranked } of rankedAreas) {
    const selected = result[area.area];
    const repeatPool = ranked.length > 0 ? ranked : consultants;
    let repeatIndex = 0;

    while (selected.length < recommendationsPerArea && repeatPool.length > 0) {
      selected.push(repeatPool[repeatIndex % repeatPool.length]);
      repeatIndex += 1;
    }
  }

  return result;
};
