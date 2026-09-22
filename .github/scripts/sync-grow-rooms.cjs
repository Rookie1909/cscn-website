const fs = require('fs');
const path = require('path');

const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';

const OUTPUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'grow-rooms.json');
const ZONE_IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'zones');
const ZONE_IMAGES_PUBLIC_PATH = '/images/zones';
const STRAIN_IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'strains');
const STRAIN_IMAGES_PUBLIC_PATH = '/images/strains';

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

// Cannanas image URLs are short-lived signed links (expire after ~24h), so we
// download the file once per sync and commit it as a normal static asset.
async function downloadImage(id, image, dir, publicPath) {
  if (!image || !image.url) return undefined;
  const res = await fetch(image.url);
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromMime(image.mimeType);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.${ext}`), buffer);
  return `${publicPath}/${id}.${ext}`;
}

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

  const [zones, batchesResponse, strains] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/zones`),
    fetchJson(`/v1/clubs/${CLUB_ID}/batches`),
    fetchJson(`/v1/clubs/${CLUB_ID}/strains`),
  ]);
  const batches = batchesResponse.items || [];

  const strainById = new Map(strains.map((s) => [s.id, s]));
  const activeBatches = batches.filter((b) => !b.archived && b.zone_id && b.status);

  // Show every room named "Blüteraum", whether or not it currently has
  // plants (an empty room between cycles is still a real room) - plus any
  // other room that's currently in active use, whatever it's called (rooms
  // get repurposed, e.g. a storage room pressed into service as a veg room).
  // This only ever skips zones that are both unnamed-as-flowering-room and
  // currently unused, i.e. the dispensary, drying room, etc.
  const zoneIdsInUse = new Set(activeBatches.map((b) => b.zone_id));
  const growRooms = zones.filter(
    (z) => !z.archived && (/bl[üu]teraum/i.test(z.name) || zoneIdsInUse.has(z.id))
  );

  // Deliberately not tracked or shown at all: growth stage and plant counts.
  // Knowing which strains are somewhere in the building is one thing; being
  // able to infer how far along or how much of it there is is a theft/
  // security risk this page shouldn't create, so that data never even makes
  // it into the room's strain list below.
  const strainImageCache = new Map();
  async function getStrainImage(strain) {
    if (strainImageCache.has(strain.id)) return strainImageCache.get(strain.id);
    const url = await downloadImage(
      slugify(strain.name),
      strain.image,
      STRAIN_IMAGES_DIR,
      STRAIN_IMAGES_PUBLIC_PATH
    );
    strainImageCache.set(strain.id, url);
    return url;
  }

  const rooms = [];
  for (const zone of growRooms) {
    const id = slugify(zone.name);
    const zoneBatches = activeBatches.filter((b) => b.zone_id === zone.id);

    const strainIdsInRoom = [...new Set(zoneBatches.map((b) => b.strain_id))];
    const strainsInRoom = [];
    for (const strainId of strainIdsInRoom) {
      const strain = strainById.get(strainId);
      if (!strain) continue;
      strainsInRoom.push({ name: strain.name, image: await getStrainImage(strain) });
    }
    strainsInRoom.sort((a, b) => a.name.localeCompare(b.name, 'de'));

    const image = await downloadImage(id, zone.image, ZONE_IMAGES_DIR, ZONE_IMAGES_PUBLIC_PATH);

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
