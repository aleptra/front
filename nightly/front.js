/**
 * @license
 * Copyright © 2020 Aleptra.
 * Josef Gabrielsson
 *
 * This source code is licensed under the MIT-style license found in the 
 * LICENSE file in the root directory of this source tree.
 *
 * This project uses ECMAScript 5 for compatibility with older JavaScript engines.
 */

var dom = {
  _uniqueId: 0,
  _bindfieldPos: 0,

  _actionMap: {
    'trimleft': 'trim',
    'trimright': 'trim',
    'insertafterbegin': 'insert',
    'insertafterend': 'insert',
    'insertbeforebegin': 'insert',
    'insertbeforeend': 'insert',
    'prependattr': 'insert',
    'setaction': 'set2',
    'setattr': 'set2',
    'setmax': 'set2',
    'settext': 'set2',
    'sethtml': 'set2',
    'sethref': 'set2',
    'setqueryhref': 'set2',
    'setvalue': 'set2',
    'setid': 'set2',
    'setname': 'set2',
    'setsrc': 'set2',
    'bindappend': 'bind',
    'bindvar': 'bind',
    'bindquery': 'bind',
    'bindasset': 'bind',
    'bindglobal': 'bind',
    'bindfield': 'bind',
    'resetvalue': 'reset',
    'togglevalue': 'toggle',
    'toggledisplay': 'toggle',
    'maprun': 'map',
    'mapclass': 'map',
    'mapmargin': 'map',
    'mapbindvar': 'map',
    'align': 'apply',
    'color': 'apply',
    'border': 'apply',
    'absolute': 'apply',
    'borderleft': 'apply',
    'borderright': 'apply',
    'borderbottom': 'apply',
    'bordertop': 'apply',
    'bgimage': 'apply',
    'bgcolor': 'apply',
    'bold': 'apply',
    'boxshadow': 'apply',
    'cursor': 'apply',
    'margin': 'apply',
    'margintop': 'apply',
    'marginbottom': 'apply',
    'marginleft': 'apply',
    'marginright': 'apply',
    'minheight': 'apply',
    'minwidth': 'apply',
    'maxwidth': 'apply',
    'move': 'move',
    'grid': 'apply',
    'fixed': 'apply',
    'font': 'apply',
    'flex': 'apply',
    'flexitem': 'apply',
    'flexdirection': 'apply',
    'justifycontent': 'apply',
    'height': 'apply',
    'inherit': 'apply',
    'left': 'apply',
    'lineheight': 'apply',
    'padding': 'apply',
    'paddingtop': 'apply',
    'paddingbottom': 'apply',
    'paddingleft': 'apply',
    'paddingright': 'apply',
    'radius': 'apply',
    'relative': 'apply',
    'resize': 'apply',
    'right': 'apply',
    'textshadow': 'apply',
    'transform': 'apply',
    'top': 'apply',
    'unset': 'apply',
    'underline': 'apply',
    'width': 'apply',
    'wordbreak': 'apply',
    'whitespace': 'apply',
    'zindex': 'apply',
    'zoom': 'apply',
  },
  _eventMap: {
    'click': 'clicked',
    'enable': 'enabled',
    'disable': 'disabled',
    'focus': 'focused',
    'submit': 'submitted'
  },

  /**
   * @function toggle
   * @memberof dom
   */
  toggle: function (el) {
    var func = el.exec.func
    if (el.exec) el = el.exec.element
    var ontoggle = el.attributes.ontoggle && el.attributes.ontoggle.value,
      tag = el.localName,
      type = el.type

    switch (func) {
      case 'toggledisplay':
        // If element is hidden, show it; otherwise, hide it
        if (el.style.display === 'none' || window.getComputedStyle(el).display === 'none') {
          el.style.display = el._originalDisplay || '' // restore previous display or default
        } else {
          el._originalDisplay = window.getComputedStyle(el).display // remember original
          el.style.display = 'none'
        }
        break
    }

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
   * @function disable
   * @memberof dom
   */
  disable: function (element) {
    if (element.exec) element = element.exec.element
    element.disabled = true
    element.wheel = false

    element.addEventListener('click', function (e) {
      if (element.disabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    element.addEventListener('wheel', function (e) {
      if (!element.wheel) {
        e.preventDefault()
        e.stopPropagation()
      }
    })
  },

  /**
   * @function move
   * @memberof dom
   */
  move: function (object, value) {
    var from = object
    var to = app.element.select(value)
    if (from && to) {
      to.appendChild(from)
    }
  },

  /**
   * @function hide
   * @memberof dom
   */
  hide: function (object, prop) {
    if (object && object.exec) object = object.exec.element
    var el = object instanceof Object ? object : app.element.select(object) // Todo: Remove in future.
    if (el) {
      if (!el.initDisplay) {
        if (el.attributes.hide) {
          el.initDisplay = 'unset'
        } else {
          el.initDisplay = el.style.display || getComputedStyle(el).display
        }
      }
      value = prop ? 'visibility: hidden' : 'display: none'
      el.style.cssText += value + ' !important'
    }
  },

  /**
   * @function hrefhost
   * @memberof dom
   */
  hrefhost: function (el) {
    if (el.length < 1) return
    var value = el.getAttribute('hrefhost'),
      parts = value.split(':'),
      host = parts[0],
      folder = parts[1] && parts[1].replace(/[\[\]]/g, '')

    // Get the first segment of the current pathname.
    var test2 = location.pathname.split('/')[1]

    // Check if the host from hrefhost matches the current location.hostname
    if (host === location.hostname) {
      el.href = test2 === '' ? '/' : '/' + folder + '/'
    } else {
      el.href = '/'
    }
    app.baseHref = el.href
  },

  /**
   * @function show
   * @memberof dom
   */
  show: function (object) {
    if (object.exec) object = object.exec.element
    var el = object instanceof Object ? object : app.element.select(object) // Todo: Remove in future.
    if (el) {
      el.style.display = el.initDisplay
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
      func = element.exec.func
      value = element.exec.value
      element = element.exec.element
    } else {
      func = element.lastRunAttribute
    }

    var prefix = '',
      suffix = '',
      attr = func.replace(/(top|bottom|left|right)$/g, function (match) {
        return match.charAt(0).toUpperCase() + match.slice(1)
      })

    // Color mapping for black01-black09 and white01-white09 using rgba
    var colorMap = {
      black01: 'rgba(0,0,0,.1)',
      black02: 'rgba(0,0,0,.2)',
      black03: 'rgba(0,0,0,.3)',
      black04: 'rgba(0,0,0,.4)',
      black05: 'rgba(0,0,0,.5)',
      black06: 'rgba(0,0,0,.6)',
      black07: 'rgba(0,0,0,.7)',
      black08: 'rgba(0,0,0,.8)',
      black09: 'rgba(0,0,0,.9)',
      white01: 'rgba(255,255,255,.1)',
      white02: 'rgba(255,255,255,.2)',
      white03: 'rgba(255,255,255,.3)',
      white04: 'rgba(255,255,255,.4)',
      white05: 'rgba(255,255,255,.5)',
      white06: 'rgba(255,255,255,.6)',
      white07: 'rgba(255,255,255,.7)',
      white08: 'rgba(255,255,255,.8)',
      white09: 'rgba(255,255,255,.9)'
    }

    switch (attr) {
      case 'align':
        attr = 'textAlign'
        break
      case 'alignitems':
        attr = 'alignItems'
        break
      case 'wordbreak':
        attr = 'wordBreak'
        break
      case 'whitespace':
        attr = 'whiteSpace'
        break
      case 'bgimage':
        var parts = value.split(' ')
        var url = parts[0]
        var size = parts[1]
        var repeat = parts[2]
        var position = parts[3]

        element.style.backgroundImage = 'url(' + url + ')'
        element.style.backgroundRepeat = repeat
        element.style.backgroundSize = size
        element.style.backgroundPosition = position
        break
      case 'bgcolor':
        value = colorMap[value] || value
        attr = 'backgroundColor'
        break
      case 'boxshadow':
        attr = 'boxShadow'
        break
      case 'bold':
        value = attr
        attr = 'fontWeight'
        break
      case 'grid':
      case 'flex':
        value = attr
        attr = 'display'
        break
      case 'radius':
        attr = 'borderRadius'
        break
      case 'flexitem':
        attr = 'flex'
        break
      case 'flexdirection':
        attr = 'flexDirection'
        break
      case 'justifycontent':
        attr = 'justifyContent'
        break
      case 'lineheight':
        attr = 'lineHeight'
        break
      case 'minheight':
        attr = 'minHeight'
        break
      case 'minwidth':
        attr = 'minWidth'
        break
      case 'maxwidth':
        attr = 'maxWidth'
        break
      case 'font':
        attr = 'fontFamily'
        break
      case 'textshadow':
        attr = 'textShadow'
        break
      case 'underline':
        element.style.textDecoration = 'underline'
        element.style.textUnderlinePosition = 'under'
        break
      case 'zindex':
        attr = 'zIndex'
        break
      case 'zoom':
        element.style.lineHeight = 'normal'
        break
      case 'Top':
      case 'Bottom':
      case 'Left':
      case 'Right':
        attr = attr.toLowerCase()
        break
      case 'fixed':
      case 'absolute':
      case 'relative':
      case 'sticky':
        value = attr
        attr = 'position'
        break
      default:
        // Extract the value and unit in the default case
        var regex = /^(\d+)([a-z%]*)$/,
          match = value.match(regex)

        if (match) {
          var numeric = parseFloat(match[1]), // Convert the value to a float
            unit = match[2] || 'px',
            value = numeric,
            prefix = unit
        }

        // Handle "unset:property" or "inherit:property" syntax
        var specialMatch = func.trim().match(/^(unset|inherit)$/i)
        if (specialMatch) {
          attr = value
          value = func
        }
    }

    element.style[attr] = suffix + value + prefix
  },

  /**
   * @function bind
   * @memberof dom
   */
  bind: function (object, value, target) {
    value = object.exec ? object.exec.value.join(':') : value,
      object = object.exec ? object.exec.element : object,
      attr = object.exec ? object.exec.func : object.lastRunAttribute,
      bindings = value.split(';')

    for (var i = 0; i < bindings.length; i++) {
      var binding = bindings[i].split(':'),
        replaceVariable = binding[0],
        replaceValue = binding[1]

      switch (attr) {
        case 'bindappend':
          // FIX: Reset attributes on the first binding iteration to restore variables (e.g. {ph})
          if (i === 0) app.variables.reset.attributes(object)

          var parts = replaceVariable.split('.'),
            element = parts[0],
            attrValue = parts[1]
          var target = app.element.select(element),
            content = app.element.get(target, false, false, attrValue ? attrValue : false)

          app.variables.update.content(object, replaceValue, content)
          app.variables.update.attributes(object, replaceValue, content)
          break
        case 'bindvar':
          var bindInclude = this.bind.include ? ';' + this.bind.include : '',
            binding = ((object.getAttribute('bindvar') || object.getAttribute('var')) || '') + bindInclude

          // Set variable if colon is presented or update innerhtml.
          var bindings = binding ? binding.split(';') : []

          for (var i = 0; i < bindings.length; i++) {
            var bindingParts = bindings[i].split(':') || [],
              replaceVariable = bindingParts[0].trim(),
              replaceValue = bindingParts.slice(1).join(':').trim()

            app.variables.update.content(object, replaceVariable, replaceValue)
            app.variables.update.attributes(object, replaceVariable, replaceValue)
          }

          return
        case 'bindquery':
          replaceValue = app.querystrings.get(false, replaceValue)
          break
        case 'bindglobal':
          replaceValue = app.element.getPropertyByPath(app.globals, replaceValue)
          break
        case 'bindasset':
          var keys = replaceValue.split('.'),
            cache = app.caches.get('session', 'var', keys[0])
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
          var type = object.localName,
            binding = object.getAttribute('bindfield'),
            bindings = binding ? binding.split(';') : []

          for (var i = 0; i < bindings.length; i++) {
            var bindingParts = bindings[i].split(':') || [],
              replaceVariable = bindingParts[0],
              replaceValue = bindingParts[1]

            var target = app.element.select(replaceValue),
              type = target.type,
              name = target.id || target.name,
              bindfieldif = target.attributes && target.attributes.bindfieldif,
              reloadContent = (target.getAttribute && target.getAttribute('bindfieldreloadcontent') === 'false') ? false : true

            var match = binding.match(new RegExp("([^:]+):[#.]" + name)),
              replaceVariableNew = match ? match[1] : '',
              fieldif = bindfieldif && bindfieldif.value.split(':')

            // Initialize update the values of variable.
            var resolvedValue = app.element.resolveBindingValue(object, replaceVariableNew, target.value)
            app.variables.update.content(object, replaceVariableNew, resolvedValue)
            app.variables.update.attributes(object, replaceVariableNew, resolvedValue)

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
                      app.variables.update.attributes(object, replaceVariableNew, this.value, { reset: true, reloadContent: reloadContent })
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
                  app.variables.update.attributes(object, replaceVariableNew, this.value, { reset: true, exclude: ['bind'] })
                  app.variables.update.content(object, replaceVariableNew, value)
                })
                break
            }
          }
          continue
      }

      app.variables.update.attributes(object, replaceVariable, replaceValue)
      app.variables.update.content(object, replaceVariable, replaceValue)
      app.element.onchange(object, attr, true)
    }
  },

  /**
   * @function submit
   * @memberof dom
   * @param {*} object
   * @param {*} value
   */
  submit: function (object, value) {
    var el = object.exec.value ? app.element.select(object.exec.value) : value,
      target = el.getAttribute('target')

    //Todo: Is this the correct way to submit a form?
    if (el && target) {
      el.submit()
    } else {
      app.element.onsubmit({ srcElement: el })
    }
  },

  /**
   * @function loader
   * @memberof dom
   * @param {*} object
   * @param {*} value
   */
  loader: function (object, value) {
    dom.hide(object)
    if (value) dom.show(value)
  },

  /**
   * @function alert
   * @memberof dom
   * @param {string} value - The message to display in the dialog box.
   * @desc Displays a message in a dialog box.
   */
  alert: function (object, value) {
    alert(object.exec ? object.exec.value : value)
  },

  /**
   * @function confirm
   * @memberof dom
   * @param {*} element
   * @param {*} value
   * @returns
   */
  confirm: function (element, value) {
    var el = app.element.resolveCall(element)
    var result = confirm(el.call && el.call.value || value || '')
    var answer = el.getAttribute('onconfirmvalue')
    if (answer) {
      var parts = answer.split(';')
      if (parts[0] === 'true' && result) app.call(parts[1], { element: el })
    }
  },

  /**
   * @function focus
   * @memberof dom
   * @param {*} element 
   * @param {*} value 
   */
  focus: function (element) {
    var el = app.element.resolveCall(element)
    if (el) setTimeout(function () { el.focus() }, 100)
  },

  /**
   * @function blur
   * @memberof dom
   */
  blur: function (element) {
    var el = app.element.resolveCall(element)
    if (el) el.blur()
  },

  /**
   * @function enable
   * @memberof dom
   */
  enable: function (element) {
    var el = app.element.resolveCall(element)
    if (el) {
      el.disabled = false
      el.wheel = true
    }
  },

  /**
   * @function scroll
   * @memberof dom
   * @param {*} object 
   * @param {*} value 
   */
  scroll: function (element, value, smooth) {
    if (element.exec) {
      value = element.exec.value
      element = element.exec.element
    }

    if (element.localName === 'body') element = document.documentElement

    // Resolve element if it's a selector string
    var target = typeof element === 'string' ? app.element.select(element) : element
    // Determine scroll position
    var scrollToValue
    if (value === 'bottom')
      scrollToValue = target.scrollHeight
    else
      scrollToValue = parseInt(value, 10) || 0

    // Scroll
    if (target.scrollTo)
      target.scrollTo({
        top: scrollToValue,
        behavior: smooth ? 'smooth' : 'instant'
      })
    else
      target.scrollTop = scrollToValue
  },

  /**
   * @function metadata
   * @memberof dom
   * @param {HTMLElement} object - The element object to modify.
   * @param {string} name - The name of the meta tag whose content will be retrieved.
   * @desc Retrieves metadata from a meta tag with the specified name and sets it as the inner HTML of the specified object.
   */
  metadata: function (object, name) {
    var value = app.element.select('meta[name=' + name + ']')
    object.innerHTML = value.content
  },

  /**
   * @function setUniqueId
   * @memberof dom
   * @param {HTMLElement} element - The element to set the unique id on.
   * @desc Sets a unique id for the given element.
   */
  setUniqueId: function (element, internal, attr) {
    this._uniqueId++
    var id = this._uniqueId
    if (!internal)
      element.id = 'id' + id
    else if (attr)
      element.setAttribute('uniqueid', id)
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
    if (title) document.title = title
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
    var target = object instanceof Object ? object : app.element.select(object),
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
    var target = app.element.resolveCall(object)
    target.innerHTML = !first || first === 'true' ? target.innerHTML.toUpperCase() : target.innerHTML.charAt(0).toUpperCase() + target.innerHTML.slice(1)
  },

  /**
   * @function lowercase
   * @memberof dom
   * @param {Object} object - The element object to modify.
   * @desc Converts the contents of an element to lowercase letters.
   */
  lowercase: function (object) {
    var target = app.element.resolveCall(object)
    target.innerHTML = target.innerHTML.toLowerCase()
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

  /**
   * @function escape
   * @memberof dom
   * @param {*} element
   */
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

  /**
   * @function insert
   * @memberof dom
   * @param {*} object 
   * @param {*} value 
   */
  insert: function (object, value) {
    var insert, attribute, hasAttribute
    if (object.exec) {
      value = object.exec.value
      insert = object.exec.func
      attribute = object.exec.attribute
      hasAttribute = object.exec.hasAttribute // Todo: Remove in future.
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
          var insertContent = object.getAttribute('insertcontent') === 'true'
          if (insertContent)
            object.textContent = afterbegin + object.textContent + beforeend
          else
            object.href = afterbegin + object.href + beforeend
          break
        case 'select':
          object.setAttribute('select', value)
          break
        default:
          if (hasAttribute) {
            var currentAttr = object.getAttribute(attribute)
            object.setAttribute(attribute, afterbegin + currentAttr + beforeend)
          } else {
            object.textContent = afterbegin + object.textContent + beforeend
          }
      }
    } else {
      object.insertAdjacentText(insert, value)
    }
  },

  /**
   * @function prepend
   * @memberof dom
   */
  prepend: function (element, value) {
    var div = app.element.select(value)
    element.insertBefore(div, element.firstChild)
  },

  /**
   * @function append
   * @memberof dom
   * @desc Clone children and append to element.
   */
  append: function (element, value) {
    element = app.element.resolveCall(element, value)
    var from = element.call.subElement,
      to = element.call.element

    /// Create a fragment to hold cloned/rerun children
    var frag = document.createDocumentFragment()

    // Iterate over children and rerun FTML
    var children = from.children

    for (var i = 0; i < children.length; i++) {
      var child = children[i]
      child.from = from
      dom.rerun(child)
      frag.appendChild(child.cloneNode(true)) // append cloned child to fragment
    }

    to.appendChild(frag)
  },

  /**
   * @function map
   * @memberof dom
   */
  map: function (object, value) {
    var object = typeof object === 'string' ? app.element.select(object) : object,
      cache = app.caches.get('window', 'var', 'enum'),
      func = object.originalAttribute || '',
      data = cache.data[func.replace('map', '')][value] || ''

    switch (func) {
      case 'mapclass':
        object.classList = data
        break
      case 'mapmargin':
        object.style.margin = data
        break
      case 'mapbindvar':
        var bindings = value.split(';'),
          mapName = func.replace('map', ''),
          mapRoot = cache.data[mapName] || {}

        for (var b = 0; b < bindings.length; b++) {
          var binding = bindings[b]
          if (!binding) continue

          var parts = binding.split(':')
          if (parts.length !== 2) continue

          var attrName = parts[0].trim()
          var dataKey = parts[1].trim()

          var dataObj = mapRoot[dataKey]
          if (!dataObj || typeof dataObj !== 'object') continue

          var finalValue = dataObj[attrName]
          if (finalValue === undefined) continue

          // IMPORTANT: ensure string, not object
          finalValue = String(finalValue)

          dom.bind(object, attrName + ':' + finalValue, 'mapbindvar')
        }
        break
      case 'maprun':
        app.exec(data, { element: object })
        break
    }
  },

  /**
   * @function set2
   * @memberof dom
   * @param {*} object
   * @param {*} value
   * @todo Check if this is nessacary to have it named set2 instead of set?
   */
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

  /**
   * @function replace
   * @memberof dom
   * @param {*} object 
   * @param {*} value 
   */
  replace: function (object, value) {
    this.insert(object, value)
  },

  /**
   * @function clear
   * @memberof dom
   */
  clear: function (object, value) {
    if (value) {
      object = app.element.select(value)
    } else if (object.exec.element) {
      object = object.exec.element
    }
    object.innerHTML = ''
  },

  /**
   * @function reset
   * @memberof dom
   * @param {*} object 
   * @param {*} value 
   */
  reset: function (object) {
    if (object.exec) object = object.exec.element

    var tag = object.localName,
      stateValue = object.attributes.statevalue
    switch (tag) {
      case 'form':
        var customReset = object.getAttribute('onreset')
        customReset && object.removeAttribute('onreset')
        object.reset()
        customReset && object.setAttribute('onreset', customReset)
        break
      case 'button':
        object.textContent = object.originalText
        break
      case 'input':
        object.value = object.originalValue
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

  /**
   * @function format
   * @memberof dom
   */
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

  /**
   * @function sanitize
   * @memberof dom
   * @param {*} object 
   * @param {*} value 
   */
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
   * @desc Loads the content of an external file and insert it into the DOM.
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

  /**
  * @function if
  * @memberof dom
  * @param {Object} element
  * @param {string} value - "([l]op[r]&[l]op[r]);trueAction?falseAction"
  */
  if: function (element, value) {
    var el = app.element.resolveCall(element, value),
      parts = el.call.string.split(';')

    if (parts.length < 2) return

    var conditionStr = parts[0].replace(/^\s*\(|\)\s*$/g, ''),
      actionStr = parts[1]

    var getValue = function (val) {
      var clean = val.replace(/[\[\]]/g, '').trim()
      if (clean.indexOf('#') === 0) {
        var target = document.getElementById(clean.substring(1))
        if (!target) return ''
        return target.value !== undefined ? target.value : (target.textContent || target.innerText || '')
      }
      return clean
    }

    var evalSingle = function (expr) {
      var m = expr.match(/^(\[.*?\]|[^!~:><]+)(!~|~|:|!|>|<)(.*)/)
      if (!m) return false

      var l = getValue(m[1]), op = m[2], r = getValue(m[3])

      var ops = {
        ':': l === r,
        '!': l !== r,
        '>': Number(l) > Number(r),
        '<': Number(l) < Number(r),
        '~': l && l.indexOf(r) !== -1,
        '!~': l && l.indexOf(r) === -1
      }
      return ops[op] || false
    }

    // Evaluate conditions
    var tokens = conditionStr.split(/([&|])/),
      result = evalSingle(tokens[0])
    for (var i = 1; i < tokens.length; i += 2) {
      var op = tokens[i]
      var next = evalSingle(tokens[i + 1])
      result = (op === '&') ? (result && next) : (result || next)
    }

    // Determine result branch
    var acts = actionStr.split('?'),
      str = (result ? acts[0] : (acts[1] || '')).trim()
    if (!str) return

    // Parse and execute actions
    var cmds = [], buf = '', depth = 0
    for (var k = 0; k < str.length; k++) {
      var c = str.charAt(k)
      if (c === '[') {
        depth++
      } else if (c === ']') {
        depth--
      }

      if (c === '&' && depth === 0) {
        cmds.push(buf.trim())
        buf = ''
      } else {
        buf += c
      }
    }
    if (buf) cmds.push(buf.trim())

    for (var j = 0; j < cmds.length; j++) {
      if (cmds[j]) app.call(cmds[j], { srcElement: element })
    }
  },

  bindif: function (object, options) {
    var test = object.value,
      test2 = test.split(';')

    var parts = test2[0].split(':'),
      target = app.element.select(parts[0]),
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
  * @param {string} value - Semi-colon separated attributes or patterns (e.g., "*.settext")
  */
  stop: function (element, value) {
    element = app.element.resolveCall(element, value)
    if (!element || !value) return

    var wildcards = {}
    var stopAll = false
    var parts = value.split(';')

    // Optimization: Map lookups are faster than array indexOf
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim()
      if (p === '*') stopAll = true
      else if (p.indexOf('*.') === 0) wildcards[p.slice(2)] = true
    }

    var children = element.getElementsByTagName('*')
    for (var i = 0; i < children.length; i++) {
      var child = children[i]
      var start = child.getAttribute('start')

      // Quick escape if element explicitly allows all
      if (start === '*') continue

      var allow = start ? start.split(';') : []
      var currentStop = child.getAttribute('stop') || ''
      var stops = currentStop ? currentStop.split(';') : []
      var attrs = child.attributes
      var modified = false

      for (var j = 0; j < attrs.length; j++) {
        var name = attrs[j].name

        // Filter out meta-attributes
        if (name === 'stop' || name === 'start') continue

        // Logical check: matches pattern AND not in allow list AND not already stopped
        var isTarget = stopAll || wildcards[name]
        if (isTarget && allow.indexOf(name) === -1 && stops.indexOf(name) === -1) {
          stops.push(name)
          modified = true
        }
      }

      if (modified) {
        // Join and clean up leading delimiters if they exist
        var result = stops.join(';')
        child.setAttribute('stop', result.charAt(0) === ';' ? result.slice(1) : result)
      }
    }
  },

  /**
   * @function start
   * @memberof dom
   */
  start: function (element, value) {
    element = app.element.resolveCall(element, value)

    var attrs = value ? value.replace(/\*\./g, '').split(';') : [],
      startAll = !attrs.length || attrs.indexOf('*') !== -1,
      all = element.getElementsByTagName('*'),
      exclude = ['stop', 'start'],
      i, j, el, stopList

    for (i = -1; ++i <= all.length;) {
      el = i === all.length ? element : all[i]
      if (el.nodeType !== 1) continue

      if (startAll) {
        el.removeAttribute('stop')
        app.attributes.run([el], exclude, true)
      } else {
        stopList = (el.getAttribute('stop') || '').split(';')

        for (j = attrs.length; j--;) {
          stopList.splice(stopList.indexOf(attrs[j]), 1)
        }

        stopList[0] ? el.setAttribute('stop', stopList.join(';')) : el.removeAttribute('stop')
        app.attributes.run([el], exclude.concat(stopList), true)
      }
    }
  },

  /**
   * @function var
   * @memberof dom
   */
  var: function (element, value) {
    if (element.localName === 'script') return
  },

  /**
   * @function iterate
   * @memberof dom
   */
  iterate: function (element, value) {
    dom.stop(element) // Stop all attributes in element.
    var values = value.split(';'),
      startStr = values[0],
      stopStr = values[1],
      varName = values[2],
      start = parseInt(startStr, 10),
      stop = parseInt(stopStr, 10),
      padLength = startStr.length, // detect padding length
      originalNode = element,
      content = ''

    originalNode.innerHTML = element.originalHtml

    for (var i = start; i <= stop; i++) {
      var innerHtml = originalNode.innerHTML,
        regex = new RegExp('\\{' + varName + '\\}', 'g')

      // Format number with leading zeros if needed
      var formatted = i.toString().padStart(padLength, '0')

      innerHtml = innerHtml.replace(regex, formatted)
      content += innerHtml
    }

    element.innerHTML = content

    var elements = app.element.find(element, '*')
    app.attributes.run(elements)
  },

  /* @function rerun
   * @memberof dom
  */
  rerun: function (object, exclude) {
    var el = object.exec ? object.exec.element : object

    if (el.originalHtml) el.innerHTML = el.originalHtml

    // Collect el + all descendants into one array
    var nodes = [el]
    var all = app.element.find(el, '*')
    for (var i = 0, n = all.length; i < n; i++) {
      nodes[nodes.length] = all[i]
    }

    app.attributes.run(nodes, exclude, true)
  },

  rundelay: function (object, value) {
    var el = app.element.resolveCall(object, value)

    setTimeout(function () {
      app.call(el.call.string, { element: el.call.element })
    }, parseInt(el.call.delayValue, 10) || 1000)
  },

  runrepeat: function (object, value) {
    var el = app.element.resolveCall(object, value)
    setInterval(function () {
      app.call(el.call.string, { element: el.call.element })
    }, parseInt(el.call.delayValue, 10) || 1000)
  },

  /**
   * @function reload
   * @memberof dom
   */
  reload: function (object, value) {
    app.element.select(value).contentDocument.location.reload(true)
  }
}

var app = {
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

  /**
   * @namespace load
   * @memberof app
   * @desc Handles the loading of the application.
   */
  load: function () {
    if (!window.frontLoaded) {
      app.disable(true)
      // TODO: Experimental feature
      if (app.isLocalNetwork) {
        var selector = 'script[src*=front]',
          element = app.element.select(selector),
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

  /**
   * @namespace disable
   * @memberof app
   * @desc Handles disabling and enabling the visibility of the application.
   */
  disable: function (bool) {
    var val = bool ? 'hidden' : 'initial',
      isURI = document.location.href.indexOf('data:') !== 0 // Stops iframes.
    if (isURI) document.documentElement.style.cssText = 'visibility:' + val
  },

  /**
   * @namespace start
   * @memberof app
   * @desc Handles the initialization of the application.
   */
  start: function () {
    var selector = 'script[src*=front]',
      element = app.element.select(selector),
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
      var bodyClick = document.body.attributes.click
      var link, click
      if (bodyClick) {
        link = document.body
        click = bodyClick
      } else {
        link = app.element.getTagLink(e.target) || e.target
        click = link.attributes.click
      }
      /*,
    onclickif = link.attributes.onclickif

  if (onclickif) {
    var ret = app.call(onclickif.value, { element: link })[0]
    if (!ret) return
  }*/

      if (click) {
        var clicktargetfield = link.attributes.clicktargetfield,
          target = clicktargetfield && clicktargetfield.value.split(':') || ''
        //,
        //element = target && app.element.select(target[0]) || element

        /* element.lastRunAttribute = val[0]
         element.targetAttribute = target && target[1]
         element.targetField = clicktargetfield
         element.clicked = element*/
        app.call(click.value, { srcElement: link, element: app.element.select(target[0]) })
        app.element.runOnEvent({ exec: { func: 'click', element: link } })
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
        app.call(mouseover.value, { srcElement: link, element: app.element.select(target[0]) })
        //app.element.runOnEvent({ exec: { func: 'click', element: link } })*/
      }
    })


    app.listeners.add(document, 'mouseout', function (e) {
      var link = app.element.getTagLink(e.target) || e.target,
        mouseout = link.attributes.mouseout,
        onmouseoutif = link.attributes.onmouseoutif

      if (onmouseoutif) {
        var ret = app.call(onmouseoutif.value, { element: link })[0]
        if (!ret) return
      }

      if (mouseout) {
        var mouseouttargetfield = link.attributes.mouseouttargetfield,
          target = mouseouttargetfield && mouseouttargetfield.value.split(':') || ''
        app.call(mouseout.value, { srcElement: link, element: app.element.select(target[0]) })
      }
    })

    app.listeners.add(document, 'input', function (e) {
      app.listeners.change('input', e.target, false, e)
    })
  },

  /**
   * @namespace call
   * @memberof app
   * @desc Handles parsing and executing commands based on a string input.
   */
  call: function (run, options) {
    var execResult = [],
      runArray = run && run.split(';')

    for (var i = 0; i < runArray.length; i++) {
      var string = runArray[i],
        parsedCall = app.parse.callString(string, options),
        run = dom._actionMap[parsedCall.func] || parsedCall.func

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

  /**
   * @namespace exec
   * @memberof app
   * @desc Handles the execution of functions based on a string input.
   */
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
      app.element.runOnEvent(args) // check for element events.
    }
  },

  /**
   * @namespace click
   * @memberof app
   * @desc Handles simulating click and double-click events on DOM elements.
   */
  click: function (el, dbl) {
    var event, eventName = dbl ? 'dblclick' : 'click'
    try {
      event = new CustomEvent(eventName, { bubbles: true, cancelable: true })
    } catch (e) {
      // Fallback for older browsers.
      event = document.createEvent('HTMLEvents')
      event.initEvent(eventName, true, true)
    }

    return el.dispatchEvent(event)
  },

  /**
   * @namespace parse
   * @memberof app
   * @desc Handles parsing of strings and creating DOM nodes.
   */
  parse: {

    /**
     * @function callString
     * @memberof app.parse
     */
    callString: function (string, options) {
      options = options || {}

      // Matches: [X]:... OR func[X]:...
      var prefixMatch = string.match(/^((\w+)?\[(\d+)\]):(.*)$/)
      if (prefixMatch) string = prefixMatch[4]

      var parts = string.split(':'),
        delayValue,
        delayFunc = prefixMatch && prefixMatch[2],
        func = parts[0],
        element1 = parts[1] && (parts[1][0] === '#' || parts[1][0] === '*') && (parts[1].split('.') || [])[0],
        element2 = parts[2] && (parts[2][0] === '#' || parts[2][0] === '*') && (parts[2].split('.') || [])[0],
        attribute1 = element1 && (parts[1].split('.') || [])[1],
        attribute2 = element2 && (parts[2].split('.') || [])[1],
        value = app.element.extractBracketValues(string),
        unique = parts[1] && parts[1][0] === '!' ? true : false

      var objElement1 = !element1 && options && options.element ? options.element : element1 === '#' || (!element1 && options && options.srcElement) ? options.srcElement : element1 ? app.element.select(element1.replace('*', '')) : '',
        objElement2 = element2 === '#' ? (options && options.srcElement) : app.element.select(element2),
        attribute1Type = attribute1 ? attribute1 : app.element.get(objElement1, false, true),
        attribute2Type = attribute2 ? attribute2 : app.element.get(objElement2, false, true),
        value = objElement2 && attribute2 ? app.element.get(objElement2, attribute2) : (objElement2 ? app.element.get(objElement2) : value === '' ? app.element.get(objElement1, attribute1) : value)

      if (prefixMatch) {
        delayFunc = func
        func = prefixMatch[2] || objElement1.lastRunAttribute
        delayValue = prefixMatch[3]
      }

      return {
        func: func || false,
        element: objElement1 || false,
        subElement: objElement2 || false,
        attribute: attribute1Type || false,
        hasAttribute: !!attribute1,
        hasSubAttribute: !!attribute2,
        subAttribute: attribute2Type || false,
        value: value === undefined ? false : value,
        unique: unique,
        delayValue: delayValue || false,
        delayFunc: delayFunc || false,
        string: string
      }
    },

    /**
     * @function attribute
     * @memberof app.parse
     * @param {string} string - The string to parse.
     * @return {object} - An object containing key-value pairs parsed from the string.
     * @desc Parses a string into an object by splitting the string by ';' and then by the first ':' only.
     */
    attribute: function (string) {
      var object = {},
        pairs = string ? string.split(';') : []
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].trim()
        if (!pair) continue  // skip empty pairs

        var colonIndex = pair.indexOf(':')
        if (colonIndex === -1) continue  // skip if no colon

        var key = pair.slice(0, colonIndex).trim(),
          value = pair.slice(colonIndex + 1).trim()

        if (key) object[key] = value
      }
      return object
    },

    /**
     * @function text
     * @memberof app.parse
     * @param {string} string - The HTML string to parse.
     * @return {Node} - A DOM node representing the parsed HTML.
     * @desc Parses a string of HTML and return a DOM node.
     */
    text: function (string, exclude) {
      var el = document.createElement('spot'),
        html = string && string.match(/<html\s+([^>]*)>/i) || '',
        body = string && string.match(/<body\s+([^>]*)>/i) || '',
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
        var attr = {}
        var attributes = body[1].trim(),
          attributePairs = attributes.split(/\s+/)

        for (var i = 0; i < attributePairs.length; i++) {
          var pair = attributePairs[i].split('='),
            name = pair[0],
            value = pair[1].slice(1, -1)
          attr[name] = value
        }

        el.attrList = attr
      }

      if (exclude) {
        for (var k = 0; k < exclude.length; k++) {
          var tag = exclude[k]

          // Remove paired tags: <tag> ... </tag>
          var paired = new RegExp('<' + tag + '[^>]*>[\\s\\S]*?<\\/' + tag + '>', 'gi')
          string = string.replace(paired, '')

          // Remove single/self-closing tags: <tag ...>
          var single = new RegExp('<' + tag + '[^>]*>', 'gi')
          string = string.replace(single, '')
        }
      }

      el.innerHTML = string
      el.doctype = doctype ? doctype[0] : ''

      return el
    },

    /**
     * @function json
     * @memberof app.parse
     */
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
   * @namespace element
   * @memberof app
   * @desc Handles manipulations of DOM elements.
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

    /**
     * 
     * @function get
     * @memberof app.element
     */
    get: function (element, attrValue, attrName, customValue) {
      if (element) {
        if (attrValue) return element.attributes[attrValue].value // Return attribute value.

        var target = element.targetAttribute || ''
        if (target) return element.attributes[target].value

        if (customValue) return customValue === 'label' ? element.options[element.selectedIndex].text : '' // Return attribute name.

        var property = this._propertyMap[element.localName] || 'textContent'
        if (attrName) return property // Return attribute name.

        return element[property]
      }
    },

    /**
     * 
     * @function set
     * @memberof app.element
     */
    set: function (element, value, attr) {
      attr = element.exec ? element.attribute : attr,
        type = element.type,
        localName = element.localName

      if (attr) {
        attr = attr.replace('set', '')
        switch (attr) {
          case 'attr':
            element.setAttribute(typeof value === 'string' ? value : value[0], value[1] || '')
            break
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
          case 'queryhref':
            // EXPERIMENTAL
            var attr = element.getAttribute('href') || '',
              values = value.split(':'),
              query = values[0],
              operation = values[1]

            element.setAttribute('href', app.element.operate(operation, query, attr))
            break
          case 'value':
            element.setAttribute('value', value)
            element.value = value
            break
          default:
            var call = element.call
            if (call) {
              values = call.split(':'),
                query = values[0],
                operation = values[1],
                test = element.getAttribute('max')

              value = app.element.operate(operation, false, test)

            }
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
          element.renderedText = value //todo: Fix this. Strange rendering solution.
      }
    },

    /**
     * 
     * @function add
     * @memberof app.element
     */
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

    /**
    * 
    * @function operate
    * @memberof app.element
    */
    operate: function (operation, query, attr) {
      // Parse dynamic operation parts
      var op = operation[0],
        operand = parseFloat(operation.slice(1)) || 1 // default multiplier/addend to 1 if not provided

      var apply = function (value) {
        var num = parseFloat(value)
        if (isNaN(num)) return value

        switch (op) {
          case '+': return num + operand
          case '-': return num - operand
          case '*': return num * operand
          case '/': return num / operand
          case '+': return num + operand
          case '++': return num + 1
          case '--': return num - 1
          default: return value
        }
      }

      if (query) {
        // Modify specific query parameter in the URL
        var regex = new RegExp('(\\b' + query + '=)(-?\\d+(?:\\.\\d+)?)', 'g')
        return attr.replace(regex, function (match, prefix, currentValue) {
          return prefix + apply(currentValue)
        })
      } else {
        // Apply the operation directly to the entire attribute value
        return apply(attr)
      }
    },

    /**
    * 
    * @function toggle
    * @memberof app.element
    */
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
    * @function select
    * @memberof app.element
    * @param {string} selector - The CSS selector used to select the elements.
    * @param {boolean} [list=undefined] - If true, always return a list of elements, even if only one element matches the selector.
    * @return {Element|Element[]} - Returns a single element if there is only one match and "list" is not set to true, or a list of elements if "list" is set to true or if there are multiple elements that match the selector.
    * @desc Retrieves elements from the document by selector.
    */
    select: function (selector, list) {
      var regex = /\[(\d+)\]/,
        match = selector && selector.match(regex)

      if (match) {
        var index = match[1],
          selector = selector.replace(regex, '')
      }

      try {
        var elements = document.querySelectorAll(selector)
      } catch (e) {
        return app.log.warn(1)('Invalid selector: ' + selector)
      }

      if (elements.length === 0)
        return ''
      else if (match)
        return elements[index]
      else
        return list ? elements : (elements.length === 1 ? elements[0] : elements)
    },

    /**
     * @function find
     * @memberof app.element
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
     * @memberof app.element
     * @param {Element} element - The element to start the search from.
     * @return {Element|null} The found anchor element, or `null` if none was found.
     * @desc Finds the first ancestor of the given element that is an anchor element (`<a>`).
     */
    getTagLink: function (element) {
      for (var current = element; current; current = current.parentNode) {
        var type = current.localName
        if (type === 'a' || type === 'button' || type === 'label') return current
      }
      return null
    },

    /**
     * @function resolveCall
     * @memberof app.element
     * @param {*} element - The element to resolve
     * @returns {Object} - Element with its call context
     */
    resolveCall: function (element, value) {
      if (element.exec) {
        var call = element.exec
        element = call.element
        element.call = call
      } else if (value) {
        var parsedCall = app.parse.callString(value, { srcElement: element })
        element.call = parsedCall
        element.autorun = true
      }
      return element
    },
    /**
     * 
     * @function resolveBindingValue
     * @memberof app.element
     * @returns 
     */
    resolveBindingValue: function (elem, variableName, targetValue) {
      // Create a cached regex only once per variableName
      var regex = new RegExp("\\{" + variableName + ":(.*?)\\}")
      var html = elem.innerHTML || '',
        match = html.match(regex),
        defaultValue = match ? match[1].trim() : ''

      return targetValue || defaultValue || ''
    },

    /**
     * @function getPropertyByPath
     * @memberof app.element
     */
    getPropertyByPath: function (object, path) {
      var pathSegments = path && path.split('.') || [],
        value = object

      for (var i = 0; i < pathSegments.length; i++) {
        value = value === null || value === undefined ? '' : value[pathSegments[i]]
      }

      return value
    },

    /**
     * @function extractBracketValues
     * @memberof app.element
     */
    extractBracketValues: function (str) {
      var values = [],
        start = -1,
        depth = 0

      for (var i = 0; i < str.length; i++) {
        var ch = str[i]

        if (ch === '[') {
          if (depth === 0) start = i + 1 // start of new bracket content
          depth++
        } else if (ch === ']') {
          depth--
          if (depth === 0 && start !== -1) {
            values.push(str.substring(start, i))
            start = -1
          }
          if (depth < 0) {
            // unbalanced bracket, reset
            depth = 0
            start = -1
          }
        }
      }

      // If only one value, return it as string, else array
      return values.length ? (values.length === 1 ? values[0] : values) : ''
    },

    saveOriginalValues: function (element) {
      if (!element._originalCaptured) {
        element._originalCaptured = true
        var clone = []
        for (var i = 0; i < element.attributes.length; i++) {
          var a = element.attributes[i]
          clone.push({ name: a.name, value: a.value, originalValue: a.value })
        }
        element.originalAttributes = clone

        // Optionally store snapshots of text/html for completeness
        element.originalText = element.textContent
        element.originalHtml = element.innerHTML
        element.originalOuterHtml = element.outerHTML
        element.originalLabel = element.label
        element.originalValue = element.value
        element.originalStyle = element.style
      }
    },

    runOnEvent: function (parsedCall) {
      if (parsedCall.exec) {
        var func = dom._eventMap[parsedCall.exec.func] || parsedCall.exec.func,
          el = parsedCall.exec.element,
          exec = el.executed && el.executed[func],
          hasAttr = el && el.getAttribute

        if (!exec) {
          var call = hasAttr && el.getAttribute('on' + func)
          if (call) {
            el.executed[func] = true
            el.call = call
            app.call(call, parsedCall.exec)
            el.executed = {} // Reset
          }

          var call = hasAttr && el.getAttribute('onif' + func)
          if (call) dom.if(el, call)
        }
      } else {
        var func = parsedCall.attribute,
          el = parsedCall.element,
          call = hasAttr && el.getAttribute('onif' + func)
        if (call) dom.if(el, call)
      }
    },

    /**
     * @function onchange
     * @memberof app.element
     */
    onchange: function (object, value, once) {
      if (value) {
        var onchange = object.getAttribute('on' + value.replace('set', '') + 'change')
        if (onchange) app.call(onchange, { srcElement: object })
      }
    },

    /**
     * @function onload
     * @memberof app.element
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
     * @memberof app.element
     */
    onsubmit: function (e) {
      if (app.adf) app.adf._form(e) // Ajax Data Form support via module.

      // Call actions with delay to allow key events to finish.
      setTimeout(function () {
        var srcEl = e.srcElement,
          attr = srcEl.getAttribute('onformsubmit'),
          submit = attr && attr.split(';')

        for (action in submit) {
          app.call(submit[action], { element: srcEl })
        }
      }, 50)
    }
  },

  /**
   @namespace log
   @memberof app
   @desc Handles logging of information and errors.
   */
  log: (function () {
    var methods = ['info', 'error', 'warn'],
      msg = {
        100: 'Skipping attribute:',
        400: 'Attribute not found:'
      },
      l = {}

    for (var i = 0; i < methods.length; i++) {
      (function (m) {
        l[m] = function (v) {
          var ok = app.debug === 'true' || app.debug === 'localhost' && app.isLocalNetwork
          if (!ok) return function () { }

          var p = m === 'info' ? (v ? ' ❱' : '❚') : (msg[v] || '')

          return function () {
            if (console && console[m]) {
              // Convert arguments to array and prepend our prefix
              var args = Array.prototype.slice.call(arguments)
              args.unshift(p)
              // IE10 requires apply to be called on console
              Function.prototype.apply.call(console[m], console, args)
            }
          }
        }
      })(methods[i])
    }

    return l
  })(),

  /**
   * @namespace config
   * @memberof app
   * @desc Handles configuration settings for the application.
   */
  config: {

    /**
     * @function get
     * @memberof app.config
     * @param {string} extension - The name of the extension (plugin or module).
     * @param {object} standard - The standard configuration object.
     * @param {object} element - The DOM element.
     * @returns {object} final - The final configuration object.
     * @desc Gets the configuration from the DOM element and overrides the standard configuration.
     */
    get: function (extension, standard, element) {
      var value = element && element.getAttribute ? element.getAttribute(extension ? extension + '-conf' : 'conf') : '',
        override = value ? app.parse.attribute(value) : {},
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

  /**
   * @namespace globals
   * @memberof app
   * @desc Handles global variables for the application.
   */
  globals: {
    frontVersion: { major: 1, minor: 0, patch: 0, build: 534 },
    language: document.documentElement.lang || 'en',
    docMode: document.documentMode || 0,
    isFrontpage: document.doctype ? true : false,
    href: '',
    title: '',
    windowHeight: (window.visualViewport && window.visualViewport.height) || window.innerHeight,
    windowWidth: (window.visualViewport && window.visualViewport.width) || window.innerWidth,

    set: function (name, value) {
      window.app.globals[name] = value
    },

    get: function (name) {
      return window.app.globals[name]
    },

    refresh: function () {
      this.href = location.href
      this.title = document.title
    }
  },

  /**
   * @namespace caches
   * @memberof app
   * @desc Handles caching mechanisms for different types of data.
   */
  caches: {
    module: {},
    var: {},
    page: {},
    template: {},

    /**
     * 
     * @function get
     * @memberof app.caches
     */
    get: function (mechanism, type, key, options) {
      options = options || {}
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
          if (data && options.fetchJson) data = JSON.parse(data.data)
      }
      return data
    },

    /**
     * 
     * @function set
     * @memberof app.caches
     */
    set: function (mechanism, type, key, data, status, format, ttl) {
      if (app.storageKey) key = app.storageKey + '_' + key
      switch (format) {
        case 'xml':
          data = new DOMParser().parseFromString(data, 'text/xml')
          break
        case 'json':
          var json = app.parse.json(data)
          data = json.value
          this.responseError = json.errorMessage
          break
      }

      var cacheData = {
        'data': data,
        'status': status ? status : '',
        'headers': '',
        'globals': app.globals,
        'ttl': ttl ? ttl : false,
        'expires': ttl ? ttl + Date.now() : false
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
    },

    /**
     * 
     * @function remove
     * @memberof app.caches
     */
    remove: function (mechanism, key) {
      switch (mechanism) {
        case 'local':
          localStorage.removeItem(key)
          break
        case 'session':
          sessionStorage.removeItem(key)
          break
      }
    }
  },

  /**
   * @namespace listeners
   * @memberof app
   * @desc Handles event listeners for DOM elements.
   */
  listeners: {
    add: function (element, eventType, callback) {
      element.removeEventListener(eventType, callback)
      element.addEventListener(eventType, callback)
      element.listeners = element.listeners || {}
      element.listeners[eventType] = (element.listeners[eventType] || []).concat(callback)
    },

    remove: function (element, eventType, callback) {
      element.removeEventListener(eventType, callback)
    },

    dispatch: function (name, detail) {
      try {
        // Ensure CustomEvent exists (polyfill for old browsers)
        if (typeof window.CustomEvent !== 'function') {
          window.CustomEvent = function (event, params) {
            params = params || { detail: undefined, bubbles: false, cancelable: false }
            var evt = document.createEvent('CustomEvent')
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
            return evt
          }
          window.CustomEvent.prototype = window.Event.prototype
        }

        var ev = new CustomEvent(name, { detail: detail, bubbles: true, cancelable: false })
        // dispatch on window (listeners registered on window) or document fallback
        if (window && window.dispatchEvent) window.dispatchEvent(ev)
        else if (document && document.dispatchEvent) document.dispatchEvent(ev)
      } catch (err) {
        // silent failure for very old environments
      }
    },

    change: function (type, object, test) {
      // Todo
      var changeValue = object.attributes.onvaluechange,
        changeValueIf = object.attributes.onvaluechangeif,
        changeStateValue = object.attributes.onstatevaluechange,
        changeStateValueIf = object.attributes.onstatevaluechangeif,
        changeSelect = object.attributes.onselectchange

      if (changeValue) {
        /*var beforeChangeValue = object.attributes.onbeforevaluechange,
          afterChangeValue = object.attributes.onaftervaluechange
        */
        console.error('change: ' + changeValue.value)
        app.call(changeValue.value, { element: object })
      }

      if (changeValueIf) {
        var value = changeValueIf.value.split(':'),
          compareValue = object.value,
          values = value.slice(1).join(':'),
          call = values.split('?'),
          result = compareValue === value[0] ? call[0] : call[1] || call[0]
        app.call(result)
      }

      if (changeStateValueIf) {
        var val = changeStateValueIf.value.split(';'),
          attr = object.value

        var element = app.element.select('#result'),
          elValue = element.attributes.statevalue.value

        // Check if statevalue contains an operator followed by a number
        var match = elValue.match(/([\+\-\*\/])(\d+)$/)

        if (match) {
          // Keep the numeric part following the last operator in the input value
          element.value = match[2]
        }
      }

      if (changeStateValue) {
        app.call(changeStateValue.value, { element: object, state: true })
      }

      // Experimental
      if (changeSelect) {
        app.call(changeSelect.value)
        var previouslySelected = app.element.select('input[type="radio"][selected="true"]')

        if (previouslySelected) {
          previouslySelected.removeAttribute('selected') // Clear the previous selection
          app.call(previouslySelected.getAttribute('onunselected'))
        }

        object.setAttribute('selected', 'true') // Mark the current radio as selected
      }
    }
  },

  /**
   * @namespace assets
   * @memberof app
   * @desc Handles loading and managing application assets.
   */
  assets: {
    load: function () {
      if (app.isFrontpage) {
        dom.doctitle(false, document.title)
        app.srcDocTemplate = document.body.innerHTML
        app.globals.refresh()
        this.get.extensions()
        // Continue to show application when no assets to load
        if (app.vars.total === 0 && app.extensions.total === 0) app.disable(false)
      } else {
        var templateElement = app.element.select('template', true)[0], // Get only the first template element.
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
        // If no vars to load, proceed to finalize immediately.
        if (app.vars.total === 0) return app.xhr.finalize('var')

        app.log.info()('Loading vars...')
        for (var j = 0; j < app.vars.total; j++) {
          var name = app.vars.name[j]
          var cache = app.caches.get('session', 'var', name)
          if (cache && cache.data) {
            app.caches.set('window', 'var', name, cache.data)
            app.vars.loaded++
            app.xhr.finalize('var')
          } else {
            app.log.info(1)(name)
            app.xhr.request({
              url: app.varsDir + '/' + name + '.json',
              type: 'var',
              cache: {
                mechanism: 'session',
                format: 'json',
                keyType: 'var',
                key: name
              }
            })
          }
        }
      },

      /**
       * @function extensions
       * @memberof app.get
       * @param {function} [runAttributes] - A flag to indicate if the runAttributes function should be called after all modules are loaded.
       * @desc Loads extensions(modules) from the `module` attribute of the script element and call autoload function if exists.
       */
      extensions: function () {
        // If no extensions to load, proceed to vars immediately.
        if (app.extensions.total === 0) return app.assets.get.vars()

        app.log.info()('Loading extensions...')

        var allExtensions = app.extensions.module.concat(app.extensions.plugin),
          modulesCount = app.extensions.module.length

        for (var i = 0; i < app.extensions.total; i++) {
          (function (i) {

            // Determine if the current script is a module or a plugin
            var isModule = i < modulesCount
            var folder = isModule ? 'modules' : 'plugins'

            var script = document.createElement('script')
            script.name = allExtensions[i]
            script.src = app.script.path + folder + '/' + script.name + '.js'
            script.defer = true

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
       * @function templates
       * @memberof app.get
       */
      templates: function () {
        app.log.info()('Loading templates...')
        var src = app.srcTemplate.url.src,
          srcDoc = app.srcTemplate.url.srcDoc,
          hasStartpage = srcDoc ? -1 : 0

        for (var i = 0; i < app.srcTemplate.total; i++) {
          var isStartpage = srcDoc && i === 0 ? true : false,
            currentTemplate = isStartpage ? srcDoc : src[i + hasStartpage],
            url = window.location.origin + window.location.pathname.replace(/\/+$/, '') + '/' + currentTemplate + '.html'

          app.xhr.request({
            url: url,
            type: 'template',
            cache: {
              mechanism: 'window',
              format: 'html',
              keyType: 'template',
              key: currentTemplate
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
      'action',
      'async',
      'alt',
      'checked',
      'conf',
      'class',
      'click',
      'charset',
      'content',
      'defer',
      'href',
      'for',
      'id',
      'lang',
      'module',
      'name',
      'open',
      'required',
      'selected',
      'src',
      'style',
      'rel',
      'target',
      'type',
      'title',
      'value'],

    /**
     * @function run
     * @memberof app.attributes
     * @param {string|Object} [selector='html *'] - A CSS selector or an object representing elements to be processed.
     * @param {Array} [exclude] - An array of items to be excluded from processing.
     * @desc Runs Front Text Markup Language in elements matching the given selector or provided object.
     */
    run: function (selector, exclude, ignore) {
      var selector = selector || 'html *',
        node = typeof selector === 'object' ? selector : app.element.select(selector, true),
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

        app.element.saveOriginalValues(element)
        attributes = [].slice.call(attributes)

        // Normalize attributes for IE.
        if (app.docMode > 0 && app.docMode <= 11) {
          attributes = attributes.reverse()
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

            if (exclude.indexOf(attrName) === -1 && exclude.indexOf(attrFullname) === -1) {
              var name = attrFullname.split('-')
              element.originalAttribute = dom._actionMap[attrName] && attrName

              if (attrName === 'include') dom.setUniqueId(element) // Add ID to all includes.

              if (app.plugin[name[0]] && name[1] === '' && name[2]) {
                app.log.info(1)(name[0] + ':' + name[0] + '-' + name[1])
                element.lastRunAttribute = attrName
                app.plugin[name[0]][name[2]] ? app.plugin[name[0]][name[2]](element) : app.log.error(400)(name[0] + '--' + name[2])
              } else if (app.module[name[0]] && name[1]) {
                app.log.info(1)(name[0] + ':' + name[0] + '-' + name[1])
                element.lastRunAttribute = attrName
                app.module[name[0]][name[1]] ? app.module[name[0]][name[1]](element) : app.log.error(400)(name[0] + '-' + name[1])
              } else if (dom[name]) {
                app.log.info(1)('dom.' + name)
                element.lastRunAttribute = attrName
                dom[name](element, attrValue)
              }
              element.executed = {}

              // Run onEvent for all attributes.
              app.element.runOnEvent({ exec: { func: attrName, element: element } })
            } else {
              app.log.warn(100)(name + '')
            }
          }
        }
      }
    }
  },

  /**
   * @namespace variables
   * @memberof app
   * @desc Handles updating variables in the application.
   */
  variables: {

    /**
    * @namespace update
    * @memberof app.variables
    * @desc Update module for replacing variables in attributes and content.
    */
    update: {

      /**
       * @function attributes
       * @memberof app.variables.update
       * @desc Replaces {var} in element attributes.
       */
      attributes: function (object, replaceVariable, replaceValue, options) {
        options = options || {}
        if (replaceVariable) {
          if (options.reset && !options.resetSoft) {
            app.variables.reset.attributes(object)
            options.reloadContent && app.variables.reset.content(object)
          }

          if (options.resetSoft) {
            app.variables.reset.attribute(object, options.single)
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

          if (options.reset && !options.resetSoft) {
            var exclude = ['stop'].concat(options.exclude || [])
            app.attributes.run([object], exclude, true)
          }
        }
      },

      /**
      * @function content
      * @memberof app.variables.update
      */
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
            var childNodes = element.childNodes
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

    /**
    * @function reset
    * @memberof app.variables
    */
    reset: {

      /**
      * @function attributes
      * @memberof app.variables.reset
      */
      attributes: function (object) {
        var original = object.originalAttributes
        for (var i = 0; i < original.length; i++) {
          var attr = original[i]
          object.setAttribute(attr.name, attr.originalValue || attr.value)
        }
      },

      /**
      * @function attribute
      * @memberof app.variables.reset
      */
      attribute: function (object, original) {
        var attr = original
        object.setAttribute(attr.name, attr.value)
      },

      /**
      * @function content
      * @memberof app.variables.reset
      */
      content: function (object) {
        object.innerHTML = object.originalHtml
      }
    }
  },

  /**
   * @namespace querystrings
   * @memberof app
   * @desc Handles query string parameters in URLs.
   */
  querystrings: {
    get: function (url, param) {
      var parser = document.createElement('a')
      // Use the provided URL, or fallback to SPA history state (for Safari), otherwise use window.location
      parser.href = url || (window.history.state && window.history.state.href) || window.location.href
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
   * @desc Handles loading and rendering of templates.
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

    /**
     * @function render
     * @memberof app.templates
     */
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
          responsePage = app.parse.text(cache.data, ['title']),
          responsePageBodyAttr = responsePage.attrList,
          responsePageScript = app.element.find(responsePage, app.script.selector),
          responsePageBaseHref = app.element.find(responsePage, 'base')

        dom.hrefhost(responsePageBaseHref)
        var responsePageContent = responsePage.innerHTML

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
            html = app.parse.text(cache.data, ['meta', 'base']),
            template = app.parse.text(app.element.find(html, 'template').innerHTML),
            srcDoc = app.parse.text(app.srcDocTemplate),
            hasMarkup = app.element.select('template')

          for (var j = 0; j < this.elementSelectors.length; j++) {
            var elSelector = this.elementSelectors[j],
              parsedEl = app.element.find(template, elSelector.name),
              content = parsedEl.innerHTML,
              attr = parsedEl.attributes || [],
              srcDocEl = app.element.find(srcDoc, elSelector.name)

            // Support attributes in the template.
            for (var key in attr) {
              if (attr.hasOwnProperty(key)) app.element.select(elSelector.name).setAttribute(attr[key].name, attr[key].value)
            }

            if (elSelector.name !== 'main') {
              dom.set(elSelector.name, parsedEl.nodeType === 1 ? content : srcDocEl.innerHTML)
              hasMarkup && app.attributes.run(elSelector.name + ' *') // Run attributes in children
            }

            hasMarkup && app.attributes.run(elSelector.name) // Run attributes in parent
          }
        }
      }

      for (var key in responsePageBodyAttr) {
        app.element.select('body').setAttribute(key, responsePageBodyAttr[key])
      }

      dom.doctitle(false, currentPageTitle)
      app.globals.refresh()
    }
  },

  /**
   * @namespace xhr
   * @memberof app
   * @desc Handles XMLHttpRequests (XHR) for loading resources.
   */
  xhr: {
    currentRequest: null,
    currentAsset: { loaded: 0, total: 1 },

    /**
     * @function start
     * @memberof app.xhr
     * @desc
     */
    start: function () {
      var self = this,
        open = XMLHttpRequest.prototype.open,
        send = XMLHttpRequest.prototype.send

      self.finalize = function (type) {
        if (app.extensions.loaded === app.extensions.total
          && app.vars.loaded === (app.vars.total + app.vars.totalStore)
          && type !== 'template' && type !== 'data') {

          app.log.info()('Loaded extensions:', app.extensions.loaded + '/' + app.extensions.total +
            ', vars:', app.vars.loaded + '/' + (app.vars.total + app.vars.totalStore))
          app.attributes.run()
          app.disable(false)
        }
      }

      XMLHttpRequest.prototype.open = function () {
        var originalOnReadyStateChange = this.onreadystatechange
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

            var options = this.options || {},
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
                obj[globalName] = app.parse.json(this.responseText).value[globalName]
                app.globals.set(module, obj)
              }
            }

            if (cache) {
              //if (cache && (statusType.success || statusType.redirect))
              app.caches.set(cache.mechanism, cache.keyType, cache.key, this.responseText, this.status, cache.format)

              // Cache in local when ttl is provided.
              if (cache.ttl > 0) app.caches.set('local', 'module', cache.key, this.responseText, this.status, cache.format, cache.ttl)
            }

            if (type) {
              switch (type) {
                case 'page':
                  var responsePage = app.parse.text(this.responseText, ['base']),
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
                  app.globals.refresh()
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
                  app.module[module].fetchedData = format === 'json' ? app.parse.json(this.responseText).value : this.responseText
                default:
                  return
              }

              self.finalize(type)
            }
          }

          // Call the original handler if it exists
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments)
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
      if (!options.url) return // prevent empty requests. example in include attribute.
      var method = options.method ? options.method.toUpperCase() : 'GET',
        url = options.url instanceof Array ? options.url : [options.url],
        target = options.target ? app.element.select(options.target) : options.element,
        single = options.single,
        cache = options.cache || false,
        cacheTtl = cache.ttl || false,
        headers = options.headers ? app.parse.attribute(options.headers) : {},
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
        var status = this.statusType || {}
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
                data: app.parse.json(responseData).value,
                error: responseError
              }
            })
          }

          if (success) {
            //if (srcEl) {
            app.call(success, { srcElement: srcEl })
            //}

            // Clean up error element.
            if (error) {
              var val = error.split(':')
              if (val[0] === 'show') dom.hide(val[1])
            }
          }

          if (aftersuccess) {
            var initValue = aftersuccess.originalValue
            app.call(aftersuccess.value, {
              srcElement: srcEl,
              srcAttribute: aftersuccess.name,
              response: {
                data: app.parse.json(responseData).value,
                error: responseError
              }
            })

            initValue && (aftersuccess.value = initValue) // Reset value
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
        var groups = {}

        if (srcEl.elements) {
          for (var i = 0; i < srcEl.elements.length; i++) {
            var el = srcEl.elements[i],
              name = el.name,
              val = el.value,
              ignore = el.attributes.ignorepayload || false

            if (!name || !val || ignore) continue

            var match = name.match(/^(.+)\[(\d+)\]$/)
            if (match) {
              var base = match[1],
                idx = parseInt(match[2], 10)
              if (!groups[base]) groups[base] = []
              groups[base][idx] = val
            } else {
              // dot notation support
              var parts = name.split('.'),
                cur = json
              for (var j = 0; j < parts.length - 1; j++) {
                if (!cur[parts[j]]) cur[parts[j]] = {}
                cur = cur[parts[j]]
              }
              cur[parts[parts.length - 1]] = val
            }
          }

          // merge bracket groups
          for (var key in groups) {
            var parts = key.split('.'),
              cur = json
            for (var j = 0; j < parts.length - 1; j++) {
              if (!cur[parts[j]]) cur[parts[j]] = {}
              cur = cur[parts[j]]
            }
            cur[parts[parts.length - 1]] = groups[key].join('')
          }

        } else {
          var name = srcEl.name ? srcEl.name : srcEl.attributes.name.value,
            val = srcEl.name ? srcEl.value : srcEl.outerText,
            parts = name.split('.'),
            cur = json
          for (var j = 0; j < parts.length - 1; j++) {
            if (!cur[parts[j]]) cur[parts[j]] = {}
            cur = cur[parts[j]]
          }
          cur[parts[parts.length - 1]] = val
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
  },
}

app.load()