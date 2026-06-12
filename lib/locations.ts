export interface Location {
  slug: string;
  name: string;
  zone: 'costa' | 'collina' | 'montagna';
  lat: number;
  lon: number;
  elevation: number;
  description?: string;
}

export const LOCATIONS: Location[] = [
  { slug: 'teramo',           name: 'Teramo',                zone: 'collina',  lat: 42.6589, lon: 13.7036, elevation: 274,  description: 'Centro storico' },
  { slug: 'giulianova',       name: 'Giulianova',            zone: 'costa',    lat: 42.7504, lon: 13.9570, elevation: 10  },
  { slug: 'roseto',           name: 'Roseto degli Abruzzi',  zone: 'costa',    lat: 42.6787, lon: 14.0185, elevation: 5   },
  { slug: 'alba-adriatica',   name: 'Alba Adriatica',        zone: 'costa',    lat: 42.8327, lon: 13.9266, elevation: 5   },
  { slug: 'tortoreto',        name: 'Tortoreto',             zone: 'costa',    lat: 42.8040, lon: 13.9250, elevation: 14  },
  { slug: 'silvi',            name: 'Silvi',                 zone: 'costa',    lat: 42.5423, lon: 14.1184, elevation: 13  },
  { slug: 'atri',             name: 'Atri',                  zone: 'collina',  lat: 42.5826, lon: 13.9787, elevation: 442 },
  { slug: 'campli',           name: 'Campli',                zone: 'collina',  lat: 42.7289, lon: 13.6896, elevation: 580 },
  { slug: 'civitella',        name: 'Civitella del Tronto',  zone: 'collina',  lat: 42.7700, lon: 13.6633, elevation: 589 },
  { slug: 'montorio',         name: 'Montorio al Vomano',    zone: 'collina',  lat: 42.5787, lon: 13.6357, elevation: 305 },
  { slug: 'isola-gran-sasso', name: 'Isola del Gran Sasso',  zone: 'montagna', lat: 42.4981, lon: 13.6628, elevation: 415 },
  { slug: 'pietracamela',     name: 'Pietracamela',          zone: 'montagna', lat: 42.5239, lon: 13.5833, elevation: 1005 },
  { slug: 'cortino',          name: 'Cortino',               zone: 'montagna', lat: 42.5611, lon: 13.5611, elevation: 820 },
];

export const DEFAULT_LOCATION = LOCATIONS[0];

export function getLocation(slug: string | null | undefined): Location {
  if (!slug) return DEFAULT_LOCATION;
  return LOCATIONS.find(l => l.slug === slug) ?? DEFAULT_LOCATION;
}
