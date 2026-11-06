import { products } from './products.mjs';
import { arrow, badge, button, faq, photo } from './layout.mjs';

function productPage(product) {
  const enquire = `index.html?solution=${product.name}#contact`;
  return `<section class="product-hero">
    <div class="wrap">
      <nav class="crumb" aria-label="Fil d’Ariane">
        <a href="index.html">Accueil</a><span aria-hidden="true">/</span>
        <a href="index.html#solutions">Solutions</a><span aria-hidden="true">/</span>
        <span aria-current="page">${product.name}</span>
      </nav>
      <div class="product-lead">
        <div>
          <div class="identity">
            ${badge(product, 96)}
            <div><strong>${product.name}</strong><span>${product.theme}</span></div>
          </div>
          <h1>${product.title}</h1>
          <p>${product.introduction}</p>
          ${button('Parler de mon projet', enquire)}
        </div>
        <figure class="product-photo">
          ${photo(product, '', true)}
          <figcaption>${product.id === 'equipsport' ? 'Illustration de tenues et d’équipements sur mesure' : 'Scène de club illustrée'}</figcaption>
        </figure>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap split scope">
      <div class="scope-heading">
        <p class="kicker">${product.name}</p>
        <h2>${product.subject}</h2>
        <dl class="audience"><dt>À qui s’adresse cette solution ?</dt><dd>${product.audience}.</dd></dl>
      </div>
      <div class="service-list">${product.sections.map(([title, description]) => `
        <article>
          <h3>${title}</h3>
          <p>${description}</p>
        </article>`).join('')}
      </div>
    </div>
  </section>
  <section class="use-case">
    <div class="wrap case-grid">
      <div><p class="kicker">Exemple d’usage</p><h2>${product.focus}</h2></div>
      <p>${product.example}</p>
    </div>
  </section>
  <section class="section"><div class="wrap split">
    <div><p class="kicker">À propos de ${product.name}</p><h2>Vos questions</h2></div>
    ${faq(product.faq)}
  </div></section>
  <section class="enquire"><div class="wrap enquire-grid">
    <div><h2>Préparons votre projet ${product.name}.</h2><p>${product.contact}</p></div>
    ${button('Décrire mon besoin', enquire, 'accent')}
  </div></section>
  <nav class="wrap related" aria-label="Les autres solutions">
    <strong>Les autres solutions</strong>
    ${products.filter(p => p.id !== product.id).map(p => `<a href="${p.id}.html">${p.name} ${arrow}</a>`).join('\n')}
  </nav>`;
}

export { productPage };
