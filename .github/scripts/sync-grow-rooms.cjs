const fs = require('fs');
const path = require('path');

const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';

const OUTPUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'grow-rooms.json');
const IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'zones');
const IMAGES_PUBLIC_PATH = '/images/zones';

function extFromMime(mimeType) {
  const known = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' };
  return known[mimeType] || 'webp';
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Same short-lived-signed-URL situation as strain images - download once and
// commit as a static asset instead of storing the expiring URL.
async function downloadZoneImage(id, image) {
  if (!image || !image.url) return undefined;
  const res = await fetch(image.url);
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromMime(image.mimeType);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, `${id}.${ext}`), buffer);
  return `${IMAGES_PUBLIC_PATH}/${id}.${ext}`;
}

// We deliberately don't publish exact plant counts (security/theft
// consideration for a cannabis cultivation site) - just a coarse bucket.
function fillLevel(count) {
  if (count >= 25) return 'many';
  if (count >= 10) return 'moderate';
  return 'few';
}

const STAGE_MAP = {
  VEGETATIVE: 'vegetative',
  FLOWERING: 'flowering',
  CUTTING: 'cutting',
};
const STAGE_WEIGHT = { flowering: 3, vegetative: 2, cutting: 1 };
const FILL_WEIGHT = { many: 3, moderate: 2, few: 1 };

async function fetchJson(urlPath) {
  const res = await fetch(`${API_BASE}${urlPath}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`Cannanas API ${urlPath} -> ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  if (!CLUB_ID || !API_KEY) {
    throw new Error('CANNANAS_CLUB_ID oder CANNANAS_API_KEY ist nicht gesetzt');
  }

  const [zones, batchesResponse, plants, strains] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/zones`),
    fetchJson(`/v1/clubs/${CLUB_ID}/batches`),
    fetchJson(`/v1/clubs/${CLUB_ID}/plants`),
    fetchJson(`/v1/clubs/${CLUB_ID}/strains`),
  ]);
  const batches = batchesResponse.items || [];

  const strainById = new Map(strains.map((s) => [s.id, s]));
  const plantCountByBatch = new Map();
  for (const p of plants) {
    if (!p.batch_id) continue;
    plantCountByBatch.set(p.batch_id, (plantCountByBatch.get(p.batch_id) || 0) + 1);
  }

  const activeBatches = batches.filter((b) => !b.archived && b.zone_id && STAGE_MAP[b.status]);

  // Only rooms that currently have active cultivation show up - this
  // naturally excludes the dispensary, storage, drying room, etc. without
  // having to hardcode room names.
  const zoneIdsInUse = new Set(activeBatches.map((b) => b.zone_id));
  const activeZones = zones.filter((z) => zoneIdsInUse.has(z.id) && !z.archived);

  const rooms = [];
  for (const zone of activeZones) {
    const id = slugify(zone.name);
    const zoneBatches = activeBatches.filter((b) => b.zone_id === zone.id);

    // Merge batches of the same strain + growth stage within this room into
    // one entry (a strain is often split across several seeding batches).
    const grouped = new Map();
    for (const b of zoneBatches) {
      const strain = strainById.get(b.strain_id);
      const stage = STAGE_MAP[b.status];
      const key = `${b.strain_id}:${stage}`;
      const count = plantCountByBatch.get(b.id) || 0;
      const existing = grouped.get(key);
      if (existing) {
        existing.count += count;
      } else {
        grouped.set(key, { name: strain ? strain.name : 'Unbekannt', stage, count });
      }
    }

    const strainsInRoom = [...grouped.values()]
      .map(({ name, stage, count }) => ({ name, stage, fillLevel: fillLevel(count) }))
      .sort((a, b) => {
        const stageDiff = STAGE_WEIGHT[b.stage] - STAGE_WEIGHT[a.stage];
        if (stageDiff !== 0) return stageDiff;
        const fillDiff = FILL_WEIGHT[b.fillLevel] - FILL_WEIGHT[a.fillLevel];
        if (fillDiff !== 0) return fillDiff;
        return a.name.localeCompare(b.name, 'de');
      });

    const image = await downloadZoneImage(id, zone.image);

    rooms.push({
      id,
      name: zone.name.trim().replace(/\s+/g, ' '),
      description: zone.description || '',
      image,
      strains: strainsInRoom,
    });
  }

  rooms.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rooms, null, 2) + '\n', 'utf8');
  console.log(`Synced ${rooms.length} active grow rooms -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
