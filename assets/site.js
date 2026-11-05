'use strict';

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

const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});

const form = document.querySelector('#contact-form');
if (form) {
  form.querySelector('button[type="submit"]').disabled = false;
  const selected = new URLSearchParams(location.search).get('solution');
  const select = form.elements.namedItem('solution');
  if (selected && Array.from(select.options).some(option => option.value === selected)) select.value = selected;
  let preparedMessage = '';
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const value = key => String(values.get(key) || '').trim();
    const subject = `Projet ${value('solution')} — ${value('club')}`;
    preparedMessage = `Bonjour SoluSport,\n\nJe souhaite échanger avec vous au sujet de mon association.\n\nNom : ${value('name')}\nAssociation : ${value('club')}\nE-mail : ${value('email')}\nSolution : ${value('solution')}\n\nMon projet :\n${value('message')}\n\nBien cordialement,\n${value('name')}`;
    document.querySelector('#email-draft').href = `mailto:contact@solusport.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedMessage)}`;
    document.querySelector('#message-preview').value = preparedMessage;
    document.querySelector('#copy-status').textContent = '';
    const result = document.querySelector('#contact-result');
    result.hidden = false;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  form.addEventListener('input', () => { document.querySelector('#contact-result').hidden = true; });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(preparedMessage);
      status.textContent = 'Message copié. Collez-le dans votre messagerie et envoyez-le à contact@solusport.fr.';
    } catch {
      const preview = document.querySelector('#message-preview');
      preview.focus(); preview.select();
      status.textContent = 'Sélectionnez le texte ci-dessus et copiez-le avec le menu de votre appareil ou Ctrl+C (⌘C sur Mac).';
    }
  });
}
