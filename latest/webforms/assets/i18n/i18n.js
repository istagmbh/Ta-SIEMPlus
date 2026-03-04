/**
 * Ta-SIEMPlus i18n System
 * Lightweight translation helper for static HTML pages.
 *
 * Usage:
 *   Add data-i18n="namespace.key"         → replaces textContent
 *   Add data-i18n-html="namespace.key"    → replaces innerHTML
 *   Add data-i18n-placeholder="ns.key"    → replaces placeholder attribute
 *   Add data-i18n-title="ns.key"          → replaces title attribute (on <title> element)
 *
 * The system detects stored language preference (localStorage key: "ta-lang"),
 * falls back to browser language, and defaults to "de".
 *
 * To switch language programmatically: i18n.setLang('en')
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ta-lang';
  const DEFAULT_LANG = 'de';
  const SUPPORTED = ['de', 'en'];

  let _translations = {};
  let _currentLang = DEFAULT_LANG;

  /** Resolve a dot-path key like "index.title" from a nested object */
  function resolve(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return o && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  /** Apply translations for the currently loaded language */
  function applyTranslations() {
    const t = _translations[_currentLang];
    if (!t) return;

    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const val = resolve(t, key);
      if (val !== null) el.textContent = val;
    });

    // data-i18n-html → innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      const val = resolve(t, key);
      if (val !== null) el.innerHTML = val;
    });

    // data-i18n-placeholder → placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = resolve(t, key);
      if (val !== null) el.setAttribute('placeholder', val);
    });

    // <title data-i18n> → document.title
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n');
      const val = resolve(t, key);
      if (val !== null) {
        titleEl.textContent = val;
        document.title = val;
      }
    }

    // Update html lang attribute
    document.documentElement.setAttribute('lang', _currentLang);
  }

  /** Load a JSON file and store in _translations */
  function loadLang(lang, callback) {
    if (_translations[lang]) {
      callback();
      return;
    }
    // Resolve path relative to this script file
    const scripts = document.querySelectorAll('script[src]');
    let base = 'assets/i18n/';
    scripts.forEach(function (s) {
      if (s.src && s.src.indexOf('i18n.js') !== -1) {
        base = s.src.replace('i18n.js', '');
      }
    });
    fetch(base + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        _translations[lang] = data;
        callback();
      })
      .catch(function (err) {
        console.warn('[i18n] Failed to load', lang, err);
        callback();
      });
  }

  /** Public API */
  var i18n = {
    /** Get currently active language */
    getLang: function () { return _currentLang; },

    /** Switch to a new language */
    setLang: function (lang) {
      if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
      _currentLang = lang;
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
      loadLang(lang, applyTranslations);
    },

    /** Toggle between de and en */
    toggle: function () {
      i18n.setLang(_currentLang === 'de' ? 'en' : 'de');
    },

    /** Initialise: detect preferred language and apply */
    init: function () {
      let lang = DEFAULT_LANG;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED.indexOf(stored) !== -1) {
          lang = stored;
        } else {
          const browser = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
          if (SUPPORTED.indexOf(browser) !== -1) lang = browser;
        }
      } catch (e) { /* ignore */ }

      _currentLang = lang;

      // Always load German first (it's the default), then the target lang if different
      loadLang('de', function () {
        if (lang === 'de') {
          applyTranslations();
        } else {
          loadLang(lang, applyTranslations);
        }
      });
    }
  };

  // Expose globally
  window.i18n = i18n;

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { i18n.init(); });
  } else {
    i18n.init();
  }
}());
