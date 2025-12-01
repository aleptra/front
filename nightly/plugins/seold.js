'use strict'

app.plugin.seold = {
  __autoload: function (options) {
    this.plugin = options.name + '-'
    this.config = app.config.get(this.plugin, {}, options.element)

    this.nameValue = ''
    this.descValue = ''

    var self = this
  },

  name: function (object) {
    this.nameValue = object.renderedText || object.originalText
    this._tryInject()
  },

  desc: function (object) {
    this.descValue = object.renderedText || object.originalText
    this._tryInject()
  },

  _tryInject: function () {
    // Only inject when both name and description are available
    if (!this.nameValue) return
    if (!this.descValue) return
    this._injectJSONLD()
  },

  _injectJSONLD: function () {
    var date = new Date().toISOString().split('T')[0]

    var jsonLd = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": this.nameValue,
      "description": this.descValue || '',
      "inDefinedTermSet": window.location.href,
      "dateCreated": date
    }

    var script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
  }
}