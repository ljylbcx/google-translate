(function() {
  if (!window.addEventListener) return

  const ELEMENT_ID = "eager-google-translate"
  const CALLBACK_NAME = "EagerGoogleTranslateOnload"

  let options = INSTALL_OPTIONS
  let element
  let script
  let style

  window[CALLBACK_NAME] = function updateElement() {
    const {colors, pageLanguage} = options
    const {TranslateElement} = window.google.translate
    const spec = {
      layout: TranslateElement.InlineLayout.VERTICAL,
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

    [
      `#${ELEMENT_ID} select { background-color: ${colors.background} }`,
      `#${ELEMENT_ID} select { color: ${colors.text} }`
    ].forEach((rule, index) => style.sheet.insertRule(rule, index))

    new TranslateElement(spec, ELEMENT_ID) // eslint-disable-line no-new
  }

  function update() {
    [style, script, document.querySelector(".skiptranslate")]
      .filter(entry => entry && entry.parentNode)
      .forEach(entry => entry.parentNode.removeChild(entry))

    script = document.createElement("script")
    script.type = "text/javascript"
    // Google's global callback must be used to reliably access `window.google.translate`.
    script.src = `//translate.google.com/translate_a/element.js?cb=${CALLBACK_NAME}`

    style = document.createElement("style")

    document.head.appendChild(script)
    document.head.appendChild(style)
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

      // Clear the user's previously selected translation.
      document.cookie = document.cookie
        .split("; ")
        .filter(cookie => cookie.indexOf("googtrans") === -1)
        .join("; ")

      update()
    }
  }
}())
