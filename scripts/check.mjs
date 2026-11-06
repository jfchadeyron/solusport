import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { products, redirects } from '../src/products.mjs';

const root = new URL('../', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const filenames = (await readdir(root)).filter(file => file.endsWith('.html'));
const pages = new Map(await Promise.all(filenames.map(async name => [name, await read(name)])));
let verifiedLinks = 0;

for (const [name, html] of pages) {
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1, name + ' doit avoir un titre principal');
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(html, /<link rel="canonical"/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, name + ' contient un ID dupliqué');
  for (const [image] of html.matchAll(/<img\b[^>]*>/g)) assert.match(image, /\balt="[^"]*"/);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (link === '/solusport/' || /^(https?:|mailto:|data:)/.test(link)) continue;
    const [pathQuery, anchor] = link.split('#');
    const target = pathQuery.split('?')[0] || name;
    assert.ok((await stat(new URL(target, root))).isFile(), name + ' → ' + target);
    if (anchor) assert.ok(pages.get(target)?.includes('id="' + anchor + '"'), name + ' → ' + link);
    verifiedLinks++;
  }
}

const home = pages.get('index.html');
const sitemap = await read('sitemap.xml');
assert.deepEqual(products.map(p => p.id).sort(), ['equipsport', 'gestionsport', 'notasport', 'presensport']);
for (const product of products) {
  assert.ok(home.includes('data-solution="' + product.id + '"'));
  assert.ok(home.includes('value="' + product.name + '"'));
  const logo = 'assets/logos/' + product.id + '.webp';
  assert.ok(home.includes(logo) && pages.get(product.id + '.html').includes(logo));
  assert.ok(sitemap.includes('/' + product.id + '.html'));
}
for (const [oldPage, target] of Object.entries(redirects)) {
  assert.ok(pages.get(oldPage).includes('http-equiv="refresh" content="0;url=' + target + '"'));
  assert.ok(pages.get(oldPage).includes('href="' + target + '"'));
  assert.ok(!sitemap.includes('/' + oldPage));
}
assert.match(pages.get('mentions-legales.html'), /en cours de création/);
assert.match(pages.get('mentions-legales.html'), /capital social prévu de 2 000/);
assert.doesNotMatch(await read('assets/site.js'), /fetch\(|XMLHttpRequest|localStorage|document\.cookie/);
const css = await read('assets/style.css');
for (const [, asset] of css.matchAll(/url\(['"]?([^)'";]+)['"]?\)/g)) {
  await stat(new URL('assets/' + asset, root));
}
console.log('OK · ' + pages.size + ' pages HTML · ' + verifiedLinks + ' liens, ancres et ressources · 4 offres · 3 redirections');
