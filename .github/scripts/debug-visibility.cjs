const CLUB_ID = process.env.CANNANAS_CLUB_ID;
const API_KEY = process.env.CANNANAS_API_KEY;
const API_BASE = 'https://api.cannanas.club';

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

  const strains = await fetchJson(`/v1/clubs/${CLUB_ID}/strains`);

  console.log(`\nGesamt: ${strains.length} Sorten in der Sortenbibliothek\n`);

  const byVisibility = new Map();
  for (const s of strains) {
    const key = String(s.visibility);
    if (!byVisibility.has(key)) byVisibility.set(key, []);
    byVisibility.get(key).push(s);
  }

  console.log('--- Verteilung nach visibility-Wert ---');
  for (const [value, list] of byVisibility) {
    console.log(`  "${value}": ${list.length} Sorten`);
  }

  console.log('\n--- Alle Sorten (Name | visibility | archived) ---');
  for (const s of strains) {
    console.log(`  ${s.name.padEnd(30)} | visibility: ${String(s.visibility).padEnd(10)} | archived: ${s.archived}`);
  }

  const clubStrains = strains.filter((s) => s.visibility === 'club');
  console.log(`\n--- Sorten mit visibility "club" (${clubStrains.length}) ---`);
  for (const s of clubStrains) {
    console.log(`  ${s.name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
