// Contrôles d'intégrité des données et des pages. Sans dépendance : `npm test` (Node >= 20).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { lieux, rewardsDatabase } = require('../data.js');

const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'));

// Catégories proposées par les filtres de app.html (attribut data-filter)
const appHtml = fs.readFileSync(path.join(root, 'app.html'), 'utf8');
const filtres = [...appHtml.matchAll(/data-filter="([^"]+)"/g)].map((m) => m[1]).filter((f) => f !== 'Tout');

// Zone approximative de Nantes Métropole
const BBOX = { latMin: 47.1, latMax: 47.32, lngMin: -1.7, lngMax: -1.4 };
// Aucun lieu hors zone n'est toléré : les structures hors métropole sont retirées
const HORS_NANTES_CONNUS = new Set();

test('chaque lieu a les champs requis', () => {
  for (const l of lieux) {
    for (const k of ['name', 'category', 'icon', 'class', 'address', 'hours', 'price', 'desc']) {
      assert.ok(typeof l[k] === 'string' && l[k].trim(), `${l.name}: champ "${k}" manquant`);
    }
    assert.ok(Number.isFinite(l.lat) && Number.isFinite(l.lng), `${l.name}: coordonnées invalides`);
  }
});

test('chaque catégorie de lieu correspond à un filtre de la carte', () => {
  for (const l of lieux) assert.ok(filtres.includes(l.category), `${l.name}: catégorie "${l.category}" sans filtre`);
});

test('les coordonnées sont dans la zone nantaise (hors exceptions documentées)', () => {
  for (const l of lieux) {
    if (HORS_NANTES_CONNUS.has(l.name)) continue;
    assert.ok(l.lat > BBOX.latMin && l.lat < BBOX.latMax && l.lng > BBOX.lngMin && l.lng < BBOX.lngMax, `${l.name}: hors zone`);
  }
});

