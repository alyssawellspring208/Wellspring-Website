/*
 * WellSpring Health & Wellness website update | November 4, 2026
 * Replace the existing assets/js/main.js with this file.
 * No changes to GitHub repository or live website are made by creating this package.
 */
(function () {
  'use strict';

  var CONTACT = 'livewell@wellspringhealthclinic.com';
  var WAITLIST_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT;
  var script = document.currentScript;
  var imageBase = script && script.src
    ? new URL('../img/', script.src).href
    : 'assets/img/';

  function imageUrl(filename) {
    return imageBase + filename;
  }

  // Preserve the original accessible mobile navigation behavior.
  var btn = document.querySelector('.menu-btn');
  function closeMenu() {
    document.body.classList.remove('nav-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = document.querySelector('.site-nav a');
        if (first) first.focus();
      }
    });
    var wide = window.matchMedia('(min-width: 961px)');
    var onWide = function (e) { if (e.matches) closeMenu(); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
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

  // Change all existing public contact links on all pages, including top bars,
  // footers, FAQ and the privacy notice. Keeps the existing HTML templates intact.
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    if (/^mailto:randy@wellspringhealthclinic\.com(?:\?|$)/i.test(a.getAttribute('href') || '')) {
      a.href = 'mailto:' + CONTACT;
      a.textContent = a.textContent.replace(/randy@wellspringhealthclinic\.com/ig, CONTACT);
    }
  });

  // Scoped visual styles use the existing WellSpring palette and typography.
  var styles = document.createElement('style');
  styles.id = 'wellspring-2026-refresh';
  styles.textContent = [
    '.hero { background-position: center, center 44%; }',
    '.team-avatar { flex: none; display: block; width: 64px; height: 64px; object-fit: cover; object-position: center 24%; border-radius: 50%; background: #eef4f3; }',
    '.team-portrait { display: block; width: 100%; height: auto; aspect-ratio: 1 / 1; object-fit: cover; object-position: center 26%; border-radius: var(--radius); background: #f3f5f5; }',
    '.form-msg { min-height: 1.6em; }',
    '.form-msg[data-status="error"] { color: #a33e38; }',
    '.form-msg[data-status="success"] { color: var(--teal-text, #0b4450); }',
    '.visually-hidden-honeypot { position: absolute !important; left: -10000px !important; width: 1px !important; height: 1px !important; overflow: hidden !important; }',
    '@media (max-width: 860px) { .bio .team-portrait { width: min(240px, 100%); } }',
    '@media (max-width: 560px) { .hero { background-position: center, 58% center; } }'
  ].join('\n');
  document.head.appendChild(styles);

  // Change only the home page hero and the former spa lounge image.
  var homeHero = document.querySelector('.hero');
  if (homeHero) {
    homeHero.style.setProperty('--img', 'url("' + imageUrl('hero-clinical.webp') + '")');
    var secondaryPhoto = document.querySelector('main .band.on-cream .split .photo');
    if (secondaryPhoto) {
      secondaryPhoto.style.setProperty('--img', 'url("' + imageUrl('clinical-testing.webp') + '")');
      secondaryPhoto.setAttribute('aria-label', 'Clinical consultation and diagnostic testing at a modern wellness practice');
    }
  }

  var portraits = {
    RB: { filename: 'team-randy.webp', name: 'Randy Beckham' },
    DR: { filename: 'team-don.webp', name: 'Dr. Don Reiff' },
    LB: { filename: 'team-layla.webp', name: 'Layla Beverly' }
  };

  function replaceMonogram(node, entry, className) {
    if (!node || !entry) return;
    var img = document.createElement('img');
    img.className = className;
    img.src = imageUrl(entry.filename);
    img.alt = 'Portrait of ' + entry.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
      // Show the original initials if a photo has not been uploaded yet.
      if (img.parentNode) img.replaceWith(node);
    };
    node.replaceWith(img);
  }

  // Home page leadership portraits, preserving original person names and roles.
  document.querySelectorAll('.people .person').forEach(function (person) {
    var initials = person.querySelector('.mono');
    var id = initials && initials.textContent.trim();
    if (id && portraits[id]) replaceMonogram(initials, portraits[id], 'team-avatar');
  });

  // About page bio portraits, preserving the existing biography text.
  document.querySelectorAll('article.bio').forEach(function (bio) {
    var initials = bio.querySelector('.mono.lg');
    var id = initials && initials.textContent.trim();
    if (id && portraits[id]) replaceMonogram(initials, portraits[id], 'team-portrait');
  });

  // Transparent privacy notice regarding the form processor.
  var prose = document.querySelector('.prose');
  if (prose) {
    prose.querySelectorAll('h2').forEach(function (heading) {
      if (heading.textContent.trim() === 'Who sees it') {
        var paragraph = heading.nextElementSibling;
        if (paragraph && paragraph.tagName === 'P') {
          paragraph.textContent = 'Waitlist submissions are processed by FormSubmit, a third-party form service, and emailed to the WellSpring team. We do not sell your information. Please do not submit health or medical details.';
        }
      }
    });
    var updated = document.querySelector('.page-hero .lede');
    if (updated && /last updated/i.test(updated.textContent)) {
      updated.textContent = 'Last updated November 4, 2026';
    }
  }

  // FormSubmit AJAX requires a one-time confirmation sent to CONTACT before
  // emails can be delivered. IMPORTANT: data.success may be the string "false",
  // which must not be treated as successful simply because it is truthy.
  document.querySelectorAll('form[data-waitlist]').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    var submit = form.querySelector('button[type="submit"]');
    if (!msg || !submit) return;

    form.method = 'POST';
    form.action = WAITLIST_ENDPOINT;
    form.setAttribute('data-endpoint', WAITLIST_ENDPOINT);
    form.removeAttribute('novalidate');

    var honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_honey';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.className = 'visually-hidden-honeypot';
    honeypot.setAttribute('aria-hidden', 'true');
    form.appendChild(honeypot);

    var fine = form.querySelector('.fine');
    if (fine) {
      fine.textContent = 'We use your name, email, and preferred location for WellSpring updates. Processed by FormSubmit. Do not include health information. ';
      var privacy = document.createElement('a');
      privacy.href = 'privacy/index.html';
      privacy.textContent = 'Privacy';
      fine.appendChild(privacy);
    }

    function setStatus(kind, message) {
      msg.dataset.status = kind;
      msg.textContent = message;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (honeypot.value) return;
      if (submit.disabled) return;

      var fields = new FormData(form);
      var payload = {
        name: String(fields.get('name') || '').trim(),
        email: String(fields.get('email') || '').trim(),
        location: String(fields.get('location') || '').trim(),
        _subject: 'New WellSpring waitlist signup',
        _template: 'table',
        _captcha: 'false',
        _honey: '',
        _url: window.location.href.split('#')[0]
      };
      if (!payload.name || !payload.email || !payload.location) {
        setStatus('error', 'Please complete your name, email and location.');
        return;
      }

      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      setStatus('', 'Sending your information...');
      fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      }).then(function (result) {
        if (result && (result.success === true || result.success === 'true')) {
          form.reset();
          setStatus('success', "You're on the list. We'll email you when we open.");
          return;
        }
        var reason = result && result.message ? String(result.message) : '';
        if (/activat|confirm/i.test(reason)) {
          setStatus('error', 'Our waitlist is awaiting email activation. Please contact ' + CONTACT + ' to be added in the meantime.');
        } else {
          setStatus('error', 'We could not confirm your signup. Please email ' + CONTACT + ' instead.');
        }
      }).catch(function () {
        setStatus('error', 'We could not confirm your signup. Please try again or email ' + CONTACT + '.');
      }).then(function () {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
      });
    });
  });
})();
