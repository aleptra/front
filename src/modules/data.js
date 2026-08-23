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

  _pagingTarget: function (object) {
    if (object && object.exec) return object.exec.element || (object.options && object.options.element)
    return object && object.nodeType ? object : null
  },

  _pagingValue: function (object) {
    var value = object && object.exec ? object.exec.value : object
    if (Array.isArray(value)) value = value[0]
    return value
  },

  _registerPagingControl: function (element, object) {
    var control = object && object.options && object.options.srcElement
    if (!element || !control || control === element) return

    if (!element._dataPagingControls) element._dataPagingControls = []
    if (element._dataPagingControls.indexOf(control) === -1) {
      element._dataPagingControls.push(control)
    }
  },

  _registerPagingControls: function (element) {
    if (!element || !element.id || typeof document === 'undefined') return

    var target = '#' + element.id,
      controls = document.querySelectorAll('[click]')

    for (var i = 0; i < controls.length; i++) {
      var commands = controls[i].getAttribute('click').split(';')
      for (var j = 0; j < commands.length; j++) {
        var parts = commands[j].trim().split(':')
        if ((parts[0] === 'data-next' || parts[0] === 'data-previous' || parts[0] === 'data-goto') && parts[1] === target) {
          this._registerPagingControl(element, { options: { srcElement: controls[i] } })
          break
        }
      }
    }
  },

  _dispatchPagingEvent: function (element, event) {
    if (!element || !element.getAttribute) return

    var attribute = 'on' + event,
      callback = element.getAttribute(attribute)
    if (!callback) return

    // Accept the natural declarative values used by paging controls while
    // retaining Front's action names for all other callbacks.
    if (callback === 'disabled') callback = 'disable'
    if (callback === 'enabled') callback = 'enable'

    if (!element.executed) element.executed = {}
    if (callback === 'disable' || callback === 'enable') {
      app.call(callback, { srcElement: element, element: element })
    } else {
      app.element.runOnEvent({ exec: { func: event, element: element } })
    }
  },

  _updatePagingControls: function (element) {
    var paging = element && element._dataPaging
    if (!paging) return
    this._registerPagingControls(element)

    var targets = [element].concat(element._dataPagingControls || []),
      isFirstPage = paging.page === 1,
      isLastPage = paging.totalPages > 0 && !paging.hasNext

    for (var i = 0; i < targets.length; i++) {
      var target = targets[i],
        state = target._dataPagingBoundary || {}

      if (state.first !== isFirstPage) {
        this._dispatchPagingEvent(target, isFirstPage ? 'data-firstpage' : 'data-notfirstpage')
      }
      if (state.last !== isLastPage) {
        this._dispatchPagingEvent(target, isLastPage ? 'data-lastpage' : 'data-notlastpage')
      }

      target._dataPagingBoundary = { first: isFirstPage, last: isLastPage }
    }
  },

  _sourceOptions: function (element, join) {
    var attr = element && element.attributes,
      iterate = attr && attr['data-iterate'],
      loader = attr && attr['data-loader'],
      src = attr && attr['data-src'],
      ttl = attr && attr['data-ttl'],
      joinSuffix = join ? 'join' : ''

    if (!src) return null

    return {
      loader: loader && loader.value,
      iterate: iterate && iterate.value,
      element: element,
      attribute: join ? 'data-srcjoin' : 'data-src',
      storageKey: this.module + this._generateId(src.value) + joinSuffix,
      ttl: ttl && ttl.value
    }
  },

  _rerun: function (element) {
    var options = this._sourceOptions(element)
    if (!options) return

    var cache = app.caches.get(this.storageMechanism, this.storageType, options.storageKey)
    if (cache) return this._run(options, cache)

    element._dataSrc = null
    return this.src(element)
  },

  page: function (object) {
    if (!object || !object.exec) return object
    return this.goTo(this._pagingTarget(object), this._pagingValue(object), object)
  },

  pagesize: function (object) {
    if (!object || !object.exec) return object
    var element = this._pagingTarget(object),
      value = parseInt(this._pagingValue(object), 10)
    if (!element || isNaN(value) || value < 1) return
    element.setAttribute('data-pagesize', value)
    return this.goTo(element, 1, object)
  },

  next: function (object) {
    var element = this._pagingTarget(object)
    if (!element) return
    this._registerPagingControl(element, object)

    var paging = element._dataPaging,
      currentPage = paging ? paging.page : parseInt(element.getAttribute('data-page'), 10) || 1
    if (paging && !paging.hasNext) return paging
    return this.goTo(element, currentPage + 1, object)
  },

  previous: function (object) {
    var element = this._pagingTarget(object)
    if (!element) return
    this._registerPagingControl(element, object)

    var paging = element._dataPaging,
      currentPage = paging ? paging.page : parseInt(element.getAttribute('data-page'), 10) || 1
    if (currentPage <= 1) return paging || { page: 1 }
    return this.goTo(element, currentPage - 1, object)
  },

  'goto': function (object) {
    return this.goTo(this._pagingTarget(object), this._pagingValue(object), object)
  },

  goTo: function (element, page, object) {
    if (!element) return
    this._registerPagingControl(element, object)

    page = parseInt(page, 10)
    if (isNaN(page) || page < 1) page = 1

    var paging = element._dataPaging
    if (paging && paging.totalPages > 0) page = Math.min(page, paging.totalPages)
    element.setAttribute('data-page', page)
    return this._rerun(element)
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
      wait = element.getAttribute('data-wait') || this.defaultInterval

    // Ensure element has a unique ID for timer tracking, but don't re-assign it.
    if (!element.uniqueId) dom.setUniqueId(element, true)

    // Stop making requests with unresolved variables.
    if (src && /\{[^}]+\}/.test(src)) return

    // Stop re-fetching the same URL when the DOM is re-processed.
    if (element._dataSrc === src) return
    element._dataSrc = src
    element._dataLoaded = false

    // Force re-render on Back-Forward Cache restoration.
    if (!window._bfCacheListenerAdded) {
      window._bfCacheListenerAdded = true
      window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
          element._dataSrc = null
          self.src(element)
        }
      })
    }

    if (loader) {
      dom.show(loader)
      dom.hide(element)
    }

    app.wait(wait, function () {
      try {
        app.xhr.currentAsset.total = 1
        self._handle(element)
        if (element.getAttribute('data-srcjoin')) {
          app.xhr.currentAsset.total = 2
          self._handle(element, true)
        }
      } catch (error) {
        app.log.error(0)(error)
      }
    })
  },

  _handle: function (element, join) {
    var options = this._sourceOptions(element, join)
    if (options) this._open(element.attributes, options)
  },

  _open: function (attr, options) {
    var error = attr['data-onerror'],
      empty = attr['data-onempty'],
      header = attr['data-header'],
      credentials = attr['data-credentials'],
      loader = attr['data-loader'],
      beforesuccess = attr['data-onbeforesuccess'],
      success = attr['data-onsuccess'],
      aftersuccess = attr['data-onaftersuccess'],
      timeout = attr.timeout,
      target = attr.target,
      progresscontent = attr.progresscontent,
      srcEl = options.element

    var cache = app.caches.validate(options)
    if (cache) return this._run(options, cache)

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
      credentials: credentials && credentials.value === 'true',
      srcEl: srcEl
    })
  },

  _run: function (options, cache) {
    var responseData = cache ? cache : app.caches.get(this.storageMechanism, this.storageType, options.storageKey.replace('join', '')),
      selector = '*:not([data-iterate-skip])',
      element = options.element,
      rootData

    var datamerge = element.getAttribute('data-merge'),
      datafilteritem = element.getAttribute('data-filteritem'),
      datareplace = element.getAttribute('data-replace'),
      datasort = element.getAttribute('data-sort'),
      dataLimit = element.getAttribute('data-limit'),
      dataPage = element.getAttribute('data-page'),
      dataPagesize = element.getAttribute('data-pagesize'),
      dataLimitValue = dataLimit === null ? null : parseInt(dataLimit, 10),
      dataPageValue = dataPage === null ? null : parseInt(dataPage, 10),
      dataPagesizeValue = dataPagesize === null ? null : parseInt(dataPagesize, 10),
      databind = element.getAttribute('data-bind'),
      databindheader = element.getAttribute('data-bindheader'),
      datastatus = element.getAttribute('data-onstatus'),
      dataempty = element.getAttribute('data-onempty'),
      datanotempty = element.getAttribute('data-onnotempty'),
      datasuccess = element.attributes['data-onsuccess']

    if (dataLimitValue !== null && (isNaN(dataLimitValue) || dataLimitValue < 0)) dataLimitValue = null
    if (dataPageValue !== null && (isNaN(dataPageValue) || dataPageValue < 1)) dataPageValue = null
    if (dataPagesizeValue !== null && (isNaN(dataPagesizeValue) || dataPagesizeValue < 1)) dataPagesizeValue = null

    var pagingEnabled = dataPageValue !== null || dataPagesizeValue !== null

    if (responseData) {
      if (datasort || dataLimitValue !== null || pagingEnabled) responseData = this._cloneResponse(responseData)
      if (datamerge) {
        var responseDataJoin = app.caches.get(this.storageMechanism, this.storageType, options.storageKey.replace('join', '') + 'join')
        if (responseDataJoin)
          responseData = this._merge(responseData, this._cloneResponse(responseDataJoin), datamerge)
      }

      rootData = responseData.data

      if (datasuccess && responseData.status === 200 && cache) {
        app.call(datasuccess.value, { srcElement: element })
      }

      if (datafilteritem) {
        var datafilterkey = element.getAttribute('data-filterkey'),
          filteredResponse = this._filter(responseData.data, datafilteritem, datafilterkey)
        filteredResponse.status = responseData.status
        responseData = filteredResponse
      }

      if (datareplace) {
        this._replace(responseData.data, datareplace)
      }

      var dataPath = element.getAttribute('data-filterkey') ||
        (options.iterate && options.iterate !== 'true' ? options.iterate : '')
      if (datasort || dataLimitValue !== null || pagingEnabled) {
        responseData = this._transformCollection(
          responseData,
          dataPath,
          datasort,
          element.getAttribute('data-sortorder'),
          dataLimitValue,
          dataPageValue,
          dataPagesizeValue,
          element
        )
      } else {
        element._dataPaging = null
      }

      if (datafilteritem && !options.iterate) {
        var filteredData = element.getAttribute('data-filterkey')
          ? responseData.data[element.getAttribute('data-filterkey')]
          : responseData.data
        if (Array.isArray(filteredData) && filteredData.length === 1) {
          responseData.data = filteredData[0]
        }
      }

      if ((dataempty || datanotempty) && responseData.status === 200) {
        var filterKey = element.getAttribute('data-filterkey'),
          iterateKey = options.iterate,
          target = (filterKey && responseData.data[filterKey])
            || (iterateKey && iterateKey !== 'true' && responseData.data[iterateKey])
            || responseData.data,
          empty = !target || (Array.isArray(target) ? !target.length : (typeof target === 'object' ? !Object.keys(target).length : false))
        if (empty && dataempty) {
          app.call(dataempty, { srcElement: element })
        } else if (!empty && datanotempty) {
          app.call(datanotempty, { srcElement: element })
        }
      }

      if (databind) {
        var test = databind.split(':'),
          realValue = app.element.getPropertyByPath(responseData.data, test[0]),
          target = app.element.select(test[1])
        app.element.set(target, realValue)
        app.element.onchange(target, 'data-bind')
      }

      if (databindheader) {
        var test2 = databindheader.split(':'),
          realValue2 = responseData.headers[test2[0]],
          target2 = app.element.select(test2[1])
        app.element.set(target2, realValue2)
        app.element.onchange(target2, 'data-bindheader')
      }

      if (datastatus && responseData.status !== 200) {
        var parts = datastatus.split(')/'),
          code = parseInt(parts[0].replace('(', ''), 10),
          actions = parts[1]

        if (responseData.status === code && actions) {
          app.call(actions, { srcElement: element })
        }
      }

      element._dataLoaded = true
      options.dataRoot = rootData
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
      onkeyempty = options.onkeyempty,
      dataSource = element.getAttribute('data-src'),
      datafilteritem = !dataSource && element.getAttribute('data-filteritem'),
      datafilterkey = element.getAttribute('data-filterkey'),
      datasort = !dataSource && element.getAttribute('data-sort'),
      dataLimit = !dataSource && element.getAttribute('data-limit'),
      dataPage = !dataSource && element.getAttribute('data-page'),
      dataPagesize = !dataSource && element.getAttribute('data-pagesize'),
      dataLimitValue = dataLimit === null ? null : parseInt(dataLimit, 10),
      dataPageValue = dataPage === null ? null : parseInt(dataPage, 10),
      dataPagesizeValue = dataPagesize === null ? null : parseInt(dataPagesize, 10),
      context = options.dataContext !== undefined ? options.dataContext : responseData.data,
      dataRoot = options.dataRoot !== undefined ? options.dataRoot : responseData.data

    if (dataLimitValue !== null && (isNaN(dataLimitValue) || dataLimitValue < 0)) dataLimitValue = null
    if (dataPageValue !== null && (isNaN(dataPageValue) || dataPageValue < 1)) dataPageValue = null
    if (dataPagesizeValue !== null && (isNaN(dataPagesizeValue) || dataPagesizeValue < 1)) dataPagesizeValue = null

    var pagingEnabled = dataPageValue !== null || dataPagesizeValue !== null

    // Nested iterate elements can filter and transform the inherited response independently.
    // Source elements are transformed in _run before traversal begins.
    if (datafilteritem) {
      var filterContext = context
      if (datafilterkey && (!context || context[datafilterkey] === undefined) && dataRoot && dataRoot[datafilterkey] !== undefined) {
        filterContext = dataRoot
      }
      context = this._filter(filterContext, datafilteritem, datafilterkey).data
    }

    if (datasort || dataLimitValue !== null || pagingEnabled) {
      var localPath = datafilterkey || (iterate && iterate !== 'true' ? iterate : ''),
        localResponse = this._transformCollection(
          this._cloneResponse({ data: context }),
          localPath,
          datasort,
          element.getAttribute('data-sortorder'),
          dataLimitValue,
          dataPageValue,
          dataPagesizeValue,
          element
        )
      context = localResponse.data
    } else if (!dataSource) {
      element._dataPaging = null
    }

    var responseObject = iterate === 'true'
      ? context
      : app.element.getPropertyByPath(context, iterate) || app.element.getPropertyByPath(responseData.data[options.k], iterate) || app.element.getPropertyByPath(dataRoot, iterate),
      total = iterate && responseObject && responseObject.length - 1 || 0

    // Fire data-onkeyempty when the resolved key is missing or has no items.
    if (onkeyempty && (!responseObject || responseObject.length === 0)) {
      app.call(onkeyempty, { srcElement: element })
    }

    if (responseObject !== undefined) {
      if (!responseObject.length) {
        var keys = Object.keys(responseObject)
        if (keys) total = keys.length - 1 || 0
      }

      if (iterate) { // Iterate
        var originalNode = element,
          originalClonedNode = originalNode.cloneNode(true)

        originalNode.innerHTML = options.originalHtml !== undefined ? options.originalHtml : element.originalHtml

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
      app.attributes.run(elements, ['data-get', 'data-set', 'data-src'])

      // Process nested iterates in the context of each parent item.
      var iterateInside = app.element.find(element, '*[data-iterate]')
      if (iterateInside && iterateInside.length) {
        var iterArray = [],
          nestedTemplates = originalClonedNode && originalClonedNode.querySelectorAll('*[data-iterate]'),
          nestedTemplateByName = {},
          nestedIndexByName = {}

        // Only process the nearest nested iterates here. Deeper levels are handled
        // recursively when their immediate parent iterate is processed.
        for (var k = 0; k < iterateInside.length; k++) {
          var candidate = iterateInside[k],
            ancestor = candidate.parentElement,
            nested = false

          while (ancestor && ancestor !== element) {
            if (ancestor.hasAttribute('data-iterate')) {
              nested = true
              break
            }
            ancestor = ancestor.parentElement
          }

          if (!nested) iterArray.push(candidate)
        }

        if (nestedTemplates) {
          for (var k = 0; k < nestedTemplates.length; k++) {
            var templateName = nestedTemplates[k].getAttribute('data-iterate')
            if (nestedTemplateByName[templateName] === undefined) {
              nestedTemplateByName[templateName] = nestedTemplates[k].innerHTML
            }
          }
        }

        for (var k = 0; k < iterArray.length; k++) {
          var childIterate = iterArray[k],
            childName = childIterate.getAttribute('data-iterate'),
            childIndex = nestedIndexByName[childName] || 0,
            childContext = childName === 'true'
              ? responseData.data
              : Array.isArray(responseObject) ? responseObject[childIndex] : responseObject

          nestedIndexByName[childName] = childIndex + 1

          if (childContext === undefined) continue

          this._traverse({
            iterate: childName,
            onkeyempty: childIterate.getAttribute('data-onkeyempty'),
            element: childIterate,
            k: k,
            dataContext: childContext,
            dataRoot: dataRoot,
            originalHtml: nestedTemplateByName[childName]
          }, responseData, childIterate, selector)
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
            replaceValue = bindingParts[1] ? bindingParts[1].trim() : null

          switch (attr.name) {
            case 'bindglobal':
              newReplaceValue = app.element.getPropertyByPath(app.globals, replaceValue)
              break
            case 'bindquery':
              newReplaceValue = app.querystrings.get(false, replaceValue)
              break
            case 'bindvar':
              if (!replaceValue) continue
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
        return obj !== undefined ? obj : (keys && keys[options.index])
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

    // Return empty string for null/undefined.
    if (result === undefined || result === null) result = ''
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
      credentials = attr['data-credentials'],
      csrf = attr['data-csrf'],
      loader = attr['data-loader'],
      empty = attr['data-onempty'],
      url = attr['data-req' + method]

    // Support header reference.
    if (headers && headers.value[0] === '#') {
      headers = app.element.select(headers.value).attributes['data-header']
    }

    // Auto-attach CSRF token from cookie
    var headerValue = headers && headers.value || ''
    if (csrf) {
      var csrfCookie = csrf.value || 'csrf_token'
      var csrfValue = app.module.storage._get('cookie', { exec: { value: csrfCookie, element: srcEl } })
      if (csrfValue) {
        headerValue = headerValue ? headerValue + ';X-CSRF-Token:' + csrfValue : 'X-CSRF-Token:' + csrfValue
      }
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
      credentials: credentials && credentials.value === 'true',
      loader: loader && loader.value,
      empty: empty && empty.value,
      beforesuccess: beforesuccess,
      success: success && success.value,
      aftersuccess: aftersuccess,
      headers: headerValue
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

  store: function (options) {
    if (!options.options || !options.options.response) return
    var response = options.options.response.data
    var value = options.exec && options.exec.value
    if (!value || !response) return

    // value = ['mechanism', 'key', 'responseField'] e.g. ['session', 'auth', 'token']
    var parts = Array.isArray(value) ? value : [value]
    if (parts.length < 3) return

    var mechanism = parts[0],
      storageKey = parts[1],
      responseKey = parts[2]

    var data = app.element.getPropertyByPath(response, responseKey)
    if (data === undefined) return

    var store = mechanism === 'local' ? localStorage : sessionStorage
    store.setItem(storageKey, typeof data === 'object' ? JSON.stringify(data) : data)
    try { app.listeners && app.listeners.dispatch && app.listeners.dispatch('storage-update', { mechanism: mechanism, key: storageKey }) } catch (e) { }
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

    var filterConditions = []
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim()
      if (!part) continue

      // Split on first colon only to preserve colons in values.
      var colonIndex = part.indexOf(':')
      if (colonIndex === -1) continue

      var filterKey = part.substring(0, colonIndex).trim()
      var filterValue = part.substring(colonIndex + 1).trim()

      // Strip surrounding quotes.
      if (filterValue.length >= 2 && filterValue[0] === "'" && filterValue[filterValue.length - 1] === "'") {
        filterValue = filterValue.slice(1, -1)
      }

      // Coerce booleans.
      if (filterValue === 'true' || filterValue === 'false') {
        filterValue = filterValue === 'true'
      }

      filterConditions.push({ key: filterKey, value: filterValue })
    }

    // Resolve target array — avoid mutating the cached response.
    var source = (key && response[key]) ? response[key] : response

    var result = Array.isArray(source) ? source.filter(function (item) {
      for (var i = 0; i < filterConditions.length; i++) {
        var cond = filterConditions[i]
        if (item[cond.key] != cond.value) return false
      }
      return true
    }) : source

    // Build a shallow copy of the response with filtered data.
    var filtered = {}
    if (key && response[key]) {
      for (var prop in response) {
        if (response.hasOwnProperty(prop)) filtered[prop] = response[prop]
      }
      filtered[key] = result
    } else {
      filtered = result
    }

    return { data: filtered }
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

  _cloneResponse: function (response) {
    if (!response) return response

    var copy = {}
    for (var prop in response) {
      if (response.hasOwnProperty(prop)) copy[prop] = response[prop]
    }

    if (response.data && typeof response.data === 'object') {
      try {
        copy.data = JSON.parse(JSON.stringify(response.data))
      } catch (e) {
        copy.data = response.data
      }
    }

    return copy
  },

  _transformCollection: function (response, path, sortKey, sortOrder, limit, page, pagesize, element) {
    var collection = path ? app.element.getPropertyByPath(response.data, path) : response.data,
      pagingEnabled = page !== null || pagesize !== null
    if (!Array.isArray(collection)) {
      if (element) element._dataPaging = null
      return response
    }

    collection = collection.slice()
    if (sortKey) this._sort(collection, sortKey, sortOrder)
    if (limit !== null) collection = collection.slice(0, limit)

    if (pagingEnabled) {
      page = page === null ? 1 : page
      pagesize = pagesize === null ? 10 : pagesize

      var totalItems = collection.length,
        totalPages = totalItems ? Math.ceil(totalItems / pagesize) : 0

      page = totalPages > 0 ? Math.min(page, totalPages) : 1
      if (element) element.setAttribute('data-page', page)

      var start = totalItems ? (page - 1) * pagesize + 1 : 0,
        offset = totalItems ? start - 1 : 0,
        pagedCollection = collection.slice(offset, offset + pagesize)

      if (element) {
        element._dataPaging = {
          page: page,
          pageSize: pagesize,
          totalItems: totalItems,
          totalPages: totalPages,
          hasPrevious: page > 1,
          hasNext: totalPages > 0 && page < totalPages,
          start: start,
          end: totalItems ? start + pagedCollection.length - 1 : 0
        }
      }
      collection = pagedCollection
    } else if (element) {
      element._dataPaging = null
    }

    if (!path) {
      response.data = collection
      return response
    }

    var parts = path.split('.'), target = response.data
    for (var i = 0; i < parts.length - 1; i++) {
      if (!target || target[parts[i]] === undefined) return response
      target = target[parts[i]]
    }
    if (target) target[parts[parts.length - 1]] = collection
    return response
  },

  _sort: function (response, sortKey, sortOrder) {
    if (!Array.isArray(response)) return response

    if (String(sortKey).toLowerCase() === 'random') {
      for (var i = response.length - 1; i > 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1)),
          randomValue = response[i]
        response[i] = response[randomIndex]
        response[randomIndex] = randomValue
      }
      return response
    }

    return response.sort(function (a, b) {
      var valueA = app.element.getPropertyByPath(a, sortKey),
        valueB = app.element.getPropertyByPath(b, sortKey)
      return (typeof valueA === 'string')
        ? (sortOrder === 'desc' ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB))
        : (sortOrder === 'desc' ? valueB - valueA : valueA - valueB)
    })
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

    element._dataLoaded = true

    if (finished) app.call(finished.value, { srcElement: element })

    if (options.loader) {
      dom.hide(options.loader)
      dom.show(element)
    }

    if (element._dataSrc) delete element._dataSrc
    this._updatePagingControls(element)
    app.element.runOnEvent({ exec: { func: 'data-onfinish', element: element } })
  }
}