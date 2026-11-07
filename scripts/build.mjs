import { readFile, writeFile } from 'node:fs/promises';
import { products, redirects } from '../src/products.mjs';
import { base, button, documentPage, faqSchema, organization, organizationId, siteUpdated } from '../src/layout.mjs';
import { homePage, questions } from '../src/home.mjs';
import { productPage } from '../src/detail.mjs';

const root = new URL('../', import.meta.url);
const home = {
  file: 'index.html',
  title: 'SoluSport — Logiciels et équipements pour clubs sportifs',
  description: 'Logiciels pour l’appel, la gestion du club et les compétitions, tenues et équipements sur mesure : les solutions SoluSport pour les associations sportives.',
  content: homePage(),
  schema: [
    organization,
    { '@type': 'WebSite', '@id': `${base}#site`, name: 'SoluSport', url: base, inLanguage: 'fr-FR', publisher: { '@id': organizationId } },
    faqSchema(questions, base)
  ]
};
const pages = [home, ...products.map(product => ({
  file: `${product.id}.html`,
  title: `${product.searchTitle} | SoluSport`,
  description: product.metaDescription,
  image: product.image,
  imageAlt: product.alt,
  content: productPage(product),
  schema: [
    {
      '@type': 'Service', '@id': `${base}${product.id}.html#service`, name: product.name,
      serviceType: product.subject, description: product.introduction, url: `${base}${product.id}.html`,
      image: `${base}assets/${product.image}.webp`, provider: { '@id': organizationId },
      audience: { '@type': 'Audience', audienceType: product.audience }
    },
    {
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: base },
        { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${base}#solutions` },
        { '@type': 'ListItem', position: 3, name: product.name, item: `${base}${product.id}.html` }
      ]
    },
    faqSchema(product.faq, `${base}${product.id}.html`)
  ]
}))];

const about = await readFile(new URL('src/about.html', root), 'utf8');
pages.push({
  file: 'a-propos.html',
  title: 'Le projet SoluSport | Varetz, Corrèze',
  description: 'Une entreprise en cours de création à Varetz pour accompagner les associations sportives dans leur organisation et leurs projets d’équipement.',
  image: 'club-collectif',
  imageAlt: 'Illustration d’un groupe de sportifs réunis avant l’entraînement.',
  content: about,
  schema: [organization, { '@type': 'AboutPage', '@id': `${base}a-propos.html`, url: `${base}a-propos.html`, name: 'Le projet SoluSport', about: { '@id': organizationId } }]
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

const siteMap = pages.map(p => `<url><loc>${base}${p.file === 'index.html' ? '' : p.file}</loc><lastmod>${siteUpdated}</lastmod></url>`);
await writeFile(new URL('sitemap.xml', root),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${siteMap.join('\n')}\n</urlset>\n`);
const llms = `# SoluSport

> SoluSport réunit des logiciels et des équipements pour les associations sportives : appel et présences, gestion du club, organisation de compétitions, tenues et équipements sur mesure. Projet d’entreprise en cours de création à Varetz (Corrèze, France).

## Solutions

${products.map(p => `- [${p.name}](${base}${p.id}.html) : ${p.subject.toLowerCase()}. ${p.summary} Pour : ${p.audience.toLowerCase()}.`).join('\n')}

## Statut

SoluSport est un projet d’entreprise en cours de création. La disponibilité, les modalités et les prix des solutions sont précisés lors d’un premier échange. Le site ne permet ni commande ni paiement en ligne.

## Contact

- E-mail : contact@solusport.com
- Téléphone : 07 56 82 21 12 (+33 7 56 82 21 12)
- Adresse : 11 allée de Biscaye, 19240 Varetz, France
- Formulaire : ${base}#contact

## Pages utiles

- [Accueil](${base})
- [Le projet SoluSport](${base}a-propos.html)
- [Questions fréquentes](${base}#questions)
- [Mentions légales](${base}mentions-legales.html)
`;
await writeFile(new URL('llms.txt', root), llms);
console.log(`${pages.length} pages, une page 404 et ${Object.keys(redirects).length} redirections générées.`);
