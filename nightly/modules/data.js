'use strict'

app.module.data = {

  _intervalTimers: {},
  storageMechanism: 'window',
  storageType: 'module',
  storageKey: '',
  defaultInterval: 250,

  __autoload: function (options) {
    app.adf = this // Enable Ajax Data Form support using this module.
    this.module = options.name
  },

  bind: function (element) {
    var value = element.getAttribute('data-bind')
    dom.bind(element, value, 'data-bind')
  },

  bindpayload: function (object) {
    var value = object.exec.value.split(':'),
      element = object.exec.element,
      bind = element.elements[value[1]].value
    app.variables.update.attributes(element, value[0], bind, { reset: true, resetSoft: true, single: 'data-bindpayload' })
  },

  src: function (element) {
    var self = this,
      loader = element.getAttribute('data-loader'),
      src = element.getAttribute('data-src'),
      interval = element.getAttribute('data-interval')

    // Ensure element has a unique ID for timer tracking, but don't re-assign it.
    if (!element.uniqueId) dom.setUniqueId(element, true)

    // Stop making requests with unresolved variables.
    //if (src && /\{[^}]+\}/.test(src)) return

    // Force re-render on Back-Forward Cache restoration.
    /*if (!window._bfCacheListenerAdded) {
      window._bfCacheListenerAdded = true
      window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
          self.src(element)
        }
      })
    }*/

    // Stop re-fetching the same URL when the DOM is re-processed.
    //if (element._dataSrc === src) return
    //element._dataSrc = src

    if (loader) {
      dom.show(loader)
      dom.hide(element)
    }

    setTimeout(function () {
      try {
        app.xhr.currentAsset.total = 1
        self._handle(element)
        alert('handling')
        if (element.getAttribute('data-srcjoin')) {
          app.xhr.currentAsset.total = 2
          self._handle(element, true)
        }
      } catch (error) {
        app.log.error(0)(error)
        alert(error)
      }
    }, interval || this.defaultInterval)
  },

  _handle: function (element, join) {
    var attr = element.attributes,
      iterate = attr['data-iterate'],
      loader = attr['data-loader'],
      src = attr['data-src'],
      ttl = attr['data-ttl'],
      joinSuffix = join ? 'join' : '',
      options = {
        loader: loader && loader.value,
        iterate: iterate && iterate.value,
        element: element,
        attribute: join ? 'data-srcjoin' : 'data-src',
        storageKey: this.module + this._generateId(src.value) + joinSuffix,
        ttl: ttl && parseInt(ttl.value) || false
      }
    this._open(attr, options)
  },

  _open: function (attr, options) {
    var error = attr['data-onerror'],
      empty = attr['data-onempty'],
      header = attr['data-header'],
      loader = attr['data-loader'],
      beforesuccess = attr['data-onbeforesuccess'],
      success = attr['data-onsuccess'],
      aftersuccess = attr['data-onaftersuccess'],
      timeout = attr.timeout,
      target = attr.target,
      progresscontent = attr.progresscontent,
      srcEl = options.element

    if (options.ttl > 0) {
      var cache = app.caches.get('local', options.keyType, options.storageKey)
      var now = Date.now()

      if (cache) {
        if ((cache.expires && now < cache.expires) && options.ttl === cache.ttl) {
          app.log.info()('Cache hit')
          return this._run(options, cache)
        }

        // Cache expired.
        app.caches.remove('local', options.keyType, options.storageKey)
      }
    }

    app.xhr.request({
      url: attr[options.attribute].value,
      type: 'data',
      headers: header && header.value,
      target: target ? target.value : false,
      onload2: {
        run: {
          func: 'app.module.data._run',
          arg: options
        },
        timeout: (timeout) ? timeout.value : 0
      },
      global: {
        globalize: {
          iso639: 'iso639'
        }
      },
      cache: {
        mechanism: this.storageMechanism,
        format: 'json',
        keyType: this.storageType,
        key: options.storageKey,
        ttl: options.ttl
      },
      onprogress: { content: (progresscontent) ? progresscontent.value : '' },
      loader: loader && loader.value,
      error: error && error.value,
      empty: empty && empty.value,
      beforesuccess: beforesuccess,
      success: success && success.value,
      aftersuccess: aftersuccess,
      srcEl: srcEl
    })
  },

  _run: function (options, cache) {
    var responseData = cache ? cache : app.caches.get(this.storageMechanism, this.storageType, options.storageKey.replace('join', ''))
    var element = options.element,
      datamerge = element.getAttribute('data-merge'),
      datafilteritem = element.getAttribute('data-filteritem'),
      datareplace = element.getAttribute('data-replace'),
      datasort = element.getAttribute('data-sort'),
      databind = element.getAttribute('data-bind'),
      datastatus = element.getAttribute('data-status'),
      dataempty = element.getAttribute('data-onempty'),
      datasuccess = element.attributes['data-onsuccess'],
      selector = '*:not([data-iterate-skip])'

    if (responseData) {
      if (datamerge) {
        var responseDataJoin = app.caches.get(this.storageMechanism, this.storageType, options.storageKey.replace('join', '') + 'join')
        if (responseDataJoin)
          responseData = this._merge(responseData, responseDataJoin, datamerge)
      }

      if (datasuccess && responseData.status === 200) {
        app.call(datasuccess.value, { srcElement: element })
      }

      if (dataempty) {
        responseData.data.length === 0 ? dom.show(dataempty) : dom.hide(dataempty)
      }

      if (datafilteritem) {
        var datafilterkey = element.getAttribute('data-filterkey')
        responseData = this._filter(responseData.data, datafilteritem, datafilterkey)
      }

      if (datareplace) {
        this._replace(responseData.data, datareplace)
      }

      if (databind) {
        var test = databind.split(':'),
          realValue = app.element.getPropertyByPath(responseData.data, test[0]),
          target = app.element.select(test[1])
        app.element.set(target, realValue)
        app.element.onchange(target, 'data-bind')
      }

      if (datasort) {
        var datasortorder = element.getAttribute('data-sortorder')
        this._sort(responseData.data, datasort, datasortorder)
      }

      if (datastatus && responseData.status !== 200) { //Todo: Fix dynamic status.
        var status = datastatus.split(';')
        var el = status.length > 0 ? status[1] : status[0]
        if (el) dom.show(el)
      }

      this._traverse(options, responseData, element, selector)
    }
  },

  /**
   * @function _traverse
   * @desc Iterating over arrays in objects or selecting single objects as needed.
   * @private
   */
  _traverse: function (options, responseData, element, selector) {
    var iterate = options.iterate,
      responseObject = iterate === 'true' ? responseData.data : app.element.getPropertyByPath(responseData.data, iterate) || app.element.getPropertyByPath(responseData.data[options.k], iterate),
      total = iterate && responseObject.length - 1 || 0

    if (responseObject !== undefined) {
      if (!responseObject.length) {
        var keys = Object.keys(responseObject)
        if (keys) total = keys.length - 1 || 0
      }

      if (iterate) { // Iterate
        var originalNode = element,
          originalClonedNode = originalNode.cloneNode(true)

        originalNode.innerHTML = element.originalHtml

        var elementsSkip = originalNode.querySelectorAll('[data-iterate-skip]')

        // Remove elements that are skipped.
        for (var i = 0; i < elementsSkip.length; i++) {
          var skipElement = elementsSkip[i]
          skipElement.parentNode.removeChild(skipElement)
        }

        var originalNodeCountAll = app.element.find(originalNode, selector).length || 1,
          content = ''

        for (var i = 0; i <= total; i++) {
          content += i === 0 && elementsSkip.length > 0 ? originalClonedNode.innerHTML : originalNode.innerHTML
        }

        element.innerHTML = content

        var elements = app.element.find(element, selector)
        for (var i = 0, j = -1; i < elements.length; i++) {
          if (i % originalNodeCountAll === 0) j++

          var params = {
            keys: keys,
            fullObject: responseObject,
            data: responseData.data,
            index: j
          }

          this._process('data-set', elements[i], responseObject[j], params)
          this._process('data-get', elements[i], responseObject[j], params)
        }

        this._process('data-set', element, responseData.data)

      } else { // Select single.
        var elements = app.element.find(element, selector),
          arrayFromNodeList = [].slice.call(elements)

        arrayFromNodeList.push(element) // Support data-get on parent.

        for (var i = 0; i < arrayFromNodeList.length; i++) {
          var singleElement = arrayFromNodeList[i]
          // SCOPE: Ensure we aren't touching children with their own data-src
          if (this._isInScope(singleElement, element)) {
            this._process('data-set', singleElement, responseObject, { single: true })
            this._process('data-get', singleElement, responseObject, { single: true })
          }
        }
      }

      // Run element attributes after processing data.
      app.attributes.run(elements, false)

      // Support multiple iterates inside the same parent.
      var dataiterate = element.getAttribute('data-iterate')
      if (!dataiterate || dataiterate === 'true') {
        var iterateInside = app.element.find(element, '[data-iterate]')
        if (iterateInside) {
          var iterArray = iterateInside.length ? iterateInside : [iterateInside]
          for (var k = 0; k < iterArray.length; k++) {
            var childIterate = iterArray[k]
            if (!childIterate || !childIterate.getAttribute) continue

            var childOptions = {
              iterate: childIterate.getAttribute('data-iterate'),
              element: childIterate,
              k: k
            }

            this._traverse(childOptions, responseData, childIterate, selector)
          }
        }
      }
    }

    this._finish(options)
  },

  _isInScope: function (item, root) {
    if (item === root) return true
    var node = item.parentElement
    while (node && node !== root) {
      // Only block if a PARENT has these attributes, not the item itself
      if (node.hasAttribute('data-src') || node.hasAttribute('data-iterate')) return false
      node = node.parentElement
    }
    return node === root
  },

  /**
   * @function _runBefore
   * @memberof app.module.data
   * @private
   */
  _runBefore: function (run, el, callback) {
    var attributes = el.attributes
    for (var k = 0; k < attributes.length; k++) {
      var attr = attributes[k]
      if (attr.name.indexOf(run) === 0) {
        var value = attr.value,
          bindings = value ? value.split(';') : [],
          newReplaceValue
        for (var l = 0; l < bindings.length; l++) {
          var bindingParts = bindings[l].split(':'),
            replaceVariable = bindingParts[0].trim(),
            replaceValue = bindingParts[1].trim()

          switch (attr.name) {
            case 'bindglobal':
              newReplaceValue = app.element.getPropertyByPath(app.globals, replaceValue)
              break
            case 'bindquery':
              newReplaceValue = app.querystrings.get(false, replaceValue)
              break
            case 'bindvar':
              newReplaceValue = replaceValue
              break
            default:
              continue
          }

          app.variables.update.attributes(el, replaceVariable, newReplaceValue)
        }
      }
    }

    // Ensure callback is executed after processing
    if (typeof callback === 'function') callback()
  },

  _process: function (accessor, element, responseObject, options) {
    var self = this // Preserve reference to current context

    this._runBefore('bind', element, function () {
      var values = options && options.value ? options.value : element.getAttribute(accessor) || '',
        value = values.split(';')

      for (var i = 0; i < value.length; i++) {
        if (value[i]) {
          var test = value[i].split(':')

          if (test[1] && test[1][0] === '#') {
            app.element.set(app.element.select(test[1]), self._resolve(responseObject, test[0], options), false)
          } else if (test[1]) {
            app.variables.update.attributes(element, test[0], self._resolve(responseObject, test[1], options))
          } else {
            app.element.set(element, self._resolve(responseObject, test[0], options), false)
          }
        }
      }

      if (options && options.single) {
        app.element.onload(element, accessor)
      }
    })

    app.element.runOnEvent({ exec: { func: accessor, element: element } })
  },

  /**
   * @function _resolve
   * @desc Resolves property paths, supports root []. and lookup (key:val). syntax.
   * @private
   */
  _resolve: function (obj, value, options) {
    // 1. Support for (key:val).path lookup syntax
    if (value && value[0] === '(' && value.indexOf(').') !== -1) {
      var endP = value.indexOf(').'),
        cond = value.substring(1, endP).split('%'),
        data = (options && options.data) ? options.data : obj

      for (var i = 0; data && i < data.length; i++) {
        if (String(data[i][cond[0]]) === cond[1]) {
          return app.element.getPropertyByPath(data[i], value.substring(endP + 2))
        }
      }
      return ''
    }

    // 2. Original context-based resolution
    if (options) {
      var fullObject = options.fullObject,
        keys = options.keys,
        keyAtIndex = keys && keys[options.index]
      if (value.indexOf('[].') !== -1) { // Root level access.
        return app.element.getPropertyByPath(options.data, value.substring(3))
      } else if (value.indexOf('[*].') !== -1) {
        var key = value.replace(value.slice(-1) === '.' ? '[*].' : '[*]', keyAtIndex)
        return app.element.getPropertyByPath(fullObject, key)
      } else if (value === '[*]') {
        return keyAtIndex
      } else if (value[0] === '#') {
        return app.element.getPropertyByPath(fullObject, value.substring(1))
      }
    }

    // 3. Original Fallback: logic for OR (||) and AND (&&) paths
    var result,
      orPaths = value.split('||')

    for (var i = 0; i < orPaths.length; i++) {
      var andPaths = orPaths[i].trim().split('&&'),
        tempResult = []

      for (var j = 0; j < andPaths.length; j++) {
        var path = andPaths[j].trim(),
          tempObj = app.element.getPropertyByPath(obj, path)

        if (tempObj !== undefined && tempObj !== null) {
          tempResult.push(typeof tempObj === 'object' ? JSON.stringify(tempObj) : tempObj)
        } else {
          tempResult = []
          break
        }
      }

      if (tempResult.length === andPaths.length) {
        result = tempResult.join(' ')
        break
      }
    }

    return result
  },

  reqpatch: function (object) {
    if (object.exec) this._request('patch', object.exec.element)
  },

  reqpost: function (object) {
    if (object.exec) this._request('post', object.exec.element)
  },

  reqget: function (object) {
    if (object.exec) this._request('get', object.exec.element)
  },

  reqdelete: function (object) {
    if (object.exec) this._request('delete', object.exec.element)
  },

  _request: function (method, srcEl) {
    var attr = srcEl.attributes,
      headers = attr['data-header'],
      beforesuccess = attr['data-onbeforesuccess'],
      aftersuccess = attr['data-onaftersuccess'],
      success = attr['data-onsuccess'],
      error = attr['data-onerror'],
      loader = attr['data-loader'],
      empty = attr['data-onempty'],
      url = attr['data-req' + method]

    // Support header reference.
    if (headers && headers.value[0] === '#') {
      headers = app.element.select(headers.value).attributes['data-header']
    }

    // Support action attribute.
    if (srcEl && srcEl.localName === 'form') {
      url = attr['action']
      if (!url) return // Stop form if action is empty.
    }

    app.xhr.request({
      url: url.value,
      method: method,
      srcEl: srcEl,
      error: error && error.value,
      loader: loader && loader.value,
      empty: empty && empty.value,
      beforesuccess: beforesuccess,
      success: success && success.value,
      aftersuccess: aftersuccess,
      headers: headers && headers.value
    })
  },

  set: function (options) {
    if (options.exec) {
      var responseObject = options.options.response.data,
        element = options.exec.element,
        value = options.exec.value,
        attribute = options.options.srcAttribute
      this._process(attribute, element, responseObject, { single: true, value: value })
    }
  },

  _merge: function (response, responseJoin, merge) {
    var keys = merge.split(';')
    keys.forEach(function (key) {
      if (responseJoin.data.hasOwnProperty(key)) {
        response.data[key] = responseJoin.data[key]
      } else {
        console.warn('Missing key in responseJoin.data:', key)
      }
    })
    return { data: response.data, status: response.status }
  },

  _filter: function (response, item, key) {
    var parts = (item || '').split(';')
    var filteredResponse = response // Create a deep copy of the response

    var filterConditions = parts.map(function (part) {
      var subParts = (part || '').split(':')
      var keyValuePair = subParts.map(function (part) {
        return part.trim()
      })
      var filterKey = keyValuePair[0],
        filterValue = keyValuePair[1]

      if (filterValue[0] === "'" && filterValue[filterValue.length - 1] === "'") {
        filterValue = filterValue.slice(1, -1)
      }

      // Check if the filterValue is a boolean condition
      if (filterValue === 'true' || filterValue === 'false') {
        // Convert the filterValue to a boolean
        filterValue = filterValue === 'true'
      }

      return function (item) {
        return item[filterKey] === filterValue
      }
    })

    if (filteredResponse[key] && Array.isArray(filteredResponse[key])) {
      var filtered = filteredResponse[key].filter(function (item) {
        return filterConditions.every(function (condition) {
          return condition(item)
        })
      })

      // Update the key with the filtered data
      filteredResponse[key] = filtered
    }

    return { data: filteredResponse }
  },

  _replace: function (response) {
    // TODO: Hardcode to Softcode
    if (response.results && response.results.length) {
      response.results.forEach(function (result) {
        if (result.media_type === 'tv') {
          result.media_type = 'show'
        }
      })
    }

    return { data: response }
  },

  _sort: function (response, sortKey, sortOrder) {
    if (Array.isArray(response)) {
      return response.sort(function (a, b) {
        var valueA = app.element.getPropertyByPath(a, sortKey),
          valueB = app.element.getPropertyByPath(b, sortKey)

        return (typeof valueA === 'string')
          ? (sortOrder === 'desc' ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB))
          : (sortOrder === 'desc' ? valueB - valueA : valueA - valueB)
      })
    }
  },

  _generateId: function (str) {
    var hash = 0
    for (var i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0
    }
    return hash
  },

  _form: function (e) {
    var allowedTargets = ['_top', '_blank'],
      srcEl = e.srcElement,
      action = srcEl.getAttribute('action'),
      method = srcEl.getAttribute('method'),
      target = srcEl.getAttribute('target')

    if (allowedTargets.indexOf(target) === -1) {
      this._request(method, srcEl)
      e.preventDefault()
    }
  },

  _finish: function (options) {
    var element = options.element,
      finished = element.attributes['data-onfinish']
    if (finished) app.call(finished.value)
    if (options.loader) {
      dom.hide(options.loader)
      dom.show(options.element)
    }

    if (element._dataSrc) delete element._dataSrc

    app.element.runOnEvent({ exec: { func: 'data-onfinish', element: element } })
  }
}