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

  _remove: function (mechanism, object) { /* ... (Logic unchanged) ... */ },
  _set: function (mechanism, object) { /* ... (Logic unchanged) ... */ },
  _update: function (mechanism, object) { /* ... (Logic unchanged) ... */ },

  /**
   * @function _add (Final Refinement supporting complex object creation AND standard array pushes)
   * @desc Pushes values to arrays in storage OR creates complex objects at a specific key.
   */
  _add: function (mechanism, object) {
    var store = mechanism === 'local' ? localStorage : sessionStorage

    // Parse a raw exec value into tokens, respecting nested brackets.
    // Examples:
    //  "[myObject][new_key][[version[1.0]][date[today]]]" =>
    //    ['myObject','new_key','[version[1.0]][date[today]]']
    //  "[myArray][item]" => ['myArray','item']
    function parseParts(raw) {
      if (Object.prototype.toString.call(raw) === '[object Array]') return raw.slice()
      if (typeof raw !== 'string') return []

      var out = []
      var buf = ''
      var depth = 0
      var i = 0
      while (i < raw.length) {
        var ch = raw.charAt(i)
        if (ch === ':' && depth === 0) {
          if (buf !== '') { out.push(buf); buf = '' }
          i++; continue
        }
        if (ch === '[') {
          // start bracket capture (skip outer bracket)
          var j = i + 1
          var bdepth = 1
          var sub = ''
          while (j < raw.length && bdepth > 0) {
            var cj = raw.charAt(j)
            if (cj === '[') { bdepth++; sub += cj }
            else if (cj === ']') { bdepth--; if (bdepth > 0) sub += cj }
            else sub += cj
            j++
          }
          if (sub !== '') out.push(sub)
          i = j
          continue
        }
        // plain text
        buf += ch
        i++
      }
      if (buf !== '') out.push(buf)
      // trim empties
      for (var t = out.length - 1; t >= 0; t--) {
        if (out[t] === '' || out[t] === undefined || out[t] === null) out.splice(t, 1)
      }
      return out
    }

    // extract pairs like "version[1.0]" or "date[today]" from a composite string
    // Accepts a string that may contain multiple "name[value]" occurrences.
    function extractPairs(str) {
      var pairs = []
      if (!str || typeof str !== 'string') return pairs
      var re = /([^\[\]]+)\[([^\[\]]+)\]/g
      var m
      while ((m = re.exec(str))) {
        if (m[1] !== undefined && m[2] !== undefined) pairs.push({ name: m[1], value: m[2] })
      }
      return pairs
    }

    var rawParts = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = parseParts(rawParts)

    // detect unique flag (supports exec.unique and '!' in exec.name)
    var unique = !!(object && object.exec && object.exec.unique)
    try {
      if (!unique && object && object.exec && object.exec.name && typeof object.exec.name === 'string') {
        unique = object.exec.name.indexOf('!') !== -1
      }
    } catch (e) { }

    if (!parts || parts.length < 1) return
    var key = parts[0]
    if (!key) return

    // require at least key + one path + value
    if (parts.length < 3) return

    var raw = store.getItem(key)
    var json
    try {
      json = raw ? JSON.parse(raw) : {}
      var current = json

      var lastToken = parts[parts.length - 1]
      var secondLast = parts[parts.length - 2]

      // If lastToken looks like a composite (contains "name[value]" pairs), treat as object creation.
      var compositeDetected = (typeof lastToken === 'string' && /[^\[\]]+\[[^\[\]]+\]/.test(lastToken))

      if (compositeDetected) {
        // Path segments between key and finalKey (exclusive)
        var pathSegments = parts.slice(1, parts.length - 2)
        for (var pi = 0; pi < pathSegments.length; pi++) {
          var pathKey = String(pathSegments[pi])
          if (current[pathKey] === undefined || typeof current[pathKey] !== 'object') current[pathKey] = {}
          current = current[pathKey]
        }

        var finalKey = String(secondLast)
        // lastToken may already contain multiple pairs like "version[1.0]][date[today]" or "version[1.0]][date[today]"
        // Ensure we have a string to scan for pairs
        var compositeStr = String(lastToken)
        // If the compositeStr does not include '[' at start, but contains '][' patterns, we still scan it directly.
        var pairs = extractPairs(compositeStr)
        if (pairs.length > 0) {
          var finalObj = {}
          for (var k = 0; k < pairs.length; k++) {
            finalObj[String(pairs[k].name)] = pairs[k].value
          }
          current[finalKey] = finalObj
        } else {
          // fallback: store raw token
          current[finalKey] = compositeStr
        }
      } else {
        // Standard array push path: path = parts[1..n-2], value = lastToken
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
        // lastToken may include multiple bracketed values merged; parse bracketed items if present
        if (typeof lastToken === 'string' && /\[[^\]]+\]/.test(lastToken)) {
          var valRe = /\[([^\]]+)\]/g
          var valMatch
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