import comuniData from './comuni.json';

export type Zona = 'pianura' | 'collina' | 'montagna';

export interface Location {
  slug: string;
  name: string;
  sigla: string;       // sigla provincia (es. TE)
  provincia: string;
  regione: string;
  zone: Zona;
  lat: number;
  lon: number;
  elevation: number;
  capoluogo: boolean;  // comune più popoloso della provincia → stazione heat
}

interface RawComune {
  slug: string;
  nome: string;
  sigla: string;
  provincia: string;
  regione: string;
  zona: string;
  lat: number;
  lon: number;
  elevation: number;
  capoluogo: boolean;
}

export const LOCATIONS: Location[] = (comuniData as RawComune[]).map(c => ({
  slug: c.slug,
  name: c.nome,
  sigla: c.sigla,
  provincia: c.provincia,
  regione: c.regione,
  zone: c.zona as Zona,
  lat: c.lat,
  lon: c.lon,
  elevation: c.elevation,
  capoluogo: c.capoluogo,
}));

const BY_SLUG = new Map(LOCATIONS.map(l => [l.slug, l]));

/** Comuni più popolosi per provincia (~107): stazioni della mappa di calore. */
export const HEAT_STATIONS: Location[] = LOCATIONS.filter(l => l.capoluogo);

export const DEFAULT_LOCATION =
  BY_SLUG.get('roma') ?? LOCATIONS[0];

export function getLocation(slug: string | null | undefined): Location {
  if (!slug) return DEFAULT_LOCATION;
  return BY_SLUG.get(slug) ?? DEFAULT_LOCATION;
}
