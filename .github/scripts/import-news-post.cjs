const fs = require('fs');
const path = require('path');

// Payload of a single Cannanas post, sent by the n8n workflow
// "Cannanas -> Multi-Channel Sync" as repository_dispatch client_payload
// (or pasted manually into the workflow_dispatch input for testing).
const PAYLOAD = process.env.NEWS_PAYLOAD;
const { translateTo, saveCache } = require('./translate.cjs');

const ROOT = path.join(__dirname, '..', '..');
const NEWS_PATH = path.join(ROOT, 'src', 'data', 'news.json');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'News_Pics');
const IMAGES_PUBLIC_PATH = '/images/News_Pics';
const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const LOCALES = [
  { suffix: 'en', lang: 'EN', locale: 'en', weekLabel: 'Week' },
  { suffix: 'fi', lang: 'FI', locale: 'fi', weekLabel: 'Viikko' },
  { suffix: 'it', lang: 'IT', locale: 'it', weekLabel: 'Sett.' },
];

function extFromMime(mimeType) {
  const known = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif' };
  return known[(mimeType || '').split(';')[0].trim().toLowerCase()];
}

// Post IDs end up in file paths and the React key, so only keep safe characters.
function safeId(postId) {
  const cleaned = String(postId).replace(/[^A-Za-z0-9_-]/g, '');
  if (!cleaned) throw new Error(`Ungültige post_id: ${JSON.stringify(postId)}`);
  return `cannanas-${cleaned}`;
}

function markdownToPlain(s) {
  return s
    .replace(/\r\n/g, '\n')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s*/gm, '')
    .trim();
}

// The news card shows a lead paragraph (description) and a highlighted quote
// box (content): the first paragraph becomes the lead, the rest the box.
// Very short openers (e.g. "Liebe Mitglieder,") are merged into the lead.
const MIN_LEAD_LENGTH = 80;
function splitParagraphs(text) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const lead = [];
  while (paragraphs.length > 0 && lead.join(' ').length < MIN_LEAD_LENGTH) {
    lead.push(paragraphs.shift());
  }
  return {
    description: lead.join('\n\n'),
    content: paragraphs.join('\n\n'),
  };
}

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function berlinDate(iso) {
  const parsed = new Date(iso);
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(date).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function monthLabel(date, locale) {
  const label = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Cannanas image URLs are short-lived signed links (expire after ~24h), so we
// download them right away and commit them as normal static assets.
async function downloadImages(id, urls) {
  const dir = path.join(IMAGES_DIR, id);
  const saved = [];
  for (const [index, url] of urls.slice(0, MAX_IMAGES).entries()) {
    if (!/^https:\/\//i.test(url)) {
      console.warn(`Überspringe Bild ohne https: ${url}`);
      continue;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Bild ${index + 1} nicht ladbar (${res.status}), übersprungen.`);
        continue;
      }
      const ext = extFromMime(res.headers.get('content-type'));
      if (!ext) {
        console.warn(`Bild ${index + 1} hat keinen Bild-Content-Type (${res.headers.get('content-type')}), übersprungen.`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > MAX_IMAGE_BYTES) {
        console.warn(`Bild ${index + 1} ist größer als ${MAX_IMAGE_BYTES} Bytes, übersprungen.`);
        continue;
      }
      fs.mkdirSync(dir, { recursive: true });
      const fileName = `${index + 1}.${ext}`;
      fs.writeFileSync(path.join(dir, fileName), buffer);
      saved.push(`${IMAGES_PUBLIC_PATH}/${id}/${fileName}`);
    } catch (err) {
      console.warn(`Bild ${index + 1} konnte nicht geladen werden: ${err.message}`);
    }
  }
  return saved;
}

async function main() {
  if (!PAYLOAD) throw new Error('NEWS_PAYLOAD ist nicht gesetzt');
  const post = JSON.parse(PAYLOAD);
  if (!post || typeof post !== 'object') throw new Error('NEWS_PAYLOAD ist kein JSON-Objekt');

  const id = safeId(post.post_id);
  const title = String(post.title || '').trim();
  const text = markdownToPlain(String(post.body_markdown || post.body_raw || ''));
  if (!title && !text) throw new Error(`Beitrag ${id} hat weder Titel noch Text`);

  const { description, content } = splitParagraphs(text);
  const date = berlinDate(post.created_at);
  const week = isoWeek(date);
  const imageUrls = Array.isArray(post.image_urls) ? post.image_urls.map(String) : [];

  const entry = {
    id,
    week: `KW ${week}`,
    month: monthLabel(date, 'de'),
    title: title || description.slice(0, 120),
    description,
    content,
    images: await downloadImages(id, imageUrls),
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
  };

  for (const { suffix, lang, locale, weekLabel } of LOCALES) {
    entry[`week_${suffix}`] = `${weekLabel} ${week}`;
    entry[`month_${suffix}`] = monthLabel(date, locale);
    const [titleT, descriptionT, contentT] = await translateTo([entry.title, entry.description, entry.content], lang);
    if (titleT) entry[`title_${suffix}`] = titleT;
    if (descriptionT) entry[`description_${suffix}`] = descriptionT;
    if (contentT) entry[`content_${suffix}`] = contentT;
  }

  const news = JSON.parse(fs.readFileSync(NEWS_PATH, 'utf8'));
  const existingIndex = news.findIndex((item) => item.id === id);
  if (existingIndex === -1) {
    news.unshift(entry);
    console.log(`Neuer News-Eintrag ${id}: "${entry.title}" (${entry.images.length} Bilder)`);
  } else {
    news[existingIndex] = entry;
    console.log(`News-Eintrag ${id} aktualisiert: "${entry.title}" (${entry.images.length} Bilder)`);
  }
  news.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  fs.writeFileSync(NEWS_PATH, JSON.stringify(news, null, 2) + '\n');
  saveCache();

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `news_id=${id}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
