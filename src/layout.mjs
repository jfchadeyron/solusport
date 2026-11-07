import { products } from './products.mjs';

const base = 'https://solusport.com/';
// Date de dernière mise à jour du contenu, reprise dans le sitemap.
const siteUpdated = '2026-11-07';
const organizationId = `${base}#organisation`;
const organization = {
  '@type': 'Organization',
  '@id': organizationId,
  name: 'SoluSport',
  url: base,
  logo: `${base}assets/logos/solusport.webp`,
  slogan: 'Votre sport, nos solutions',
  description: 'Projet d’entreprise en cours de création à Varetz (Corrèze) : logiciels pour l’appel, la gestion du club et les compétitions, tenues et équipements sportifs sur mesure pour les associations sportives.',
  email: 'contact@solusport.com',
  telephone: '+33 7 56 82 21 12',
  address: { '@type': 'PostalAddress', streetAddress: '11 allée de Biscaye', postalCode: '19240', addressLocality: 'Varetz', addressCountry: 'FR' },
  founder: { '@type': 'Person', name: 'Jean-François Chadeyron' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'contact@solusport.com', telephone: '+33 7 56 82 21 12', availableLanguage: 'French' }
};
const plain = text => String(text).replace(/<[^>]+>/g, '');
const faqSchema = (items, url) => ({
  '@type': 'FAQPage', '@id': `${url}#questions`,
  mainEntity: items.map(([question, answer]) => ({ '@type': 'Question', name: plain(question), acceptedAnswer: { '@type': 'Answer', text: plain(answer) } }))
});
function jsonLd(items) {
  if (!items.length) return '';
  const graph = JSON.stringify({ '@context': 'https://schema.org', '@graph': items }).replaceAll('<', '\\u003c');
  return `<script type="application/ld+json">${graph}</script>\n`;
}
const arrow = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const brand = '<img class="brand" src="assets/logos/solusport.webp" width="640" height="250" alt="SoluSport, votre sport, nos solutions">';

function escape(text) {
  return String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}

function button(label, href, variant = '') {
  return `<a class="button ${variant}" href="${escape(href)}">${label} ${arrow}</a>`;
}

function badge(product, size = 80) {
  return `<img class="product-logo" src="assets/logos/${product.id}.webp" width="${size}" height="${size}" alt="">`;
}

function photo(product, className = '', priority = false) {
  const panoramic = product.image === 'entrainement';
  const loading = priority ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<img class="photo ${className} ${product.id}" src="assets/${product.image}.webp"
    srcset="assets/${product.image}-800.webp 800w, assets/${product.image}.webp ${panoramic ? 2000 : 1200}w"
    sizes="(max-width: 760px) 100vw, 50vw"
    width="${panoramic ? 2000 : 1200}" height="${panoramic ? 740 : 800}"
    alt="${escape(product.alt)}" ${loading}>`;
}

function faq(items) {
  return `<div class="questions">${items.map(([question, answer]) => `
    <details>
      <summary>${question}<span class="plus" aria-hidden="true"></span></summary>
      <p>${answer}</p>
    </details>`).join('')}
  </div>`;
}

function header(file) {
  const about = file === 'a-propos.html' ? 'aria-current="page"' : '';
  const product = products.find(item => file === item.id + '.html');
  const contactLink = product ? `index.html?solution=${product.name}#contact` : 'index.html#contact';
  return `
    <a class="skip" href="#contenu">Aller au contenu</a>
    <header class="site-header">
      <div class="wrap masthead">
        <a href="index.html" class="brand-link" aria-label="Accueil SoluSport">${brand}</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Ouvrir le menu">
          <span></span><span></span><span></span>
        </button>
        <nav id="navigation" aria-label="Navigation principale">
          <a href="index.html#solutions">Nos solutions</a>
          <a href="a-propos.html" ${about}>À propos</a>
          <a href="index.html#questions">Questions fréquentes</a>
            ${button('Parler de mon projet', contactLink, 'nav-contact')}
        </nav>
      </div>
    </header>`;
}

function footer() {
  return `<footer class="footer">
    <div class="wrap footer-layout">
      <div>
        <a href="index.html" class="brand-link" aria-label="Accueil SoluSport">${brand}</a>
        <p>Solutions pour les associations sportives<br>Varetz, Corrèze</p>
      </div>
      <nav aria-label="Les solutions"><strong>Les solutions</strong>
        ${products.map(p => `<a href="${p.id}.html">${p.name}</a>`).join('\n')}
      </nav>
      <div><strong>SoluSport</strong>
        <a href="a-propos.html">Le projet</a>
        <a href="index.html#questions">Questions fréquentes</a>
        <a href="index.html#contact">Contact</a>
      </div>
      <div><strong>Nous contacter</strong>
        <a href="mailto:contact@solusport.com">contact@solusport.com</a>
        <a href="tel:+33756822112">07 56 82 21 12</a>
        <address>11 allée de Biscaye<br>19240 Varetz, France</address>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>© 2026 SoluSport · Entreprise en cours de création</span>
      <a href="mentions-legales.html">Mentions légales</a>
      <a href="confidentialite.html">Confidentialité</a>
    </div>
  </footer>`;
}

function documentPage({file, title, description, content, image = 'entrainement', imageAlt = 'Une entraîneuse et deux sportifs au bord du terrain.', schema = [], notFound = false}) {
  const address = base + (file === 'index.html' ? '' : file);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
${notFound ? '<base href="/"><meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#082945">
<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}">
<link rel="canonical" href="${address}">
<meta property="og:locale" content="fr_FR">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SoluSport">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${address}">
<meta property="og:image" content="${base}assets/partage/${image}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escape(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/logos/favicon.png" type="image/png">
<link rel="preload" href="assets/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
<script src="assets/site.js" defer></script>
${jsonLd(schema)}</head>
<body>${header(file)}
<main id="contenu">${content}</main>
${footer()}
</body>
</html>
`;
}

export { arrow, badge, base, button, documentPage, faq, faqSchema, organization, organizationId, photo, siteUpdated };
