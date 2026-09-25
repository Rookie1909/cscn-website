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

  // The API docs (https://api.cannanas.club/docs) confirm /plants supports
  // an is_mother query filter directly - no need to guess/heuristically scan fields.
  const [motherPlants, strains, zonesResponse] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/plants?archived=false&is_mother=true`),
    fetchJson(`/v1/clubs/${CLUB_ID}/strains`),
    fetchJson(`/v1/clubs/${CLUB_ID}/zones`),
  ]);
  const zones = zonesResponse.items || zonesResponse;

  const strainNameById = new Map(strains.map((s) => [s.id, s.name]));
  const zoneNameById = new Map(zones.map((z) => [z.id, z.name]));

  console.log(`Mutterpflanzen (is_mother=true, nicht archiviert): ${motherPlants.length}\n`);

  console.log('--- Mutterpflanzen mit Sorten- und Raumname ---');
  for (const p of motherPlants) {
    const strainName = strainNameById.get(p.strain_id) || `unbekannt (${p.strain_id})`;
    const zoneName = p.zone_id ? zoneNameById.get(p.zone_id) || `unbekannt (${p.zone_id})` : '- kein Raum zugewiesen -';
    console.log(`  Sorte: ${strainName.padEnd(30)} | Raum: ${zoneName.padEnd(20)} | Status: ${p.status ?? '-'} | erstellt: ${p.created_at?.slice(0, 10) ?? '-'}`);
  }

  console.log('\n--- Anzahl Mutterpflanzen pro Sorte ---');
  const byStrain = new Map();
  for (const p of motherPlants) {
    const name = strainNameById.get(p.strain_id) || `unbekannt (${p.strain_id})`;
    byStrain.set(name, (byStrain.get(name) || 0) + 1);
  }
  for (const [name, count] of [...byStrain.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${name}: ${count}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
