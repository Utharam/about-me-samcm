(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme ---------- */

  var toggle = document.querySelector('[data-theme-toggle]');

  function paintToggleIcons() {
    var dark = root.dataset.theme === 'dark';
    toggle.querySelector('.theme-icon--light').style.display = dark ? 'block' : 'none';
    toggle.querySelector('.theme-icon--dark').style.display = dark ? 'none' : 'block';
    toggle.setAttribute('aria-pressed', String(dark));
  }

  toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintToggleIcons();
  });

  paintToggleIcons();

  /* ---------- copy email ---------- */

  var toast = document.querySelector('.toast');
  var toastText = document.querySelector('[data-toast-text]');
  var toastTimer;

  function flash(message) {
    toastText.textContent = message;
    toast.dataset.show = 'true';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.dataset.show = 'false'; }, 2600);
  }

  function legacyCopy(text) {
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(field);
    return ok;
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var text = button.dataset.copy;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { flash(text + ' copied'); },
          function () { flash(legacyCopy(text) ? text + ' copied' : 'Copy failed — ' + text); }
        );
      } else {
        flash(legacyCopy(text) ? text + ' copied' : 'Copy failed — ' + text);
      }
    });
  });
})();
