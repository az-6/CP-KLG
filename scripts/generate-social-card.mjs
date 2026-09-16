// Menghasilkan public/social-card.png (1200x630) untuk Open Graph.
// SVG tidak dirender oleh WhatsApp, LinkedIn, dan Facebook, sehingga kartu
// sosial harus tersedia sebagai PNG. Jalankan ulang setelah mengubah logo atau
// slogan:
//   node scripts/generate-social-card.mjs
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const logoPath = fileURLToPath(new URL('src/assets/logo-klg-transparent.png', root));
const outputPath = fileURLToPath(new URL('public/social-card.png', root));

const logo = await sharp(logoPath).resize({ width: 440, withoutEnlargement: true }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
const logoDataUri = `data:image/png;base64,${logo.toString('base64')}`;

const escapeXml = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sans = 'Arial, Helvetica, DejaVu Sans, Liberation Sans, sans-serif';
const headlineLines = ['Kualitas Terjaga,', 'Spesifikasi Anda.'];
const subline = 'Pasokan ikan B2B untuk bisnis Indonesia';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#061a2f"/>
      <stop offset="1" stop-color="#087ea4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1030" cy="110" r="280" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="2"/>
  <circle cx="1030" cy="110" r="210" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="2"/>
  <image href="${logoDataUri}" x="90" y="78" width="${logoMeta.width}" height="${logoMeta.height}"/>
  <text x="90" y="345" fill="#ffffff" font-family="${sans}" font-size="66" font-weight="700">${escapeXml(headlineLines[0])}</text>
  <text x="90" y="427" fill="#ffffff" font-family="${sans}" font-size="66" font-weight="700">${escapeXml(headlineLines[1])}</text>
  <rect x="90" y="472" width="88" height="4" fill="#7ce0f2"/>
  <text x="90" y="534" fill="#ffffff" fill-opacity=".78" font-family="${sans}" font-size="28">${escapeXml(subline)}</text>
</svg>`;

await sharp(Buffer.from(svg), { density: 72 })
  .resize(1200, 630, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

const out = await sharp(outputPath).metadata();
console.log(`social-card.png ${out.width}x${out.height} ${(await readFile(outputPath)).length} bytes`);
