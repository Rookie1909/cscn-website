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
  const [allResponse, motherResponse] = await Promise.all([
    fetchJson(`/v1/clubs/${CLUB_ID}/plants?archived=false`),
    fetchJson(`/v1/clubs/${CLUB_ID}/plants?archived=false&is_mother=true`),
  ]);
  const allPlants = allResponse.items || allResponse;
  const motherPlants = motherResponse.items || motherResponse;

  console.log(`Gesamt (nicht archiviert): ${allPlants.length} Pflanzen`);
  console.log(`Davon Mutterpflanzen (is_mother=true): ${motherPlants.length}\n`);

  if (allPlants.length > 0) {
    console.log('--- Alle Felder einer einzelnen Beispiel-Pflanze (roh) ---');
    console.log(JSON.stringify(allPlants[0], null, 2));
    console.log('');
  }

  console.log('--- Verteilung nach cultivation status ---');
  const byStatus = new Map();
  for (const p of allPlants) {
    const key = String(p.status);
    byStatus.set(key, (byStatus.get(key) || 0) + 1);
  }
  for (const [status, count] of byStatus) {
    console.log(`  ${status}: ${count}`);
  }

  console.log(`\n--- Mutterpflanzen im Detail (${motherPlants.length}) ---`);
  for (const p of motherPlants) {
    console.log(
      `  id: ${p.id ?? '?'} | name: ${p.name ?? '?'} | strain_id: ${p.strain_id ?? '?'} | room_id: ${p.room_id ?? p.zone_id ?? '?'} | status: ${p.status ?? '?'}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
