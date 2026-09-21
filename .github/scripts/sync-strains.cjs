const fs = require('fs');
const path = require('path');

const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';

const OVERRIDES_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'strain-overrides.json');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'strains-sync.json');

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

  const [strains, productsResponse] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/strains`),
    fetchJson(`/v1/clubs/${CLUB_ID}/products`),
  ]);

  const products = productsResponse.products || [];

  const inStockStrainIds = new Set(
    products
      .filter((p) => (p.availabilities || []).some((a) => a.quantity > 0))
      .map((p) => p.strain && p.strain.id)
      .filter(Boolean)
  );

  const overrides = fs.existsSync(OVERRIDES_PATH)
    ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))
    : {};

  const publicStrains = strains.filter((s) => s.visibility === 'public' && !s.archived);

  const mapped = publicStrains.map((s) => {
    const id = slugify(s.name);
    const { indica, sativa } = ratioToPercents(s.indica_sativa_ratio);
    const { tags: terpeneTags, rest: terpeneRest } = extractTerpeneTags(s.terpene_profile);

    const override = overrides[id] || {};
    const finalTerpenes = override.terpenes || terpeneTags;

    let description = (s.description || '').trim();
    // Only fold the raw terpene text into the description when we have no
    // clean tag list for it (otherwise it just duplicates the tags below).
    if (terpeneRest && finalTerpenes.length === 0) {
      description = [description, terpeneRest].filter(Boolean).join('\n\n');
    }
    if (s.effects) description = [description, s.effects.trim()].filter(Boolean).join('\n\n');

    return {
      id,
      name: s.name,
      thc: s.thc || '-',
      cbd: s.cbd || '-',
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
      isSoldOut: !inStockStrainIds.has(s.id),
    };
  });

  mapped.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(mapped, null, 2) + '\n', 'utf8');
  console.log(`Synced ${mapped.length} public strains -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
