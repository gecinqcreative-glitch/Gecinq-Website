// Génère des placeholders SVG (dégradés, SANS aucun texte) pour chaque projet.
// Lancer : node scripts/gen-placeholders.mjs
// Tes vraies images se déposent dans public/projects/{slug}/ (voir src/data/projects.ts).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public', 'projects');

// slug → [couleurA, couleurB] du dégradé
const PROJECTS = [
  ['poz-dca-lab', '#2b2b2e', '#9a9a9f'],
  ['cycling-doc', '#3a4a3f', '#cdd7c9'],
  ['animalia', '#4a3b2f', '#ddcdb8'],
  ['ecole-42', '#1f1f24', '#7d7d86'],
  ['visions', '#2d2a3a', '#c7c2da'],
];

// dégradé diagonal + léger grain — AUCUN texte (le plan ne montre que le média)
const svg = (w, h, a, b) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" filter="url(#n)" opacity="0.5"/>
</svg>`;

for (const [slug, a, b] of PROJECTS) {
  const dir = join(PUBLIC, slug);
  mkdirSync(dir, { recursive: true });
  // cover : paysage 3:2 (ratio 1.5)
  writeFileSync(join(dir, 'cover.svg'), svg(1600, 1067, a, b));
  // 6 visuels éditoriaux (alternance large / portrait) pour la page projet
  for (let n = 1; n <= 6; n++) {
    const wide = n % 3 === 1;
    const w = wide ? 1600 : 1100;
    const h = wide ? 1000 : 1400;
    writeFileSync(join(dir, `${String(n).padStart(2, '0')}.svg`), svg(w, h, a, b));
  }
}

console.log('Placeholders SVG (sans texte) générés dans public/projects/*');