test('les liens externes sont en https', () => {
  for (const l of lieux.filter((x) => x.link)) assert.match(l.link, /^https:\/\//, l.name);
});

test('les offres de récompenses sont valides', () => {
  for (const r of rewardsDatabase) {
    assert.ok(r.points > 0 && Number.isInteger(r.points), `${r.name}: points invalides`);
    assert.ok(r.name && r.address && r.offer && r.category, `${r.name}: champ manquant`);
    assert.ok(!('img' in r), `${r.name}: pas de photo de partenaire (droits non documentés, voir docs/IMAGES.md)`);
  }
});

test('les catégories de récompenses correspondent aux filtres de recompenses.html', () => {
  const html = fs.readFileSync(path.join(root, 'recompenses.html'), 'utf8');
  const cats = [...html.matchAll(/data-reward-cat="([^"]+)"/g)].map((m) => m[1]).filter((c) => c !== 'Tout');
  for (const r of rewardsDatabase) assert.ok(cats.includes(r.category), `${r.name}: catégorie "${r.category}"`);
});

test('toutes les ressources locales référencées existent', () => {
  const sources = [...pages.map((p) => [p, fs.readFileSync(path.join(root, p), 'utf8')]), ['script.js', fs.readFileSync(path.join(root, 'script.js'), 'utf8')]];
  for (const [name, content] of sources) {
    for (const m of content.matchAll(/(?:src|href)="([^"#?]+)"|["'`](assets\/[^"'`$]+)["'`]/g)) {
      const ref = m[1] || m[2];
      if (/^(https?:|mailto:)/.test(ref) || ref.includes('${')) continue; // URL distantes et gabarits dynamiques
      assert.ok(fs.existsSync(path.join(root, ref)), `${name}: ressource introuvable (${ref})`);
    }
  }
});

test('les cibles de navigation existent', () => {
  for (const p of pages) {
    const html = fs.readFileSync(path.join(root, p), 'utf8');
    for (const m of html.matchAll(/data-target="([^"]+\.html)"/g)) assert.ok(pages.includes(m[1]), `${p}: cible ${m[1]}`);
  }
});

test('les CDN externes sont versionnées et protégées par SRI', () => {
  for (const p of pages) {
    const html = fs.readFileSync(path.join(root, p), 'utf8');
    for (const m of html.matchAll(/<(?:script|link)[^>]+unpkg\.com[^>]*>/g)) {
      assert.ok(!m[0].includes('@latest'), `${p}: version flottante`);
      assert.match(m[0], /integrity="sha384-/, `${p}: SRI manquant`);
    }
  }
});

test('les pages ne bloquent pas le zoom (WCAG 1.4.4)', () => {
  for (const p of pages) assert.ok(!/user-scalable=no/.test(fs.readFileSync(path.join(root, p), 'utf8')), p);
});

test('chaque id utilisé par script.js existe dans une page (ou est créé par le script)', () => {
  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  const allHtml = pages.map((p) => fs.readFileSync(path.join(root, p), 'utf8')).join('\n');
  const creeParLeScript = new Set(['toast']);
  const ids = new Set([...script.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]));
  for (const id of ids) {
    if (creeParLeScript.has(id)) continue;
    assert.ok(allHtml.includes(`id="${id}"`), `id "${id}" utilisé dans script.js mais absent des pages`);
  }
});

test('le nombre de lieux annoncé sur la landing page correspond aux données', () => {
  const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.ok(landing.includes(`${lieux.length} lieux`), `la landing page doit annoncer ${lieux.length} lieux`);
});

test('les boutons icônes des pages applicatives ont un nom accessible', () => {
  for (const p of pages.filter((f) => f !== 'index.html')) {
    const html = fs.readFileSync(path.join(root, p), 'utf8');
    for (const m of html.matchAll(/<button\b([^>]*)>\s*<i data-lucide[^>]*><\/i>\s*<\/button>/g)) {
      assert.match(m[1], /aria-label=/, `${p}: bouton icône sans aria-label`);
    }
  }
});

test('chaque catégorie de récompense a un pictogramme défini dans script.js', () => {
  const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
  for (const cat of new Set(rewardsDatabase.map((r) => r.category))) {
    assert.ok(script.includes(`'${cat}': {`), `pictogramme manquant pour "${cat}"`);
  }
});

test('les images retirées pour droits non documentés ne reviennent pas (docs/IMAGES.md)', () => {
  const retirees = ['trouvaille1.jpg', 'tee_shirt_noir.jpg', 'profil_photo.avif', 'ticket_tenu.jpg', 'trouvaille2.jpg', 'perso1.jpg', 'perso2.jpg', 'perso3.jpg', 'la_canaille.webp', 'warehouse.webp', 'stade.jpg'];
  for (const f of retirees) assert.ok(!fs.existsSync(path.join(root, 'assets/img', f)), `${f} ne doit pas être présent`);
});

test('chaque page déclare une CSP stricte, un favicon existant et aucun script inline', () => {
  for (const p of pages) {
    const html = fs.readFileSync(path.join(root, p), 'utf8');
    const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
    assert.ok(csp, `${p}: CSP manquante`);
    assert.ok(/default-src 'self'/.test(csp[1]) && /object-src 'none'/.test(csp[1]), `${p}: CSP trop permissive`);
    assert.ok(!/script-src[^;]*'unsafe-(inline|eval)'/.test(csp[1]), `${p}: script inline autorisé`);
    const icon = html.match(/rel="icon"[^>]*href="([^"]+)"/);
    assert.ok(icon && fs.existsSync(path.join(root, icon[1])), `${p}: favicon manquant`);
    for (const m of html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>/g)) assert.fail(`${p}: script inline interdit par la CSP : ${m[0].slice(0, 80)}`);
  }
});

test('les liens target="_blank" portent rel="noopener"', () => {
  for (const p of pages) {
    const html = fs.readFileSync(path.join(root, p), 'utf8');
    for (const m of html.matchAll(/<a\s[^>]*target="_blank"[^>]*>/g)) assert.match(m[0], /rel="[^"]*noopener/, `${p}: ${m[0]}`);
  }
});

test('aucune image distante : toutes les images de l\'interface sont locales', () => {
  for (const f of [...pages, 'script.js', 'data.js']) {
    const content = fs.readFileSync(path.join(root, f), 'utf8');
    assert.ok(!/<img[^>]+src="https?:/.test(content), `${f}: image distante dans le HTML`);
    assert.ok(!/(unsplash|pravatar)/i.test(content), `${f}: référence à un service d'images tiers`);
  }
});
