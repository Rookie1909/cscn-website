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

// --- i18n key parity ---
console.log('Checking i18n key parity…');
const deKeys = new Set(flattenKeys(readJson('src/locales/de.json')));
const enKeys = new Set(flattenKeys(readJson('src/locales/en.json')));

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
if (deKeys.size === enKeys.size && !failed) {
  console.log(`  OK — ${deKeys.size} keys in sync`);
}

// --- static asset existence ---
console.log('Checking static asset references…');
const assetPattern =
  /\/(?:images|documents|icons)\/[^\s'"`),]+?\.(?:png|jpe?g|webp|gif|svg|pdf|ico)/gi;
const sourceFiles = collectSourceFiles(join(root, 'src'));
sourceFiles.push(join(root, 'src/data/news.json'));

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
  assetCount++;
  const publicPath = join(root, 'public', assetPath.slice(1));
  if (!existsSync(publicPath)) {
    fail(`Missing asset ${assetPath} (referenced in ${refs.join(', ')})`);
  }
}
if (!failed) {
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
  routeCount++;
  if (!validRoutes.has(route)) {
    fail(`Unknown route ${route} (referenced in ${refs.join(', ')})`);
  }
}
if (!failed) {
  console.log(`  OK — ${routeCount} internal route references verified`);
  console.log(`  Valid routes: ${[...validRoutes].sort().join(', ')}`);
}

if (failed) {
  process.exit(1);
}

console.log('All content checks passed.');
