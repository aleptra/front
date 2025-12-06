'use strict'

app.module.storage = {
  set: function (object) {
    var data = object.exec.value
    var cache = {
      mechanism: 'session',
      type: 'module',
      key: 'test',
      value: '{ "wrong": "' + data + '" }'
    }

    app.caches.set(cache.mechanism, cache.type, cache.key, cache.value, '', 'json')
  },

  sessionset: function (object) {
    var parts = object.exec.value

    var key = parts[0]
    var json = {}

    function buildTree(obj, arr, i) {
      if (i >= arr.length) return
      var val = arr[i]

      // Case 1: Value is an array => handle as a nested structure and process its inner items.
      if (Object.prototype.toString.call(val) === '[object Array]') {
        buildTree(obj, val, 0)
        return
      }

      if (i === arr.length - 2) {
        var finalValue = arr[i + 1]
        var finalKey = val

        // If the last value contains bracketed pairs ([[k1][v1][k2][v2]]), extract them to build multiple key/value entries.
        if (typeof finalValue === 'string' && finalValue.indexOf('[') !== -1 && finalValue.indexOf(']') !== -1) {
          var extracted = app.element.extractBracketValues(finalValue)
          var nestedObj = {}

          // Ensure extracted items form valid key/value pairs (must be even count).
          if (extracted.length % 2 !== 0) {
            console.warn('Warning: Complex storage value has an odd number of elements. The last element ("' + extracted[extracted.length - 1] + '") will be ignored.')
            // Remove the last element to ensure safe pairing (k1, v1, k2, v2, ...)
            extracted.pop()
          }

          // The extracted list is flat key/value sequence: [key1, value1, key2, value2, ...].
          // Iterate through the extracted list, taking 2 elements at a time (key and value)
          for (var j = 0; j < extracted.length; j += 2) {
            var nestedKey = extracted[j]
            var nestedValue = extracted[j + 1]

            // If a value itself contains nested bracket arrays, extract them recursively.
            if (typeof nestedValue === 'string' && nestedValue.indexOf('[') !== -1 && nestedValue.indexOf(']') !== -1) {
              nestedValue = app.element.extractBracketValues(nestedValue)
            }

            nestedObj[nestedKey] = nestedValue
          }

          finalValue = nestedObj // Replace finalValue with the structured object created from bracket pairs.
        }

        obj[finalKey] = finalValue

      } else {
        // Intermediate path key: ensure it exists and continue recursion.
        if (!obj[val] || typeof obj[val] !== 'object') obj[val] = {}
        buildTree(obj[val], arr, i + 1)
      }
    }

    buildTree(json, parts, 1)
    sessionStorage.setItem(key, JSON.stringify(json))
    console.warn('Updated JSON:', json)
  },

  sessionupdate: function (object) {
    var parts = object.exec.value
    var key = parts[0]
    var valueToUpdate = parts[parts.length - 1]

    if (parts.length < 3) {
      console.error('Error: sessionupdate requires at least a key, a property to update, and a value.')
      return
    }

    var item = sessionStorage.getItem(key)
    if (!item) {
      console.warn('Warning: No session storage item found for key:', key)
      return
    }

    try {
      var json = JSON.parse(item)
      var current = json

      // Traverse the path to the second-to-last element.
      for (var i = 1; i < parts.length - 2; i++) {
        if (current[parts[i]] !== undefined && typeof current[parts[i]] === 'object') {
          current = current[parts[i]]
        } else {
          console.warn('Warning: Invalid path for update in session storage for key:', key)
          return
        }
      }

      var propertyToUpdate = parts[parts.length - 2]
      current[propertyToUpdate] = valueToUpdate
      sessionStorage.setItem(key, JSON.stringify(json))
      console.warn('Updated JSON after update:', json)
    } catch (e) {
      console.error('Error parsing session storage item for update:', e)
    }
  },

  sessionremove: function (object) {
    var parts = object.exec.value
    var key = parts[0]

    if (parts.length === 1) {
      // If only a key is provided, remove the entire session storage item.
      sessionStorage.removeItem(key)
      console.warn('Removed item with key:', key)
      return
    }

    // If a path is provided, remove a property from within the JSON object.
    var item = sessionStorage.getItem(key)
    if (!item) {
      console.warn('Warning: No session storage item found for key:', key)
      return
    }

    try {
      var json = JSON.parse(item)
      var current = json

      // Traverse the path to the second-to-last element.
      for (var i = 1; i < parts.length - 1; i++) {
        if (current[parts[i]] !== undefined && typeof current[parts[i]] === 'object') {
          current = current[parts[i]]
        } else {
          console.warn('Warning: Invalid path for removal in session storage for key:', key)
          return
        }
      }

      delete current[parts[parts.length - 1]]
      sessionStorage.setItem(key, JSON.stringify(json))
      console.warn('Updated JSON after removal:', json)
    } catch (e) {
      console.error('Error parsing session storage item:', e)
    }
  },

  sessionadd: function (object) {
    var parts = object.exec.value
    var unique = object.exec.unique
    var key = parts[0]
    var valueToAdd = parts[parts.length - 1]

    if (parts.length < 3) {
      return
    }

    var item = sessionStorage.getItem(key)
    var json

    try {
      // If item exists, parse it. Otherwise, start with an empty object.
      json = item ? JSON.parse(item) : {}
      var current = json

      // Traverse or create the path to the array.
      for (var i = 1; i < parts.length - 2; i++) {
        if (current[parts[i]] === undefined || typeof current[parts[i]] !== 'object') {
          current[parts[i]] = {} // Create nested object if it doesn't exist.
        }
        current = current[parts[i]]
      }

      var arrayKey = parts[parts.length - 2]

      // Ensure the target property is an array.
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = []
      }

      // Check if unique flag is set and if value already exists
      if (unique) {
        var valueExists = false
        for (var j = 0; j < current[arrayKey].length; j++) {
          if (current[arrayKey][j] === valueToAdd) {
            valueExists = true
            break
          }
        }
        if (valueExists) {
          console.warn('Warning: Value already exists in array. Skipping add.')
          return
        }
      }

      // Add the new value to the array.
      current[arrayKey].push(valueToAdd)

      sessionStorage.setItem(key, JSON.stringify(json))
      console.warn('Updated JSON after add:', json)
    } catch (e) {
      console.error('Error processing session storage item for add:', e)
    }
  }
}