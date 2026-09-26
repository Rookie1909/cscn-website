const fs = require('fs');
const path = require('path');
const { TRANSLATION_TARGETS, translateTo, saveCache } = require('./translate.cjs');

// Backfills missing EN/FI/IT texts in src/data/news.json, e.g. for posts that
// were imported while the translation quota was exhausted. Runs with the
// regular Cannanas sync; entries that are already translated cost nothing.
const NEWS_PATH = path.join(__dirname, '..', '..', 'src', 'data', 'news.json');
const FIELDS = ['title', 'description', 'content'];

async function main() {
  const news = JSON.parse(fs.readFileSync(NEWS_PATH, 'utf8'));
  let filled = 0;

  for (const { suffix, lang } of TRANSLATION_TARGETS) {
    const jobs = [];
    for (const entry of news) {
      for (const field of FIELDS) {
        if (entry[field] && !entry[`${field}_${suffix}`]) jobs.push({ entry, field });
      }
    }
    if (jobs.length === 0) continue;
    const translated = await translateTo(jobs.map(({ entry, field }) => entry[field]), lang);
    jobs.forEach(({ entry, field }, i) => {
      if (translated[i]) {
        entry[`${field}_${suffix}`] = translated[i];
        filled++;
      }
    });
  }

  if (filled > 0) {
    fs.writeFileSync(NEWS_PATH, JSON.stringify(news, null, 2) + '\n');
  }
  saveCache();
  console.log(`News: ${filled} fehlende Übersetzungen ergänzt.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
