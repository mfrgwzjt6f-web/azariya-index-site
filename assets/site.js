/* Nav: hamburger on narrow screens, plain links on wide ones.
   The links stay in the DOM at every width so keyboard and screen-reader
   users meet them in reading order rather than behind a button. */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;

  function close() {
    links.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Escape closes it, and so does following a link or growing past the breakpoint.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) { close(); btn.focus(); }
  });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
  window.matchMedia('(min-width: 801px)').addEventListener('change', function (m) {
    if (m.matches) close();
  });
})();
