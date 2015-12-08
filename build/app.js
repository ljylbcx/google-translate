"use strict";

(function () {
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager-google-translate";
  var CALLBACK_NAME = "EagerGoogleTranslateOnload";

  var options = INSTALL_OPTIONS;
  var element = undefined;
  var script = undefined;
  var style = undefined;

  window[CALLBACK_NAME] = function updateElement() {
    var _options = options;
    var backgroundColor = _options.backgroundColor;
    var pageLanguage = _options.pageLanguage;
    var textColor = _options.textColor;
    var TranslateElement = window.google.translate.TranslateElement;

    var spec = {
      layout: TranslateElement.InlineLayout.VERTICAL,
      pageLanguage: pageLanguage
    };

    element = Eager.createElement(options.element, element);
    element.id = ELEMENT_ID;

    if (options.specificLanguagesToggle) {
      (function () {
        var _options2 = options;
        var specificLanguages = _options2.specificLanguages;

        spec.includedLanguages = Object.keys(specificLanguages).filter(function (key) {
          return specificLanguages[key];
        }).map(function (key) {
          return key.replace("_", "-");
        }) // Convert Eager's schema to Google's.
        .join(",");
      })();
    }

    if (options.advancedOptionsToggle) {
      var _options3 = options;
      var advancedOptions = _options3.advancedOptions;

      spec.multilanguagePage = advancedOptions.multilanguagePage;
      spec.autoDisplay = advancedOptions.autoDisplay;

      if (advancedOptions.analyticsToggle && advancedOptions.gaId.length) {
        spec.gaTrack = true;
        spec.gaId = advancedOptions.gaId;
      }
    }

    ["#" + ELEMENT_ID + " select { background-color: " + backgroundColor + " }", "#" + ELEMENT_ID + " select { color: " + textColor + " }"].forEach(function (rule, index) {
      return style.sheet.insertRule(rule, index);
    });

    new TranslateElement(spec, ELEMENT_ID); // eslint-disable-line no-new
  };

  function update() {
    [style, script, document.querySelector(".skiptranslate")].filter(function (entry) {
      return entry && entry.parentNode;
    }).forEach(function (entry) {
      return entry.parentNode.removeChild(entry);
    });

    script = document.createElement("script");
    script.type = "text/javascript";
    // Google's global callback must be used to reliably access `window.google.translate`.
    script.src = "//translate.google.com/translate_a/element.js?cb=" + CALLBACK_NAME;

    style = document.createElement("style");

    document.head.appendChild(script);
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;
      update();
    }
  };
})();