(function (global) {
  // get test filter from querystring using your app.querystrings.get
  var filterTest = app.querystrings.get('', 'test')

  var currentTest = '', currentGroup = ''
  var total = 0, passed = 0, failed = 0, skipped = 0, missing = 0

  function getContainer() {
    return document.querySelector('main')
  }

  function updateSummary() {
    var s = document.getElementById('summary')
    if (!s) {
      s = document.createElement('div')
      s.id = 'summary'
      document.body.insertBefore(s, getContainer())
    }
    s.textContent = 'Total: ' + total + ', Passed: ' + passed + ', Failed: ' + failed + ', Skipped: ' + skipped + ', Missing: ' + missing
  }

  function log(name, expected, actual, isPass, error) {
    total++
    isPass ? passed++ : failed++
    var parts = name.split(' - '),
      group = parts.length > 1 ? parts[0] : 'Ungrouped',
      title = parts.length > 1 ? parts.slice(1).join(' - ') : parts[0]

    if (group !== currentGroup) {
      currentGroup = group
      var h = document.createElement('h4')
      h.textContent = group
      getContainer().appendChild(h)
    }

    var d = document.createElement('div')
    d.textContent = (isPass ? '✅ ' : '❌ ') + name +
      (isPass ? '' : ': expected "' + expected + '", got "' + actual + '"')
    d.style.color = isPass ? 'green' : 'red'
    getContainer().appendChild(d)

    if (isPass) console.info('PASS:', name)
    else console.error('FAIL:', name, '| expected:', expected, '| got:', actual, '| error:', error)

    updateSummary()

    return d // Return the log entry element for modification.
  }

  function withDescription(entry) {
    return {
      desc: function (description) {
        entry.textContent += ' — ' + description
      }
    }
  }

  global.test = function (name, fn, cb) {
    // only run test if it matches the filter (or no filter is set).
    if (filterTest && name.toLowerCase().indexOf(filterTest.toLowerCase()) === -1) return

    currentTest = name
    var doneCalled = false
    var done = function () {
      if (doneCalled) return
      doneCalled = true
      currentTest = ''
      if (cb) cb()
      updateSummary()
    }

    try {
      fn(done)
      if (fn.length === 0) done()
    } catch (e) {
      // Determine expected and actual safely
      var expected = (e && typeof e.expected !== 'undefined') ? e.expected : 'unknown',
        actual = (e && typeof e.actual !== 'undefined') ? e.actual : e.message || 'error'
      log(currentTest, expected, actual, false, e)
      done()
    }
  }

  global.test.skip = function (name, fn, cb) {
    if (filterTest && name.toLowerCase().indexOf(filterTest.toLowerCase()) === -1) return

    total++
    skipped++

    var parts = name.split(' - '),
      group = parts.length > 1 ? parts[0] : 'Ungrouped',
      title = parts.length > 1 ? parts.slice(1).join(' - ') : parts[0]

    if (group !== currentGroup) {
      currentGroup = group
      var h = document.createElement('h4')
      h.textContent = group
      getContainer().appendChild(h)
    }

    var d = document.createElement('div')
    d.textContent = '⚠️ ' + name + ' (skipped)'
    d.style.color = 'orange'
    getContainer().appendChild(d)

    updateSummary()
  }

  global.assertEqual = function (actual, expected) {
    var isPass = actual === expected
    return withDescription(log(currentTest, expected, actual, isPass))
  }

  global.assertTrue = function (val) {
    var isPass = val === true
    return withDescription(log(currentTest, true, val, isPass))
  }

  global.assertFalse = function (val) {
    var isPass = val === false
    return withDescription(log(currentTest, false, val, isPass))
  }

  global.assertStyleEqual = function (el, prop, expected) {
    var val = window.getComputedStyle(el)[prop]
    var isPass = val === expected
    return withDescription(log(currentTest, expected, val, isPass))
  }

  global.assertIsObject = function (el) {
    var isPass = typeof el === 'object' && el !== null
    return withDescription(log(currentTest, 'object', el, isPass))
  }

  global.assertType = function (val, expected) {
    var actual = typeof val
    var isPass = actual === expected
    return withDescription(log(currentTest, expected, actual, isPass))
  }

  global.assertIsNumber = function (val) {
    var isPass = typeof val === 'number'
    return withDescription(log(currentTest, 'number', typeof val, isPass))
  }

  global.assertIsString = function (val) {
    var isPass = typeof val === 'string'
    return withDescription(log(currentTest, 'string', typeof val, isPass))
  }

  global.createElement = function (tag, noWrapper) {
    // create the wrapper.
    var wrapper = document.createElement('template')
    !noWrapper && document.body.appendChild(wrapper)

    // create the actual element.
    var el = document.createElement(tag || 'div')
    el.id = 'id_' + Math.random().toString(36).slice(2, 11)

    wrapper.appendChild(el)
    return el
  }

  global.dispatchTestEvent = function (element, type, bubbles, cancelable) {
    var event = document.createEvent('Event')
    event.initEvent(type, bubbles !== false, cancelable !== false)
    element.dispatchEvent(event)
    return event
  }

  /**
   * @function createStub
   * @memberof global
   * @param {object} obj - The object containing the method to stub.
   * @param {string} method - The name of the method on `obj` to stub.
   * @returns {object} - An object with a getter `get` that returns the last captured argument.
   * @desc Replaces a method on an object temporarily to capture.
   */
  global.createStub = function (obj, method) {
    var lastCall
    obj[method] = function (run, args) {
      lastCall = args && args[method]
    }
    return { get get() { return lastCall } }
  }

  /**
   * Temporarily replaces an object method and always restores it.
   */
  global.withStub = function (obj, method, replacement, callback) {
    var original = obj[method]
    obj[method] = replacement
    try {
      return callback(original)
    } finally {
      obj[method] = original
    }
  }

  /**
   * Temporarily replaces a property, including browser globals, and restores its descriptor.
   */
  global.withProperty = function (obj, property, value, callback) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, property)
    var hadProperty = Object.prototype.hasOwnProperty.call(obj, property)
    try {
      Object.defineProperty(obj, property, {
        configurable: true,
        enumerable: descriptor ? descriptor.enumerable : true,
        writable: true,
        value: value
      })
    } catch (e) {
      obj[property] = value
    }

    try {
      return callback(descriptor)
    } finally {
      try {
        if (hadProperty) Object.defineProperty(obj, property, descriptor)
        else delete obj[property]
      } catch (e) {
        obj[property] = descriptor && descriptor.value
      }
    }
  }

  /**
   * Temporarily sets a local/session storage value and restores the previous value afterward.
   */
  global.withStorage = function (mechanism, key, value, callback) {
    var store = mechanism === 'session' ? sessionStorage : localStorage
    var previous = store.getItem(key)
    if (value === null || value === undefined) store.removeItem(key)
    else store.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))

    try {
      return callback(store)
    } finally {
      if (previous === null) store.removeItem(key)
      else store.setItem(key, previous)
    }
  }

  /**
   * Creates a test element with optional attributes and inner HTML.
   */
  global.createFixture = function (tag, attributes, html) {
    var element = createElement(tag)
    attributes = attributes || {}
    for (var name in attributes) {
      if (attributes.hasOwnProperty(name)) element.setAttribute(name, attributes[name])
    }
    if (html !== undefined) element.innerHTML = html
    return element
  }

  global.assertContains = function (actual, expected) {
    return assertTrue(String(actual).indexOf(expected) !== -1)
  }

  global.assertNotContains = function (actual, expected) {
    return assertFalse(String(actual).indexOf(expected) !== -1)
  }

  global.measure = function (fn) {
    var startTime = performance.now()
    fn()
    return performance.now() - startTime
  }

  global.log = function () {
    console.log.apply(console, arguments)
  }

  // Capture script reference at parse time (document.currentScript is null in event handlers).
  var _testScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }())

  function loadExtraTests() {
    var extra = _testScript && _testScript.getAttribute('extra'),
      files = extra && extra.split(';') || []

    for (var i = 0; i < files.length; i++) {
      var f = files[i].replace(/^\s+|\s+$/g, '')
      if (f) {
        var sc = document.createElement('script')
        sc.src = f + '.js'
        sc.async = false
        sc.onerror = function () { missing++ }
        document.head.appendChild(sc)
      }
    }
  }

  function autoload() {
    var attr = _testScript && _testScript.getAttribute('autoload')

    // If ?test= is present, always load only that test.
    if (filterTest) {
      var sc = document.createElement('script')
      sc.src = filterTest + '.js'

      sc.onerror = function () { missing++ }
      document.head.appendChild(sc)
      app.log.info('Loaded filtered script (priority):', filterTest)
      return
    }

    // Otherwise, load explicitly listed local coverage before the normal manifest.
    loadExtraTests()

    // Otherwise, continue with the normal autoload logic.
    if (!attr) return
    if (attr && attr.indexOf('.json') !== -1) {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', attr, true)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
          try {
            var data = JSON.parse(xhr.responseText), key
            for (key in data) if (data.hasOwnProperty(key)) {
              (function (src) {
                var sc = document.createElement('script')
                sc.src = src
                sc.async = false
                sc.onerror = function () { missing++ }
                document.head.appendChild(sc)
              }(key + '.js'))
            }
            app.log.info('Loaded JSON tests:', attr)
          } catch (err) { console.error('JSON parse error:', err) }
        }
      }
      xhr.send()
    } else {
      var files = attr.split(';'), i
      for (i = 0; i < files.length; i++) {
        var f = files[i].replace(/^\s+|\s+$/g, '')
        if (f) {
          (function (src) {
            var sc = document.createElement('script')
            sc.src = src
            sc.async = false
            document.head.appendChild(sc)
          }(f + '.js'))
        }
      }
      app.log.info('Loaded scripts:', files.join(', '))
    }
  }

  window.addEventListener('load', autoload)
}(this))