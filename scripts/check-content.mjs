import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');
let failed = false;

function fail(message) {
  console.error(`ERROR: ${message}`);
  failed = true;
}

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
}

function collectSourceFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, files);
    } else if (/\.(tsx?|jsx?|json)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function hasNamedField(block, name) {
  return new RegExp(String.raw`\b${name}(?!_)\s*:`).test(block);
}

function fieldNumber(block, name) {
  const match = block.match(new RegExp(String.raw`\b${name}\s*:\s*(-?\d+)`));
  return match ? Number(match[1]) : null;
}

function extractObjectBlocks(source, idField = 'id') {
  const blocks = [];
  const startRe = new RegExp(String.raw`\{\s*${idField}:\s*"([^"]+)"`, 'g');
  let match;
  while ((match = startRe.exec(source))) {
    const start = match.index;
    let depth = 0;
    let end = start;
    for (let i = start; i < source.length; i += 1) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    blocks.push({ id: match[1], text: source.slice(start, end) });
  }
  return blocks;
}

function collectEmptyPaths(obj, prefix = '', acc = []) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      if (value.trim() === '') acc.push(path);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string' && item.trim() === '') {
          acc.push(`${path}[${index}]`);
        }
      });
    } else if (value && typeof value === 'object') {
      collectEmptyPaths(value, path, acc);
    }
  }
  return acc;
}

