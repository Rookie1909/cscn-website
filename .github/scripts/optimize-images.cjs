const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TARGET_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'News_Pics');
const MAX_DIMENSION = 1600;
const QUALITY = 80;

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      await optimize(fullPath);
    }
  }
}

async function optimize(filePath) {
  const before = fs.statSync(filePath).size;
  const image = sharp(fs.readFileSync(filePath));
  let pipeline = image.resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  });

  pipeline = /\.png$/i.test(filePath)
    ? pipeline.png({ quality: QUALITY, compressionLevel: 9 })
    : pipeline.jpeg({ quality: QUALITY, mozjpeg: true });

  const output = await pipeline.toBuffer();
  if (output.length < before) {
    fs.writeFileSync(filePath, output);
    console.log(`Optimized ${path.relative(process.cwd(), filePath)}: ${(before / 1024).toFixed(0)}KB -> ${(output.length / 1024).toFixed(0)}KB`);
  } else {
    console.log(`Skipped ${path.relative(process.cwd(), filePath)} (already optimal)`);
  }
}

if (fs.existsSync(TARGET_DIR)) {
  walk(TARGET_DIR).catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  console.log('No News_Pics directory found, skipping image optimization.');
}
