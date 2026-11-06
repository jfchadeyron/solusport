import { products } from './products.mjs';
import { arrow, badge, button, faq } from './layout.mjs';

const questions = [
  ['Quelle solution choisir pour les adhésions et l’appel ?', 'GestionSport accompagne le bureau pour les adhésions, les cotisations et l’agenda partagé avec les familles. PresenSport accompagne les entraîneurs pendant les séances pour l’appel, les absences et le suivi des uniformes.'],
  ['Peut-on commencer par une seule solution ?', 'Oui. Vous pouvez préparer un projet autour d’un seul besoin, par exemple l’appel hors ligne ou l’organisation d’une compétition. Nous précisons ensemble les fonctionnalités, la disponibilité et les conditions adaptées au club.'],
  ['Peut-on demander du matériel sur mesure avec EquipSport ?', 'Oui. EquipSport étudie aussi bien les équipements sportifs sur mesure que les tenues personnalisées. Décrivez l’usage prévu, les contraintes, les quantités et votre échéance pour préparer un premier échange.'],
  ['Comment préparer notre demande ?', 'Indiquez votre discipline et décrivez une situation concrète. Pour un logiciel, précisez qui va l’utiliser et à quel moment de la saison. Pour une tenue ou un équipement, ajoutez les dimensions ou les tailles utiles et le délai souhaité.'],
  ['Quand peut-on contacter SoluSport ?', 'Vous pouvez prendre contact dès maintenant. SoluSport est un projet d’entreprise en cours de création à Varetz. Ce premier échange sert à étudier votre besoin et à préciser la disponibilité de la solution.']
];

function solutionCard(product) {
  return `<a class="solution-card" data-solution="${product.id}" href="${product.id}.html">
    <div class="card-identity">${badge(product)}<span>${product.theme}</span></div>
    <h3>${product.name}</h3>
    <p>${product.summary}</p>
    <span class="card-link">Découvrir la solution ${arrow}</span>
  </a>`;
}

function contact() {
  return `<section class="contact section" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact-grid" id="approche">
      <div class="contact-intro">
        <p class="kicker">Contact</p>
        <h2 id="contact-title">Parlons de votre club.</h2>
        <p>Décrivez votre discipline, votre organisation et ce que vous souhaitez mettre en place. Un premier échange permet de préciser le projet et son calendrier.</p>
        <a class="contact-email" href="mailto:contact@solusport.fr">contact@solusport.fr ${arrow}</a>
        <address>11 allée de Biscaye<br>19240 Varetz, France</address>
      </div>
      <form class="contact-form" id="contact-form">
        <div class="field-grid">
          <label for="name">Votre nom <span>*</span>
            <input id="name" name="name" autocomplete="name" maxlength="100" required>
          </label>
          <label for="club">Votre association <span>*</span>
            <input id="club" name="club" autocomplete="organization" maxlength="150" required>
          </label>
          <label for="email">Votre e-mail <span>*</span>
            <input id="email" name="email" type="email" autocomplete="email" maxlength="180" required>
          </label>
          <label for="solution">Solution envisagée
            <select id="solution" name="solution">
              <option>À définir ensemble</option>
              ${products.map(p => `<option value="${p.name}">${p.name}</option>`).join('\n')}
              <option>Plusieurs solutions</option>
            </select>
          </label>
        </div>
        <label for="message">Votre projet <span>*</span>
          <textarea id="message" name="message" rows="4" maxlength="3000" required
            placeholder="De quoi votre association a-t-elle besoin ?"></textarea>
        </label>
        <p class="form-note">* Champs obligatoires. Vous pourrez relire le message, puis l’envoyer depuis votre messagerie. <a href="confidentialite.html">Confidentialité</a></p>
        <noscript><p>Écrivez directement à <a href="mailto:contact@solusport.fr">contact@solusport.fr</a>.</p></noscript>
        <button class="button" type="submit" disabled>Préparer mon e-mail ${arrow}</button>
        <div id="contact-result" hidden tabindex="-1">
          <p role="status">Votre message est prêt. Ouvrez votre messagerie pour l’envoyer à contact@solusport.fr.</p>
          <a class="button" id="email-draft" href="mailto:contact@solusport.fr">Ouvrir ma messagerie ${arrow}</a>
          <button class="copy" id="copy-message" type="button">Copier le message</button>
          <textarea id="message-preview" readonly rows="6" aria-label="Message préparé"></textarea>
          <p id="copy-status" role="status"></p>
        </div>
      </form>
    </div>
  </section>`;
}

function homePage() {
  return `<section class="hero" aria-labelledby="hero-title">
    <img class="hero-photo" src="assets/entrainement.webp" width="2000" height="740"
      alt="Une entraîneuse et deux sportifs au bord du terrain." fetchpriority="high">
    <div class="hero-shade" aria-hidden="true"></div>
    <div class="wrap hero-layout">
      <div class="hero-copy">
        <p class="kicker">Pour les associations sportives</p>
        <h1 id="hero-title">Organisez votre club.<br><em>Équipez vos sportifs.</em></h1>
        <p>De l’appel à l’entraînement jusqu’au matériel sur mesure, SoluSport réunit quatre solutions pour les bénévoles, les entraîneurs et les dirigeants.</p>
        <div class="actions">
          ${button('Explorer les solutions', '#solutions', 'accent')}
          <a class="quiet-link" href="#contact">Échanger sur mon projet ${arrow}</a>
        </div>
      </div>
    </div>
  </section>
  <section class="range section" id="solutions" aria-labelledby="range-title">
    <div class="wrap">
      <div class="section-head">
        <div><p class="kicker">La gamme SoluSport</p><h2 id="range-title">Quelle solution pour votre club ?</h2></div>
      </div>
      <div class="solution-grid">${products.map(solutionCard).join('\n')}</div>
    </div>
  </section>
  <section class="equipment-feature">
    <div class="wrap feature-layout">
      <figure class="equipment-image">
        <img src="assets/equipement-sur-mesure.webp" width="1200" height="800" loading="lazy"
          alt="Concept de maillot, sac d’équipe et housse de transport coordonnés aux couleurs du club.">
        <figcaption>Exemple de personnalisation</figcaption>
      </figure>
      <div class="feature-copy">
        <p class="kicker">EquipSport</p>
        <h2>Du maillot au matériel sur mesure.</h2>
        <p>Pour une tenue, tout commence par les sportifs qui la portent. Pour un équipement, le point de départ est son usage sur le terrain.</p>
        <dl class="brief">
          <div><dt>Votre projet textile</dt><dd>Discipline, coupes, couleurs du club, tailles et quantités.</dd></div>
          <div><dt>Votre projet d’équipement</dt><dd>Usage, dimensions, contraintes de transport ou de rangement et délai souhaité.</dd></div>
        </dl>
        ${button('Découvrir EquipSport', 'equipsport.html')}
      </div>
    </div>
  </section>
  <section class="section" id="questions">
    <div class="wrap split">
      <div><p class="kicker">Avant de nous contacter</p><h2>Questions fréquentes</h2></div>
      ${faq(questions)}
    </div>
  </section>
  ${contact()}`;
}

export { homePage };
