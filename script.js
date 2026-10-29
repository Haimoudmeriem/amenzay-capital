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

  // Formulaire de devis : envoi AJAX vers Formspree
  var form = document.getElementById('devis-form');
  var note = document.getElementById('form-note');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var ok = true;
      [form.nom, form.email].forEach(function (champ) {
        var vide = !champ.value.trim();
        champ.classList.toggle('invalid', vide);
        if (vide) ok = false;
      });

      if (!ok) {
        note.textContent = 'Merci de renseigner votre nom et votre e-mail.';
        note.style.color = '#ef4444';
        return;
      }

      var bouton = form.querySelector('button[type="submit"]');
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';
      note.textContent = 'Transmission de votre demande en cours…';
      note.style.color = '#94a3b8';

      var data = new FormData(form);

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          note.textContent = 'Merci ! Votre demande a bien été envoyée. Nous vous répondons sous 24h.';
          note.style.color = '#d4af62';
          note.style.fontWeight = '600';
          form.reset();
        } else {
          var resData = await response.json();
          if (resData.errors) {
            note.textContent = resData.errors.map(function(error) { return error.message; }).join(', ');
          } else {
            note.textContent = 'Une erreur est survenue lors de l\'envoi. Vous pouvez nous écrire directement à amenzaycapitale@gmail.com';
          }
          note.style.color = '#ef4444';
        }
      } catch (error) {
        note.textContent = 'Erreur réseau. Vous pouvez nous contacter directement par e-mail ou téléphone.';
        note.style.color = '#ef4444';
      } finally {
        bouton.disabled = false;
        bouton.textContent = 'Envoyer ma demande';
      }
    });

    form.querySelectorAll('input').forEach(function (champ) {
      champ.addEventListener('input', function () { champ.classList.remove('invalid'); });
    });
  }
})();
