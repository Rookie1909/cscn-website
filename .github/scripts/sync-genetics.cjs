const fs = require('fs');
const path = require('path');

const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_URL = DEEPL_API_KEY && DEEPL_API_KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

const OVERRIDES_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'strain-overrides.json');
const OUTPUT_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'genetics.json');
const IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'strains');
const IMAGES_PUBLIC_PATH = '/images/strains';

const TRANSLATION_TARGETS = [
  { suffix: 'en', deepl: 'EN' },
  { suffix: 'fi', deepl: 'FI' },
  { suffix: 'it', deepl: 'IT' },
];

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

function ratioToPercents(ratio) {
  const r = typeof ratio === 'number' ? ratio : 0;
  const indica = Math.round(50 - r / 2);
  const sativa = 100 - indica;
  return { indica, sativa };
}

function typeFromPercents(indica, sativa) {
  if (indica >= 60) return 'indica';
  if (sativa >= 60) return 'sativa';
  return 'hybrid';
}

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

async function downloadImage(id, image) {
  if (!image || !image.url) return undefined;
  const res = await fetch(image.url);
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromMime(image.mimeType);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.writeFileSync(path.join(IMAGES_DIR, `${id}.${ext}`), buffer);
  return `${IMAGES_PUBLIC_PATH}/${id}.${ext}`;
}

async function translateTo(texts, targetLang) {
  if (!DEEPL_API_KEY) return texts.map(() => undefined);
  const nonEmptyIndexes = texts.map((t, i) => (t ? i : -1)).filter((i) => i !== -1);
  if (nonEmptyIndexes.length === 0) return texts.map(() => undefined);
  const params = new URLSearchParams();
  nonEmptyIndexes.forEach((i) => params.append('text', texts[i]));
  params.append('source_lang', 'DE');
  params.append('target_lang', targetLang);
  try {
    const res = await fetch(DEEPL_URL, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    if (!res.ok) {
      console.error(`DeepL translation (${targetLang}) failed: ${res.status} ${await res.text()}`);
      return texts.map(() => undefined);
    }
    const data = await res.json();
    const result = new Array(texts.length).fill(undefined);
    nonEmptyIndexes.forEach((origIndex, j) => {
      result[origIndex] = data.translations[j].text;
    });
    return result;
  } catch (err) {
    console.error(`DeepL translation (${targetLang}) error:`, err.message);
    return texts.map(() => undefined);
  }
}

async function autoTranslate({ description, terpenes, effects }, override) {
  const result = {};
  for (const { suffix, deepl } of TRANSLATION_TARGETS) {
    const jobs = [];
    const texts = [];
    const push = (job, text) => { jobs.push(job); texts.push(text); };
    if (description && !override[`description_${suffix}`]) push('description', description);
    if (!override[`terpenes_${suffix}`]) terpenes.forEach((t) => push('terpenes', t));
    if (!override[`effects_${suffix}`]) effects.forEach((e) => push('effects', e));
    if (texts.length === 0) continue;
    const translated = await translateTo(texts, deepl);
    const out = { terpenes: [], effects: [] };
    jobs.forEach((job, i) => {
      if (job === 'description') out.description = translated[i];
      else out[job].push(translated[i]);
    });
    if (out.description) result[`description_${suffix}`] = out.description;
    if (out.terpenes.length > 0) result[`terpenes_${suffix}`] = out.terpenes;
    if (out.effects.length > 0) result[`effects_${suffix}`] = out.effects;
  }
  return result;
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

  const [strains, productsResponse, batchesResponse, plantsResponse, zonesResponse] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/strains`),
    fetchJson(`/v1/clubs/${CLUB_ID}/products`),
    fetchJson(`/v1/clubs/${CLUB_ID}/batches`),
    fetchJson(`/v1/clubs/${CLUB_ID}/plants?archived=false&is_mother=true`),
    fetchJson(`/v1/clubs/${CLUB_ID}/zones`),
  ]);
  const products = productsResponse.products || [];
  const batches = batchesResponse.items || [];
  const motherPlants = plantsResponse.items || plantsResponse;
  const zones = zonesResponse.items || zonesResponse;

  // Availability status is informational only, computed from live stock/grow
  // data - never exposed as exact numbers, just "available" / "next harvest".
  const availableStrainIds = new Set(
    products
      .filter((p) => p.can_be_selected_by_users && (p.availabilities || []).some((a) => a.quantity > 0))
      .map((p) => p.strain && p.strain.id)
      .filter(Boolean)
  );
  const floweringStrainIds = new Set(
    batches.filter((b) => !b.archived && b.status === 'FLOWERING').map((b) => b.strain_id)
  );

  const overrides = fs.existsSync(OVERRIDES_PATH)
    ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'))
    : {};

  // "Our genetics" is the club's own curated mother-plant portfolio, not tied
  // to what happens to be in stock right now: a strain belongs here exactly
  // when it has a mother plant in the dedicated "Reproduktion" zone.
  const reproductionZone = zones.find((z) => /reproduktion/i.test(z.name));
  if (!reproductionZone) {
    throw new Error('Zone "Reproduktion" wurde in Cannanas nicht gefunden');
  }
  const motherStrainIds = new Set(
    motherPlants.filter((p) => p.zone_id === reproductionZone.id).map((p) => p.strain_id)
  );
  const publicStrains = strains.filter((s) => motherStrainIds.has(s.id) && !s.archived);

  const entries = [];
  for (const s of publicStrains) {
    const id = slugify(s.name);
    const { indica, sativa } = ratioToPercents(s.indica_sativa_ratio);
    const { tags: terpeneTags, rest: terpeneRest } = extractTerpeneTags(s.terpene_profile);
    const override = overrides[id] || {};
    const finalTerpenes = override.terpenes || terpeneTags;
    const germanEffects = override.effects || [];

    let description = (s.description || override.description || '').trim();
    if (terpeneRest && finalTerpenes.length === 0) {
      description = [description, terpeneRest].filter(Boolean).join('\n\n');
    }
    if (s.effects) description = [description, s.effects.trim()].filter(Boolean).join('\n\n');

    const image = await downloadImage(id, s.image);
    const auto = await autoTranslate(
      { description, terpenes: finalTerpenes, effects: germanEffects },
      override
    );

    const status = availableStrainIds.has(s.id)
      ? 'available'
      : floweringStrainIds.has(s.id)
        ? 'next_harvest'
        : 'none';

    const entry = {
      id,
      name: s.name,
      type: typeFromPercents(indica, sativa),
      indica,
      sativa,
      thc: s.thc || '-',
      cbd: s.cbd || '-',
      genetics: s.genetics || '',
      breeder: s.breeder || '',
      description,
      effects: germanEffects,
      terpenes: finalTerpenes,
      image,
      status,
    };
    for (const { suffix } of TRANSLATION_TARGETS) {
      entry[`description_${suffix}`] = override[`description_${suffix}`] || auto[`description_${suffix}`];
      entry[`effects_${suffix}`] = override[`effects_${suffix}`] || auto[`effects_${suffix}`];
      entry[`terpenes_${suffix}`] = override[`terpenes_${suffix}`] || auto[`terpenes_${suffix}`];
    }
    entries.push(entry);
  }

  entries.sort((a, b) => a.name.localeCompare(b.name, 'de'));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2) + '\n', 'utf8');
  console.log(`Synced ${entries.length} genetics -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
