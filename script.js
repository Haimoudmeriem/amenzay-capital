(function () {
  'use strict';

  // Année du pied de page
  var annee = document.getElementById('annee');
  if (annee) annee.textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });
  }

  // Formulaire de devis : envoi classique vers FormSubmit (réception par e-mail)
  var form = document.getElementById('devis-form');
  var note = document.getElementById('form-note');

  if (form) {
    // Message de remerciement au retour de FormSubmit
    if (/[?&]merci=1/.test(window.location.search)) {
      note.textContent = 'Merci ! Votre demande a bien été envoyée. Nous vous répondons sous 24h.';
      note.style.color = '#d4af62';
      note.style.fontWeight = '600';
    }

    form.addEventListener('submit', function (e) {
      var ok = true;
      [form.nom, form.email].forEach(function (champ) {
        var vide = !champ.value.trim();
        champ.classList.toggle('invalid', vide);
        if (vide) ok = false;
      });
      if (!ok) {
        e.preventDefault();
        note.textContent = 'Merci de renseigner votre nom et votre e-mail.';
        return;
      }

      var societe = form.societe.value.trim();
      form._subject.value = 'Demande de devis - ' + (societe || form.nom.value.trim());
      form._next.value = window.location.origin + window.location.pathname + '?merci=1#contact';

      var bouton = form.querySelector('button[type="submit"]');
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';
      // Le navigateur poursuit l'envoi normalement vers FormSubmit
    });

    form.querySelectorAll('input').forEach(function (champ) {
      champ.addEventListener('input', function () { champ.classList.remove('invalid'); });
    });
  }
})();
