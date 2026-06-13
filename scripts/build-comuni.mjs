// Genera lib/comuni.json: tutti i comuni italiani con coordinate, provincia,
// regione, altitudine e zona altimetrica. L'altitudine viene recuperata una
// sola volta dall'API elevation di Open-Meteo e "cotta" nel file statico,
// così a runtime non servono chiamate extra.
//
// Uso:  node scripts/build-comuni.mjs
// Input (scaricati al volo):
//   - matteocontrini/comuni-json  → nome, codice ISTAT, provincia, regione, sigla, popolazione
//   - MatteoHenryChinaski/...      → coordinate (lat/lng) per codice ISTAT

import { writeFileSync } from 'node:fs';

const META_URL = 'https://raw.githubusercontent.com/matteocontrini/comuni-json/master/comuni.json';
const GEO_URL  = 'https://raw.githubusercontent.com/MatteoHenryChinaski/Comuni-Italiani-2018-Sql-Json-excel/master/italy_geo.json';

const normCode = c => String(parseInt(c, 10));

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // accenti
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Zona altimetrica semplificata (euristica su altitudine).
function zonaFromElevation(m) {
  if (m == null) return 'collina';
  if (m >= 500) return 'montagna';
  if (m >= 150) return 'collina';
  return 'pianura';
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchElevations(points, batch = 100) {
  const out = new Array(points.length).fill(null);
  for (let i = 0; i < points.length; i += batch) {
    const slice = points.slice(i, i + batch);
    const params = new URLSearchParams({
      latitude: slice.map(p => p.lat).join(','),
      longitude: slice.map(p => p.lon).join(','),
    });
    const url = `https://api.open-meteo.com/v1/elevation?${params}`;

    let data;
    for (let attempt = 0; ; attempt++) {
      const res = await fetch(url);
      if (res.ok) { data = await res.json(); break; }
      if (res.status === 429 && attempt < 6) {
        process.stdout.write(`\r  rate limit, attendo… (${i}/${points.length})            `);
        await sleep(65000); // il limite a minuto si resetta
        continue;
      }
      throw new Error(`elevation ${i} → ${res.status}`);
    }

    const arr = Array.isArray(data.elevation) ? data.elevation : [data.elevation];
    arr.forEach((e, j) => { out[i + j] = e == null ? null : Math.round(e); });
    process.stdout.write(`\r  elevation ${Math.min(i + batch, points.length)}/${points.length}            `);
    await sleep(1500); // andatura di crociera sotto il rate limit
  }
  process.stdout.write('\n');
  return out;
}

async function main() {
  console.log('Scarico dataset…');
  const [meta, geo] = await Promise.all([getJson(META_URL), getJson(GEO_URL)]);
  const geoByCode = new Map(geo.map(g => [normCode(g.istat), g]));

  // Join + scarto comuni senza coordinate.
  let comuni = meta
    .map(m => {
      const g = geoByCode.get(normCode(m.codice));
      if (!g) return null;
      return {
        nome: m.nome,
        sigla: m.sigla,
        provincia: m.provincia.nome,
        regione: m.regione.nome,
        lat: +(+g.lat).toFixed(4),
        lon: +(+g.lng).toFixed(4),
        popolazione: m.popolazione || 0,
      };
    })
    .filter(Boolean);

  console.log(`Comuni con coordinate: ${comuni.length}`);

  // Altitudine (una sola volta).
  console.log('Recupero altitudini da Open-Meteo…');
  const elevations = await fetchElevations(comuni);
  comuni.forEach((c, i) => {
    c.elevation = elevations[i];
    c.zona = zonaFromElevation(elevations[i]);
  });

  // Slug univoci (in caso di omonimie aggiungo la sigla provincia).
  const used = new Map();
  for (const c of comuni) {
    let s = slugify(c.nome);
    if (used.has(s)) s = `${s}-${c.sigla.toLowerCase()}`;
    let n = 2;
    while (used.has(s)) s = `${slugify(c.nome)}-${c.sigla.toLowerCase()}-${n++}`;
    used.set(s, true);
    c.slug = s;
  }

  // Capoluogo "di fatto" = comune più popoloso per provincia → stazioni heat.
  const topByProv = new Map();
  for (const c of comuni) {
    const cur = topByProv.get(c.provincia);
    if (!cur || c.popolazione > cur.popolazione) topByProv.set(c.provincia, c);
  }
  for (const c of topByProv.values()) c.capoluogo = true;

  // Ordina per nome, riordina i campi.
  comuni.sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
  const final = comuni.map(c => ({
    slug: c.slug,
    nome: c.nome,
    sigla: c.sigla,
    provincia: c.provincia,
    regione: c.regione,
    zona: c.zona,
    lat: c.lat,
    lon: c.lon,
    elevation: c.elevation,
    capoluogo: c.capoluogo || false,
  }));

  writeFileSync(new URL('../lib/comuni.json', import.meta.url), JSON.stringify(final));
  const stations = final.filter(c => c.capoluogo).length;
  console.log(`Scritto lib/comuni.json — ${final.length} comuni, ${stations} stazioni heat.`);
}

main().catch(e => { console.error(e); process.exit(1); });
