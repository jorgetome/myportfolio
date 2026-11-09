/*
 * main.js - deferred. Applies translations, renders config links, wires the
 * language and theme toggles and the active-nav indicator.
 * DOM writes use textContent / setAttribute only. No network access.
 */
(function () {
  'use strict';

  var root = typeof window !== 'undefined' ? window : globalThis;
  var P = root.Portfolio = root.Portfolio || {};
  var hasDoc = typeof document !== 'undefined';

  var LANGS = ['pt', 'en'];

  function localized(value, lang) {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      return value[lang] || value.pt || '';
    }
    return '';
  }

  function config() {
    return root.SITE_CONFIG || {};
  }

  function translate(lang, key) {
    var dict = root.I18N || {};
    var text = null;
    if (dict[lang] && typeof dict[lang][key] === 'string') {
      text = dict[lang][key];
    } else if (dict.pt && typeof dict.pt[key] === 'string') {
      text = dict.pt[key];
    }
    if (text === null) {
      return null;
    }
    return text.split('{name}').join(localized(config().name, lang));
  }

  function safeUrl(value, kind) {
    if (typeof value !== 'string') {
      return null;
    }
    if (kind === 'web') {
      if (/^https?:\/\//.test(value) && !/[\s\u0000-\u001f\u007f]/.test(value)) {
        return value;
      }
      return null;
    }
    if (kind === 'email') {
      if (/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(value)) {
        return 'mailto:' + value;
      }
      return null;
    }
    return null;
  }

  P.localized = localized;
  P.translate = translate;
  P.safeUrl = safeUrl;

  if (!hasDoc) {
    return;
  }

  var currentLang = 'pt';

  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  function navLanguages() {
    if (typeof navigator === 'undefined') {
      return [];
    }
    return navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language];
  }

  function renderLinks() {
    var cfg = config();
    var links = qsa('[data-link]');
    var i, el, kind, url;
    for (i = 0; i < links.length; i++) {
      el = links[i];
      kind = el.getAttribute('data-link');
      if (kind === 'email') {
        url = safeUrl(cfg.email, 'email');
      } else if (kind === 'linkedin' || kind === 'github') {
        url = safeUrl(cfg[kind], 'web');
      } else {
        url = null;
      }
      if (url === null) {
        el.setAttribute('hidden', '');
        el.removeAttribute('href');
        continue;
      }
      el.removeAttribute('hidden');
      el.setAttribute('href', url);
      if (url.indexOf('https://') === 0) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  }

  function applyLanguage(lang) {
    if (LANGS.indexOf(lang) === -1) {
      lang = 'pt';
    }
    currentLang = lang;
    var cfg = config();
    var el = document.documentElement;
    var nodes, i, j, text, pairs, pair, idx;

    el.lang = P.htmlLang(lang);
    el.setAttribute('data-lang', lang);

    nodes = qsa('[data-i18n]');
    for (i = 0; i < nodes.length; i++) {
      text = translate(lang, nodes[i].getAttribute('data-i18n'));
      if (text !== null) {
        nodes[i].textContent = text;
      }
    }

    nodes = qsa('[data-i18n-attr]');
    for (i = 0; i < nodes.length; i++) {
      pairs = nodes[i].getAttribute('data-i18n-attr').split(';');
      for (j = 0; j < pairs.length; j++) {
        pair = pairs[j];
        idx = pair.indexOf(':');
        if (idx < 1) {
          continue;
        }
        text = translate(lang, pair.slice(idx + 1).trim());
        if (text !== null) {
          nodes[i].setAttribute(pair.slice(0, idx).trim(), text);
        }
      }
    }

    nodes = qsa('[data-config]');
    for (i = 0; i < nodes.length; i++) {
      text = localized(cfg[nodes[i].getAttribute('data-config')], lang);
      if (text) {
        nodes[i].textContent = text;
      }
    }

    text = translate(lang, 'meta.title');
    if (text !== null) {
      document.title = text;
    }

    nodes = qsa('[data-lang-btn]');
    for (i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute(
        'aria-pressed',
        nodes[i].getAttribute('data-lang-btn') === lang ? 'true' : 'false'
      );
    }

    renderLinks();
  }

  function setLanguage(lang) {
    if (LANGS.indexOf(lang) === -1) {
      return;
    }
    P.safeSet(P.STORAGE.lang, lang);
    applyLanguage(lang);
  }

  function effectiveTheme() {
    var attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') {
      return attr;
    }
    return 'light';
  }

  function refreshThemeToggle() {
    var nodes = qsa('[data-theme-toggle]');
    var pressed = effectiveTheme() === 'dark' ? 'true' : 'false';
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].setAttribute('aria-pressed', pressed);
    }
  }

  function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
    P.safeSet(P.STORAGE.theme, theme);
    refreshThemeToggle();
  }

  function setupNavObserver() {
    if (typeof root.IntersectionObserver !== 'function') {
      return;
    }
    var links = qsa('nav a.nav__link[href^="#"]');
    var sections = qsa('main section[id]');
    if (!links.length || !sections.length) {
      return;
    }
    var active = {};

    function mark(id) {
      for (var i = 0; i < links.length; i++) {
        if (id && links[i].getAttribute('href') === '#' + id) {
          links[i].setAttribute('aria-current', 'true');
        } else {
          links[i].removeAttribute('aria-current');
        }
      }
    }

    var observer = new root.IntersectionObserver(function (entries) {
      var k, current = null;
      for (k = 0; k < entries.length; k++) {
        active[entries[k].target.id] = entries[k].isIntersecting;
      }
      for (k = 0; k < sections.length; k++) {
        if (active[sections[k].id]) {
          current = sections[k].id;
        }
      }
      mark(current);
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    for (var s = 0; s < sections.length; s++) {
      observer.observe(sections[s]);
    }
  }

  function init() {
    var attr = document.documentElement.getAttribute('data-lang');
    var lang = attr === 'pt' || attr === 'en'
      ? attr
      : P.pickLanguage(P.safeGet(P.STORAGE.lang), navLanguages());
    applyLanguage(lang);

    var btns = qsa('[data-lang-btn]');
    var i;
    for (i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (ev) {
        setLanguage(ev.currentTarget.getAttribute('data-lang-btn'));
      });
    }

    var toggles = qsa('[data-theme-toggle]');
    for (i = 0; i < toggles.length; i++) {
      toggles[i].addEventListener('click', function () {
        setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark');
      });
    }
    refreshThemeToggle();

    setupNavObserver();
  }

  P.applyLanguage = applyLanguage;
  P.setLanguage = setLanguage;
  P.setTheme = setTheme;
  P.effectiveTheme = effectiveTheme;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
