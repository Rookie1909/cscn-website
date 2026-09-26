const fs = require('fs');
const path = require('path');

// Shared DeepL helper for the Cannanas sync scripts. Every German string is
// translated once per language and remembered in a committed cache file, so
// the 6-hourly syncs only send new or changed texts to DeepL instead of the
// whole catalogue on every run.
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
// DeepL marks free-tier keys with a ":fx" suffix, which also determines the endpoint.
const DEEPL_URL = DEEPL_API_KEY && DEEPL_API_KEY.endsWith(':fx')
  ? 'https://api-free.deepl.com/v2/translate'
  : 'https://api.deepl.com/v2/translate';

const CACHE_PATH = path.join(__dirname, '..', 'translation-cache.json');

// Languages the site is translated into besides German (the source), and the
// suffix used for each on both locale keys (e.g. description_fi) and DeepL's
// target_lang codes.
const TRANSLATION_TARGETS = [
  { suffix: 'en', deepl: 'EN' },
  { suffix: 'fi', deepl: 'FI' },
  { suffix: 'it', deepl: 'IT' },
];

const cache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) : {};
let cacheDirty = false;
let charactersSent = 0;

function remember(targetLang, source, translated) {
  if (!source || typeof translated !== 'string' || !translated) return;
  cache[targetLang] = cache[targetLang] || {};
  if (cache[targetLang][source] !== translated) {
    cache[targetLang][source] = translated;
    cacheDirty = true;
  }
}

// Fills the cache from a previous sync output, so translations that already
// exist on the site are reused instead of being requested again.
function seedFromEntries(entries, fields) {
  for (const entry of entries || []) {
    for (const { suffix, deepl } of TRANSLATION_TARGETS) {
      for (const field of fields) {
        const source = entry[field];
        const translated = entry[`${field}_${suffix}`];
        if (typeof source === 'string') {
          remember(deepl, source, translated);
        } else if (Array.isArray(source) && Array.isArray(translated) && source.length === translated.length) {
          source.forEach((s, i) => remember(deepl, s, translated[i]));
        }
      }
    }
  }
}

function seedFromFile(filePath, fields) {
  if (!fs.existsSync(filePath)) return;
  seedFromEntries(JSON.parse(fs.readFileSync(filePath, 'utf8')), fields);
}

// Translates a list of German strings to the given DeepL target language,
// preserving order. Cached strings are answered locally; only the rest goes
// to DeepL in one request. Entries that could not be translated stay undefined.
async function translateTo(texts, targetLang) {
  const known = cache[targetLang] || {};
  const result = texts.map((t) => (t ? known[t] : undefined));
  const missing = [...new Set(texts.filter((t, i) => t && result[i] === undefined))];
  if (missing.length === 0 || !DEEPL_API_KEY) return result;

  const params = new URLSearchParams();
  missing.forEach((t) => params.append('text', t));
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
      return result;
    }
    const data = await res.json();
    missing.forEach((t, j) => remember(targetLang, t, data.translations[j].text));
    charactersSent += missing.reduce((sum, t) => sum + t.length, 0);
  } catch (err) {
    console.error(`DeepL translation (${targetLang}) error:`, err.message);
    return result;
  }
  const updated = cache[targetLang] || {};
  return texts.map((t) => (t ? updated[t] : undefined));
}

function saveCache() {
  console.log(`DeepL: ${charactersSent} Zeichen neu übersetzt, Rest aus dem Cache.`);
  if (!cacheDirty) return;
  const sorted = {};
  for (const lang of Object.keys(cache).sort()) {
    sorted[lang] = Object.fromEntries(Object.entries(cache[lang]).sort(([a], [b]) => a.localeCompare(b, 'de')));
  }
  fs.writeFileSync(CACHE_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  cacheDirty = false;
}

module.exports = { TRANSLATION_TARGETS, translateTo, seedFromFile, saveCache };
