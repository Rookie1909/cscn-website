// Shrinks images from Cannanas before they are committed. The originals are
// 1250-2400px photos (400-650KB each) but are only shown in cards, banners and
// a lightbox, so we re-encode them as smaller WebP files.
//
// sharp is installed on the fly in CI (npm install --no-save sharp), not listed
// in package.json. If it is missing, the original file is kept unchanged.
let sharp = null;
try {
  sharp = require('sharp');
} catch {
  sharp = null;
}

// Shared presets: every script that writes into the same folder must use the
// same preset, otherwise they would overwrite each other's files.
const PRESETS = {
  // Room photos: shown in ~400px wide cards.
  zone: { maxWidth: 800, quality: 72 },
  // Strain photos: 56px thumbnails, 320-384px banners and a full-screen
  // lightbox, so keep up to 1000px on the long side.
  strain: { maxWidth: 1000, maxHeight: 1000, quality: 70 },
};

// Returns an optimized WebP buffer, or null if sharp is not available, the
// image can't be processed, or the result wouldn't be smaller (caller then
// keeps the original). The output is deterministic, so unchanged source images
// produce identical bytes and therefore no git diff on repeated syncs.
async function toWebp(buffer, { maxWidth = 800, maxHeight, quality = 72 } = {}) {
  if (!sharp) return null;
  try {
    const output = await sharp(buffer)
      .rotate()
      .resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toBuffer();
    return output.length < buffer.length ? output : null;
  } catch (err) {
    console.warn(`Bildoptimierung übersprungen: ${err.message}`);
    return null;
  }
}

module.exports = { toWebp, PRESETS };
