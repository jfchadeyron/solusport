import { products } from './products.mjs';

const base = 'https://solucheer.com/';
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

function documentPage({file, title, description, content, image = 'entrainement', notFound = false}) {
  const address = base + (file === 'index.html' ? '' : file);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
${notFound ? '<base href="/"><meta name="robots" content="noindex">' : ''}
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
<meta property="og:image" content="${base}assets/${image}.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/logos/favicon.png" type="image/png">
<link rel="preload" href="assets/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
<script src="assets/site.js" defer></script>
</head>
<body>${header(file)}
<main id="contenu">${content}</main>
${footer()}
</body>
</html>
`;
}

export { arrow, badge, base, button, documentPage, faq, photo };
