import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { products } from '../src/products.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const files=(await readdir(root)).filter(f=>f.endsWith('.html'));
const cache=new Map(await Promise.all(files.map(async f=>[f,await readFile(resolve(root,f),'utf8')])));
let links=0;
for(const [file,html] of cache){
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one h1`);
 assert.match(html,/<html lang="fr">/,`${file}: French document`);
 assert.match(html,/<meta name="description" content="[^"]+">/,`${file}: description`);
 assert.match(html,/<link rel="canonical"/,`${file}: canonical`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`${file}: unique IDs`);
 for(const img of html.matchAll(/<img\b[^>]*>/g)) assert.match(img[0],/\balt="[^"]*"/,`${file}: image alt`);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1].replaceAll('&amp;','&');
  if(url==='/solusport/')continue;
  if(/^(https?:|mailto:|data:)/.test(url))continue;
  const [pathAndQuery,anchor]=url.split('#');
  const relative=pathAndQuery.split('?')[0]||file;
  const full=resolve(root,relative);
  assert.ok((await stat(full)).isFile(),`${file}: asset ${relative} exists`);
  if(anchor){const target=cache.get(relative)||await readFile(full,'utf8');assert.ok(target.includes(`id="${anchor}"`),`${file}: anchor ${relative}#${anchor}`);}
  links++;
 }
}
const home=cache.get('index.html');
for(const p of products){assert.ok(cache.has(`${p.id}.html`));assert.ok(home.includes(`id="tab-${p.id}"`));assert.ok(home.includes(`id="panel-${p.id}"`));}
assert.match(cache.get('mentions-legales.html'),/en cours de création/);
assert.match(cache.get('mentions-legales.html'),/capital social prévu de 2 000/);
assert.ok(![...cache.values()].join('').includes('®'),'No unverified registered trademark');
const js=await readFile(resolve(root,'assets/site.js'),'utf8');
assert.ok(!/fetch\(|XMLHttpRequest|localStorage|document\.cookie/.test(js),'No form upload or tracking');
const css=await readFile(resolve(root,'assets/style.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'";]+)['"]?\)/g)) await stat(resolve(root,'assets',match[1]));
console.log(`PASS — ${files.length} pages, ${links} liens et ressources locaux, ancres, métadonnées, images et statut de lancement.`);
