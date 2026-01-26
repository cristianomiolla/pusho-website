// i18n.js - Internationalization system for Pusho website
(function() {
  'use strict';

  const STORAGE_KEY = 'pusho-lang';
  const SUPPORTED_LANGS = ['it', 'en'];
  const DEFAULT_LANG = 'it';

  let translations = {};
  let currentLang = DEFAULT_LANG;

  // Detect browser language
  function detectBrowserLang() {
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.split('-')[0].toLowerCase();
    return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  }

  // Get saved language or detect from browser
  function getSavedLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
    return detectBrowserLang();
  }

  // Save language preference
  function saveLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  // Load translations from JSON files
  async function loadTranslations(lang) {
    try {
      const base = document.querySelector('meta[name="base-url"]')?.content || '/pusho-website/';
      const response = await fetch(`${base}i18n/${lang}.json`);
      if (!response.ok) throw new Error('Failed to load translations');
      return await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      return null;
    }
  }

  // Get nested value from object using dot notation
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Apply translations to the page
  function applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(translations, key);
      if (value) {
        el.textContent = value;
      }
    });

    // Update all elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const value = getNestedValue(translations, key);
      if (value) {
        el.innerHTML = value;
      }
    });

    // Update mockup image based on language
    const mockupImg = document.querySelector('.mockup-image[data-mockup-it][data-mockup-en]');
    if (mockupImg) {
      const mockupSrc = mockupImg.getAttribute(`data-mockup-${currentLang}`);
      if (mockupSrc) {
        mockupImg.src = mockupSrc;
      }
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update language switcher display
    updateLangSwitcher();
  }

  // Update language switcher UI
  function updateLangSwitcher() {
    const currentLangEl = document.getElementById('current-lang');
    const langOptions = document.querySelectorAll('.lang-option');

    if (currentLangEl) {
      currentLangEl.textContent = currentLang.toUpperCase();
    }

    langOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === currentLang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  // Change language
  async function changeLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return;

    const newTranslations = await loadTranslations(lang);
    if (newTranslations) {
      translations = newTranslations;
      currentLang = lang;
      saveLang(lang);
      applyTranslations();

      // Close dropdown after selection
      const dropdown = document.querySelector('.lang-dropdown');
      if (dropdown) {
        dropdown.classList.remove('open');
      }
    }
  }

  // Initialize language switcher
  function initLangSwitcher() {
    const langToggle = document.getElementById('lang-toggle');
    const dropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    if (langToggle && dropdown) {
      langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });

      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    langOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        changeLang(lang);
      });
    });
  }

  // Initialize i18n system
  async function init() {
    currentLang = getSavedLang();
    translations = await loadTranslations(currentLang);

    if (translations) {
      applyTranslations();
    }

    initLangSwitcher();
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose functions globally for manual use if needed
  window.i18n = {
    changeLang,
    getCurrentLang: () => currentLang,
    t: (key) => getNestedValue(translations, key) || key
  };
})();
