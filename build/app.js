"use strict";

(function () {
  // Check for IE9+
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager-google-translate";
  var CALLBACK_NAME = "EagerGoogleTranslateOnload";
  var style = document.createElement("style");

  document.head.appendChild(style);

  var options = INSTALL_OPTIONS;
  var element = undefined;
  var script = undefined;

  function updateStylesheet() {
    var _options = options;
    var _options$colors = _options.colors;
    var background = _options$colors.background;
    var foreground = _options$colors.foreground;
    var text = _options$colors.text;

    element.setAttribute("data-position", options.position);

    style.innerHTML = "\n      .goog-te-gadget {\n        background-color: " + background + ";\n      }\n\n      #" + ELEMENT_ID + " select {\n        background-color: " + foreground + ";\n        color: " + text + ";\n      }";
  }

  function unmountNode(node) {
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
    }

    updateStylesheet();

    new TranslateElement(spec, ELEMENT_ID); // eslint-disable-line no-new
  };

  function updateScript() {
    [script, document.querySelector(".skiptranslate")].forEach(unmountNode);

    script = document.createElement("script");
    script.type = "text/javascript";
    // Google's global callback must be used to reliably access `window.google.translate`.
    script.src = "//translate.google.com/translate_a/element.js?cb=" + CALLBACK_NAME;

    document.head.appendChild(script);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateScript);
  } else {
    updateScript();
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setStylesheet: function setStylesheet(nextOptions) {
      options = nextOptions;

      updateStylesheet();
    },
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;

      // Clear the user's previously selected translation.
      document.cookie = document.cookie.split("; ").filter(function (cookie) {
        return cookie.indexOf("googtrans") === -1;
      }).join("; ");

      updateScript();
    }
  };
})();