/*
 * boot.js - runs pre-paint from <head>.
 * Restores language and theme before first render and publishes the small
 * shared helpers on window.Portfolio. Classic script, no modules, no network.
 */
(function () {
  'use strict';

  var root = typeof window !== 'undefined' ? window : globalThis;

  var STORAGE = { lang: 'portfolio.lang', theme: 'portfolio.theme' };

  function safeGet(key) {
    try {
      return root.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      root.localStorage.setItem(key, value);
    } catch (e) {
      /* storage blocked (file:// in some browsers, privacy modes): ignore */
    }
  }

  // Portuguese is the default language. Only an explicit, stored choice selects English;
  // the browser language is deliberately not consulted.
  function pickLanguage(stored) {
    return stored === 'en' ? 'en' : 'pt';
  }

  function htmlLang(lang) {
    return lang === 'pt' ? 'pt-BR' : 'en';
  }

  if (typeof document !== 'undefined') {
    var lang = pickLanguage(safeGet(STORAGE.lang));
    var el = document.documentElement;
    el.lang = htmlLang(lang);
    el.setAttribute('data-lang', lang);

    // Light is the default theme. The OS colour scheme is deliberately not consulted;
    // only an explicit, stored choice selects dark.
    var theme = safeGet(STORAGE.theme);
    el.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }

  root.Portfolio = {
    STORAGE: STORAGE,
    safeGet: safeGet,
    safeSet: safeSet,
    pickLanguage: pickLanguage,
    htmlLang: htmlLang
  };
})();
