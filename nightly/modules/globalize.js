'use strict'

app.module.globalize = {
  storageMechanism: 'local',
  storageType: 'module',
  defaultFolder: 'assets/json/locales',
  globals: ['direction', 'code', 'iso639'],
  ttl: 0,

  /**
   * @function _autoload
   * @memberof app.module.globalize
   * @param {object} options - The script element to load the configuration for.
   * @desc Autoloads the globalize configuration for a specified script element.
   * @private
   */
  __autoload: function (options) {
    this.module = options.name
    var query = app.querystrings.get(false, 'locale')
    if (query) this._locale.set({ language: query }, this)

    var config = app.config.get(
      this.module,
      {
        storageMechanism: this.storageMechanism,
        storageType: this.storageType,
        folder: this.defaultFolder + this.module,
        language: this._locale.get(query, this),
        ttl: this.ttl
      },
      options.element
    )

    this._locale.update(config, this)

    var cache = app.caches.get(
      this.storageMechanism,
      this.storageType,
      this.storageKey
    )

    if (cache) {
      app.globals.set('globalize', cache.globals.globalize)
      this.cachedData = cache
    } else {
      app.vars.totalStore++
      this._locale.load(config, this)
    }

    config.keyType = this.storageType
    config.storageKey = this.storageKey
    app.caches.validate(config)
  },

  _run: function () {
    app.attributes.run('html [globalize-get]:not([include])', false, true)
    app.element.onload(app.element.select('[globalize-onsetload]'), 'globalize-set')
  },

  _locale: {
    /**
     * @function load
     * @private
     * @memberof app.module.globalize._locale
    */
    load: function (config, _this, run) {
      var options = {
        url: config.folder + '/' + config.language + '.json',
        type: 'var',
        module: _this.module,
        format: 'json',
        global: _this.globals,
        cache: {
          mechanism: _this.storageMechanism,
          format: 'json',
          keyType: _this.storageType,
          key: _this.storageKey,
          ttl: config.ttl
        },
        onload: {}
      }

      if (run) {
        options.type = 'fetch'
        options.onload.run = {
          func: 'app.module.' + _this.module + '._run',
          arg: {}
        }
      }

      app.xhr.request(options)
    },

    /**
     * @function get
     * @private
     * @memberof app.module.globalize._locale
    */
    get: function (query, _this) {
      var storedLanguage = app.caches.get(
        _this.storageMechanism,
        _this.storageType,
        _this.module + '.language'
      )
      return (storedLanguage && storedLanguage.globals.language) || query || app.language
    },

    /**
     * @function set
     * @private
     * @memberof app.module.globalize._locale
    */
    set: function (config, _this) {
      app.globals.set('language', config.language)
      app.caches.set(
        _this.storageMechanism,
        _this.storageType,
        _this.module + '.language',
        config.language,
        config.ttl
      )
    },

    /** 
     * @function update
     * @private
     * @memberof app.module.globalize._locale
     */
    update: function (config, _this) {
      _this.storageKey = _this.module + '.' + config.language
      app.globals.set('language', config.language)
      document.documentElement.setAttribute('lang', config.language)
      document.documentElement.setAttribute('dir', 'ltr')
    }
  },

  /**
   * @function get
   * @memberof app.module.globalize
   * @param {HTMLElement} element - The element to set the globalized value to.
   * @desc Gets the globalized value and set it to the element.
   */
  get: function (element) {
    var tag = element.localName,
      target = element.getAttribute(this.module + '-target'),
      value = element.getAttribute(this.module + '-get')

    // Fallback to the element’s original text or label if `-get` is empty.
    if (!value) {
      if (tag === 'optgroup') {
        element.label = element.originalLabel || element.label
      } else {
        element.textContent = element.renderedText || element.originalText || element.textContent
      }
    }

    var value = value || element.textContent,
      isRoot = value[0] == '/' ? true : false

    if (this.fetchedData) {
      var fetchedData = this.fetchedData,
        setValue = app.element.getPropertyByPath(fetchedData, 'translations.' + value)
    } else {
      var cachedData = this.cachedData || app.caches.get(this.storageMechanism, this.storageType, this.storageKey),
        setValue = app.element.getPropertyByPath(cachedData.data, isRoot ? value.substring(1) : 'translations.' + value)
    }

    if (setValue) app.element.set(element, setValue, target ? target : 'settext')
  },

  /**
   * @function set
   * @memberof app.module.globalize
   */
  set: function (value) {
    var config = {
      storageMechanism: this.storageMechanism,
      folder: this.defaultFolder,
      language: value.exec.value,
    }

    this._locale.update(config, this)
    this._locale.set(config, this)
    this._locale.load(config, this, true)
  }
}