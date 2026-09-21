const fs = require('fs');
const path = require('path');

const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';

const OVERRIDES_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'strain-overrides.json');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'strains-sync.json');
const IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'strains');
const IMAGES_PUBLIC_PATH = '/images/strains';

function extFromMime(mimeType) {
  const known = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' };
  return known[mimeType] || 'webp';
}

// Cannanas image URLs are short-lived signed links (expire after ~24h), so we
// download the file once per sync and commit it as a normal static asset.
async function downloadStrainImage(id, image) {
  if (!image || !image.url) return undefined;
  const res = await fetch(image.url);
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromMime(image.mimeType);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, `${id}.${ext}`), buffer);
  return `${IMAGES_PUBLIC_PATH}/${id}.${ext}`;
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// indica_sativa_ratio: negative = indica-leaning, positive = sativa-leaning, range roughly -100..100
function ratioToPercents(ratio) {
  const r = typeof ratio === 'number' ? ratio : 0;
  const indica = Math.round(50 - r / 2);
  const sativa = 100 - indica;
  return { indica, sativa };
}

// Cannanas stores terpene_profile as free text. Some entries start with a
// "Tag · Tag · Tag" line before the prose description - extract that if present.
function extractTerpeneTags(profile) {
  if (!profile) return { tags: [], rest: '' };
  const firstBreak = profile.indexOf('\n');
  const firstLine = firstBreak === -1 ? profile : profile.slice(0, firstBreak);
  if (firstLine.includes('·')) {
    const tags = firstLine.split('·').map((s) => s.trim()).filter(Boolean);
    const rest = firstBreak === -1 ? '' : profile.slice(firstBreak).trim();
    return { tags, rest };
  }
  return { tags: [], rest: profile.trim() };
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

  // The strain library's "public" flag is unrelated to what's actually being
  // dispensed - the real source of truth for "currently available" is which
  // products have stock right now. Each product embeds its full strain info,
  // so we don't need the separate /strains endpoint at all.
  const productsResponse = await fetchJson(`/v1/clubs/${CLUB_ID}/products`);
  const products = productsResponse.products || [];

  const overrides = fs.existsSync(OVERRIDES_PATH)
    ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))
    : {};

  // Multiple batches of the same strain can be listed separately (e.g. two
  // Tiramisu harvests) - keep only the one with the most stock per strain.
  // "can_be_selected_by_users" is the club's own toggle for "released to
  // members" - that's the real signal for what belongs on the site, not
  // stock level or the strain library's unrelated "public" flag.
  const bestProductByStrain = new Map();
  for (const p of products) {
    if (!p.strain || !p.strain.id) continue;
    if (!p.can_be_selected_by_users) continue;
    const stock = (p.availabilities || []).reduce((sum, a) => sum + (a.quantity || 0), 0);
    if (stock <= 0) continue;
    const existing = bestProductByStrain.get(p.strain.id);
    if (!existing || stock > existing.stock) {
      bestProductByStrain.set(p.strain.id, { product: p, stock });
    }
  }

  const mapped = [];
  for (const { product: p } of bestProductByStrain.values()) {
    const s = p.strain;
    const id = slugify(s.name);
    const { indica, sativa } = ratioToPercents(s.indica_sativa_ratio);
    const { tags: terpeneTags, rest: terpeneRest } = extractTerpeneTags(s.terpene_profile);

    const override = overrides[id] || {};
    const finalTerpenes = override.terpenes || terpeneTags;

    // Cannanas is the source of truth, but fall back to a manually written
    // description when the club never filled one in over there.
    let description = (s.description || override.description || '').trim();
    // Only fold the raw terpene text into the description when we have no
    // clean tag list for it (otherwise it just duplicates the tags below).
    if (terpeneRest && finalTerpenes.length === 0) {
      description = [description, terpeneRest].filter(Boolean).join('\n\n');
    }
    if (s.effects) description = [description, s.effects.trim()].filter(Boolean).join('\n\n');

    const image = await downloadStrainImage(id, s.image);

    mapped.push({
      id,
      name: s.name,
      // The product-level thc/cbd reflect the actual tested batch; fall back
      // to the strain library's figures if a batch value is missing.
      thc: p.thc != null ? `${p.thc}%` : s.thc || '-',
      cbd: p.cbd != null ? `${p.cbd}%` : s.cbd || '-',
      indica,
      sativa,
      description,
      description_en: override.description_en,
      effects: override.effects || [],
      effects_en: override.effects_en,
      medicalEffects: override.medicalEffects,
      medicalEffects_en: override.medicalEffects_en,
      terpenes: finalTerpenes,
      terpenes_en: override.terpenes_en,
      genetics: s.genetics || '',
      breeder: s.breeder || '',
      image,
    });
  }

  mapped.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapped, null, 2) + '\n', 'utf8');
  console.log(`Synced ${mapped.length} currently available strains -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
