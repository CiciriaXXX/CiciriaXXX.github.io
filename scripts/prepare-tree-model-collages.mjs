// Compose the original captures into single, self-contained SVG images.
// Embedded screenshots retain their pixels and aspect ratios.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const metadataPath = path.join(root, 'src/data/treeFiguresImages.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const groups = {
  'music-models': ['listener-model', 'long-dress-model', 'guitar-model'],
  'gathering-models': ['umbrella-model', 'floral-dress-model', 'orange-dress-model', 'clapping-model'],
  'conversation-models': ['seated-floral-model', 'seated-purple-model'],
  'walking-models': ['black-white-dress-model', 'yellow-shirt-model'],
};

for (const [name, models] of Object.entries(groups)) {
  const height = 1000;
  let x = 0;
  const elements = models.map((key) => {
    const source = metadata[key];
    const width = Math.round(source.width / source.height * height);
    const bytes = fs.readFileSync(path.join(root, 'public', source.fullSrc));
    const element = `<image x="${x}" y="0" width="${width}" height="${height}" href="data:image/webp;base64,${bytes.toString('base64')}"/>`;
    x += width;
    return element;
  });
  const src = `/a-great-big-tree/figures/${name}.svg`;
  fs.writeFileSync(path.join(root, 'public', src),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="${height}" viewBox="0 0 ${x} ${height}">${elements.join('')}</svg>\n`);
  metadata[name] = { src, fullSrc: src, width: x, height };
}
fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`Prepared ${Object.keys(groups).length} model collages.`);
