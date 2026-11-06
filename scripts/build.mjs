import { readFile, writeFile } from 'node:fs/promises';
import { products, redirects } from '../src/products.mjs';
import { base, button, documentPage } from '../src/layout.mjs';
import { homePage } from '../src/home.mjs';
import { productPage } from '../src/detail.mjs';

const root = new URL('../', import.meta.url);
const home = {
  file: 'index.html',
  title: 'SoluSport — Solutions pour les associations sportives',
  description: 'Découvrez PresenSport, GestionSport, NotaSport et EquipSport pour organiser les séances, gérer le club, piloter les compétitions et concevoir des équipements sur mesure.',
  content: homePage()
};
const pages = [home, ...products.map(product => ({
  file: `${product.id}.html`,
  title: `${product.name} — ${product.subject} | SoluSport`,
  description: product.summary,
  image: product.image,
  content: productPage(product)
}))];

const about = await readFile(new URL('src/about.html', root), 'utf8');
pages.push({
  file: 'a-propos.html',
  title: 'Le projet SoluSport | Varetz, Corrèze',
  description: 'Une entreprise en cours de création à Varetz pour accompagner les associations sportives dans leur organisation et leurs projets d’équipement.',
  image: 'club-collectif',
  content: about
});

const informationPages = [
  ['mentions-legales', 'legal', 'Mentions légales', 'Éditeur, directeur de publication, hébergeur et statut du projet SoluSport.'],
  ['confidentialite', 'privacy', 'Confidentialité', 'Fonctionnement du formulaire de contact et traitement des informations échangées avec SoluSport.']
];
for (const [slug, source, title, description] of informationPages) {
  const body = await readFile(new URL(`src/${source}.html`, root), 'utf8');
  pages.push({
    file: `${slug}.html`, title: `${title} | SoluSport`, description,
    content: `<article class="wrap legal section">${body}</article>`
  });
}

for (const page of pages) {
  await writeFile(new URL(page.file, root), documentPage(page));
}

for (const [oldFile, destination] of Object.entries(redirects)) {
  const product = products.find(p => `${p.id}.html` === destination);
  const redirect = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${product.name} | SoluSport</title>
<meta name="description" content="Retrouvez cette offre sur la page ${product.name}.">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${base}${destination}">
<meta http-equiv="refresh" content="0;url=${destination}">
<link rel="stylesheet" href="assets/style.css">
</head>
<body><main class="wrap section">
<h1>${product.name}</h1>
<p>Retrouvez cette offre sur sa nouvelle page.</p>
${button(`Découvrir ${product.name}`, destination)}
</main></body>
</html>
`;
  await writeFile(new URL(oldFile, root), redirect);
}

const errorPage = documentPage({
  file: '404.html', title: 'Page introuvable | SoluSport', notFound: true,
  description: 'Accédez aux quatre solutions de SoluSport pour les associations sportives.',
  content: `<section class="wrap section error-page"><p class="kicker">Erreur 404</p>
    <h1>Page introuvable</h1><p>Retrouvez les offres pour votre association depuis l’accueil.</p>
    ${button('Voir les solutions', 'index.html#solutions')}</section>`
});
await writeFile(new URL('404.html', root), errorPage);

const siteMap = pages.map(p => `<url><loc>${base}${p.file === 'index.html' ? '' : p.file}</loc></url>`);
await writeFile(new URL('sitemap.xml', root),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${siteMap.join('\n')}\n</urlset>\n`);
console.log(`${pages.length} pages, une page 404 et ${Object.keys(redirects).length} redirections générées.`);
