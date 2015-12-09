"use strict";

(function () {
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager-google-translate";
  var CALLBACK_NAME = "EagerGoogleTranslateOnload";

  var options = INSTALL_OPTIONS;
  var element = undefined;
  var script = undefined;
  var style = undefined;

  function updateStylesheet() {
    var _options = options;
    var _options$colors = _options.colors;
    var background = _options$colors.background;
    var text = _options$colors.text;

    var rules = ["#" + ELEMENT_ID + " select { background-color: " + background + " }", "#" + ELEMENT_ID + " select { color: " + text + " }"];

    style = document.createElement("style");
    document.head.appendChild(style);

    rules.forEach(function (rule, index) {
      return style.sheet.insertRule(rule, index);
    });
  }

  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  window[CALLBACK_NAME] = function updateElement() {
    var _options2 = options;
    var pageLanguage = _options2.pageLanguage;
    var TranslateElement = window.google.translate.TranslateElement;

    var spec = {
      layout: TranslateElement.InlineLayout.VERTICAL,
      pageLanguage: pageLanguage
    };

    element = Eager.createElement(options.element, element);
    element.id = ELEMENT_ID;

    if (options.specificLanguagesToggle) {
      (function () {
        var _options3 = options;
        var specificLanguages = _options3.specificLanguages;

        spec.includedLanguages = Object.keys(specificLanguages).filter(function (key) {
          return specificLanguages[key];
        }).map(function (key) {
          return key.replace("_", "-");
        }) // Convert Eager's schema to Google's.
        .join(",");
      })();
    }

    if (options.advancedOptionsToggle) {
      var _options4 = options;
      var advancedOptions = _options4.advancedOptions;

      spec.multilanguagePage = advancedOptions.multilanguagePage;
      spec.autoDisplay = advancedOptions.autoDisplay;

      if (advancedOptions.analyticsToggle && advancedOptions.gaId.length) {
        spec.gaTrack = true;
        spec.gaId = advancedOptions.gaId;
      }
    }

    updateStylesheet();

    new TranslateElement(spec, ELEMENT_ID); // eslint-disable-line no-new
  };

  function update() {
    [style, script, document.querySelector(".skiptranslate")].forEach(removeNode);

    script = document.createElement("script");
    script.type = "text/javascript";
    // Google's global callback must be used to reliably access `window.google.translate`.
    script.src = "//translate.google.com/translate_a/element.js?cb=" + CALLBACK_NAME;

    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setStylesheet: function setStylesheet(nextOptions) {
      removeNode(style);
      options = nextOptions;

      updateStylesheet();
    },
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;

      // Clear the user's previously selected translation.
      document.cookie = document.cookie.split("; ").filter(function (cookie) {
        return cookie.indexOf("googtrans") === -1;
      }).join("; ");

      update();
    }
  };
})();