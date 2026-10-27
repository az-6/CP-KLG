// Membuat src/data/indonesia-map.ts dari data Natural Earth 1:50m (paket world-atlas).
// Jalankan ulang hanya bila batas wilayah atau proyeksi peta perlu diubah:
//   node scripts/generate-indonesia-map.mjs
import { writeFile } from 'node:fs/promises';

const SOURCE = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json';
const INDONESIA = '360';
const NEIGHBOURS = new Set(['458', '598', '626', '096', '608', '036']); // MY, PG, TL, BN, PH, AU

// Proyeksi equirectangular dengan koreksi kosinus lintang tengah.
export const BOUNDS = { west: 94.6, east: 143.6, north: 6.6, south: -14 };
const WIDTH = 1000;
const kx = Math.cos((((BOUNDS.north + BOUNDS.south) / 2) * Math.PI) / 180);
const HEIGHT = Math.round((WIDTH * (BOUNDS.north - BOUNDS.south)) / ((BOUNDS.east - BOUNDS.west) * kx));

const project = ([lon, lat]) => [
  ((lon - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * WIDTH,
  ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * HEIGHT,
];

const topology = await (await fetch(SOURCE)).json();
const { scale, translate } = topology.transform;

const arcs = topology.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

const ring = (indexes) =>
  indexes.flatMap((index, position) => {
    const points = index < 0 ? [...arcs[~index]].reverse() : arcs[index];
    return position === 0 ? points : points.slice(1);
  });

const inView = ([lon, lat]) =>
  lon > BOUNDS.west - 2 && lon < BOUNDS.east + 2 && lat > BOUNDS.south - 2 && lat < BOUNDS.north + 2;

const toPath = (geometry) => {
  const polygons = geometry.type === 'Polygon' ? [geometry.arcs] : geometry.type === 'MultiPolygon' ? geometry.arcs : [];
  let d = '';
  for (const polygon of polygons) {
    const outer = ring(polygon[0]);
    if (!outer.some(inView)) continue;
    let last = null;
    const points = outer.map(project).filter(([x, y]) => {
      const key = `${Math.round(x)},${Math.round(y)}`;
      if (key === last) return false;
      last = key;
      return true;
    });
    if (points.length < 3) continue;
    d += `M${points.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join('L')}Z`;
  }
  return d;
};

const geometries = topology.objects.countries.geometries;
const indonesia = toPath(geometries.find((g) => g.id === INDONESIA));
const neighbours = geometries.filter((g) => NEIGHBOURS.has(g.id)).map(toPath).join('');

const output = `// Dibuat oleh scripts/generate-indonesia-map.mjs dari Natural Earth 1:50m (world-atlas@2.0.2).
// Jangan disunting manual.
export const MAP_WIDTH = ${WIDTH};
export const MAP_HEIGHT = ${HEIGHT};
export const MAP_BOUNDS = ${JSON.stringify(BOUNDS)};
export const MAP_COS = ${kx.toFixed(6)};
export const indonesiaPath = '${indonesia}';
export const neighbourPath = '${neighbours}';
`;

await writeFile(new URL('../src/data/indonesia-map.ts', import.meta.url), output);
console.log(`indonesia-map.ts ${WIDTH}x${HEIGHT}, ${(output.length / 1024).toFixed(1)} KB`);
