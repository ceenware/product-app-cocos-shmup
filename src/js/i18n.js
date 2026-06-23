(function () {
  'use strict';

  var STORAGE_KEY = 'phaser-shmup-language';
  var DEFAULT_LANGUAGE = 'en';

  var translations = {
    en: {
      htmlLang: 'en',
      documentTitle: 'Phaser SHMUP',
      switchTo: '中文',
      switchLabel: 'Switch language',
      menuTitle: 'PHASER SHMUP',
      controls: '_______________\nControls\nW : shoot / start\nArrows : move\nTouch : start / move + shoot\n_______________',
      getReady: 'Get ready',
      gameOver: 'Game over',
      stats: {
        hp: 'HP',
        strength: 'STR',
        rate: 'RAT',
        speed: 'SPD',
        accel: 'ACC'
      }
    },
    zh: {
      htmlLang: 'zh-CN',
      documentTitle: 'Phaser 飞行射击',
      switchTo: 'EN',
      switchLabel: '切换语言',
      menuTitle: '飞行射击',
      controls: '_______________\n操作\nW：射击 / 开始\n方向键：移动\n触摸：开始 / 移动 + 射击\n_______________',
      getReady: '准备',
      gameOver: '游戏结束',
      stats: {
        hp: '生命',
        strength: '攻击',
        rate: '射速',
        speed: '速度',
        accel: '加速'
      }
    }
  };

  function normalizeLanguage(language) {
    if (!language) {
      return DEFAULT_LANGUAGE;
    }

    return /^zh/i.test(language) ? 'zh' : 'en';
  }

  function detectLanguage() {
    var languages = window.navigator.languages;

    if (languages && languages.length > 0) {
      return normalizeLanguage(languages[0]);
    }

    return normalizeLanguage(window.navigator.language || window.navigator.userLanguage);
  }

  function readStoredLanguage() {
    try {
      var language = window.localStorage.getItem(STORAGE_KEY);
      return translations[language] ? language : null;
    } catch (e) {
      return null;
    }
  }

  function storeLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // Ignore storage errors in private browsing or restricted environments.
    }
  }

  var currentLanguage = readStoredLanguage() || detectLanguage();

  function getBundle(language) {
    return translations[language] || translations[DEFAULT_LANGUAGE];
  }

  function getNestedValue(bundle, key) {
    var parts = key.split('.');
    var value = bundle;

    for (var i = 0; i < parts.length; i++) {
      if (!value || typeof value[parts[i]] === 'undefined') {
        return null;
      }

      value = value[parts[i]];
    }

    return value;
  }

  function translate(key) {
    var value = getNestedValue(getBundle(currentLanguage), key);

    if (value === null) {
      value = getNestedValue(getBundle(DEFAULT_LANGUAGE), key);
    }

    return value === null ? key : value;
  }

  function dispatchLanguageChange() {
    var event;

    if (typeof window.CustomEvent === 'function') {
      event = new window.CustomEvent('firsttry:languagechange', {
        detail: { language: currentLanguage }
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('firsttry:languagechange', false, false, {
        language: currentLanguage
      });
    }

    window.dispatchEvent(event);
  }

  function applyDocumentLanguage() {
    var bundle = getBundle(currentLanguage);
    document.documentElement.lang = bundle.htmlLang;
    document.title = bundle.documentTitle;

    var switcher = document.getElementById('language-switch');
    if (switcher) {
      switcher.textContent = bundle.switchTo;
      switcher.setAttribute('aria-label', bundle.switchLabel);
      switcher.title = bundle.switchLabel;
    }
  }

  function setLanguage(language) {
    language = normalizeLanguage(language);

    if (language === currentLanguage) {
      return;
    }

    currentLanguage = language;
    storeLanguage(language);
    applyDocumentLanguage();
    dispatchLanguageChange();
  }

  function toggleLanguage() {
    setLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
  }

  function createSwitcher() {
    var switcher = document.getElementById('language-switch');

    if (!switcher) {
      switcher = document.createElement('button');
      switcher.id = 'language-switch';
      switcher.className = 'language-switch';
      switcher.type = 'button';
      document.body.appendChild(switcher);

      switcher.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleLanguage();
      });

      switcher.addEventListener('mousedown', function (event) {
        event.stopPropagation();
      });

      switcher.addEventListener('touchstart', function (event) {
        event.stopPropagation();
      });
    }

    applyDocumentLanguage();
  }

  applyDocumentLanguage();

  window['firsttry'] = window['firsttry'] || {};
  window['firsttry'].i18n = {
    getLanguage: function () {
      return currentLanguage;
    },
    setLanguage: setLanguage,
    toggleLanguage: toggleLanguage,
    createSwitcher: createSwitcher,
    applyDocumentLanguage: applyDocumentLanguage,
    t: translate
  };
}());
