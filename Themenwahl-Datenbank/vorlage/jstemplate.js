/* Themenwahl – Modelle der sozialen Differenzierung
   ------------------------------------------------------------------
   - Listenansicht: Übersicht mit Belegung je Thema (Namen, x von 5)
   - Eintrag hinzufügen/bearbeiten: volle Themen werden gesperrt;
     direkt vor dem Speichern wird die Belegung noch einmal geprüft.
   Hinweis: Die Sperre läuft im Browser. Sie verhindert Überbelegung
   im Unterrichtsalltag zuverlässig, ist aber keine Server-Sperre.
*/
(function () {
  'use strict';

  /* ===== EINSTELLUNGEN ================================================ */
  /* 20 Schüler/innen : 4 Themen = 5 Plätze pro Thema */
  var PLAETZE_PRO_THEMA = 5;

  /* Die Namen müssen GENAU den Optionen des Feldes „Thema“ entsprechen. */
  var THEMEN = [
    { name: 'Klassenmodell nach Karl Marx',
      info: 'Bourgeoisie und Proletariat: Der Besitz an Produktionsmitteln teilt die Gesellschaft in Klassen.' },
    { name: 'Schichtungstheorien (Dahrendorf und Geißler)',
      info: 'Hausmodelle der Gesellschaft: Schichten nach Beruf, Bildung, Einkommen und Ansehen.' },
    { name: 'Soziale Milieus (Sinus)',
      info: 'Soziale Lage und Grundorientierung: Gruppen mit ähnlichen Werten und Lebensstilen.' },
    { name: 'Exklusion und Inklusion',
      info: 'Drinnen oder draußen statt oben oder unten: Teilhabe an Arbeit, Bildung und sozialen Beziehungen.' }
  ];
  /* ==================================================================== */

  function bereit(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function norm(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function themaIndex(text) {
    var t = norm(text);
    for (var i = 0; i < THEMEN.length; i++) {
      if (THEMEN[i].name === t) { return i; }
    }
    return -1;
  }

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) { e.className = klasse; }
    if (text !== undefined) { e.textContent = text; }
    return e;
  }

  /* d=… (Datenbank-ID) oder id=… (Kursmodul-ID) der aktuellen Datenbank */
  function datenbankParameter() {
    var p = new URLSearchParams(window.location.search);
    if (p.get('d')) { return 'd=' + encodeURIComponent(p.get('d')); }
    var feld = document.querySelector('input[name="d"]');
    if (feld && feld.value) { return 'd=' + encodeURIComponent(feld.value); }
    var m = (document.body.className || '').match(/\bcmid-(\d+)\b/);
    if (m) { return 'id=' + m[1]; }
    if (p.get('id')) { return 'id=' + encodeURIComponent(p.get('id')); }
    return null;
  }

  /* Lädt alle Einträge (Listenansicht) und zählt die Namen je Thema. */
  function belegungLaden() {
    var param = datenbankParameter();
    if (!param || !window.fetch || !window.DOMParser) {
      return Promise.reject(new Error('Belegung nicht abrufbar'));
    }
    var url = 'view.php?' + param + '&mode=list&perpage=1000&search=&advanced=0';
    return fetch(url, { credentials: 'same-origin' })
      .then(function (antwort) {
        if (!antwort.ok) { throw new Error('HTTP ' + antwort.status); }
        return antwort.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var belegung = THEMEN.map(function () { return []; });
        doc.querySelectorAll('.tw-eintrag').forEach(function (eintrag) {
          var wert = eintrag.querySelector('.tw-thema-wert');
          var i = themaIndex(wert ? wert.textContent : '');
          if (i < 0) { return; }
          var name = eintrag.querySelector('.tw-name');
          belegung[i].push(norm(name ? name.textContent : '') || '?');
        });
        return belegung;
      });
  }

  /* ---------- Farben für Themen-Badges (alle Ansichten) ---------- */
  function badgesFaerben() {
    document.querySelectorAll('.tw-thema-wert').forEach(function (b) {
      var i = themaIndex(b.textContent);
      if (i >= 0) { b.classList.add('tw-t' + (i + 1)); }
    });
    document.querySelectorAll('.tw-plaetze').forEach(function (s) {
      s.textContent = PLAETZE_PRO_THEMA;
    });
    /* leeres Wunschteam in der Liste ausblenden */
    document.querySelectorAll('.tw-eintrag-team').forEach(function (t) {
      var w = t.querySelector('.tw-team-wert');
      if (w && !norm(w.textContent)) { t.style.visibility = 'hidden'; }
    });
  }

  /* ---------- Listenansicht: Übersicht ---------- */
  function uebersichtAnzeigen(box) {
    box.textContent = '';
    box.appendChild(el('p', 'tw-ladehinweis', 'Belegung wird geladen …'));

    belegungLaden().then(function (belegung) {
      box.textContent = '';
      var vergeben = 0;
      belegung.forEach(function (namen) { vergeben += namen.length; });
      var gesamt = PLAETZE_PRO_THEMA * THEMEN.length;
      box.appendChild(el('div', 'tw-gesamt',
        vergeben + ' von ' + gesamt + ' Plätzen vergeben · ' +
        Math.max(gesamt - vergeben, 0) + ' noch frei'));

      THEMEN.forEach(function (thema, i) {
        var namen = belegung[i].slice().sort(function (a, b) { return a.localeCompare(b, 'de'); });
        var n = namen.length;
        var karte = el('section', 'tw-karte tw-t' + (i + 1));
        karte.appendChild(el('h4', '', thema.name));
        karte.appendChild(el('p', 'tw-info', thema.info));

        var zahl = el('div', 'tw-zahl');
        var links = el('span');
        links.appendChild(el('strong', '', String(n)));
        links.appendChild(document.createTextNode(' von ' + PLAETZE_PRO_THEMA));
        zahl.appendChild(links);
        var status;
        if (n > PLAETZE_PRO_THEMA) {
          status = el('span', 'tw-status tw-ueber', 'überbelegt');
        } else if (n === PLAETZE_PRO_THEMA) {
          status = el('span', 'tw-status tw-voll', 'voll');
        } else {
          var frei = PLAETZE_PRO_THEMA - n;
          status = el('span', 'tw-status tw-frei', frei + (frei === 1 ? ' Platz frei' : ' Plätze frei'));
        }
        zahl.appendChild(status);
        karte.appendChild(zahl);

        var balken = el('div', 'tw-balken');
        balken.setAttribute('role', 'progressbar');
        balken.setAttribute('aria-valuemin', '0');
        balken.setAttribute('aria-valuemax', String(PLAETZE_PRO_THEMA));
        balken.setAttribute('aria-valuenow', String(n));
        balken.setAttribute('aria-label', thema.name + ': ' + n + ' von ' + PLAETZE_PRO_THEMA + ' Plätzen belegt');
        var fuell = el('span');
        fuell.style.width = Math.min(100, Math.round(n / PLAETZE_PRO_THEMA * 100)) + '%';
        balken.appendChild(fuell);
        karte.appendChild(balken);

        var liste = el('ul', 'tw-namen');
        if (!n) {
          liste.appendChild(el('li', 'tw-leer', 'noch niemand'));
        } else {
          namen.forEach(function (name) { liste.appendChild(el('li', '', name)); });
        }
        karte.appendChild(liste);
        box.appendChild(karte);
      });
    }).catch(function () {
      box.textContent = '';
      box.appendChild(el('p', 'tw-ladehinweis', 'Die Belegung konnte nicht geladen werden. Bitte die Seite neu laden.'));
    });
  }

  /* ---------- Formular: volle Themen sperren ---------- */
  function formularVorbereiten(wahl) {
    var radios = Array.prototype.slice.call(wahl.querySelectorAll('input[type="radio"]'));
    if (!radios.length) { return; }
    var form = wahl.closest('form');

    /* Beim Bearbeiten zählt der eigene Eintrag nicht gegen das eigene Thema. */
    var ridFeld = form ? form.querySelector('input[name="rid"]') : null;
    var bearbeiten = !!(new URLSearchParams(window.location.search).get('rid') || (ridFeld && ridFeld.value));
    var vorher = radios.filter(function (r) { return r.checked; })[0];
    var eigenesThema = (bearbeiten && vorher) ? themaIndex(vorher.value) : -1;

    var meldung = el('div', 'tw-meldung');
    meldung.setAttribute('role', 'alert');
    wahl.parentNode.insertBefore(meldung, wahl);

    function labelVon(r) {
      return (r.id && wahl.querySelector('label[for="' + r.id + '"]')) || r.closest('label');
    }

    function belegt(belegung, i) {
      return belegung[i].length - (i === eigenesThema ? 1 : 0);
    }

    function anzeigen(belegung) {
      wahl.querySelectorAll('.tw-zusatz').forEach(function (z) { z.remove(); });
      radios.forEach(function (r) {
        var i = themaIndex(r.value);
        var label = labelVon(r);
        if (i < 0 || !label) { return; }
        label.classList.add('tw-t' + (i + 1));

        var info = el('span', 'tw-zusatz tw-option-info', THEMEN[i].info);
        label.parentNode.insertBefore(info, label.nextSibling);

        if (!belegung) { return; }
        var b = belegt(belegung, i);
        var frei = PLAETZE_PRO_THEMA - b;
        var voll = frei <= 0;
        var platz = el('span', 'tw-zusatz tw-platz tw-t' + (i + 1) + (voll ? ' tw-voll' : ''),
          voll ? 'voll (' + b + ' von ' + PLAETZE_PRO_THEMA + ')'
               : frei + (frei === 1 ? ' Platz frei' : ' Plätze frei'));
        label.parentNode.insertBefore(platz, label.nextSibling);

        r.disabled = voll && !r.checked;
        label.classList.toggle('tw-gesperrt', voll && !r.checked);
      });
    }

    function hinweis(text, typ) {
      meldung.textContent = '';
      if (!text) { return; }
      var box = el('div', 'alert alert-' + (typ || 'warning'), text);
      meldung.appendChild(box);
    }

    anzeigen(null);
    belegungLaden().then(anzeigen).catch(function () {
      hinweis('Die Belegung konnte nicht geladen werden. Du kannst trotzdem wählen.', 'info');
    });

    if (!form) { return; }

    /* Direkt vor dem Speichern noch einmal prüfen (falls jemand schneller war). */
    var geprueft = false;
    form.addEventListener('submit', function (ev) {
      if (geprueft) { return; }
      var knopf = ev.submitter || null;
      if (knopf && /cancel/i.test(knopf.name || '')) { return; }
      var gewaehlt = radios.filter(function (r) { return r.checked; })[0];
      if (!gewaehlt) { return; }  /* Pflichtfeld – Moodle meldet das selbst */
      var i = themaIndex(gewaehlt.value);
      if (i < 0) { return; }

      ev.preventDefault();
      belegungLaden().then(function (belegung) {
        anzeigen(belegung);
        if (belegt(belegung, i) >= PLAETZE_PRO_THEMA && i !== eigenesThema) {
          gewaehlt.checked = false;
          anzeigen(belegung);
          hinweis('Schade, „' + THEMEN[i].name + '“ ist inzwischen voll. Bitte wähle ein anderes Thema.', 'warning');
          wahl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return false;
        }
        return true;
      }).catch(function () {
        return true;   /* Prüfung nicht möglich: normal speichern */
      }).then(function (abschicken) {
        if (!abschicken) { return; }
        geprueft = true;
        if (knopf && form.requestSubmit) {
          form.requestSubmit(knopf);
        } else {
          if (knopf && knopf.name) {
            var h = document.createElement('input');
            h.type = 'hidden';
            h.name = knopf.name;
            h.value = knopf.value;
            form.appendChild(h);
          }
          HTMLFormElement.prototype.submit.call(form);
        }
      });
    });
  }

  bereit(function () {
    badgesFaerben();
    var box = document.getElementById('tw-uebersicht');
    if (box) { uebersichtAnzeigen(box); }
    var wahl = document.getElementById('tw-thema-wahl');
    if (wahl) { formularVorbereiten(wahl); }
  });
})();
