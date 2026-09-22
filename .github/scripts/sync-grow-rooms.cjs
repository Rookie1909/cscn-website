const fs = require('fs');
const path = require('path');

const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';

const OUTPUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'grow-rooms.json');
const ZONE_IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'zones');
const ZONE_IMAGES_PUBLIC_PATH = '/images/zones';

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

  const [zones, batchesResponse] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/zones`),
    fetchJson(`/v1/clubs/${CLUB_ID}/batches`),
  ]);
  const batches = batchesResponse.items || [];

  // "Currently has an active batch" is only ever used internally to decide
  // which non-"Blüteraum"-named rooms count as real grow rooms (e.g. a
  // storage room pressed into service as a veg room) - it never appears in
  // the output. Neither does anything else about what's actually growing
  // where: no strains, no growth stage, no plant counts. This page only
  // ever shows the rooms themselves (photo + facility info), nothing about
  // their contents - that's a deliberate security/theft-prevention choice.
  const activeBatches = batches.filter((b) => !b.archived && b.zone_id && b.status);
  const zoneIdsInUse = new Set(activeBatches.map((b) => b.zone_id));
  // "Zwischenlager" is an interim/overflow room, not one of the club's actual
  // presentable grow rooms - never show it here even if it's briefly in use.
  const growRooms = zones.filter(
    (z) =>
      !z.archived &&
      !/zwischenlager/i.test(z.name) &&
      (/bl[üu]teraum/i.test(z.name) || zoneIdsInUse.has(z.id))
  );

  const rooms = [];
  for (const zone of growRooms) {
    const id = slugify(zone.name);
    const image = await downloadImage(id, zone.image, ZONE_IMAGES_DIR, ZONE_IMAGES_PUBLIC_PATH);

    rooms.push({
      id,
      name: zone.name.trim().replace(/\s+/g, ' '),
      description: zone.description || '',
      image,
      size: zone.size || undefined,
      lighting: zone.lighting || undefined,
      ventilation: zone.ventilation || undefined,
    });
  }

  rooms.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rooms, null, 2) + '\n', 'utf8');
  console.log(`Synced ${rooms.length} grow rooms -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