function collectUsedI18nKeys(sourceFiles) {
  const used = new Map();
  const staticKeyRe = /\b(?:t|i18nKey)\(\s*['"]([^'"]+)['"]/g;
  const attrKeyRe = /\bi18nKey=["']([^"']+)["']/g;
  const templateKeyRe = /\bt\(\s*`([^`$]*?)\$\{[^}]+\}([^`]*)`/g;

  for (const file of sourceFiles) {
    if (!/\.(tsx?|jsx?)$/.test(file)) continue;
    const content = readFileSync(file, 'utf8');
    const rel = relative(root, file);

    for (const match of content.matchAll(staticKeyRe)) {
      if (!used.has(match[1])) used.set(match[1], []);
      used.get(match[1]).push(rel);
    }
    for (const match of content.matchAll(attrKeyRe)) {
      if (!used.has(match[1])) used.set(match[1], []);
      used.get(match[1]).push(rel);
    }
    for (const match of content.matchAll(templateKeyRe)) {
      const prefix = match[1].replace(/\.$/, '');
      const suffix = match[2];
      const ids = [...content.matchAll(/\bid:\s*['"]([\w-]+)['"]/g)].map((item) => item[1]);
      if (!prefix || ids.length === 0) {
        fail(`Unresolvable i18n template in ${rel}: t(\`${match[1]}\{…\}${suffix}\`)`);
        continue;
      }
      for (const id of ids) {
        const key = `${prefix}.${id}${suffix}`;
        if (!used.has(key)) used.set(key, []);
        used.get(key).push(rel);
      }
    }
  }

  return used;
}

const de = readJson('src/locales/de.json');
const en = readJson('src/locales/en.json');
const sourceFiles = collectSourceFiles(join(root, 'src'));
sourceFiles.push(join(root, 'src/data/news.json'));

// --- i18n key parity ---
console.log('Checking i18n key parity…');
const deKeys = new Set(flattenKeys(de));
const enKeys = new Set(flattenKeys(en));

for (const key of deKeys) {
  if (!enKeys.has(key)) {
    fail(`Missing EN key: ${key}`);
  }
}
for (const key of enKeys) {
  if (!deKeys.has(key)) {
    fail(`Missing DE key: ${key}`);
  }
}
if (deKeys.size === enKeys.size) {
  console.log(`  OK — ${deKeys.size} keys in sync`);
}

// --- empty translation values ---
console.log('Checking empty translation values…');
const emptyDe = collectEmptyPaths(de);
const emptyEn = collectEmptyPaths(en);
for (const path of emptyDe) fail(`Empty DE value: ${path}`);
for (const path of emptyEn) fail(`Empty EN value: ${path}`);
if (emptyDe.length === 0 && emptyEn.length === 0) {
  console.log('  OK — no empty locale strings');
}

// --- used i18n keys ---
console.log('Checking used i18n keys…');
const usedKeys = collectUsedI18nKeys(sourceFiles);
let missingUsed = 0;
for (const [key, refs] of usedKeys) {
  if (!deKeys.has(key)) {
    missingUsed += 1;
    fail(`Used i18n key missing from locales: ${key} (${refs.join(', ')})`);
  }
}
if (missingUsed === 0) {
  console.log(`  OK — ${usedKeys.size} used keys exist in locales`);
}

const unused = [...deKeys].filter((key) => !usedKeys.has(key));
if (unused.length > 0) {
  console.log(`  WARN — ${unused.length} unused locale keys (not failing):`);
  for (const key of unused.slice(0, 20)) {
    console.log(`    ${key}`);
  }
  if (unused.length > 20) {
    console.log(`    …and ${unused.length - 20} more`);
  }
}

// --- news invariants ---
console.log('Checking news.json…');
const news = readJson('src/data/news.json');
const newsIds = new Set();
const newsEnFields = ['week', 'month', 'title', 'description', 'content'];

if (!Array.isArray(news) || news.length === 0) {
  fail('news.json must be a non-empty array');
} else {
  for (const [index, item] of news.entries()) {
    const label = item?.id ?? `#${index}`;
    if (!item?.id || typeof item.id !== 'string') {
      fail(`News item #${index} is missing id`);
    } else if (newsIds.has(item.id)) {
      fail(`Duplicate news id: ${item.id}`);
    } else {
      newsIds.add(item.id);
    }

    if (!item?.date || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
      fail(`News ${label} has invalid date (expected YYYY-MM-DD): ${item?.date}`);
    }
    if (!Array.isArray(item?.images)) {
      fail(`News ${label} images must be an array`);
    }

    for (const field of newsEnFields) {
      if (typeof item?.[field] !== 'string' || item[field].trim() === '') {
        fail(`News ${label} is missing ${field}`);
      }
      const enField = `${field}_en`;
      if (typeof item?.[enField] !== 'string' || item[enField].trim() === '') {
        fail(`News ${label} is missing ${enField}`);
      }
    }
  }
  if (!failed) {
    console.log(`  OK — ${news.length} news items`);
  }
}

// --- strain invariants ---
console.log('Checking strains…');
const strainsFile = existsSync(join(root, 'src/data/strains-sync.json'))
  ? 'src/data/strains-sync.json'
  : 'src/constants/strains.ts';
const strainRequired = ['id', 'name', 'thc', 'cbd', 'description', 'terpenes', 'genetics', 'breeder'];
const strainPaired = ['description', 'effects', 'medicalEffects', 'terpenes'];
const strainIds = new Set();
let strains = [];

if (strainsFile.endsWith('.json')) {
  strains = readJson(strainsFile);
} else {
  strains = extractObjectBlocks(readFileSync(join(root, strainsFile), 'utf8')).map((block) => {
    const indica = fieldNumber(block.text, 'indica');
    const sativa = fieldNumber(block.text, 'sativa');
    const item = { id: block.id, indica, sativa };
    for (const field of [...strainRequired, ...strainPaired.map((name) => `${name}_en`)]) {
      if (hasNamedField(block.text, field)) item[field] = true;
    }
    return item;
  });
}

if (!Array.isArray(strains) || strains.length === 0) {
  fail(`No strain objects found in ${strainsFile}`);
}

for (const item of strains) {
  const id = item?.id;
  if (!id || typeof id !== 'string') {
    fail(`Strain is missing id`);
    continue;
  }
  if (strainIds.has(id)) {
    fail(`Duplicate strain id: ${id}`);
  } else {
    strainIds.add(id);
  }

  for (const field of strainRequired) {
    const value = item[field];
    const missing = value == null || value === false || (typeof value === 'string' && value.trim() === '');
    if (missing) fail(`Strain ${id} is missing ${field}`);
  }

  for (const field of strainPaired) {
    const value = item[field];
    const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
    const en = item[`${field}_en`];
    const hasEn = Array.isArray(en) ? en.length > 0 : Boolean(en);
    if (hasValue && !hasEn) {
      fail(`Strain ${id} is missing ${field}_en`);
    }
  }

  const indica = Number(item.indica);
  const sativa = Number(item.sativa);
  if (Number.isNaN(indica) || Number.isNaN(sativa)) {
    fail(`Strain ${id} is missing indica/sativa`);
  } else if (indica + sativa !== 100) {
    fail(`Strain ${id} indica (${indica}) + sativa (${sativa}) !== 100`);
  }
}
if (strains.length > 0) {
  console.log(`  OK — ${strains.length} strains (${strainsFile})`);
}

// --- HashRouter fragment links ---
console.log('Checking HashRouter fragment links…');
const hashHrefRe = /\b(?:href|to)=["'](#[^"']+)["']/g;
let hashCount = 0;
for (const file of sourceFiles) {
  if (!/\.(tsx?|jsx?)$/.test(file)) continue;
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(hashHrefRe)) {
    hashCount += 1;
    const href = match[1];
    if (!href.startsWith('#/')) {
      fail(`Hash-only link ${href} breaks HashRouter (in ${relative(root, file)})`);
    }
  }
}
if (hashCount === 0) {
  console.log('  OK — no hash-only href/to links');
} else if (!failed) {
  console.log(`  OK — ${hashCount} hash links are HashRouter routes`);
}

// --- static asset existence ---
console.log('Checking static asset references…');
const assetPattern =
  /\/(?:images|documents|icons)\/[^\s'"`),]+?\.(?:png|jpe?g|webp|gif|svg|pdf|ico)/gi;

const assetRefs = new Map();
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const match of content.matchAll(assetPattern)) {
    const assetPath = match[0].replace(/[),.;]+$/, '');
    if (!assetRefs.has(assetPath)) {
      assetRefs.set(assetPath, []);
    }
    assetRefs.get(assetPath).push(relative(root, file));
  }
}

let assetCount = 0;
for (const [assetPath, refs] of assetRefs) {
  assetCount += 1;
  const publicPath = join(root, 'public', assetPath.slice(1));
  if (!existsSync(publicPath)) {
    fail(`Missing asset ${assetPath} (referenced in ${refs.join(', ')})`);
  }
}
if (assetCount > 0) {
  console.log(`  OK — ${assetCount} asset references verified`);
}

// --- internal route sanity ---
console.log('Checking internal route references…');
const appSource = readFileSync(join(root, 'src/App.tsx'), 'utf8');
const validRoutes = new Set(['/']);
for (const match of appSource.matchAll(/path="([^"]+)"/g)) {
  const segment = match[1];
  validRoutes.add(segment === '/' ? '/' : `/${segment.replace(/^\//, '')}`);
}

