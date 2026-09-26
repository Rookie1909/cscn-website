const fs = require('fs');
const path = require('path');

// Used by import-news.yml when a push was rejected and the run starts over on
// the latest main: carries this run's translations and usage over into the new
// translation-cache.json instead of discarding them, so a retry never pays
// Google twice for the same text and the monthly usage counter stays accurate.
//
// Usage: node merge-translation-cache.cjs <start.json> <ours.json> <carried.json>
//   start   = cache at the start of the rejected attempt
//   ours    = cache at the end of the rejected attempt
//   carried = this run's own usage so far (read and updated here)
const CACHE_PATH = path.join(__dirname, '..', 'translation-cache.json');
const USAGE_KEY = '_usage';

const read = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {});
const [startPath, oursPath, carriedPath] = process.argv.slice(2);
const start = read(startPath);
const ours = read(oursPath);
const carried = read(carriedPath);
const current = read(CACHE_PATH);

for (const [key, entries] of Object.entries(ours)) {
  if (key === USAGE_KEY) continue;
  current[key] = { ...entries, ...(current[key] || {}) };
}

// Usage this attempt added on top of its starting point.
for (const [month, used] of Object.entries(ours[USAGE_KEY] || {})) {
  const delta = used - ((start[USAGE_KEY] || {})[month] || 0);
  if (delta > 0) carried[month] = (carried[month] || 0) + delta;
}
fs.writeFileSync(carriedPath, JSON.stringify(carried));

const usage = { ...(current[USAGE_KEY] || {}) };
for (const [month, used] of Object.entries(carried)) usage[month] = (usage[month] || 0) + used;
current[USAGE_KEY] = usage;

const sorted = {};
for (const key of Object.keys(current).sort()) {
  sorted[key] = Object.fromEntries(Object.entries(current[key]).sort(([a], [b]) => a.localeCompare(b, 'de')));
}
fs.writeFileSync(CACHE_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
