'use strict';

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Ouvrir le menu');
  navigation?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const form = document.querySelector('#contact-form');
if (form) {
  form.querySelector('button[type="submit"]').disabled = false;
  const requested = new URLSearchParams(location.search).get('solution');
  const formerNames = new Map([
    ['CommSport', 'GestionSport'],
    ['ManageSport', 'GestionSport'],
    ['WearSport', 'EquipSport']
  ]);
  const selected = formerNames.get(requested) || requested;
  const select = form.elements.namedItem('solution');
  if (selected && Array.from(select.options).some(option => option.value === selected)) select.value = selected;
  let preparedMessage = '';
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#form-status');
  const result = document.querySelector('#contact-result');
  const reveal = element => {
    element.hidden = false;
    element.focus({ preventScroll: true });
    element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  };
  const showStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle('is-error', isError);
    reveal(status);
  };
  // Si l’envoi automatique échoue, le visiteur peut encore envoyer le message depuis sa messagerie.
  const prepareDraft = values => {
    const value = key => String(values.get(key) || '').trim();
    const subject = `Projet ${value('solution')} — ${value('club')}`;
    preparedMessage = `Bonjour SoluSport,\n\nJe souhaite échanger avec vous au sujet de mon association.\n\nNom : ${value('name')}\nAssociation : ${value('club')}\nE-mail : ${value('email')}\nSolution : ${value('solution')}\n\nMon projet :\n${value('message')}\n\nBien cordialement,\n${value('name')}`;
    document.querySelector('#email-draft').href = `mailto:contact@solusport.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedMessage)}`;
    document.querySelector('#message-preview').value = preparedMessage;
    document.querySelector('#copy-status').textContent = '';
    reveal(result);
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    status.hidden = true;
    result.hidden = true;
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch('contact.php', { method: 'POST', body: values, headers: { Accept: 'application/json' } });
      const answer = await response.json().catch(() => null);
      if (response.ok && answer?.ok) {
        form.reset();
        showStatus('Merci ! Votre message a bien été envoyé à SoluSport. Une réponse vous sera apportée à l’adresse indiquée.');
      } else if (response.status === 400 && answer?.erreur) {
        showStatus(answer.erreur, true);
      } else {
        prepareDraft(values);
      }
    } catch {
      prepareDraft(values);
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
    }
  });
  form.addEventListener('input', () => { result.hidden = true; status.hidden = true; });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(preparedMessage);
      status.textContent = 'Message copié. Collez-le dans votre messagerie et envoyez-le à contact@solusport.com.';
    } catch {
      const preview = document.querySelector('#message-preview');
      preview.focus(); preview.select();
      status.textContent = 'Sélectionnez le texte ci-dessus et copiez-le avec le menu de votre appareil ou Ctrl+C (⌘C sur Mac).';
    }
  });
}