const staticPrefixes = ['/images/', '/documents/', '/icons/'];
const routePatterns = [
  /\bto=["'](\/[^"'#?]+)["']/g,
  /\blink:\s*["'](\/[^"'#?]+)["']/g,
  /\bhref:\s*["'](\/[^"'#?]+)["']/g,
];

const routeRefs = new Map();
for (const file of sourceFiles) {
  const content = readFileSync(file, 'utf8');
  for (const pattern of routePatterns) {
    for (const match of content.matchAll(pattern)) {
      const route = match[1];
      if (staticPrefixes.some((prefix) => route.startsWith(prefix))) {
        continue;
      }
      if (!routeRefs.has(route)) {
        routeRefs.set(route, []);
      }
      routeRefs.get(route).push(relative(root, file));
    }
  }
}

let routeCount = 0;
for (const [route, refs] of routeRefs) {
  routeCount += 1;
  if (!validRoutes.has(route)) {
    fail(`Unknown route ${route} (referenced in ${refs.join(', ')})`);
  }
}
if (routeCount > 0) {
  console.log(`  OK — ${routeCount} internal route references verified`);
  console.log(`  Valid routes: ${[...validRoutes].sort().join(', ')}`);
}

if (failed) {
  process.exit(1);
}

console.log('All content checks passed.');
