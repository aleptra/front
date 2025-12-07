'use strict'

app.module.storage = {

  // Store render references to handle live updates efficiently
  _renderMap: {},

  bind: function (element) {
    var self = this
    var value = element.getAttribute('storage-bind')
    if (!value) return

    // Parse "mechanism:key" (e.g., session:dictionaryLanguage)
    var parts = value.split(':')
    var mechanism = parts[0] || 'session'
    var key = parts[1] || ''

    // Generate a unique ID for the element to track its render function
    if (!element.id) element.id = 'storage-' + Math.random().toString(36).substr(2, 9)

    // Define the render logic based on data.js structure
    var render = function () {
      var storage = mechanism === 'local' ? localStorage : sessionStorage
      var raw = storage.getItem(key)
      var data = raw ? JSON.parse(raw) : {}

      // Mimic data.js _run options structure
      var options = {
        element: element,
        data: data,
        mechanism: mechanism,
        key: key
      }

      self._run(options)
    }

    // Save render function for listeners
    this._renderMap[element.id] = {
      render: render,
      key: key,
      mechanism: mechanism
    }

    // Add Live Listeners
    var updateHandler = function (e) {
      // Check if the update matches our key and mechanism
      if (e.detail && e.detail.key === key && e.detail.mechanism === mechanism) {
        render()
      }
    }

    app.listeners.add(window, 'storage-update', updateHandler)

    // Initial Render
    render()
  },

  _run: function (options) {
    var element = options.element
    var data = options.data
    var iterate = element.getAttribute('storage-iterate')
    var empty = element.getAttribute('data-onempty') // Support onempty like data.js
    var selector = '*:not([storage-iterate-skip])'

    // Handle empty data
    if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && Object.keys(data).length === 0)) {
      if (empty) dom.show(empty)
      // If no data and not iterating, we might still want to clear/reset
    } else {
      if (empty) dom.hide(empty)
    }

    // Main Traversal (matches data.js _traverse call)
    this._traverse(options, data, element, selector, iterate)
  },

  /**
   * @function _traverse
   * @desc Clones nodes and loops over data, exactly like data.js
   */
  _traverse: function (options, rootData, element, selector, iteratePath) {
    // Resolve the data to iterate over (e.g. data.languages)
    var responseObject = iteratePath ? app.element.getPropertyByPath(rootData, iteratePath) : rootData

    // Safety check: if iteratePath exists but data is missing, default to empty array
    if (iteratePath && !responseObject) responseObject = []

    var total = (responseObject.length) ? responseObject.length - 1 : 0

    if (responseObject) {
      // 1. Prepare Template (store original HTML)
      if (!element.originalHtml) {
        element.originalHtml = element.innerHTML
        element.originalClonedNode = element.cloneNode(true)
      }

      var originalNode = element
      var originalClonedNode = element.originalClonedNode

      // Reset HTML to blank before rebuilding
      originalNode.innerHTML = element.originalHtml

      // Handle Skip Elements
      var elementsSkip = originalNode.querySelectorAll('[storage-iterate-skip]')
      for (var k = 0; k < elementsSkip.length; k++) {
        var skipElement = elementsSkip[k]
        skipElement.parentNode.removeChild(skipElement)
      }

      var originalNodeCountAll = app.element.find(originalNode, selector).length || 1
      var content = ''

      // 2. Build HTML String (Loop)
      if (iteratePath || Array.isArray(responseObject)) {
        // Loop through data items
        for (var i = 0; i <= total; i++) {
          // Use original template for every item
          content += (i === 0 && elementsSkip.length > 0) ? originalClonedNode.innerHTML : originalNode.innerHTML
        }
      } else {
        // Single Object (no loop)
        content = originalNode.innerHTML
      }

      element.innerHTML = content

      // 3. Process Bindings on the newly created elements
      var elements = app.element.find(element, selector)

      // If we are iterating an array, we process each block of elements against the specific data item
      if (iteratePath || Array.isArray(responseObject)) {
        for (var i = 0, j = -1; i < elements.length; i++) {
          // Determine which data item index (j) corresponds to this DOM element (i)
          if (i % originalNodeCountAll === 0) j++

          var currentItem = responseObject[j]

          // A. Process storage-set FIRST
          this._process('storage-set', elements[i], currentItem, {
            fullObject: responseObject,
            rootData: rootData,
            index: j
          })

          // B. Process storage-get
          this._process('storage-get', elements[i], currentItem, {
            fullObject: responseObject,
            rootData: rootData,
            index: j
          })

          // C. Interpolate attributes BEFORE app.attributes.run so clicks get {iso} replaced
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

      // D. NOW run attributes (this processes click handlers with interpolated values)
      if (app.attributes && app.attributes.run) {
        app.attributes.run(elements, false, true)
      }
    }
  },

  /**
   * @function _process
   * @desc Handles storage-set and storage-get logic (like data.js _process)
   */
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

        // Resolve data
        var result = self._resolve(itemData, path, options)

        if (accessor === 'storage-set') {
          // storage-set: set attribute/variable on element for interpolation
          if (targetProp) {
            if (targetProp.charAt(0) === '#') {
              // Selector target
              app.element.set(app.element.select(targetProp), result, false)
            } else {
              // Set attribute on this element (for {attr} interpolation later)
              try {
                element.setAttribute(targetProp, result)
              } catch (e) {
                try { element[targetProp] = result } catch (e2) { }
              }
            }
          } else {
            // No target prop -> set element content
            app.element.set(element, result, false)
          }
        } else if (accessor === 'storage-get') {
          // storage-get: set content/value on element or target
          if (targetProp) {
            if (targetProp.charAt(0) === '#') {
              // Selector syntax
              app.element.set(app.element.select(targetProp), result, false)
            } else {
              // Attribute update on self
              app.element.set(element, result, false)
            }
          } else {
            // Default: Set content of self
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
   * @function _resolve
   * @desc Resolves paths like [*], [languages], etc.
   */
  _resolve: function (currentItem, path, options) {
    if (!path) return ''

    // 1. "[*]" -> Current Item (primitive)
    if (path === '[*]') {
      return currentItem
    }

    // 2. "[*].prop" -> Property of current item
    if (path.indexOf('[*].') === 0) {
      return app.element.getPropertyByPath(currentItem, path.substring(4))
    }

    // 3. "[].prop" -> Root Data property
    if (path.indexOf('[].') === 0 && options && options.rootData) {
      return app.element.getPropertyByPath(options.rootData, path.substring(3))
    }

    // 4. Standard property lookup on current item
    return app.element.getPropertyByPath(currentItem, path)
  },

  /**
   * @function _interpolateAttributes
   * @desc Replaces {token} in attributes with values from:
   *  1. Element attributes (set by storage-set)
   *  2. Current item properties (if object)
   *  3. Current item itself (if primitive)
   */
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
        var token = match[1] // e.g., "iso" from {iso}
        var replacement = ''

        // 1. First check: element attribute (set by storage-set)
        try {
          var attrValue = element.getAttribute(token)
          if (attrValue !== null && attrValue !== undefined) {
            replacement = String(attrValue)
          }
        } catch (e) { /* ignore */ }

        // 2. Second check: property on currentItem (if object)
        if ((replacement === '' || replacement === null) && currentItem && typeof currentItem === 'object') {
          try {
            var propVal = app.element.getPropertyByPath(currentItem, token)
            if (propVal !== undefined && propVal !== null) {
              replacement = String(propVal)
            }
          } catch (e) { /* ignore */ }
        }

        // 3. Fallback: if token is 'value' and currentItem is primitive, use it directly
        if ((replacement === '' || replacement === null) && token === 'value' && typeof currentItem !== 'object') {
          replacement = String(currentItem)
        }

        // Replace token in updated string
        if (replacement !== '' && replacement !== null) {
          updated = updated.split('{' + token + '}').join(replacement)
        }
      }

      // Set the updated attribute value back on element
      if (updated !== original) {
        try {
          element.setAttribute(attr.name, updated)
        } catch (e) { /* ignore */ }
      }
    }
  },

  // Keep existing session methods needed for the button to work
  sessionremove: function (object) {
    // normalize exec value into parts (supports arrays, colon/dot/bracket notation)
    var val = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = []

    if (Object.prototype.toString.call(val) === '[object Array]') {
      parts = val.slice()
    } else if (typeof val === 'string') {
      // prefer colon separator if present
      if (val.indexOf(':') !== -1) {
        parts = val.split(':')
      } else if (val.indexOf('[') !== -1) {
        // extract plain tokens and bracket values: foo[bar][baz] => ['foo','bar','baz']
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

    // trim/clean parts
    for (var t = parts.length - 1; t >= 0; t--) {
      if (parts[t] === '' || parts[t] === undefined || parts[t] === null) parts.splice(t, 1)
      else parts[t] = String(parts[t])
    }

    if (!parts || parts.length === 0) return

    var key = parts[0]
    if (!key) return

    // remove whole item
    if (parts.length === 1) {
      sessionStorage.removeItem(key)
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'session', key: key }) } catch (e) { }
      return
    }

    var raw = sessionStorage.getItem(key)
    if (!raw) {
      console.warn('Warning: No session storage item found for key:', key)
      return
    }

    try {
      var json = JSON.parse(raw)
      var current = json

      // traverse to parent of target (stop before last)
      for (var i = 1; i < parts.length - 1; i++) {
        var p = parts[i]
        // numeric index support for arrays
        if (current === undefined) {
          console.warn('Warning: Invalid path for removal in session storage for key:', key)
          return
        }
        if (Array.isArray(current)) {
          // when current is array and p is numeric -> go into index
          if (/^\d+$/.test(p)) {
            p = parseInt(p, 10)
            if (current[p] === undefined) {
              console.warn('Warning: Invalid array index in path for key:', key)
              return
            }
            current = current[p]
          } else {
            // can't traverse non-numeric into array
            console.warn('Warning: Expected numeric index when traversing array for key:', key)
            return
          }
        } else if (current[p] !== undefined) {
          current = current[p]
        } else {
          console.warn('Warning: Invalid path for removal in session storage for key:', key)
          return
        }
      }

      var last = parts[parts.length - 1]

      // If current is array -> remove by index or by value
      if (Array.isArray(current)) {
        var idx = (/^\d+$/.test(last)) ? parseInt(last, 10) : current.indexOf(last)
        if (idx > -1) current.splice(idx, 1)
        else console.warn('Warning: Value not found in array for removal:', last)
      } else if (current.hasOwnProperty(last)) {
        // direct property removal
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

      sessionStorage.setItem(key, JSON.stringify(json))
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'session', key: key }) } catch (e) { }
    } catch (e) {
      console.error('Error parsing session storage item:', e)
    }
  },

  sessionset: function (object) {
    var parts = object.exec.value,
      key = parts[0],
      json = {}

    function buildTree(obj, arr, i) {
      if (i >= arr.length) return
      var val = arr[i]

      // Case 1: Value is an array => handle as a nested structure
      if (Object.prototype.toString.call(val) === '[object Array]') {
        buildTree(obj, val, 0)
        return
      }

      if (i === arr.length - 2) {
        var finalValue = arr[i + 1],
          finalKey = val

        // If the last value contains bracketed pairs...
        if (typeof finalValue === 'string' && finalValue.indexOf('[') !== -1 && finalValue.indexOf(']') !== -1) {
          var extracted = app.element.extractBracketValues(finalValue)
          var nestedObj = {}

          if (extracted.length % 2 !== 0) extracted.pop()

          for (var j = 0; j < extracted.length; j += 2) {
            var nestedKey = extracted[j]
            var nestedValue = extracted[j + 1]
            if (typeof nestedValue === 'string' && nestedValue.indexOf('[') !== -1 && nestedValue.indexOf(']') !== -1) {
              nestedValue = app.element.extractBracketValues(nestedValue)
            }
            nestedObj[nestedKey] = nestedValue
          }
          finalValue = nestedObj
        }
        obj[finalKey] = finalValue
      } else {
        if (!obj[val] || typeof obj[val] !== 'object') obj[val] = {}
        buildTree(obj[val], arr, i + 1)
      }
    }

    buildTree(json, parts, 1)
    sessionStorage.setItem(key, JSON.stringify(json))
    console.warn('Updated JSON:', json)

    app.listeners.dispatch('storage-update', { mechanism: 'session', key: key })
  },

  sessionadd: function (object) {
    var parts = object.exec.value,
      unique = object.exec.unique,
      key = parts[0],
      valueToAdd = parts[parts.length - 1]

    if (parts.length < 3) return

    var item = sessionStorage.getItem(key),
      json

    try {
      json = item ? JSON.parse(item) : {}
      var current = json

      // Traverse or create the path to the array.
      for (var i = 1; i < parts.length - 2; i++) {
        var pathKey = parts[i].replace(/[\[\]]/g, '') // Clean brackets if passed
        if (current[pathKey] === undefined || typeof current[pathKey] !== 'object') {
          current[pathKey] = {}
        }
        current = current[pathKey]
      }

      var arrayKey = parts[parts.length - 2].replace(/[\[\]]/g, '')

      // Ensure the target property is an array.
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = []
      }

      // Unique Check
      if (unique) {
        if (current[arrayKey].indexOf(valueToAdd) !== -1) {
          console.warn('Warning: Value already exists in array. Skipping add.')
          return
        }
      }

      current[arrayKey].push(valueToAdd)
      sessionStorage.setItem(key, JSON.stringify(json))

      app.listeners.dispatch('storage-update', { mechanism: 'session', key: key })
    } catch (e) {
      console.error('Error processing session storage item for add:', e)
    }
  },

  sessionupdate: function (object) {
    var parts = object.exec.value,
      key = parts[0],
      valueToUpdate = parts[parts.length - 1]

    if (parts.length < 3) return

    var item = sessionStorage.getItem(key)
    if (!item) return

    try {
      var json = JSON.parse(item)
      var current = json

      for (var i = 1; i < parts.length - 2; i++) {
        var pathKey = parts[i].replace(/[\[\]]/g, '')
        if (current[pathKey] !== undefined && typeof current[pathKey] === 'object') {
          current = current[pathKey]
        } else {
          return
        }
      }

      var propertyToUpdate = parts[parts.length - 2].replace(/[\[\]]/g, '')
      current[propertyToUpdate] = valueToUpdate
      sessionStorage.setItem(key, JSON.stringify(json))

      app.listeners.dispatch('storage-update', { mechanism: 'session', key: key })
    } catch (e) {
      console.error('Error parsing session storage item for update:', e)
    }
  },

  sessionremove: function (object) {
    // normalize exec value into parts (supports arrays, colon/dot/bracket notation)
    var val = (object && object.exec && object.exec.value !== undefined) ? object.exec.value : object.value
    var parts = []

    if (Object.prototype.toString.call(val) === '[object Array]') {
      parts = val.slice()
    } else if (typeof val === 'string') {
      // prefer colon separator if present
      if (val.indexOf(':') !== -1) {
        parts = val.split(':')
      } else if (val.indexOf('[') !== -1) {
        // extract plain tokens and bracket values: foo[bar][baz] => ['foo','bar','baz']
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

    // trim/clean parts
    for (var t = parts.length - 1; t >= 0; t--) {
      if (parts[t] === '' || parts[t] === undefined || parts[t] === null) parts.splice(t, 1)
      else parts[t] = String(parts[t])
    }

    if (!parts || parts.length === 0) return

    var key = parts[0]
    if (!key) return

    // remove whole item
    if (parts.length === 1) {
      sessionStorage.removeItem(key)
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'session', key: key }) } catch (e) { }
      return
    }

    var raw = sessionStorage.getItem(key)
    if (!raw) {
      console.warn('Warning: No session storage item found for key:', key)
      return
    }

    try {
      var json = JSON.parse(raw)
      var current = json

      // traverse to parent of target (stop before last)
      for (var i = 1; i < parts.length - 1; i++) {
        var p = parts[i]
        // numeric index support for arrays
        if (current === undefined) {
          console.warn('Warning: Invalid path for removal in session storage for key:', key)
          return
        }
        if (Array.isArray(current)) {
          // when current is array and p is numeric -> go into index
          if (/^\d+$/.test(p)) {
            p = parseInt(p, 10)
            if (current[p] === undefined) {
              console.warn('Warning: Invalid array index in path for key:', key)
              return
            }
            current = current[p]
          } else {
            // can't traverse non-numeric into array
            console.warn('Warning: Expected numeric index when traversing array for key:', key)
            return
          }
        } else if (current[p] !== undefined) {
          current = current[p]
        } else {
          console.warn('Warning: Invalid path for removal in session storage for key:', key)
          return
        }
      }

      var last = parts[parts.length - 1]

      // If current is array -> remove by index or by value
      if (Array.isArray(current)) {
        var idx = (/^\d+$/.test(last)) ? parseInt(last, 10) : current.indexOf(last)
        if (idx > -1) current.splice(idx, 1)
        else console.warn('Warning: Value not found in array for removal:', last)
      } else if (current.hasOwnProperty(last)) {
        // direct property removal
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

      sessionStorage.setItem(key, JSON.stringify(json))
      try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: 'session', key: key }) } catch (e) { }
    } catch (e) {
      console.error('Error parsing session storage item:', e)
    }
  }
}