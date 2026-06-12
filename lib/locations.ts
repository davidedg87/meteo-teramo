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
  // ── Costa ────────────────────────────────────────────────────────────────
  { slug: 'martinsicuro',            name: 'Martinsicuro',               zone: 'costa',    lat: 42.8823, lon: 13.9177, elevation: 5    },
  { slug: 'alba-adriatica',          name: 'Alba Adriatica',             zone: 'costa',    lat: 42.8327, lon: 13.9266, elevation: 5    },
  { slug: 'tortoreto',               name: 'Tortoreto',                  zone: 'costa',    lat: 42.8040, lon: 13.9250, elevation: 14   },
  { slug: 'giulianova',              name: 'Giulianova',                 zone: 'costa',    lat: 42.7504, lon: 13.9570, elevation: 10   },
  { slug: 'roseto',                  name: 'Roseto degli Abruzzi',       zone: 'costa',    lat: 42.6787, lon: 14.0185, elevation: 5    },
  { slug: 'pineto',                  name: 'Pineto',                     zone: 'costa',    lat: 42.6003, lon: 14.0665, elevation: 32   },
  { slug: 'silvi',                   name: 'Silvi',                      zone: 'costa',    lat: 42.5423, lon: 14.1184, elevation: 13   },

  // ── Collina ───────────────────────────────────────────────────────────────
  { slug: 'ancarano',                name: 'Ancarano',                   zone: 'collina',  lat: 42.8617, lon: 13.7293, elevation: 260  },
  { slug: 'colonnella',              name: 'Colonnella',                 zone: 'collina',  lat: 42.8613, lon: 13.8661, elevation: 130  },
  { slug: 'controguerra',            name: 'Controguerra',               zone: 'collina',  lat: 42.8475, lon: 13.7620, elevation: 340  },
  { slug: 'sant-egidio',             name: "Sant'Egidio alla Vibrata",   zone: 'collina',  lat: 42.8347, lon: 13.7583, elevation: 130  },
  { slug: 'corropoli',               name: 'Corropoli',                  zone: 'collina',  lat: 42.8333, lon: 13.8333, elevation: 210  },
  { slug: 'torano-nuovo',            name: 'Torano Nuovo',               zone: 'collina',  lat: 42.8278, lon: 13.7879, elevation: 209  },
  { slug: 'nereto',                  name: 'Nereto',                     zone: 'collina',  lat: 42.8212, lon: 13.8230, elevation: 90   },
  { slug: 'sant-omero',              name: "Sant'Omero",                 zone: 'collina',  lat: 42.7891, lon: 13.8122, elevation: 275  },
  { slug: 'bellante',                name: 'Bellante',                   zone: 'collina',  lat: 42.7610, lon: 13.8150, elevation: 330  },
  { slug: 'campli',                  name: 'Campli',                     zone: 'collina',  lat: 42.7289, lon: 13.6896, elevation: 580  },
  { slug: 'civitella',               name: 'Civitella del Tronto',       zone: 'collina',  lat: 42.7700, lon: 13.6633, elevation: 589  },
  { slug: 'mosciano',                name: "Mosciano Sant'Angelo",       zone: 'collina',  lat: 42.7405, lon: 13.8890, elevation: 260  },
  { slug: 'teramo',                  name: 'Teramo',                     zone: 'collina',  lat: 42.6589, lon: 13.7036, elevation: 274, description: 'Centro storico' },
  { slug: 'morro-d-oro',             name: "Morro d'Oro",                zone: 'collina',  lat: 42.6818, lon: 13.7883, elevation: 230  },
  { slug: 'castellalto',             name: 'Castellalto',                zone: 'collina',  lat: 42.6500, lon: 13.8000, elevation: 350  },
  { slug: 'notaresco',               name: 'Notaresco',                  zone: 'collina',  lat: 42.6571, lon: 13.8958, elevation: 370  },
  { slug: 'canzano',                 name: 'Canzano',                    zone: 'collina',  lat: 42.6452, lon: 13.7929, elevation: 375  },
  { slug: 'torricella-sicura',       name: 'Torricella Sicura',          zone: 'collina',  lat: 42.6427, lon: 13.6521, elevation: 450  },
  { slug: 'cermignano',              name: 'Cermignano',                 zone: 'collina',  lat: 42.6042, lon: 13.8328, elevation: 350  },
  { slug: 'penna-sant-andrea',       name: "Penna Sant'Andrea",          zone: 'collina',  lat: 42.5813, lon: 13.7396, elevation: 350  },
  { slug: 'cellino-attanasio',       name: 'Cellino Attanasio',          zone: 'collina',  lat: 42.5897, lon: 13.8100, elevation: 300  },
  { slug: 'atri',                    name: 'Atri',                       zone: 'collina',  lat: 42.5826, lon: 13.9787, elevation: 442  },
  { slug: 'castilenti',              name: 'Castilenti',                 zone: 'collina',  lat: 42.5803, lon: 13.8538, elevation: 405  },
  { slug: 'montefino',               name: 'Montefino',                  zone: 'collina',  lat: 42.5618, lon: 13.8622, elevation: 440  },
  { slug: 'basciano',                name: 'Basciano',                   zone: 'collina',  lat: 42.5595, lon: 13.7303, elevation: 400  },
  { slug: 'castiglione-mr',          name: 'Castiglione M. Raimondo',    zone: 'collina',  lat: 42.5413, lon: 13.8508, elevation: 430  },
  { slug: 'bisenti',                 name: 'Bisenti',                    zone: 'collina',  lat: 42.5428, lon: 13.7968, elevation: 500  },
  { slug: 'montorio',                name: 'Montorio al Vomano',         zone: 'collina',  lat: 42.5787, lon: 13.6357, elevation: 305  },

  // ── Montagna ─────────────────────────────────────────────────────────────
  { slug: 'valle-castellana',        name: 'Valle Castellana',           zone: 'montagna', lat: 42.7289, lon: 13.4924, elevation: 700  },
  { slug: 'rocca-santa-maria',       name: 'Rocca Santa Maria',          zone: 'montagna', lat: 42.6835, lon: 13.5162, elevation: 1020 },
  { slug: 'cortino',                 name: 'Cortino',                    zone: 'montagna', lat: 42.5611, lon: 13.5611, elevation: 820  },
  { slug: 'tossicia',                name: 'Tossicia',                   zone: 'montagna', lat: 42.5508, lon: 13.6632, elevation: 600  },
  { slug: 'colledara',               name: 'Colledara',                  zone: 'montagna', lat: 42.5176, lon: 13.6888, elevation: 600  },
  { slug: 'pietracamela',            name: 'Pietracamela',               zone: 'montagna', lat: 42.5239, lon: 13.5833, elevation: 1005 },
  { slug: 'fano-adriano',            name: 'Fano Adriano',               zone: 'montagna', lat: 42.5380, lon: 13.5520, elevation: 1011 },
  { slug: 'crognaleto',              name: 'Crognaleto',                 zone: 'montagna', lat: 42.4873, lon: 13.5170, elevation: 894  },
  { slug: 'arsita',                  name: 'Arsita',                     zone: 'montagna', lat: 42.5148, lon: 13.7881, elevation: 750  },
  { slug: 'isola-gran-sasso',        name: 'Isola del Gran Sasso',       zone: 'montagna', lat: 42.4981, lon: 13.6628, elevation: 415  },
  { slug: 'castel-castagna',         name: 'Castel Castagna',            zone: 'montagna', lat: 42.4869, lon: 13.6996, elevation: 615  },
  { slug: 'castelli',                name: 'Castelli',                   zone: 'montagna', lat: 42.4855, lon: 13.7146, elevation: 600  },
];

export const DEFAULT_LOCATION = LOCATIONS.find(l => l.slug === 'teramo')!;

export function getLocation(slug: string | null | undefined): Location {
  if (!slug) return DEFAULT_LOCATION;
  return LOCATIONS.find(l => l.slug === slug) ?? DEFAULT_LOCATION;
}
