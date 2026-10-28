(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  function closeMenu() {
    document.body.classList.remove('nav-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMenu();
        btn.focus();
      }
    });
  }

  // Waitlist form. Set data-endpoint on the form in index.html to your Formspree URL.
  var CONTACT = 'randy@wellspringhealthclinic.com';
  document.querySelectorAll('form[data-waitlist]').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        msg.textContent = 'The waitlist opens soon. Email ' + CONTACT + ' to be added now.';
        return;
      }
      submit.disabled = true;
      msg.textContent = 'Sending...';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('Request failed');
          form.reset();
          msg.textContent = "You're on the list. We'll email you when we open.";
        })
        .catch(function () {
          msg.textContent = 'That did not go through. Try again, or email ' + CONTACT + '.';
        })
        .then(function () { submit.disabled = false; });
    });
  });
})();
