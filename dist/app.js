"use strict";

(function () {
  if (!window.addEventListener) return;

  var ELEMENT_ID = "eager-google-translate";
  var CALLBACK_NAME = "EagerGoogleTranslateOnload";

  var options = INSTALL_OPTIONS;
  var element = undefined;
  var script = undefined;

  function updateElement() {
    var _options = options;
    var layout = _options.layout;
    var pageLanguage = _options.pageLanguage;
    var TranslateElement = window.google.translate.TranslateElement;

    var spec = {
      layout: TranslateElement.InlineLayout[layout],
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
        }) // Replaces Eager App schema requirements.
        .join(",");
      })();
    }

    if (options.advancedOptionsToggle) {
      var _options3 = options;
      var advancedOptions = _options3.advancedOptions;

      spec.multilanguagePage = advancedOptions.multilanguagePage;
      spec.autoDisplay = advancedOptions.autoDisplay;

      if (advancedOptions.gaId.length) {
        spec.gaTrack = true;
        spec.gaId = advancedOptions.gaId;
      }
    }

    new TranslateElement(spec, ELEMENT_ID); // eslint-disable-line no-new
  }

  function update() {
    [element, script].filter(function (entry) {
      return entry && entry.parentNode;
    }).forEach(function (entry) {
      return entry.parentNode.removeChild(entry);
    });

    script = Object.assign(document.createElement("script"), {
      // Google's global callback must be used to reliably access `window.google.translate`.
      src: "//translate.google.com/translate_a/element.js?cb=" + CALLBACK_NAME,
      type: "text/javascript"
    });

    document.querySelector("head").appendChild(script);
  }

  function setOptions(nextOptions) {
    options = nextOptions;
    update();
  }

  window[CALLBACK_NAME] = function () {
    return updateElement();
  };

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", update) : update();

  window.EagerGoogleTranslate = { setOptions: setOptions };
})();