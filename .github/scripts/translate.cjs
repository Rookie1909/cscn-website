const fs = require('fs');
const path = require('path');

// Shared translation helper (Google Cloud Translation, Basic/v2) for the
// Cannanas sync and news scripts. Requests are kept to what is really needed:
//   1. every German string is translated once per language and remembered in
//      a committed cache file, so unchanged texts never hit the API again,
//   2. strings are normalized (whitespace) before lookup, so cosmetic edits
//      don't count as new texts,
//   3. strings without letters ("-", "22%") and duplicates are never sent,
//   4. a monthly character budget (tracked in the cache file) stops requests
//      well before Google's free tier of 500,000 characters is used up.
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';
const MONTHLY_BUDGET = Number(process.env.TRANSLATE_MONTHLY_BUDGET) || 400000;
// Google recommends staying below ~5,000 characters and 128 strings per request.
const MAX_CHARS_PER_REQUEST = 5000;
const MAX_STRINGS_PER_REQUEST = 100;

const CACHE_PATH = path.join(__dirname, '..', 'translation-cache.json');
const USAGE_KEY = '_usage';

// Languages the site is translated into besides German (the source): the
// suffix used on locale keys (e.g. description_fi) and the cache/API language.
const TRANSLATION_TARGETS = [
  { suffix: 'en', lang: 'EN' },
  { suffix: 'fi', lang: 'FI' },
  { suffix: 'it', lang: 'IT' },
];

const cache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) : {};
let cacheDirty = false;
let charactersSent = 0;
let skippedForBudget = 0;

function normalize(text) {
  return typeof text === 'string' ? text.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim() : '';
}

function worthTranslating(text) {
  return /\p{L}/u.test(text);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function usedThisMonth() {
  return (cache[USAGE_KEY] && cache[USAGE_KEY][currentMonth()]) || 0;
}

function addUsage(chars) {
  cache[USAGE_KEY] = cache[USAGE_KEY] || {};
  cache[USAGE_KEY][currentMonth()] = usedThisMonth() + chars;
  cacheDirty = true;
}

function remember(lang, source, translated) {
  const key = normalize(source);
  if (!key || typeof translated !== 'string' || !translated) return;
  cache[lang] = cache[lang] || {};
  if (cache[lang][key] !== translated) {
    cache[lang][key] = translated;
    cacheDirty = true;
  }
}

function lookup(lang, text) {
  const key = normalize(text);
  if (!key) return undefined;
  if (!worthTranslating(key)) return text;
  return cache[lang] && cache[lang][key];
}

// Fills the cache from a previous sync output, so translations that already
// exist on the site are reused instead of being requested again.
function seedFromEntries(entries, fields) {
  for (const entry of entries || []) {
    for (const { suffix, lang } of TRANSLATION_TARGETS) {
      for (const field of fields) {
        const source = entry[field];
        const translated = entry[`${field}_${suffix}`];
        if (typeof source === 'string') {
          remember(lang, source, translated);
        } else if (Array.isArray(source) && Array.isArray(translated) && source.length === translated.length) {
          source.forEach((s, i) => remember(lang, s, translated[i]));
        }
      }
    }
  }
}

function seedFromFile(filePath, fields) {
  if (!fs.existsSync(filePath)) return;
  seedFromEntries(JSON.parse(fs.readFileSync(filePath, 'utf8')), fields);
}

function chunk(texts) {
  const chunks = [];
  let current = [];
  let size = 0;
  for (const t of texts) {
    if (current.length > 0 && (current.length >= MAX_STRINGS_PER_REQUEST || size + t.length > MAX_CHARS_PER_REQUEST)) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(t);
    size += t.length;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

async function requestTranslations(texts, lang) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': API_KEY },
    body: JSON.stringify({ q: texts, source: 'de', target: lang.toLowerCase(), format: 'text' }),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.data.translations.map((t) => t.translatedText);
}

// Translates a list of German strings to the given target language,
// preserving order. Cached strings are answered locally; only new, translatable
// strings within the monthly budget go to the API. Entries that could not be
// translated stay undefined (the site then falls back to German).
async function translateTo(texts, lang) {
  const missing = [...new Set(texts.filter((t) => normalize(t) && lookup(lang, t) === undefined).map(normalize))];

  if (missing.length > 0 && !API_KEY) {
    console.warn(`GOOGLE_TRANSLATE_API_KEY fehlt – ${missing.length} Texte (${lang}) bleiben unübersetzt.`);
  } else if (missing.length > 0) {
    for (const batch of chunk(missing)) {
      const chars = batch.reduce((sum, t) => sum + t.length, 0);
      if (usedThisMonth() + chars > MONTHLY_BUDGET) {
        skippedForBudget += chars;
        continue;
      }
      try {
        const translated = await requestTranslations(batch, lang);
        addUsage(chars);
        charactersSent += chars;
        batch.forEach((t, i) => remember(lang, t, translated[i]));
      } catch (err) {
        console.error(`Google Translate (${lang}) fehlgeschlagen: ${err.message}`);
        break;
      }
    }
  }

  return texts.map((t) => lookup(lang, t));
}

function saveCache() {
  console.log(`Übersetzung: ${charactersSent} Zeichen an Google gesendet, ${usedThisMonth()}/${MONTHLY_BUDGET} im Monat ${currentMonth()} verbraucht.`);
  if (skippedForBudget > 0) {
    console.warn(`::warning::Monatsbudget erreicht – ${skippedForBudget} Zeichen nicht übersetzt (Seite zeigt dort Deutsch).`);
  }
  if (!cacheDirty) return;
  const sorted = {};
  for (const key of Object.keys(cache).sort()) {
    sorted[key] = Object.fromEntries(Object.entries(cache[key]).sort(([a], [b]) => a.localeCompare(b, 'de')));
  }
  fs.writeFileSync(CACHE_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  cacheDirty = false;
}

module.exports = { TRANSLATION_TARGETS, translateTo, seedFromFile, saveCache };
