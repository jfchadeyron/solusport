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
    if (link === '/' || /^(https?:|mailto:|tel:|data:)/.test(link)) continue;
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
const script = await read('assets/site.js');
assert.doesNotMatch(script, /XMLHttpRequest|localStorage|document\.cookie/);
for (const [call] of script.matchAll(/fetch\([^,)]*/g)) assert.equal(call, "fetch('contact.php'", 'site.js ne doit contacter que contact.php');
for (const [name, html] of pages) {
  assert.doesNotMatch(html, /PresenCheer|NotaCheer/, name + ' mentionne un ancien nom');
  assert.doesNotMatch(html, /contact@solusport\.fr|github\.io|solucheer/i, name + ' contient une ancienne adresse');
}
assert.match(home, /action="contact\.php" method="post"/);
assert.match(home, /href="tel:\+33756822112"/);
const mailer = await read('contact.php');
assert.match(mailer, /const DESTINATAIRE = 'contact@solusport\.com';/);
for (const product of products) assert.ok(mailer.includes("'" + product.name + "'"), 'contact.php doit accepter ' + product.name);
assert.match(await read('.htaccess'), /ErrorDocument 404 \/404\.html/);
const decode = text => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<');
for (const [name, html] of pages) {
  if (html.includes('http-equiv="refresh"')) continue;
  const title = decode(html.match(/<title>([^<]+)<\/title>/)[1]);
  const description = decode(html.match(/<meta name="description" content="([^"]+)">/)[1]);
  assert.ok(title.length <= 70, name + ' : titre trop long (' + title.length + ')');
  assert.ok(description.length >= 50 && description.length <= 160, name + ' : description de ' + description.length + ' caractères');
  const image = html.match(/<meta property="og:image" content="https:\/\/solusport\.com\/([^"]+)">/)[1];
  await stat(new URL(image, root));
  for (const [, block] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(block);
    assert.equal(data['@context'], 'https://schema.org');
    assert.ok(data['@graph'].every(item => item['@type']), name + ' : bloc JSON-LD sans type');
  }
}
assert.match(home, /"@type":"Organization"/);
for (const product of products) assert.match(pages.get(product.id + '.html'), /"@type":"Service"/);
const llms = await read('llms.txt');
for (const product of products) assert.ok(llms.includes('https://solusport.com/' + product.id + '.html'), 'llms.txt doit citer ' + product.name);
assert.match(sitemap, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
assert.match(await read('robots.txt'), /https:\/\/solusport\.com\/sitemap\.xml/);
const css = await read('assets/style.css');
for (const [, asset] of css.matchAll(/url\(['"]?([^)'";]+)['"]?\)/g)) {
  await stat(new URL('assets/' + asset, root));
}
console.log('OK · ' + pages.size + ' pages HTML · ' + verifiedLinks + ' liens, ancres et ressources · 4 offres · 3 redirections');
