'use strict'

app.module.storage = {

  _renderMap: {},

  // ... (bind and _run functions remain as previously defined) ...
  bind: function (element) {
    var self = this
    var value = element.getAttribute('storage-bind')
    if (!value) return

    var parts = value.split(':')
    var mechanism = parts[0] || 'session'
    var key = parts[1] || ''

    if (!element.id) element.id = 'storage-' + Math.random().toString(36).substr(2, 9)

    var render = function () {
      var storage = mechanism === 'local' ? localStorage : sessionStorage
      var raw = storage.getItem(key)
      var data = raw ? JSON.parse(raw) : {}

      var options = {
        element: element,
        data: data,
        mechanism: mechanism,
        key: key
      }

      self._run(options)
    }

    this._renderMap[element.id] = {
      render: render,
      key: key,
      mechanism: mechanism
    }

    var updateHandler = function (e) {
      if (e.detail && e.detail.key === key && e.detail.mechanism === mechanism) {
        render()
      }
    }

    app.listeners.add(window, 'storage-update', updateHandler)
    render()
  },

  _run: function (options) {
    var element = options.element
    var data = options.data
    var iterate = element.getAttribute('storage-iterate')
    var empty = element.getAttribute('storage-onempty')
    var selector = '*:not([storage-iterate-skip])'
    var targetData = iterate ? app.element.getPropertyByPath(data, iterate) : data

    if (!targetData || (Array.isArray(targetData) && targetData.length === 0) || (typeof targetData === 'object' && Object.keys(targetData).length === 0)) {
      if (empty) dom.show(empty)
    } else {
      if (empty) dom.hide(empty)
    }

    this._traverse(options, data, element, selector, iterate)
  },

  /**
   * @function _traverse (Retaining Object Iteration Support)
   */
  _traverse: function (options, rootData, element, selector, iteratePath) {
    var responseObject = iteratePath ? app.element.getPropertyByPath(rootData, iteratePath) : rootData

    if (iteratePath && !responseObject) responseObject = []

    var isObjectIteration = typeof responseObject === 'object' && responseObject !== null && !Array.isArray(responseObject)
    var keys = []

    // FIX: Set keys and total without the -1 offset so 0 actually means 0
    keys = isObjectIteration ? Object.keys(responseObject) : []
    var total = isObjectIteration ? keys.length : (responseObject ? responseObject.length : 0)

    if (responseObject) {
      if (!element.originalHtml) {
        element.originalHtml = element.innerHTML
        element.originalClonedNode = element.cloneNode(true)
      }

      var originalNode = element
      var originalClonedNode = originalNode.cloneNode(true)

      originalNode.innerHTML = element.originalHtml

      var elementsSkip = originalNode.querySelectorAll('[storage-iterate-skip]')
      for (var k = 0; k < elementsSkip.length; k++) {
        elementsSkip[k].parentNode.removeChild(elementsSkip[k])
      }

      var originalNodeCountAll = app.element.find(originalNode, selector).length || 1
      var content = ''

      if (iteratePath || Array.isArray(responseObject) || isObjectIteration) {
        for (var i = 0; i < total; i++) {
          content += (i === 0 && elementsSkip.length > 0) ? originalClonedNode.innerHTML : originalNode.innerHTML
        }
      } else {
        content = originalNode.innerHTML
      }

      element.innerHTML = content
      var elements = app.element.find(element, selector)

      if (iteratePath || Array.isArray(responseObject) || isObjectIteration) {
        for (var i = 0, j = -1; i < elements.length; i++) {
          if (i % originalNodeCountAll === 0) j++

          var currentItem = null
          var traverseOptions = {
            fullObject: responseObject,
            rootData: rootData,
            index: j,
            keys: keys
          }

          if (isObjectIteration) {
            currentItem = responseObject[keys[j]]
            elements[i].setAttribute('data-key', keys[j])

            // Item is a structured object, wrap it for resolution consistency
            currentItem = { value: currentItem, key: keys[j] }
          } else {
            currentItem = responseObject[j]
          }

          this._process('storage-set', elements[i], currentItem, traverseOptions)
          this._process('storage-get', elements[i], currentItem, traverseOptions)
          this._interpolateAttributes(elements[i], currentItem)
        }
      } else {
        var arrayFromNodeList = [].slice.call(elements)
        arrayFromNodeList.push(element)

        for (var i = 0; i < arrayFromNodeList.length; i++) {
          this._process('storage-set', arrayFromNodeList[i], responseObject, { single: true, rootData: rootData })
          this._process('storage-get', arrayFromNodeList[i], responseObject, { single: true, rootData: rootData })
          this._interpolateAttributes(arrayFromNodeList[i], responseObject)
        }
      }

      if (app.attributes && app.attributes.run) {
        app.attributes.run(elements, false, true)
      }
    }
  },

  // ... (_process, _interpolateAttributes, wrappers, _remove, _set, _update remain as previously defined) ...
  _process: function (accessor, element, itemData, options) {
    var self = this
    var values = element.getAttribute(accessor) || ''
    if (!values) return
    var valueList = values.split(';')

    for (var i = 0; i < valueList.length; i++) {
      if (valueList[i]) {
        var parts = valueList[i].split(':')
        var targetProp = (parts.length > 1) ? parts[0] : null
        var path = (parts.length > 1) ? parts[1] : parts[0]
        var result = self._resolve(itemData, path, options)

        if (accessor === 'storage-set') {
          if (targetProp) {
            if (targetProp.charAt(0) === '#') {
              app.element.set(app.element.select(targetProp), result, false)
            } else {
              try { element.setAttribute(targetProp, result) } catch (e) { try { element[targetProp] = result } catch (e2) { } }
            }
          } else {
            app.element.set(element, result, false)
          }
        } else if (accessor === 'storage-get') {
          if (targetProp) {
            if (targetProp.charAt(0) === '#') {
              app.element.set(app.element.select(targetProp), result, false)
            } else {
              app.element.set(element, result, false)
            }
          } else {
            app.element.set(element, result, false)
          }
        }
      }
    }
    if (options && options.single) {
      try { app.element.onload(element, accessor) } catch (e) { }
    }
  },

  /**
   * @function _resolve (Retaining Object Iteration Support)
   */
  _resolve: function (currentItem, path, options) {
    if (!path) return ''

    // If item is wrapped by _traverse (Object Iteration)
    if (currentItem && currentItem.key && currentItem.value !== undefined) {
      // If currentItem.value is the object {iso: "...", name: "..."}, we access its properties directly
      return app.element.getPropertyByPath(currentItem.value, path) || app.element.getPropertyByPath(currentItem, path)
    }

    // Original logic for array iteration (where currentItem is the item itself)
    if (path === '[*]') return currentItem
    if (path.indexOf('[*].') === 0) return app.element.getPropertyByPath(currentItem, path.substring(4))
    if (path.indexOf('[].') === 0 && options && options.rootData) return app.element.getPropertyByPath(options.rootData, path.substring(3))
    return app.element.getPropertyByPath(currentItem, path)
  },

  _interpolateAttributes: function (element, currentItem) {
    if (!element || !element.attributes) return
    var attributes = element.attributes
    var regex = /\{([^\}]+)\}/g

    for (var i = 0; i < attributes.length; i++) {
      var attr = attributes[i]
      if (!attr || !attr.value || attr.value.indexOf('{') === -1) continue

      var original = attr.value
      var updated = original
      var match

      while ((match = regex.exec(original))) {
        var token = match[1]
        var replacement = ''

        try {
          var attrValue = element.getAttribute(token)
          if (attrValue !== null && attrValue !== undefined) replacement = String(attrValue)
        } catch (e) { }

        if ((replacement === '' || replacement === null) && currentItem && typeof currentItem === 'object') {
          try {
            // Check if token matches a property of the current object
            var propVal = app.element.getPropertyByPath(currentItem, token)
            if (propVal !== undefined && propVal !== null) replacement = String(propVal)
          } catch (e) { }
        }

        if ((replacement === '' || replacement === null) && token === 'value' && typeof currentItem !== 'object') {
          replacement = String(currentItem)
        }

        if (replacement !== '' && replacement !== null) {
          updated = updated.split('{' + token + '}').join(replacement)
        }
      }
      if (updated !== original) {
        try { element.setAttribute(attr.name, updated) } catch (e) { }
      }
    }
  },

  // Public Wrappers (unchanged)
  bindlocal: function (element) {
    element = element.exec ? element.exec.element : element
    var value = element.getAttribute('storage-bindlocal')
    if (!value) return
    var parts = value.split(':')
    var key = parts[0]
    var variable = parts[1] || key
    var raw = localStorage.getItem(key)
    if (raw) {
      try { raw = JSON.parse(raw) } catch (e) { }
      app.variables.update.attributes(element, variable, raw)
      app.variables.update.content(element, variable, raw)
    }
  },

  bindsession: function (element) {
    element = element.exec ? element.exec.element : element
    var value = element.getAttribute('storage-bindsession')
    if (!value) return
    var parts = value.split(':')
    var key = parts[0]
    var variable = parts[1] || key
    var raw = sessionStorage.getItem(key)
    if (raw) {
      try { raw = JSON.parse(raw) } catch (e) { }
      app.variables.update.attributes(element, variable, raw)
      app.variables.update.content(element, variable, raw)
    }
  },

  sessionremove: function (object) { this._remove('session', object) },
  sessionset: function (object) { this._set('session', object) },
  sessionadd: function (object) { this._add('session', object) },
  sessionupdate: function (object) { this._update('session', object) },
  localremove: function (object) {
    // normalize exec value into parts (supports arrays, colon/dot/bracket notation)
    var val = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = []

    if (Object.prototype.toString.call(val) === '[object Array]') {
      parts = val.slice()
    } else if (typeof val === 'string') {
      if (val.indexOf(':') !== -1) {
        parts = val.split(':')
      } else if (val.indexOf('[') !== -1) {
        var re = /([^\[\]]+)|\[(.*?)\]/g
        var m
        while ((m = re.exec(val))) {
          if (m[1] && m[1].trim() !== '') parts.push(m[1].trim())
          if (m[2] && m[2].trim() !== '') parts.push(m[2].trim())
        }
      } else if (val.indexOf('.') !== -1) {
        parts = val.split('.')
      } else {
        parts = [val]
      }
    }

    // clean parts
    for (var t = parts.length - 1; t >= 0; t--) {
      if (parts[t] === '' || parts[t] === undefined || parts[t] === null) parts.splice(t, 1)
      else parts[t] = String(parts[t])
    }

    if (!parts || parts.length === 0) return

    var key = parts[0]
    if (!key) return

    // remove whole item if only key provided
    if (parts.length === 1) {
      localStorage.removeItem(key)
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'local', key: key }) } catch (e) { }
      return
    }

    var raw = localStorage.getItem(key)
    if (!raw) return

    try {
      var json = JSON.parse(raw)
      var current = json

      // traverse to parent of target (stop before last)
      for (var i = 1; i < parts.length - 1; i++) {
        var p = parts[i]
        if (current === undefined) {
          console.warn('Warning: Invalid path for removal in local storage for key:', key)
          return
        }
        if (Array.isArray(current)) {
          if (/^\d+$/.test(p)) {
            p = parseInt(p, 10)
            if (current[p] === undefined) {
              console.warn('Warning: Invalid array index in path for key:', key)
              return
            }
            current = current[p]
          } else {
            console.warn('Warning: Expected numeric index when traversing array for key:', key)
            return
          }
        } else if (current[p] !== undefined) {
          current = current[p]
        } else {
          console.warn('Warning: Invalid path for removal in local storage for key:', key)
          return
        }
      }

      var last = parts[parts.length - 1]

      // If parent is array -> remove by index or by value
      if (Array.isArray(current)) {
        var idx = (/^\d+$/.test(last)) ? parseInt(last, 10) : current.indexOf(last)
        if (idx > -1) current.splice(idx, 1)
        else console.warn('Warning: Value not found in array for removal:', last)
      } else if (current.hasOwnProperty(last)) {
        // direct property removal (works for objects like languages.syh)
        delete current[last]
      } else {
        // fallback: try removing value from any array property on current
        var removed = false
        for (var k in current) {
          if (current.hasOwnProperty(k) && Array.isArray(current[k])) {
            var pidx = current[k].indexOf(last)
            if (pidx > -1) {
              current[k].splice(pidx, 1)
              removed = true
              break
            }
          }
        }
        if (!removed) {
          console.warn('Warning: Could not remove target from storage (not found):', last)
        }
      }

      localStorage.setItem(key, JSON.stringify(json))
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'local', key: key }) } catch (e) { }
    } catch (e) {
      console.error('Error parsing local storage item:', e)
    }
  },

  localset: function (object) { this._set('local', object) },
  localadd: function (object) { this._add('local', object) },
  localupdate: function (object) { this._update('local', object) },

  _remove: function (mechanism, object) {
    if (mechanism === 'cookie') {
      var name = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : ''
      var el = object.exec && object.exec.element
      var path = el && el.getAttribute('storage-cookie-path') || '/'
      document.cookie = encodeURIComponent(name) + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=' + path
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'cookie', key: name }) } catch (e) { }
      return
    }

    var store = mechanism === 'local' ? localStorage : sessionStorage
    var val = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = this._parseParts(val)

    if (!parts || parts.length === 0) return
    var key = parts[0]
    if (!key) return

    if (parts.length === 1) {
      store.removeItem(key)
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: key }) } catch (e) { }
      return
    }

    var raw = store.getItem(key)
    if (!raw) return

    try {
      var json = JSON.parse(raw)
      var current = json

      for (var i = 1; i < parts.length - 1; i++) {
        var p = parts[i]
        if (current === undefined) return
        if (Array.isArray(current)) {
          p = /^\d+$/.test(p) ? parseInt(p, 10) : p
          if (current[p] === undefined) return
          current = current[p]
        } else if (current[p] !== undefined) {
          current = current[p]
        } else { return }
      }

      var last = parts[parts.length - 1]

      if (Array.isArray(current)) {
        var idx = /^\d+$/.test(last) ? parseInt(last, 10) : current.indexOf(last)
        if (idx > -1) current.splice(idx, 1)
      } else if (current.hasOwnProperty(last)) {
        delete current[last]
      } else {
        for (var k in current) {
          if (current.hasOwnProperty(k) && Array.isArray(current[k])) {
            var pidx = current[k].indexOf(last)
            if (pidx > -1) { current[k].splice(pidx, 1); break }
          }
        }
      }

      store.setItem(key, JSON.stringify(json))
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: key }) } catch (e) { }
    } catch (e) {
      console.error('Storage _remove error:', e)
    }
  },

  _set: function (mechanism, object) {
    if (mechanism === 'cookie') {
      var val = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : ''
      var cparts = val.split(':')
      if (cparts.length < 2) return
      var cname = cparts[0]
      var cvalue = cparts.slice(1).join(':')
      var el = object.exec && object.exec.element
      var days = el && el.getAttribute('storage-cookie-days')
      var cpath = el && el.getAttribute('storage-cookie-path') || '/'
      var secure = el && el.getAttribute('storage-cookie-secure') === 'true'
      var samesite = el && el.getAttribute('storage-cookie-samesite') || 'Lax'
      var expires = ''
      if (days) {
        var d = new Date()
        d.setTime(d.getTime() + (parseInt(days, 10) * 86400000))
        expires = ';expires=' + d.toUTCString()
      }
      document.cookie = encodeURIComponent(cname) + '=' + encodeURIComponent(cvalue) + expires + ';path=' + cpath + (secure ? ';Secure' : '') + ';SameSite=' + samesite
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'cookie', key: cname }) } catch (e) { }
      return
    }

    var store = mechanism === 'local' ? localStorage : sessionStorage
    var rawParts = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = this._parseParts(rawParts)

    if (!parts || parts.length < 1) return
    var key = parts[0]
    if (!key) return

    // Simple set: [key]:[value] — store raw value as JSON
    if (parts.length === 2) {
      var simpleVal = parts[1]
      // Check if value looks like pairs: name[val]name[val]
      var pairs = this._extractPairs(simpleVal)
      if (pairs.length > 0) {
        var obj = {}
        for (var p = 0; p < pairs.length; p++) obj[pairs[p].name] = pairs[p].value
        store.setItem(key, JSON.stringify(obj))
      } else {
        store.setItem(key, JSON.stringify(simpleVal))
      }
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: key }) } catch (e) { }
      return
    }

    // Nested set: [key]:[path]:[path]:[value]
    var raw = store.getItem(key)
    var json
    try { json = raw ? JSON.parse(raw) : {} } catch (e) { json = {} }

    var current = json
    // Navigate to parent (all parts except first=key and last=value)
    for (var i = 1; i < parts.length - 2; i++) {
      var seg = parts[i]
      if (current[seg] === undefined || typeof current[seg] !== 'object') current[seg] = {}
      current = current[seg]
    }

    var setKey = parts[parts.length - 2]
    var setValue = parts[parts.length - 1]

    // Check if value is composite pairs
    var valuePairs = this._extractPairs(setValue)
    if (valuePairs.length > 0) {
      var valueObj = {}
      for (var vp = 0; vp < valuePairs.length; vp++) valueObj[valuePairs[vp].name] = valuePairs[vp].value
      current[setKey] = valueObj
    } else {
      current[setKey] = setValue
    }

    store.setItem(key, JSON.stringify(json))
    try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: key }) } catch (e) { }
  },

  _get: function (mechanism, object) {
    if (mechanism === 'cookie') {
      var el = object.exec && object.exec.element || object
      var name = (object.exec && object.exec.value) || el.getAttribute('storage-cookieget') || ''
      var cookies = document.cookie.split(';')
      for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i].replace(/^\s+/, '')
        if (c.indexOf(encodeURIComponent(name) + '=') === 0) {
          var value = decodeURIComponent(c.substring(name.length + 1))
          app.element.set(el, value)
          return value
        }
      }
      return ''
    }
  },

  _update: function (mechanism, object) {
    var store = mechanism === 'local' ? localStorage : sessionStorage
    var rawParts = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = this._parseParts(rawParts)

    if (!parts || parts.length < 3) return
    var key = parts[0]
    if (!key) return

    var raw = store.getItem(key)
    if (!raw) return

    try {
      var json = JSON.parse(raw)
      var current = json

      // Navigate path (skip key and last two: target + value)
      for (var i = 1; i < parts.length - 2; i++) {
        var seg = parts[i]
        if (current[seg] === undefined) return
        current = current[seg]
      }

      var updateKey = parts[parts.length - 2]
      var updateValue = parts[parts.length - 1]

      current[updateKey] = updateValue

      store.setItem(key, JSON.stringify(json))
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: key }) } catch (e) { }
    } catch (e) {
      console.error('Storage _update error:', e)
    }
  },

  _parseParts: function (raw) {
    if (Object.prototype.toString.call(raw) === '[object Array]') return raw.slice()
    if (typeof raw !== 'string') return []

    var out = [], buf = '', i = 0
    while (i < raw.length) {
      var ch = raw.charAt(i)
      if (ch === ':' && buf === '') { i++; continue }
      if (ch === ':') { out.push(buf); buf = ''; i++; continue }
      if (ch === '[') {
        var j = i + 1, bdepth = 1, sub = ''
        while (j < raw.length && bdepth > 0) {
          var cj = raw.charAt(j)
          if (cj === '[') { bdepth++; sub += cj }
          else if (cj === ']') { bdepth--; if (bdepth > 0) sub += cj }
          else sub += cj
          j++
        }
        if (sub !== '') out.push(sub)
        i = j; continue
      }
      buf += ch; i++
    }
    if (buf !== '') out.push(buf)
    for (var t = out.length - 1; t >= 0; t--) {
      if (out[t] === '' || out[t] === undefined || out[t] === null) out.splice(t, 1)
    }
    return out
  },

  _extractPairs: function (str) {
    var pairs = []
    if (!str || typeof str !== 'string') return pairs
    // Try standard format: name[value]name[value]
    var re = /([^\[\]]+)\[([^\[\]]+)\]/g, m
    while ((m = re.exec(str))) {
      if (m[1] !== undefined && m[2] !== undefined) pairs.push({ name: m[1], value: m[2] })
    }
    // Try bracket format: [name][value][name][value]
    if (pairs.length === 0 && str.charAt(0) === '[') {
      var re2 = /\[([^\[\]]+)\]/g, tokens = [], m2
      while ((m2 = re2.exec(str))) {
        if (m2[1]) tokens.push(m2[1])
      }
      for (var i = 0; i < tokens.length - 1; i += 2) {
        pairs.push({ name: tokens[i], value: tokens[i + 1] })
      }
    }
    return pairs
  },

  _add: function (mechanism, object) {
    var store = mechanism === 'local' ? localStorage : sessionStorage

    var rawParts = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = this._parseParts(rawParts)

    // detect unique flag
    var unique = !!(object && object.exec && object.exec.unique)
    try {
      if (!unique && object && object.exec && object.exec.name && typeof object.exec.name === 'string') {
        unique = object.exec.name.indexOf('!') !== -1
      }
    } catch (e) { }

    if (!parts || parts.length < 1) return
    var key = parts[0]
    if (!key) return
    if (parts.length < 3) return

    var raw = store.getItem(key)
    var json
    try {
      json = raw ? JSON.parse(raw) : {}
      var current = json

      var lastToken = parts[parts.length - 1]
      var secondLast = parts[parts.length - 2]

      var compositeDetected = (typeof lastToken === 'string' && (/[^\[\]]+\[[^\[\]]+\]/.test(lastToken) || /^\[[^\[\]]+\]\[[^\[\]]+\]/.test(lastToken)))

      // Check if target path resolves to an existing array — if so, treat as array push not composite
      if (compositeDetected) {
        var checkPath = parts.slice(1, parts.length - 1)
        var checkCurrent = json
        for (var ci = 0; ci < checkPath.length; ci++) {
          if (checkCurrent && checkCurrent[checkPath[ci]] !== undefined) checkCurrent = checkCurrent[checkPath[ci]]
          else { checkCurrent = undefined; break }
        }
        if (Array.isArray(checkCurrent)) compositeDetected = false
      }

      if (compositeDetected) {
        var pathSegments = parts.slice(1, parts.length - 2)
        for (var pi = 0; pi < pathSegments.length; pi++) {
          var pathKey = String(pathSegments[pi])
          if (current[pathKey] === undefined || typeof current[pathKey] !== 'object') current[pathKey] = {}
          current = current[pathKey]
        }

        var finalKey = String(secondLast)
        var pairs = this._extractPairs(String(lastToken))
        if (pairs.length > 0) {
          var finalObj = {}
          for (var k = 0; k < pairs.length; k++) finalObj[String(pairs[k].name)] = pairs[k].value
          current[finalKey] = finalObj
        } else {
          current[finalKey] = String(lastToken)
        }
      } else {
        var pathSegments2 = parts.slice(1, parts.length - 1)
        for (var p = 0; p < pathSegments2.length; p++) {
          var pathKey2 = String(pathSegments2[p])
          if (current[pathKey2] === undefined) {
            if (p === pathSegments2.length - 1) current[pathKey2] = []
            else current[pathKey2] = {}
          }
          current = current[pathKey2]
        }

        if (!Array.isArray(current)) {
          console.error('Storage _add: target path does not resolve to an array.')
          return
        }

        var valuesToAdd = []
        if (typeof lastToken === 'string' && /\[[^\]]+\]/.test(lastToken)) {
          var valRe = /\[([^\]]+)\]/g, valMatch
          while ((valMatch = valRe.exec(lastToken)) !== null) {
            if (valMatch[1]) valuesToAdd.push(valMatch[1])
          }
        } else {
          valuesToAdd.push(lastToken)
        }

        for (var v2 = 0; v2 < valuesToAdd.length; v2++) {
          var val = valuesToAdd[v2]
          if (unique && current.indexOf(val) > -1) continue
          current.push(val)
        }
      }

      store.setItem(key, JSON.stringify(json))
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: key }) } catch (e) { }
    } catch (e) {
      console.error('Error processing storage item for add:', e)
    }
  },
}