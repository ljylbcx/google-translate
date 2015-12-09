(function() {
  if (!window.addEventListener) return

  const ELEMENT_ID = "eager-google-translate"
  const CALLBACK_NAME = "EagerGoogleTranslateOnload"


  let options = INSTALL_OPTIONS
  let element
  let script
  let style

  function updateStylesheet() {
    const {colors: {background, text}} = options
    const rules = [
      `#${ELEMENT_ID} select { background-color: ${background} }`,
      `#${ELEMENT_ID} select { color: ${text} }`
    ]

    style = document.createElement("style")
    document.head.appendChild(style)

    rules.forEach((rule, index) => style.sheet.insertRule(rule, index))
  }

  function removeNode(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node)
  }

  window[CALLBACK_NAME] = function updateElement() {
    const {pageLanguage} = options
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

    updateStylesheet()

    new TranslateElement(spec, ELEMENT_ID) // eslint-disable-line no-new
  }

  function update() {
    [style, script, document.querySelector(".skiptranslate")].forEach(removeNode)

    script = document.createElement("script")
    script.type = "text/javascript"
    // Google's global callback must be used to reliably access `window.google.translate`.
    script.src = `//translate.google.com/translate_a/element.js?cb=${CALLBACK_NAME}`

    document.head.appendChild(script)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update)
  }
  else {
    update()
  }

  INSTALL_SCOPE = { // eslint-disable-line no-undef
    setStylesheet(nextOptions) {
      removeNode(style)
      options = nextOptions

      updateStylesheet()
    },
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
