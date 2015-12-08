(function() {
  if (!window.addEventListener) return console.log("Client unsupported.")

  const ELEMENT_ID = "eager-google-translate"
  const CALLBACK_NAME = "EagerGoogleTranslateOnload"

  let options = INSTALL_OPTIONS
  let element
  let script

  window[CALLBACK_NAME] = function updateElement() {
    const {layout, pageLanguage} = options
    const {TranslateElement} = window.google.translate
    const spec = {
      layout: TranslateElement.InlineLayout[layout],
      pageLanguage
    }

    element = Eager.createElement(options.element, element)
    element.id = ELEMENT_ID

    if (options.specificLanguagesToggle) {
      const {specificLanguages} = options

      spec.includedLanguages = Object
        .keys(specificLanguages)
        .filter(key => specificLanguages[key])
        .map(key => key.replace("_", "-")) // Convert Eager's schema to Google's.
        .join(",")
    }

    if (options.advancedOptionsToggle) {
      const {advancedOptions} = options

      spec.multilanguagePage = advancedOptions.multilanguagePage
      spec.autoDisplay = advancedOptions.autoDisplay

      if (advancedOptions.analyticsToggle && advancedOptions.gaId.length) {
        spec.gaTrack = true
        spec.gaId = advancedOptions.gaId
      }
    }

    new TranslateElement(spec, ELEMENT_ID) // eslint-disable-line no-new
  }

  function update() {
    [script, document.querySelector(".skiptranslate")]
      .filter(entry => entry && entry.parentNode)
      .forEach(entry => entry.parentNode.removeChild(entry))

    script = Object.assign(document.createElement("script"), {
      // Google's global callback must be used to reliably access `window.google.translate`.
      src: `//translate.google.com/translate_a/element.js?cb=${CALLBACK_NAME}`,
      type: "text/javascript"
    })

    document.head.appendChild(script)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update)
  }
  else {
    update()
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setOptions(nextOptions) {
      options = nextOptions
      update()
    }
  }
}())
