/**
 * @license
 * Copyright © 2020 Aleptra.
 * Josef Gabrielsson
 *
 * This source code is licensed under the MIT-style license found in the 
 * LICENSE file in the root directory of this source tree.
 *
 * This project is developed using ECMAScript 5 (2009) to ensure compatibility 
 * with older JavaScript engines while adhering to established standards.
 */

var dom = {
  _actionMap: {
    'trimleft': 'trim',
    'trimright': 'trim',
    'insertbeforebegin': 'insert',
    'insertafterbegin': 'insert',
    'insertbeforeend': 'insert',
    'insertafterend': 'insert',
    'setaction': 'set2',
    'settext': 'set2',
    'sethtml': 'set2',
    'sethref': 'set2',
    'setvalue': 'set2',
    'setid': 'set2',
    'setname': 'set2',
    'setsrc': 'set2',
    'bindvar': 'bind',
    'bindquery': 'bind',
    'bindasset': 'bind',
    'bindglobal': 'bind',
    'bindfield': 'bind',
    'ifafterbegin': 'if',
    'ifbeforeend': 'if',
    'resetvalue': 'reset',
    'togglevalue': 'toggle',
    'mapclass': 'map',
    'bold': 'apply',
    'cursor': 'apply',
    'margintop': 'apply',
    'marginbottom': 'apply',
    'marginleft': 'apply',
    'marginright': 'apply',
    'flexdirection': 'apply',
    'height': 'apply',
    'lineheight': 'apply',
    'padding': 'apply',
    'paddingtop': 'apply',
    'paddingbottom': 'apply',
    'paddingleft': 'apply',
    'paddingright': 'apply',
    'resize': 'apply',
    'width': 'apply',
    'wordbreak': 'apply',
    'whitespace': 'apply'
  },
  _eventMap: {
    'focus': 'focused',
    'click': 'clicked'
  },
  _uniqueId: 0,
  _bindfieldPos: 0,

  /**
   * @namespace parse
   * @memberof dom
   * @desc Object that contains functions for parsing strings and creating DOM nodes.
   */
  parse: {
    /**
     * @function attribute
     * @memberof dom.parse
     * @param {string} string - The string to parse.
     * @return {object} - An object containing key-value pairs parsed from the string.
     * @desc Parses a string into an object by splitting the string by ';' and then by ':'.
     */
    attribute: function (string) {
      var pairs = string ? string.split(';') : '',
        object = {}

      for (var i = 0; i < pairs.length; i++) {
        var keyValue = pairs[i].split(':'),
          key = keyValue[0],
          value = keyValue[1]

        object[key] = value
      }
      return object
    },

    /**
     * @function text
     * @memberof dom.parse
     * @param {string} string - The HTML string to parse.
     * @return {Node} - A DOM node representing the parsed HTML.
     * @desc Parses a string of HTML and return a DOM node.
    */
    text: function (string, exclude) {
      var el = document.createElement('spot'),
        html = string && string.match(/<html\s+([^>]*)>/i) || '',
        body = string && string.match(/<body\s+class="([^"]*)"/i) || '',
        doctype = string && string.match(/<!doctype\s+[^>]*>/i) || ''

      if (html) {
        var attributes = html[1].trim(),
          attributePairs = attributes.split(/\s+/)

        for (var i = 0; i < attributePairs.length; i++) {
          var pair = attributePairs[i].split('='),
            name = pair[0],
            value = pair[1].slice(1, -1)
          el.setAttribute(name, value)
        }
      }

      if (body) {
        el.className = body[1]
      }

      if (exclude) {
        var regexArray = exclude.map(function (tag) {
          return new RegExp('<' + tag + '[^>]*>[\\s\\S]*?</' + tag + '>', 'g')
        })

        for (var i = 0; i < regexArray.length; i++) {
          string = string.replace(regexArray[i], '')
        }
      }

      el.innerHTML = string
      el.doctype = doctype ? doctype[0] : ''

      return el
    },

    json: function (string) {
      try {
        string = { value: JSON.parse(string) }
      } catch (error) {
        string = {
          value: '',
          errorName: error.name,
          errorMessage: error.message
        }
      }
      return string
    }
  },

  /**
   * @function get
   * @memberof dom
   * @param {string} selector - The CSS selector used to select the elements.
   * @param {boolean} [list=undefined] - If true, always return a list of elements, even if only one element matches the selector.
   * @return {Element|Element[]} - Returns a single element if there is only one match and "list" is not set to true, or a list of elements if "list" is set to true or if there are multiple elements that match the selector.
   * @desc Retrieves elements from the document by selector.
   */
  get: function (selector, list) {
    var regex = /\[(\d+)\]/,
      match = selector && selector.match(regex)

    if (match) {
      var index = match[1],
        selector = selector.replace(regex, '')
    }

    var elements = document.querySelectorAll(selector)

    if (elements.length === 0)
      return ''
    else if (match)
      return elements[index]
    else
      return list ? elements : (elements.length === 1 ? elements[0] : elements)
  },

  /**
   * @function toggle
   * @memberof dom
   */
  toggle: function (el) {
    if (el.exec) el = el.exec.element
    var ontoggle = el.attributes.ontoggle && el.attributes.ontoggle.value,
      tag = el.localName,
      type = el.type

    if (!el.originalClassList) {
      el.originalClassList = [].slice.call(el.classList).join(' ')
    }

    var match = el.originalClassList.match(/(\S+)\s*_dn\b/)
    if (match) el.classList.toggle(match[0])

    if (ontoggle) {
      var normalize = ontoggle.replace(']', '').split('[')
      app.exec('app.element.' + normalize[0], { element: el, value: normalize[1] })
    }

    switch (tag) {
      case 'input':
        if (type === 'checkbox') el.value = el.checked === true ? '1' : '0'
        break
    }
  },

  /**
   * @function hide
   * @memberof dom
   */
  hide: function (object, prop) {
    if (object && object.exec) object = object.exec.element
    var el = object instanceof Object ? object : dom.get(object) // Todo: Remove in future.
    if (el) {
      value = prop ? 'visibility: hidden' : 'display: none'
      el.style.cssText = value + ' !important'
    }
  },

  /**
   * @function show
   * @memberof dom
   */
  show: function (object) {
    if (object.exec) object = object.exec.element
    var el = object instanceof Object ? object : dom.get(object) // Todo: Remove in future.
    if (el) {
      el.style.cssText = el.style.cssText.replace(/display\s*:\s*[^;]+;/gi, '')
      el.removeAttribute('hide')
    }
  },

  /**
   * @function apply
   * @memberof dom
   * @param {*} element 
   * @param {*} value 
   */
  apply: function (element, value) {

    if (element.exec) {
      test = element.exec.func
      value = element.exec.value
      element = element.exec.element
    } else {
      test = element.lastRunAttribute
    }

    var prefix = '',
      attr = test.replace(/(top|bottom|left|right)$/g, function (match) {
        return match.charAt(0).toUpperCase() + match.slice(1)
      })

    switch (attr) {
      case 'wordbreak':
        attr = 'wordBreak'
        break
      case 'whitespace':
        attr = 'whiteSpace'
        break
      case 'bold':
        attr = 'fontWeight'
        value = 'bold'
        break
      case 'resize':
        attr = 'resize'
        break
      case 'flex':
        attr = 'display'
        value = 'flex'
        break
      case 'flexdirection':
        attr = 'flexDirection'
        break
      case 'lineheight':
        attr = 'lineHeight'
        break
      default:
        // Extract the value and unit in the default case
        var regex = /^(\d+)([a-z%]*)$/,
          match = value.match(regex)

        if (match) {
          var numeric = parseFloat(match[1]), // Convert the value to a float
            unit = match[2] || 'px'
          value = numeric
          prefix = unit
        }
    }

    element.style[attr] = value + prefix
  },

  /**
   * @function bind
   * @memberof dom
   */
  bind: function (object, value) {
    var attr = object.lastRunAttribute,
      bindings = value.split(';')

    for (var i = 0; i < bindings.length; i++) {
      var binding = bindings[i].split(':'),
        replaceVariable = binding[0],
        replaceValue = binding[1]

      switch (attr) {
        case 'bindvar':
          var bindInclude = this.bind.include ? ';' + this.bind.include : '',
            binding = ((object.getAttribute('bindvar') || object.getAttribute('var')) || '') + bindInclude

          // Set variable if colon is presented or update innerhtml.
          var bindings = binding ? binding.split(';') : []

          for (var i = 0; i < bindings.length; i++) {
            var bindingParts = bindings[i].split(':') || [],
              replaceVariable = bindingParts[0].trim(),
              replaceValue = bindingParts.slice(1).join(':').trim()

            app.variables.update.content(object, replaceVariable, replaceValue, false)
            app.variables.update.attributes(object, replaceVariable, replaceValue, false)
          }

          return
        case 'bindquery':
          replaceValue = app.querystrings.get(false, replaceValue)
          break
        case 'bindglobal':
          var globals = replaceValue.indexOf('.') !== -1 ? app.globals : app // Todo: Remove when globals are moved.
          replaceValue = app.element.getPropertyByPath(globals, replaceValue)
          break
        case 'bindasset':
          var keys = replaceValue.split('.'),
            cache = app.caches.get('window', 'var', keys[0])
          app.log.info()('Binding asset: ' + keys)
          if (cache && cache.data) {
            var value = cache.data
            for (var j = 1; j < keys.length; j++) {
              if (value.hasOwnProperty(keys[j])) {
                value = value[keys[j]]
              } else {
                console.error('Key ' + keys[j] + ' does not exist on the value object')
                return
              }
            }

            replaceValue = value
          }
          break
        case 'bindfield':
          var type = object.tagName.toLowerCase(),
            binding = object.getAttribute('bindfield'),
            bindings = binding ? binding.split(';') : []

          for (var i = 0; i < bindings.length; i++) {
            var bindingParts = bindings[i].split(':') || [],
              replaceVariable = bindingParts[0],
              replaceValue = bindingParts[1]

            var target = dom.get(replaceValue),
              type = target.type,
              name = target.id || target.name,
              bindfieldif = target.attributes && target.attributes.bindfieldif

            var match = binding.match(new RegExp("([^:]+):[#.]" + name)),
              replaceVariableNew = match ? match[1] : '',
              fieldif = bindfieldif && bindfieldif.value.split(':')

            switch (type) {
              case 'text':
                if (object.listener !== object) {
                  this._bindfieldPos++
                  object.bindfieldPos = this._bindfieldPos
                  app.listeners.add(target, 'keyup', function (e) {
                    if ([9, 16, 17, 18, 20, 27, 37, 38, 39, 40, 91, 93].indexOf(e.keyCode) !== -1) return // Ignore keys.
                    target.startBind = true
                    if (fieldif && fieldif[1] !== target.lastPressedKey) {
                      target.startBind = false
                      target.lastPressedKey = false
                    }
                    if (target.startBind) {
                      app.variables.update.attributes(object, replaceVariableNew, this.value, true)
                      app.variables.update.content(object, replaceVariableNew, this.value)
                    }
                    if (target.startSubmit) {
                      var length = target.listeners['keyup'].length
                      if (object.bindfieldPos === length) {
                        app.call(target.startSubmit, { element: target })
                        target.startSubmit = false
                      }
                    }
                  })

                  object.listener = object
                }
                break
              case 'select-one':
                app.listeners.add(target, 'change', function () {
                  var value = this.options[this.selectedIndex].value
                  app.variables.update.attributes(object, replaceVariableNew, this.value, true, ['bind'])
                  app.variables.update.content(object, replaceVariableNew, value)
                })
                break
            }
          }
          continue
      }

      app.variables.update.attributes(object, replaceVariable, replaceValue, false)
      app.variables.update.content(object, replaceVariable, replaceValue, false)
    }
  },

  /**
   * @function submit
   * @memberof dom
   * @param {*} object 
   * @param {*} value 
   */
  submit: function (object, value) {
    var target = object.exec.value ? dom.get(object.exec.value) : value
    if (target) target.submit()
  },

  loader: function (object, value) {
    dom.hide(object)
    if (value) dom.show(value)
  },

  // Experimental
  dialog: function (object, value) {
    var dialog = document.getElementById("favDialog")
    if (dialog.open) {
      dialog.close()
    } else {
      dialog.showModal()
    }
  },

  /**
   * Displays a message in a dialog box.
   * @function alert
   * @memberof dom
   * @param {string} value - The message to display in the dialog box.
   */
  alert: function (object, value) {
    alert(object.exec.value || value)
  },

  /**
   * @function confirm
   * @memberof dom
   * @param {*} element 
   * @param {*} value 
   * @returns 
   */
  confirm: function (element, value) {
    if (element.exec) {
      value = element.exec.value
      element = element.exec.element
    }
    return confirm(element.getAttribute('confirmtext') || value || '')
  },

  /**
   * @function focus
   * @memberof dom
   * @param {*} element 
   * @param {*} value 
   */
  focus: function (element, value) {
    if (element.exec) {
      value = element.exec.value
      element = element.exec.element
    }
    if (element) element.focus()
  },

  /**
   * @function blur
   * @memberof dom
   */
  blur: function (element, value) {
    if (element.exec) element = element.exec.element
    var target = value ? dom.get(value) : element
    if (target) target.blur()
  },

  //Todo: Experimental
  scroll: function (element, value) {
    if (element.exec) element = element.exec.element
    var target = value ? dom.get(value) : element
    targetHeight = target.scrollHeight

    if (target.scrollTo) {
      target.scrollTo(0, targetHeight)
    } else {
      target.scrollTop = targetHeight
    }
  },

  /**
   * @function metadata
   * @memberof dom
   * @param {HTMLElement} object - The element object to modify.
   * @param {string} name - The name of the meta tag whose content will be retrieved.
   * @desc Retrieves metadata from a meta tag with the specified name and sets it as the inner HTML of the specified object.
   */
  metadata: function (object, name) {
    var value = dom.get('meta[name=' + name + ']')
    object.innerHTML = value.content
  },

  /**
   * @function setUniqueId
   * @memberof dom
   * @param {HTMLElement} element - The element to set the unique id on.
   * @desc Sets a unique id for the given element.
   */
  setUniqueId: function (element, internal) {
    this._uniqueId++
    var id = this._uniqueId
    if (!internal)
      element.id = 'id' + id
    else
      element.uniqueId = id
  },

  /**
   * @function doctitle
   * @memberof dom
   * @desc Sets the title of the application.
   */
  doctitle: function (object, value) {
    var title = object.exec ? object.exec.value : value
    if (title) {
      app.title = title
      document.title = title
    }
  },

  /**
   * @function set
   * @memberof dom
   * @param {Object} object - The element object to modify.
   * @param {string} value - The value to set as the content of the element.
   * @param {boolean} [strip=false] - If true, remove all HTML tags from the value before setting it as the content.
   * @desc Sets the content of an element.
  */
  set: function (object, value, strip, replace) {
    var target = object instanceof Object ? object : dom.get(object),
      value = strip ? value.replace(/<[^>]+>/g, '') : value || ''
    target.innerHTML = value
  },

  /**
   * @function uppercase
   * @memberof dom
   * @param {Object} object - The element object to modify.
   * @param {boolean} [first=false] - If true, only convert the first character to uppercase. Otherwise, convert the entire contents to uppercase.
   * @desc Converts the contents of an element to uppercase letters.
   */
  uppercase: function (object, first) {
    if (object.exec) object = object.exec.element
    object.innerHTML = !first || first === 'true' ? object.innerHTML.toUpperCase() : object.innerHTML.charAt(0).toUpperCase() + object.innerHTML.slice(1)
  },

  /**
   * @function lowercase
   * @memberof dom
   * @param {Object} object - The element object to modify.
   * @desc Converts the contents of an element to lowercase letters.
   */
  lowercase: function (object) {
    if (object.exec) object = object.exec.element
    object.innerHTML = object.innerHTML.toLowerCase()
  },

  /**
   * @function slice
   * @memberof dom
   * @param {Object} object - The element object to modify.
   * @param {string} value - A string representing the start and end indices of the slice.
   * @desc Slices the content of an element and replaces it with the sliced portion.
   */
  slice: function (object, value) {
    var values = value.replace(/\s+/g, '').split(',')
    object.innerHTML = object.innerHTML.slice(values[0], values[1])
  },

  /**
   * @function trim
   * @memberof dom
   * @param {Object} object - The element object to modify.
   * @param {string} value - A string representing the type of trim operation to perform ('left', 'right', or undefined).
   * @desc Trims chars from the content of an element.
   */
  trim: function (element, value) {
    var regex, attr, char

    if (element.exec) {
      attr = element.exec.func
      char = element.exec.value || ' '
      element = element.exec.element
    } else {
      attr = element.lastRunAttribute
      char = value || ' '
    }

    switch (attr) {
      case 'trimleft':
        regex = '^[' + char + '\\t]+'
        break
      case 'trimright':
        regex = '[' + char + '\\t]+$'
        break
      default:
        regex = '^[' + char + '\\t]+|[' + char + '\\t]+$'
    }

    app.element.set(element, app.element.get(element).replace(new RegExp(regex, 'g'), ''))
  },

  escape: function (element) {
    if (element.exec) {
      element = element.exec.element
    }

    var escape = app.element.get(element),
      code = escape.charCodeAt(0)

    if (0xD800 <= code && code <= 0xDBFF) {
      low = escape.charCodeAt(1)
      code = ((code - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
    }

    if (code) app.element.set(element, '&#' + code + ';')
  },

  insert: function (object, value) {
    var insert
    if (object.exec) {
      value = object.exec.value
      insert = object.exec.func
      object = object.exec.element
    } else {
      insert = object.lastRunAttribute
    }

    var tag = object.localName,
      state = object.attributes.statevalue,
      insert = insert.replace('insert', '')

    var normal = insert === '2' ? value : '',
      afterbegin = insert === 'afterbegin' ? value : '',
      beforeend = insert === 'beforeend' ? value : ''

    if (state) state.value += value

    if (afterbegin || beforeend || normal) {
      switch (tag) {
        case 'input':
          object.value = afterbegin + object.value + beforeend
          app.listeners.change('input', object, false)
          break
        case 'img':
          var src = object.getAttribute('src')
          if (src) object.src = afterbegin + src + beforeend
          break
        case 'a':
          object.href = afterbegin + object.href + beforeend
          break
        case 'select':
          object.setAttribute('select', value)
          break
        default:
          object.textContent = afterbegin + object.textContent + beforeend
      }
    } else {
      object.insertAdjacentText(insert, value)
    }
  },

  /**
   * @function map
   * @memberof dom
   */
  map: function (object, value) {
    var object = typeof object === 'string' ? dom.get(object) : object,
      cache = app.caches.get('window', 'var', 'enum')
    object.classList = cache.data[value] || ''
  },

  set2: function (object, value) {
    var attr
    if (object.exec) {
      value = object.exec.value
      attr = object.exec.func
      object = object.exec.element
    } else {
      attr = object.lastRunAttribute
    }

    app.element.set(object, value, attr)
    app.element.onchange(object, attr)

    switch (object.localName) {
      case 'input':
        app.listeners.change('input', object, false)
        break
    }
  },

  replace: function (object, value) {
    this.insert(object, value)
  },

  reset: function (object, value) {
    if (object.exec) {
      object = object.exec.element
    }

    var tag = object.localName,
      stateValue = object.attributes.statevalue
    switch (tag) {
      case 'form':
        object.reset()
        break
      case 'input':
        object.value = object.defaultValue
        stateValue ? stateValue.value = object.defaultValue : false
        app.listeners.change('input', object, false)
        break
    }
  },

  /**
   * @function remove
   * @memberof dom
   */
  remove: function (object) {
    var target = object.exec ? object.exec.element : object
    if (target) target.remove()
  },

  format: function (object, value) {
    var tag = object.localName,
      stateValue = object.textContent

    if (object.clicked) {
      value = object.value
      object = object.clicked
      tag = object.localName
      stateValue = object.attributes.statevalue
    }

    switch (value) {
      case 'compute':
        regex = /([=+\-*/])(?=[=+\-*/])/
        break
    }

    switch (tag) {
      case 'input':
        stateValue.value = stateValue.value.replace(new RegExp(regex, 'g'), '')
        break
    }
  },

  sanitize: function (object, value) {
    var regex = value
    if (object.exec) {
      regex = object.exec.value
      object = object.exec.element
    }

    object.value = object.value.replace(new RegExp(regex, 'g'), '')
  },

  /**
   * 
   * @param {*} object 
   * @param {*} value 
   */
  split: function (object, value) {
    var parts = value.split(';'),
      pattern = parts[0],
      index = parts[1]

    dom.set(object, object.innerHTML.split(pattern)[index])
  },

  /**
   * @function log
   */
  log: function (object, value) {
    console.log(value || object.exec.value)
  },

  /**
   * @function select
   * @param {*} object 
   * @param {*} value
   */
  select: function (object, value) {
    var target = object
    if (object.exec) {
      target = object.exec.element,
        value = object.exec.value
    }
    value = value.split(',')
    if (target) target.setSelectionRange(value[0], value[1])
  },

  /**
   * @function include
   * @memberof dom
   * @param {Object} element - The element to which the external content will be added.
   * @desc * Loads the content of an external file and insert it into the DOM.
   */
  include: function (element) {

    //@TODO Fix ie bug with reversed attributes.
    var bindvar = element.attributes.bindvar
    if (bindvar) dom.bind.include = bindvar.value
    app.xhr.request({
      element: element,
      url: element.attributes.include.value,
      onload: {
        run: {
          func: 'app.attributes.run',
          arg: '#' + element.id + ' *'
        }
      }
    })
  },

  // TODO: Finish
  if: function (object, value) {
    var attr = object.lastRunAttribute
    var value = value.split(';')
    var condition1 = value[0]
    var test = value[1].split(':'),
      newAttr = test[0],
      newValue = test[1]
    var currentAttr = app.element.get(object, newAttr)
    if (condition1) {
      switch (attr) {
        case 'ifbeforeend':
          app.element.set(object, currentAttr + newValue, newAttr)
          break
      }
    }
  },

  bindif: function (object, options) {
    var test = object.value,
      test2 = test.split(';')

    var parts = test2[0].split(':'),
      target = dom.get(parts[0]),
      condition = test2[1],
      type = target.type

    switch (type) {
      case 'text':
        if (target.value === parts[1]) {
          //var identifier = condition.match(/([^[]+)\[(\S+)\]/)
          //app.call(identifier[1], { clicked: object, value: identifier[2] })
        }
        break
      case 'select-one':
        app.listeners.add(target, 'change', function () {
          var value = this.options[this.selectedIndex].value
        })
        break
    }

    return true
  },

  /**
   * @function stop
   * @memberof dom
   * @param {HTMLElement} element - The parent element whose children will be processed.
   * @param {string} value
   * @param {Array<string>} exclude - An array of attribute names to exclude from the 'stop' attribute value.
   */
  stop: function (element, value) {
    var exclude = ['stop', 'bind'],
      children = element.childNodes
    for (var i = 0; i < children.length; i++) {
      var child = children[i]
      if (child.nodeType === 1) { // Check if it's an element node
        var existingAttributes = child.attributes,
          stopValueArray = []

        // Concatenate existing attribute names to the stopValueArray, excluding specified attributes
        for (var j = 0; j < existingAttributes.length; j++) {
          var attr = existingAttributes[j],
            name = dom._actionMap[attr.name] || attr.name
          if (exclude.indexOf(name) === -1) {
            stopValueArray.push(name)
          }
        }

        // Join the stopValueArray with semicolons and set the 'stop' attribute with the resulting string
        var stopValue = stopValueArray.join(';')
        child.setAttribute('stop', stopValue)
      }
    }
  },

  /**
   * @function start
   * @memberof dom
   */
  start: function (element) {
    element.removeAttribute('stop')
    var children = element.childNodes
    for (var i = 0; i < children.length; i++) {
      var child = children[i]
      if (child.nodeType === 1) { // Check if it's an element node
        child.removeAttribute('stop')
        this.start(child) // Recursively remove 'stop' attribute from child's children
      }
    }
  },

  stopif: function (element, value) {
    var elementValue = element.innerHTML || '',
      values = value.split(':'),
      condition = values[0],
      attributes = values[1].split(';')

    if (elementValue === condition) {
      for (var i = 0; i < attributes.length; i++)
        element.removeAttribute(attributes[i])
    }
  },

  callif: function (element, value) {
    var elementValue = element.innerHTML || '',
      values = value.split(':'),
      condition = values[0],
      attributes = values[1].split(';')

    if (elementValue === condition) {
      alert('hej')
    }
  },

  var: function (element, value) {
    if (element.localName === 'script') return
  },

  iterate: function (element, value) {
    dom.stop(element) // Stop all attributes in element .
    var values = value.split(';'),
      start = parseInt(values[0]),
      stop = parseInt(values[1]),
      varName = values[2],
      originalNode = element,
      content = ''

    originalNode.innerHTML = element.originalHtml

    for (var i = start; i <= stop; i++) {
      var innerHtml = originalNode.innerHTML,
        regex = new RegExp('\\{' + varName + '\\}', 'g')

      innerHtml = innerHtml.replace(regex, i) // Todo: Use a function. app.varibales
      content += innerHtml
    }

    element.innerHTML = content

    var elements = app.element.find(element, '*')
    app.attributes.run(elements)
  },

  /*await: function (element, value) {
    if (value) app.await[value] = { element: element, value: value, enable: true }
  }*/

  rerun: function (object) {
    var el = object.exec ? object.exec.element : object
    el.innerHTML = el.originalHtml
    var target = el.id ? '#' + el.id : [el]
    if (target) {
      app.attributes.run(target, false, true)
    }
  },

  reload: function (object, value) {
    dom.get(value).contentDocument.location.reload(true)
  }
}

var app = {
  version: { major: 1, minor: 0, patch: 0, build: 272 },
  module: {},
  plugin: {},
  var: {},
  language: document.documentElement.lang || 'en',
  docMode: document.documentMode || 0,
  isFrontpage: document.doctype ? true : false,
  srcDocTemplate: '',
  srcTemplate: [],
  isLocalNetwork: /localhost|127\.0\.0\.1|::1|\.local|^$/i.test(location.hostname),
  spa: false,
  vars: { total: 0, totalStore: 0, loaded: 0 },
  modules: { total: 0, loaded: 0 },
  await: {},

  /**
   * @namespace load
   * @memberof app
   * @desc
   */
  load: function () {
    if (!window.frontLoaded) {
      app.disable(true)
      // TODO: Experimental feature
      if (app.isLocalNetwork) {
        var selector = 'script[src*=front]',
          element = dom.get(selector),
          config = app.config.get(false, { frontSrcLocal: '' }, element)
        if (config.frontSrcLocal.length > 0) {
          element.remove()

          var script = document.createElement('script'),
            attributes = element.attributes
          for (var i = 0; i < attributes.length; i++) {
            script.setAttribute(attributes[i].name, attributes[i].value)
          }

          script.src = config.frontSrcLocal // Override front.js.
          document.head.appendChild(script)
        }
      }

      window.addEventListener('load', app.start)
      window.frontLoaded = true
    }
  },

  disable: function (bool) {
    var val = bool ? 'hidden' : 'initial',
      isURI = (document.documentURI || document.location.href).indexOf('data:') !== 0 // Stops iframes.
    if (isURI) document.documentElement.style.cssText = 'visibility:' + val
  },

  /**
   * @namespace start
   * @memberof app
   * @desc
   */
  start: function () {
    var selector = 'script[src*=front]',
      element = dom.get(selector),
      value = element.attributes.src.value

    app.script = {
      element: element,
      path: (value.match(/^(.*\/)[^/]+$/) || ['', ''])[1],
      selector: selector
    }

    app.config.set()
    app.assets.set(element.attributes)
    app.xhr.start()
    app.assets.load()

    app.listeners.add(document, 'submit', function (e) {
      app.element.onsubmit(e)
    })

    app.listeners.add(document, 'keydown', function (e) {
      var link = app.element.getTagLink(e.target) || e.target,
        click = link.attributes.click
      switch (e.key) {
        case 'Tab':
          var tab = link.attributes.ontabchange
          if (tab) {
            var val = click ? click.value : tab.value
            app.call(val, { element: link })
          }
          break
        case 'Enter':
          var submit = link.attributes.onsubmit
          if (submit) {
            var val = submit.value.split(':')
            link.startSubmit = val[0]
          }
          break
      }
      link.lastPressedKey = e.key
    })

    app.listeners.add(document, 'click', function (e) {
      var link = app.element.getTagLink(e.target) || e.target,
        click = link.attributes.click,
        onclickif = link.attributes.onclickif

      if (onclickif) {
        var ret = app.call(onclickif.value, { element: link })[0]
        if (!ret) return
      }

      if (click) {
        var clicktargetfield = link.attributes.clicktargetfield,
          target = clicktargetfield && clicktargetfield.value.split(':') || ''
        //,
        //element = target && dom.get(target[0]) || element

        /* element.lastRunAttribute = val[0]
         element.targetAttribute = target && target[1]
         element.targetField = clicktargetfield
         element.clicked = element*/
        app.call(click.value, { srcElement: link, element: dom.get(target[0]) })
        app.element.runevent({ exec: { func: 'click', element: link } })
      }
    })

    app.listeners.add(document, 'mouseover', function (e) {
      var link = app.element.getTagLink(e.target) || e.target,
        mouseover = link.attributes.mouseover,
        onmouseoverif = link.attributes.onmouseoverif

      if (onmouseoverif) {
        var ret = app.call(onclickif.value, { element: link })[0]
        if (!ret) return
      }

      if (mouseover) {
       var mouseovertargetfield = link.attributes.mouseovertargetfield,
          target = mouseovertargetfield && mouseovertargetfield.value.split(':') || ''
        app.call(mouseover.value, { srcElement: link, element: dom.get(target[0]) })
        //app.element.runevent({ exec: { func: 'click', element: link } })*/
      }
    })

    // Listen for all input fields.
    app.listeners.add(document, 'input', function (e) {
      app.listeners.change('input', e.target, false, e)
    })
  },

  /**
   * @namespace call
   * @memberof app
   * @desc Parses and executes a series of commands based on a string input.
   */
  call: function (run, options) {
    var execResult = [],
      runArray = run && run.split(';')

    for (var i = 0; i < runArray.length; i++) {
      var string = runArray[i],
        parts = string.split(":"),
        func = parts[0],
        element1 = parts[1] && (parts[1][0] === "#" || parts[1][0] === "*") && (parts[1].split('.') || [])[0],
        element2 = parts[2] && (parts[2][0] === "#" || parts[2][0] === "*") && (parts[2].split('.') || [])[0],
        attribute1 = element1 && (parts[1].split('.') || [])[1],
        attribute2 = element2 && (parts[2].split('.') || [])[1],
        value = string.substring(string.indexOf('[') + 1, string.lastIndexOf(']'))

      var objElement1 = options && options.element ? options.element : element1 === '#' || !element1 ? options && options.srcElement : dom.get(element1.replace('*', '')),
        objElement2 = element2 === '#' ? options && options.srcElement : dom.get(element2),
        attribute1Type = attribute1 ? attribute1 : app.element.get(objElement1, false, true),
        attribute2Type = attribute2 ? attribute2 : app.element.get(objElement2, false, true),
        value = objElement2 && attribute2 ? app.element.get(objElement2, attribute2) : (objElement2 ? app.element.get(objElement2) : value === '' ? app.element.get(objElement1, attribute1) : value)

      // Return the parsed object
      parsedCall = {
        func: func,
        element: objElement1 || false,
        subElement: objElement2 || false,
        attribute: attribute1Type || false,
        hasAttribute: !!attribute1,
        hasSubAttribute: !!attribute2,
        subAttribute: attribute2Type || false,
        value: value === undefined ? false : value
      }

      var run = dom._actionMap[func] || func

      if (run.indexOf('--') !== -1) {
        var plugin = run.split('--')
        run = 'app.plugin.' + plugin[0] + '.' + plugin[1]
      } else if (run.indexOf('-') !== -1) {
        var module = run.split('-')
        run = 'app.module.' + module[0] + '.' + module[1]
      } else {
        run = 'dom.' + run
      }

      var exec = this.exec(run, { exec: parsedCall, options: options })
      execResult.push(exec)
    }

    return execResult
  },

  exec: function (run, args) {
    try {
      run = run.split('.')
      switch (run.length) {
        case 4:
          return window[run[0]][run[1]][run[2]][run[3]](args)
        case 3:
          return window[run[0]][run[1]][run[2]](args)
        case 2:
          return window[run[0]][run[1]](args)
      }
    } catch (e) {
      if (e.message.indexOf('run[0]') !== -1) console.error('Command not found', run)
      if (e.message.indexOf('object.exec') !== -1) console.error('Could not execute command', run)
    } finally {
      app.element.runevent(args) // check for element events.
    }
  },

  click: function (el, dbl) {
    var event, eventName = dbl ? 'dblclick' : 'click'
    try {
      event = new CustomEvent(eventName, { bubbles: true, cancelable: true })
    } catch (e) {
      // Fallback for older browsers.
      event = document.createEvent('HTMLEvents')
      event.initEvent(eventName, true, true)
    }

    el.dispatchEvent(event)
  },

  /**
   * @namespace element
   * @memberof app
   * @desc
   */
  element: {
    _propertyMap: {
      'input': 'value',
      'textarea': 'value',
      'progress': 'value',
      'select': 'value',
      'audio': 'src',
      'embed': 'src',
      'img': 'src',
      'video': 'src',
      'source': 'src',
      'script': 'src',
      'track': 'src',
      'iframe': 'src',
      'area': 'href',
      'base': 'href',
      'link': 'href',
      'object': 'data',
      'applet': 'code',
      'meta': 'content',
      'optgroup': 'label'
    },

    get: function (element, attrValue, attrName) {
      if (element) {
        if (attrValue) return element.attributes[attrValue].value // Return attribute value.
        var target = element.targetAttribute || ''
        if (target) return element.attributes[target].value
        var property = this._propertyMap[element.localName] || 'textContent'
        if (attrName) return property // Return attribute name.
        return element[property]
      }
    },

    set: function (element, value, attr) {
      attr = element.exec ? element.attribute : attr,
        type = element.type,
        localName = element.localName

      if (attr) {
        attr = attr.replace('set', '')
        switch (attr) {
          case 'text':
            element.textContent = value
            break
          case 'html':
            if (localName === 'iframe') {
              var encoded = encodeURIComponent(value),
                data = 'data:text/html;charset=utf-8,' + encoded
              element.src = data
            } else {
              element.innerHTML = value
            }
            break
          case 'value':
            element.setAttribute('value', value)
            element.value = value
            break
          default:
            element.setAttribute(attr, value)
        }
        return
      }

      switch (type) {
        case 'checkbox':
          element.checked = value === 'true' ? true : false
          break
        default:
          var property = this._propertyMap[localName] || 'textContent'
          element[property] = value
      }
    },

    add: {
      style: function (options) {
        var _ = this._(options, ':')
        _.el.style[action[0]] = _.action[1]
      },

      class: function (options) {
        var _ = this._(options, ' ')
        for (var i = 0; i < _.action.length; i++) {
          _.el.classList.add(_.action[i])
        }
      }
    },

    toggle: {
      class: function (options, value) {
        var el = options.element,
          value = options.value

        var classes = value.split(' ')
        for (var i = 0; i < classes.length; i++) {
          el.classList.toggle(classes[i])
        }
      }
    },

    /**
     * @function find
     * @memberof app
     * @param {Node} node - The node to search within.
     * @param {string} selector - The CSS selector used to select the elements.
     * @return {Element|Element[]} - Returns a single element if there is only one match, or a list of elements if there are multiple elements that match the selector.
     * @desc Retrieves elements from a given node by selector.
     */
    find: function (node, selector) {
      var element = node.querySelectorAll(selector)
      return element.length === 1 && selector[0] !== '*' ? element[0] : element
    },

    /**
     * @function getTagLink
     * @memberof app
     * @param {Element} element - The element to start the search from.
     * @return {Element|null} The found anchor element, or `null` if none was found.
     * @desc Finds the first ancestor of the given element that is an anchor element (`<a>`).
     */
    getTagLink: function (element) {
      for (var current = element; current; current = current.parentNode) {
        var type = current.localName
        if (type === 'a' || type === 'button') return current
      }
      return null
    },

    /**
     * @function getPropertyByPath
     * @memberof app
     */
    getPropertyByPath: function (object, path) {
      var pathSegments = path && path.split('.') || [],
        value = object

      for (var i = 0; i < pathSegments.length; i++) {
        value = value === null || value === undefined ? '' : value[pathSegments[i]]
      }

      return value
    },

    runevent: function (parsedCall) {
      if (parsedCall.exec) {
        var func = dom._eventMap[parsedCall.exec.func] || parsedCall.exec.func,
          el = parsedCall.exec.element

        var call = el && el.getAttribute('on' + func)
        if (call) {
          app.call(call, parsedCall.exec)
        }
      }
    },

    /**
     * @function onchange
     * @memberof app
     */
    onchange: function (object, value) {
      if (value) {
        var onchange = object.getAttribute('on' + value.replace('set', '') + 'change')
        if (onchange) app.call(onchange, { srcElement: object })
      }
    },

    /**
     * @function onload
     * @memberof app
     * @desc Handles onload attributes for single elements or a NodeList.
     * @param {HTMLElement | NodeList} object - The element or NodeList to process.
     * @param {string} value - The attribute value to parse.
     */
    onload: function (object, value) {
      var elements = []

      if (object && object.nodeType) {
        elements.push(object)
      } else if (object.length !== undefined) {
        for (var i = 0; i < object.length; i++) {
          elements.push(object[i])
        }
      }

      var part1 = '', part2 = value

      if (value.indexOf('--') !== -1) {
        var plugin = value.split('--'),
          part1 = plugin[0] + '--',
          part2 = plugin[1]
      } else if (value.indexOf('-') !== -1) {
        var module = value.split('-'),
          part1 = module[0] + '-',
          part2 = module[1]
      }

      for (var j = 0; j < elements.length; j++) {
        var element = elements[j],
          onload = element.getAttribute(part1 + 'on' + part2 + 'load')
        if (onload) {
          app.call(onload, { srcElement: element })
        }
      }
    },

    /**
     * @function onsubmit
     * @memberof app
     */
    onsubmit: function (e) {
      if (app.adf) app.adf._form(e)
      var srcEl = e.srcElement,
        attr = srcEl.getAttribute('onformsubmit'),
        submit = attr && attr.split(';')
      for (action in submit) {
        app.call(submit[action], { element: srcEl })
      }
    }
  },

  /**
   @namespace log
   @memberof app
   @desc Object that contains functions for logging information and errors to the console.
   */
  log: {

    /**
     * @function info
     * @memberof app.log
     * @returns {function} - The console.info() function or a no-op function if app.debug is not set to 'true'.
     * @desc Logs information to the console if app.debug is set to 'true'.
     */
    info: function (prefix) {
      return app.debug === 'true' || app.debug === 'localhost' && app.isLocalNetwork ? console.info.bind(console, prefix ? ' ❱' : '❚') : function () { }
    },

    /**
     * @function error
     * @memberof app.log
     * @returns {function} - The console.error() function or a no-op function if app.debug is not set to 'true'.
     * @desc Logs errors to the console if app.debug is set to 'true'.
     */
    error: function (code) {
      return app.debug === 'true' || app.debug === 'localhost' && app.isLocalNetwork ? console.error.bind(console, code === 0 ? ' Syntax not found:' : '') : function () { }
    },

    /**
     * @function warn
     * @memberof app.log
     * @returns {function} - The console.warn() function or a no-op function if app.debug is not set to 'true'.
     * @desc Logs warnings to the console if app.debug is set to 'true'.
     */
    warn: function (code) {
      return app.debug === 'true' || app.debug === 'localhost' && app.isLocalNetwork ? console.warn.bind(console, code === 0 ? ' ?:' : '') : function () { }
    }
  },

  /**
   * @namespace config
   * @memberof app
   * @desc Object that contains functions to get and set configurations.
   */
  config: {

    /**
     * @function get
     * @memberof app.config
     * @param {string} module - The name of the module.
     * @param {object} standard - The standard configuration object.
     * @param {object} element - The DOM element.
     * @returns {object} final - The final configuration object.
     * @desc Gets the configuration from the DOM element and overrides the standard configuration.
     */
    get: function (module, standard, element) {
      var value = module ? element && element.getAttribute(module + '-conf') : element && element.getAttribute('conf') || '',
        override = value ? value && dom.parse.attribute(value) : {},
        final = {}
      for (var prop in standard) {
        final[prop] = override.hasOwnProperty(prop) ? override[prop] : standard[prop]
      }

      return final
    },

    /**
     * @function set
     * @memberof app.config
     * @param {object} [scriptElement=null] - The script DOM element.
     * @desc Sets the configuration to the app object.
     */
    set: function (scriptElement) {
      var config = this.get(false, {
        debug: false,
        debugLocalhost: false,
        varsDir: 'assets/json/vars',
        storageKey: false,
        frontSrcLocal: '',
        //fileExtension: '.html'
      }, scriptElement || app.script.element)

      for (var prop in config) {
        if (config.hasOwnProperty(prop)) {
          app[prop] = config[prop]
        }
      }
    }
  },

  globals: {
    language: document.documentElement.lang || 'en',
    docMode: document.documentMode || 0,
    isFrontpage: document.doctype ? true : false,

    set: function (name, value) {
      app.globals[name] = value
    },

    get: function (name) {
      return app.globals[name]
    }
  },

  /**
   * @namespace caches
   * @memberof app
   * @desc
   */
  caches: {
    module: {},
    var: {},
    page: {},
    template: {},

    get: function (mechanism, type, key) {
      var data
      if (app.storageKey) key = app.storageKey + '_' + key
      switch (mechanism) {
        case 'local':
          data = JSON.parse(localStorage.getItem(key))
          break
        case 'session':
          data = JSON.parse(sessionStorage.getItem(key))
          break
        case 'cookie':
          data = document.cookie
          break
        default:
          data = app.caches[type][key]
      }
      return data
    },

    set: function (mechanism, type, key, data, status, format) {
      if (app.storageKey) key = app.storageKey + '_' + key
      switch (format) {
        case 'xml':
          data = new DOMParser().parseFromString(data, 'text/xml')
          break
        case 'json':
          var json = dom.parse.json(data)
          data = json.value
          this.responseError = json.errorMessage
          break
      }

      var cacheData = {
        'data': data,
        'status': status ? status : '',
        'headers': '',
        'globals': app.globals
      }

      app.caches[type][key] = cacheData

      switch (mechanism) {
        case 'local':
          localStorage.setItem(key, JSON.stringify(cacheData))
          break
        case 'session':
          sessionStorage.setItem(key, JSON.stringify(cacheData))
          break
        case 'cookie':
          document.cookie = cacheData.data
          break
      }
    }
  },

  /**
   * @namespace listeners
   * @memberof app
   * @desc
   */
  listeners: {
    add: function (element, eventType, callback) {

      element.removeEventListener(eventType, callback)
      element.addEventListener(eventType, callback)

      // Track the listener
      element.listeners = element.listeners || {}
      element.listeners[eventType] = (element.listeners[eventType] || []).concat(callback)
    },

    remove: function (element, eventType, callback) {
      element.removeEventListener(eventType, callback)
    },

    change: function (type, object, test) {
      // Todo
      var changeValue = object.attributes.onvaluechange,
        changeValueIf = object.attributes.onvaluechangeif,
        changeStateValue = object.attributes.onstatevaluechange,
        changeStateValueIf = object.attributes.onstatevaluechangeif

      if (changeValue) {
        /*var beforeChangeValue = object.attributes.onbeforevaluechange,
          afterChangeValue = object.attributes.onaftervaluechange
        */
        console.error('change: ' + changeValue.value)
        app.call(changeValue.value, { element: object })
      }

      if (changeValueIf) {
        var val = changeValueIf.value.split(';'),
          attr = object.value

        var identifier = val[2].match(/(\w+)\[([^\]]+)\]/g) || []

        var target = dom.get(val[1]),
          object = target,
          isNegative = val[0][0] === '!',
          newVal = isNegative ? val[0].substring(1) : val[0],
          regex = /(\w+)\[([^\]]+)\]/

        var statement, text, action

        if (attr === newVal && identifier[1]) {
          statement = identifier[1].match(regex)
        } else {
          statement = identifier[0].match(regex)
        }

        if (!identifier[1] && attr !== newVal) {
          return
        } else {
          app.call(statement[1] + ':' + statement[2], { element: object })
        }
      }

      if (changeStateValue) {
        app.call(changeStateValue.value, { element: object, state: true })
      }

      if (changeStateValueIf) {
        var val = changeStateValueIf.value.split(';'),
          attr = object.value

        var element = dom.get('#result'),
          elValue = element.attributes.statevalue.value

        // Check if statevalue contains an operator followed by a number
        var match = elValue.match(/([\+\-\*\/])(\d+)$/)

        if (match) {
          // Keep the numeric part following the last operator in the input value
          element.value = match[2]
        }
      }
    }
  },

  /**
   * @namespace assets
   * @memberof app
   * @desc
   */
  assets: {
    load: function () {
      if (app.isFrontpage) {
        app.srcDocTemplate = document.body.innerHTML
        dom.doctitle(false, document.title)
        this.get.extensions()

        // Continue running application.
        if (app.extensions.total === 0) app.assets.get.vars()
        if (app.vars.total === 0) app.attributes.run()
      } else {
        var templateElement = dom.get('template', true)[0], // Get only the first template element.
          templateAttr = templateElement && templateElement.attributes,
          elementSrcDoc = templateAttr && templateAttr.srcdoc && templateAttr.srcdoc.value,
          elementSrc = templateAttr && templateAttr.src && templateAttr.src.value,
          templateSrcDoc = elementSrcDoc || false,
          templateSrc = elementSrc && elementSrc.split(';') || []

        app.srcTemplate = {
          url: {
            srcDoc: templateSrcDoc,
            src: templateSrc
          },
          page: false,
          total: templateSrc.length + (templateSrcDoc ? 1 : 0)
        }

        this.get.templates()
      }
      if (app.extensions.total === 0) app.disable(false)
    },

    set: function (scriptAttr) {
      var modules = scriptAttr && scriptAttr.module && scriptAttr.module.value.split(';') || [],
        plugins = scriptAttr && scriptAttr.plugin && scriptAttr.plugin.value.split(';') || [],
        vars = scriptAttr && scriptAttr.var && scriptAttr.var.value.split(';') || []

      app.extensions = {
        module: modules,
        plugin: plugins,
        total: modules.length + plugins.length,
        loaded: 0
      }

      app.vars.name = vars
      app.vars.total = vars.length
    },

    get: {
      vars: function () {
        app.log.info()('Loading vars...')
        for (var j = 0; j < app.vars.total; j++) {
          var name = app.vars.name[j]
          app.log.info(1)(name)
          app.xhr.request({
            url: app.varsDir + '/' + name + '.json',
            type: 'var',
            cache: {
              format: 'json',
              keyType: 'var',
              key: name
            }
          })
        }
      },

      /**
       * @function load
       * @memberof app
       * @param {function} [runAttributes] - A flag to indicate if the runAttributes function should be called after all modules are loaded.
       * @desc Loads extensions(modules) from the `module` attribute of the script element and call autoload function if exists.
       */
      extensions: function () {
        app.log.info()('Loading extensions...')

        var allExtensions = app.extensions.module.concat(app.extensions.plugin)

        var modulesCount = app.extensions.module.length

        for (var i = 0; i < app.extensions.total; i++) {
          (function (i) {

            // Determine if the current script is a module or a plugin
            var isModule = i < modulesCount;
            var folder = isModule ? 'modules' : 'plugins';

            var script = document.createElement('script')
            script.name = allExtensions[i]
            script.src = app.script.path + folder + '/' + script.name + '.js'
            script.async = true

            script.onload = function () {
              app.log.info(1)(this.name)
              app.extensions.loaded++
              var name = isModule ? app.module[this.name] : app.plugin[this.name]

              if (name) {
                name.conf = function () { }

                if (name.__autoload) {
                  name.__autoload({
                    element: app.script.element,
                    name: this.name
                  })
                }
              }

              if (app.extensions.loaded === app.extensions.total) {
                app.assets.get.vars()
              }
            }

            document.head.appendChild(script)
          })(i)
        }
      },

      /**
       * @function load
       * @memberof app
       * 
       */
      templates: function () {
        app.log.info()('Loading templates...')
        var src = app.srcTemplate.url.src,
          srcDoc = app.srcTemplate.url.srcDoc,
          hasStartpage = srcDoc ? -1 : 0

        for (var i = 0; i < app.srcTemplate.total; i++) {
          var isStartpage = srcDoc && i === 0 ? true : false,
            currentTemplate = isStartpage ? srcDoc : src[i + hasStartpage]

          app.xhr.request({
            url: window.location.origin + window.location.pathname + '/' + currentTemplate + '.html',
            type: 'template',
            cache: {
              format: 'html',
              name: 'template',
              keyType: 'template',
              key: currentTemplate,
              extraData: { isStartPage: isStartpage }
            },
          })
        }
      }
    }
  },

  /**
   * @namespace attributes
   * @memberof app
   * @desc
   */
  attributes: {

    defaultExclude: [
      'alt',
      'checked',
      'class',
      'content',
      'for',
      'id',
      'name',
      'selected',
      'src',
      'style',
      'target',
      'type',
      'title',
      'value'],

    /**
     * @function run
     * @memberof app
     * @param {string|Object} [selector='html *'] - A CSS selector or an object representing elements to be processed.
     * @param {Array} [exclude] - An array of items to be excluded from processing.
     * @desc Runs Front Text Markup Language in elements matching the given selector or provided object.
     */
    run: function (selector, exclude, ignore) {
      var selector = selector || 'html *',
        node = typeof selector === 'object' ? selector : dom.get(selector, true),
        excludes = (exclude || []).concat(this.defaultExclude),
        orderMap = {}

      app.log.info()('Running attributes (' + selector + ') ...')
      for (var i = 0; i < node.length; i++) {
        var element = node[i],
          attributes = element.attributes,
          runorder = attributes.runorder ? attributes.runorder.value.split(';') : [],
          run = attributes.run ? attributes.run.value : false,
          stop = attributes.stop && !ignore ? attributes.stop.value.split(';') : [],
          exclude = stop && excludes.indexOf('stop') === -1 ? excludes.concat(stop) : excludes

        attributes = [].slice.call(attributes)

        // Normalize attributes for IE.
        if (app.docMode > 0 && app.docMode <= 11) {
          attributes = array.reverse()
        }

        if (runorder) {
          for (var j = 0; j < runorder.length; j++) {
            orderMap[runorder[j]] = j
          }

          // Sort attributes based on runorder.
          attributes.sort(function (a, b) {
            var indexA = orderMap[a.name] !== undefined ? orderMap[a.name] : Number.MAX_VALUE,
              indexB = orderMap[b.name] !== undefined ? orderMap[b.name] : Number.MAX_VALUE
            return indexA - indexB
          })
        }

        if (run !== 'false') {
          for (var j = 0; j < attributes.length; j++) {
            var attrName = attributes[j].name,
              attrValue = attributes[j].value,
              attrFullname = dom._actionMap[attrName] || attrName
            if (exclude.indexOf(attrFullname) === -1) {
              var name = attrFullname.split('-')

              element.lastRunAttribute = attrName
              if (attrName === 'include') dom.setUniqueId(element) // Add ID to all includes.
              if (!element.originalText) element.originalText = element.textContent
              if (!element.originalHtml) element.originalHtml = element.innerHTML
              if (!element.originalOuterHtml) element.originalOuterHtml = element.outerHTML
              if (!element.originalLabel) element.originalLabel = element.label

              if (app.plugin[name[0]] && name[1] === '' && name[2]) {
                app.log.info(1)(name[0] + ':' + name[0] + '-' + name[1])
                app.plugin[name[0]][name[2]] ? app.plugin[name[0]][name[2]](element) : app.log.error(0)(name[0] + '--' + name[2])
              } else if (app.module[name[0]] && name[1]) {
                app.log.info(1)(name[0] + ':' + name[0] + '-' + name[1])
                app.module[name[0]][name[1]] ? app.module[name[0]][name[1]](element) : app.log.error(0)(name[0] + '-' + name[1])
              } else if (dom[name]) {
                app.log.info(1)('dom.' + name)
                dom[name](element, attrValue)
              }
            } else {
              app.log.warn(1)(name + " [Skipping]")
            }
          }
        }
      }
    }
  },

  /**
   * @namespace variables
   * @memberof app
   * @desc
   */
  variables: {
    update: {
      attributes: function (object, replaceVariable, replaceValue, reset, runExclude) {
        if (replaceVariable) {
          if (reset) {
            var originalAttributes = dom.parse.text(object.originalOuterHtml).children[0].attributes,
              originalHtml = object.originalHtml
            app.variables.reset.attributes(object, originalAttributes)
            app.variables.reset.content(object, originalHtml)
          }

          var regex = new RegExp('\\{\\s*' + replaceVariable + '\\s*(?::((?:{[^{}]*}|[^}])+))?\\}', 'g')
          for (var i = 0; i < object.attributes.length; i++) {
            var attr = object.attributes[i]
            // Check if the regex is matched before updating the attribute.
            if (regex.test(attr.value)) {
              attr.originalValue = attr.value
              // Update the attribute value directly.
              attr.value = attr.value.replace(regex, replaceValue === 0 ? '0' : replaceValue || '$1' || '')
            }
          }

          if (reset) {
            var exclude = ['stop'].concat(runExclude || [])
            app.attributes.run([object], exclude, true)
          }
        }
      },

      content: function (object, replaceVariable, replaceValue) {
        // Escape special characters in the variable pattern to create a valid regular expression.
        var escapedVariable = replaceVariable.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

        // Create a regular expression using the escaped variable pattern.
        var variableRegex = new RegExp('{' + escapedVariable + '(?::([^}]+))?}', 'g')

        // Create a stack for elements to process
        var elementsToProcess = [object]

        // Process elements in the stack
        while (elementsToProcess.length > 0) {
          var element = elementsToProcess.pop()

          // If the element is an Element node, add its children to the stack
          if (element.nodeType === 1) {
            var childNodes = element.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i--) {
              elementsToProcess.push(childNodes[i])
            }
            // If the element is a Text node, replace the variable pattern
          } else if (element.nodeType === 3) {
            var originalContent = element.nodeValue
            var modifiedContent = originalContent.replace(variableRegex, replaceValue === 0 ? '0' : replaceValue || '$1' || '')

            if (originalContent !== modifiedContent) {
              element.nodeValue = modifiedContent
            }
          }
        }
      }
    },

    reset: {
      attributes: function (object, original) {
        for (var i = 0; i < original.length; i++) {
          var attr = original[i]
          object.setAttribute(attr.name, attr.value)
        }
      },

      content: function (object, original) {
        object.innerHTML = original
      }
    }
  },

  /**
   * @namespace querystrings
   * @memberof app
   * @desc
   */
  querystrings: {
    get: function (url, param) {
      var parser = document.createElement('a')
      parser.href = url || window.location.href
      var query = parser.search.substring(1),
        vars = query.split('&')

      for (var i = 0, len = vars.length; i < len; i++) {
        var pair = vars[i].split('='),
          key = decodeURIComponent(pair[0]),
          value = decodeURIComponent(pair[1] || '')
        if (key === param) return value
      }

      return ''
    }
  },

  /**
   * @namespace templates
   * @memberof app
   * @desc
   */
  templates: {
    loaded: 0,
    total: 0,
    elementSelectors: [
      { name: 'header', class: '', content: '' },
      { name: 'aside:nth-of-type(1)', class: '', content: '' },
      { name: 'main', class: '', content: '' },
      { name: 'aside:nth-of-type(2)', class: '', content: '' },
      { name: 'footer', class: '', content: '' }
    ],
    originalClassList: [],

    render: function () {
      app.log.info()('Rendering templates...')
      var currentPageTitle = document.title,
        currentPageBodyContent = document.body.innerHTML,
        isReload = app.srcTemplate.page,
        srcDoc = app.srcTemplate.url.srcDoc,
        src = app.srcTemplate.url.src

      if (!app.srcDocTemplate) app.srcDocTemplate = app.caches.get('window', 'template', srcDoc).data

      if (srcDoc) {
        var cache = app.caches.get('window', 'template', srcDoc),
          responsePage = dom.parse.text(cache.data, ['title']),
          responsePageScript = app.element.find(responsePage, app.script.selector),
          responsePageContent = responsePage.innerHTML,
          responsePageContentClass = responsePage.className

        for (var i = 0; i < this.elementSelectors.length; i++) {
          var elSelector = this.elementSelectors[i],
            parsedEl = app.element.find(responsePage, elSelector.name),
            content = parsedEl.innerHTML

          if (elSelector.name !== 'main') {
            elSelector.content = content
            dom.set(elSelector.name, content ? content : '')
            app.attributes.run(elSelector.name + ' *')
          }
        }

        if (!isReload) {
          app.assets.set(responsePageScript.attributes)
          app.language = responsePage.attributes.lang ? responsePage.attributes.lang.value : app.language
          app.script.element = responsePageScript

          if (app.docMode > 0 && app.docMode < 10) {
            document.open()
            document.write(responsePageContent)
            document.close()
          } else {
            dom.set('html', responsePageContent)
          }

          dom.set('main', currentPageBodyContent)
        }
      }

      if (src) {
        for (var i = 0; i < src.length; i++) {
          var cache = app.caches.get('window', 'template', src[i]),
            html = dom.parse.text(cache.data),
            template = dom.parse.text(app.element.find(html, 'template').innerHTML),
            srcDoc = dom.parse.text(app.srcDocTemplate)

          for (var j = 0; j < this.elementSelectors.length; j++) {
            var elSelector = this.elementSelectors[j],
              parsedEl = app.element.find(template, elSelector.name),
              content = parsedEl.innerHTML,
              classAttr = parsedEl.attributes && parsedEl.attributes.class ? true : false,
              className = parsedEl.className,
              templateEl = dom.get(elSelector.name),
              srcDocEl = app.element.find(srcDoc, elSelector.name)

            if (elSelector.name !== 'main') {
              dom.set(elSelector.name, parsedEl.nodeType === 1 ? content : srcDocEl.innerHTML)
              if (dom.get('template')) app.attributes.run(elSelector.name + ' *')
            }

            templateEl.className = classAttr ? className : srcDocEl.className
          }
        }
      }

      if (responsePageContentClass) document.body.className = responsePageContentClass
      dom.doctitle(false, currentPageTitle)
    }
  },

  /**
   * @namespace xhr
   * @memberof app
   * @desc
   */
  xhr: {
    currentRequest: null,
    currentAsset: { loaded: 0, total: 1 },

    start: function () {
      var self = this,
        open = XMLHttpRequest.prototype.open,
        send = XMLHttpRequest.prototype.send
      XMLHttpRequest.prototype.open = function () {
        this.onreadystatechange = function () {
          if (this.readyState === 4) {
            var statusType = {
              informational: this.status >= 100 && this.status <= 199,
              success: this.status >= 200 && this.status <= 299,
              redirect: this.status >= 300 && this.status <= 399,
              clientError: this.status >= 400 && this.status <= 499,
              serverError: this.status >= 500 && this.status <= 599
            }

            this.statusType = statusType

            var options = this.options,
              type = options.type,
              global = options.global,
              cache = options.cache,
              target = options.target,
              module = options.module,
              format = options.format

            if (global) {
              // Create an object to store all globals
              var obj = {}
              // Loop through the global array
              for (var i = 0; i < global.length; i++) {
                var globalName = global[i]
                obj[globalName] = dom.parse.json(this.responseText).value[globalName]
                app.globals.set(module, obj)
              }
            }

            if (cache) {
              //if (cache && (statusType.success || statusType.redirect)) {
              app.caches.set(cache.type, cache.keyType, cache.key, this.responseText, this.status, cache.format)
            }

            if (type) {
              switch (type) {
                case 'page':
                  var responsePage = dom.parse.text(this.responseText),
                    responsePageTitle = app.element.find(responsePage, 'title').textContent,
                    templateElement = app.element.find(responsePage, 'template'),
                    templateAttr = templateElement && templateElement.attributes,
                    elementSrcDoc = templateAttr && templateAttr.srcdoc && templateAttr.srcdoc.value,
                    elementSrc = templateAttr && templateAttr.src && templateAttr.src.value,
                    templateSrcDoc = target !== 'main' ? elementSrcDoc || false : false,
                    templateSrc = elementSrc && elementSrc.split(';') || []

                  self.currentAsset.loaded = 0
                  app.vars.total = 0
                  app.extensions.total = 0 // Without this. it creates duplicate xhr requests.
                  app.templates.total = 0
                  app.templates.loaded = 0

                  app.srcTemplate = {
                    url: {
                      srcDoc: templateSrcDoc,
                      src: templateSrc
                    },
                    page: true,
                    total: templateSrc.length + (templateSrcDoc ? 1 : 0)
                  }
                  dom.doctitle(false, responsePageTitle)
                  dom.bind.include = ''
                  app.assets.get.templates()
                  break
                case 'var':
                  app.vars.loaded++
                  break
                case 'template':
                  app.templates.loaded++
                  if (app.templates.loaded === app.srcTemplate.total) {
                    app.isFrontpage = false
                    app.templates.render()
                    app.config.set()
                    app.assets.get.extensions()
                  }
                  break
                case 'data':
                  if (self.currentAsset.total === 1) {
                    self.currentAsset.loaded = 0
                  }
                  self.currentAsset.loaded++
                  if (self.currentAsset.loaded === self.currentAsset.total) {
                    var run = this.options.onload2.run
                    app.exec(run.func, run.arg)
                  }
                  break
                case 'fetch':
                  // TODO: Make a function of format
                  app.module[module].fetchedData = format === 'json' ? dom.parse.json(this.responseText).value : this.responseText
                default:
                  return
              }

              if (app.extensions.loaded === app.extensions.total
                && app.vars.loaded === (app.vars.total + app.vars.totalStore)
                && type !== 'template' && type !== 'data') {

                /*console.log('Extensions loaded:', app.extensions.loaded + '/' + app.extensions.total)
                console.log('Vars loaded:', app.vars.loaded + '/' + (app.vars.total + app.vars.totalStore))*/

                app.disable(false)
                app.attributes.run()
              }
            }
          }
        }

        open.apply(this, arguments)
      }

      XMLHttpRequest.prototype.send = function (data) {
        if (data) app.log.info()('Data: ' + data)
        send.apply(this, arguments)
      }
    },

    /**
     * @function request
     * @memberof app.xhr
     * @desc Creates XHR requests and updates the DOM based on the response.
     */
    request: function (options) {
      //console.warn(options)
      var method = options.method ? options.method.toUpperCase() : 'GET',
        url = options.url instanceof Array ? options.url : [options.url],
        target = options.target ? dom.get(options.target) : options.element,
        single = options.single,
        cache = options.cache || false,
        headers = options.headers ? dom.parse.attribute(options.headers) : {},
        srcEl = options.srcEl || false,
        enctype = options.enctype ? options.enctype : 'application/json',
        onload = options.onload,
        error = options.error,
        beforesuccess = options.beforesuccess,
        success = options.success,
        aftersuccess = options.aftersuccess,
        loader = options.loader,
        type = options.type,
        run = onload && onload.run && onload.run.func ? onload.run.func : false,
        runarg = onload && onload.run && onload.run.arg

      if (false) {
        console.dir('cache: ' + cache)
      } else {

        var xhr = new XMLHttpRequest(),
          urlExtension = url.indexOf('.') !== -1 || url == '/' || options.urlExtension === false ? '' : app.fileExtension || ''

        xhr.options = options

        if (single) {
          if (this.currentRequest) this.currentRequest.abort()
          this.currentRequest = xhr
        }

        xhr.onabort = function () {
          if (app.spa && loader) app.spa._preloader.reset()
        }

        xhr.onprogress = function (e) {
          if (app.spa && type === 'page') app.spa._preloader.load(e, true)
        }

        xhr.onload = function () {
          var status = this.statusType
          if (status.informational || status.success || status.redirect) {

            /*var headers = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/)
            var headerMap = {}
            for (var i = 0; i < headers.length; i++) {
              var parts = headers[i].split(": ")
              var header = parts[0]
              var value = parts.slice(1).join(": ")
              headerMap[header] = value
            }*/

            var responseData = this.responseText,
              responseError = this.responseError // Get the parsing error message.

            if (target) {
              dom.set(target, responseData)
            }

            //Todo: Fix so parsing problem shows. 
            if (responseError) {
              //dom.show(error)
            }

            if (onload) {
              if (run) app.exec(run, runarg)
            }

            if (beforesuccess) {
              app.call(beforesuccess.value, {
                srcElement: srcEl,
                srcAttribute: beforesuccess.name,
                response: {
                  data: dom.parse.json(responseData).value,
                  error: responseError
                }
              })
            }

            if (success) {
              if (srcEl) {
                app.call(success, { srcElement: srcEl })
              }

              // Clean up error element.
              if (error) {
                var val = error.split(':')
                if (val[0] === 'show') dom.hide(val[1])
              }
            }

            if (aftersuccess) {
              console.warn(aftersuccess)
              app.call(aftersuccess.value, {
                srcElement: srcEl,
                srcAttribute: aftersuccess.name,
                response: {
                  data: dom.parse.json(responseData).value,
                  error: responseError
                }
              })
            }

            if (options.exec) app.element.onload(options.exec.element)

          } else if (status.clientError || status.serverError) {
            dom.hide(loader)
            if (error) app.call(error, { element: options.element })
          }
        }

        xhr.onerror = function () {
          if (error) app.call(error, { element: options.element })
        }

        xhr.open(method, url + urlExtension, true)

        var payload
        if (['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
          var json = {}
          if (srcEl.elements) { // Iterate in form elements.
            for (var i = 0; i < srcEl.elements.length; i++) {
              var el = srcEl.elements[i]
              json[el.name] = el.value
            }
          } else { // Single select form elements.
            var name = srcEl.name ? srcEl.name : srcEl.attributes.name.value
            json[name] = srcEl.name ? srcEl.value : srcEl.outerText
          }

          payload = JSON.stringify(json)
        } else {
          payload = null
          enctype = 'application/x-www-form-urlencoded'
        }

        // Set headers
        headers['Content-type'] = enctype
        for (var header in headers) {
          if (headers.hasOwnProperty(header)) xhr.setRequestHeader(header, headers[header])
        }

        xhr.send(payload)
      }
    }
  },
}

app.load()