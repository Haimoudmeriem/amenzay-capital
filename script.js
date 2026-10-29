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

  // Formulaire de devis : envoi direct vers votre boîte e-mail (service FormSubmit)
  var DESTINATAIRE = 'amenzaycapitale@gmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + DESTINATAIRE;

  var form = document.getElementById('devis-form');
  var note = document.getElementById('form-note');
  var bouton = form ? form.querySelector('button[type="submit"]') : null;

  function ouvrirMessagerie() {
    var lignes = [
      'Bonjour,',
      '',
      'Je souhaite recevoir un devis comparatif pour : ' + form.besoin.value + '.',
      '',
      form.message.value.trim(),
      '',
      'Nom : ' + form.nom.value.trim(),
      form.societe.value.trim() ? 'Société : ' + form.societe.value.trim() : '',
      'E-mail : ' + form.email.value.trim(),
      form.tel.value.trim() ? 'Téléphone : ' + form.tel.value.trim() : ''
    ];
    var sujet = 'Demande de devis - ' + (form.societe.value.trim() || form.nom.value.trim());
    window.location.href = 'mailto:' + DESTINATAIRE +
      '?subject=' + encodeURIComponent(sujet) +
      '&body=' + encodeURIComponent(lignes.join('\n'));
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Champ piège anti-spam : un humain ne le remplit jamais
      if (form._honey && form._honey.value) return;

      var ok = true;
      [form.nom, form.email].forEach(function (champ) {
        var vide = !champ.value.trim();
        champ.classList.toggle('invalid', vide);
        if (vide) ok = false;
      });
      if (!ok) {
        note.textContent = 'Merci de renseigner votre nom et votre e-mail.';
        return;
      }

      var societe = form.societe.value.trim();
      var donnees = {
        'Nom': form.nom.value.trim(),
        'Société': societe || 'Non renseignée',
        'E-mail': form.email.value.trim(),
        'Téléphone': form.tel.value.trim() || 'Non renseigné',
        'Besoin': form.besoin.value,
        'Message': form.message.value.trim() || 'Aucun message',
        '_subject': 'Demande de devis - ' + (societe || form.nom.value.trim()),
        '_replyto': form.email.value.trim(),
        '_template': 'table',
        '_captcha': 'false'
      };

      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';
      note.textContent = '';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(donnees)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (res) {
          if (res && (res.success === 'true' || res.success === true)) {
            form.reset();
            note.textContent = 'Merci ! Votre demande a bien été envoyée. Nous vous répondons sous 24h.';
          } else {
            throw new Error('Réponse inattendue');
          }
        })
        .catch(function () {
          // Plan B : ouvrir la messagerie du visiteur avec un e-mail prérempli
          note.textContent = 'L\'envoi direct a échoué. Votre application e-mail va s\'ouvrir pour terminer l\'envoi.';
          ouvrirMessagerie();
        })
        .then(function () {
          bouton.disabled = false;
          bouton.textContent = 'Envoyer ma demande';
        });
    });

    form.querySelectorAll('input').forEach(function (champ) {
      champ.addEventListener('input', function () { champ.classList.remove('invalid'); });
    });
  }
})();
