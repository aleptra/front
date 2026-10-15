'use strict'

app.module.form = {

  __autoload: function (options) {
    this.module = options.name

    var self = this
    var scrolled = false

    // Native form validation
    document.addEventListener('invalid', function (e) {
      e.preventDefault()

      if (!scrolled) {
        e.target.scrollIntoView({ block: 'center' })
        e.target.focus()
        scrolled = true
        setTimeout(function () {
          scrolled = false
        }, 100)
      }

      self._showTip(e.target)
    }, true)

    // Form throttling
    document.addEventListener('submit', function (e) {
      var form = e.target || e.srcElement
      if (!form || !form.getAttribute) return

      var ms = parseInt(form.getAttribute('form-throttle'), 10)
      if (!ms || isNaN(ms) || ms < 1) return

      if (form._formThrottled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      form._formThrottled = true
      app.wait(ms, function () {
        form._formThrottled = false
      })
    }, true)
  },

  // Validation tip
  _showTip: function (el) {
    var raw = el.getAttribute(this.module + '-invalid') || ''
    var message = app.element.extractBracketValues(raw)
    var targetId = message ? raw.split(':')[0] : ''
    var target = targetId ? app.element.select(targetId) : null

    if (!target) return

    target.textContent = message || raw || el.validationMessage || ''

    el.addEventListener('input', function () {
      target.textContent = ''
    })
    el.addEventListener('change', function () {
      target.textContent = ''
    })
  },

  // -------------------------------------------------
  // form-upload
  // -------------------------------------------------
  upload: function (context) {
    var exec = context && context.exec
    var el = exec && exec.element
    var pattern = (exec && exec.value) || '*.*'

    if (!el) return

    // Find parent form
    var form = null
    var node = el
    while (node) {
      if (node.nodeType === 1 && node.tagName && node.tagName.toLowerCase() === 'form') {
        form = node
        break
      }
      node = node.parentNode
    }

    if (!form) {
      console.error('form-upload: no parent form found')
      return
    }

    // Create hidden file input
    var input = document.createElement('input')
    input.type = 'file'
    input.name = el.getAttribute('form-upload-name') || 'files'
    input.multiple = true
    input.style.cssText = 'display:none'

    // Convert pattern to accept attribute
    var patterns = String(pattern).split(',')
    var accepted = []
    var i
    var p

    for (i = 0; i < patterns.length; i++) {
      p = patterns[i].replace(/^\s+|\s+$/g, '').toLowerCase()
      if (p === '*' || p === '*.*') {
        accepted = []
        break
      }
      if (p.indexOf('*.') === 0) {
        accepted.push('.' + p.substring(2))
      } else if (p.charAt(0) === '.') {
        accepted.push(p)
      }
    }

    if (accepted.length) {
      input.setAttribute('accept', accepted.join(','))
    }

    form.appendChild(input)

    // Files selected
    input.addEventListener('change', function () {
      var files = input.files
      if (!files || !files.length) return

      var endpoint = form.getAttribute('action') || form.getAttribute('data-src')
      if (!endpoint) {
        console.error('form-upload: no action or data-src on form')
        return
      }

      // Base headers
      var headers = {
        'Content-Type': 'application/octet-stream'
      }

      var authHeader = form.getAttribute('data-header') || ''
      if (authHeader) {
        var parts = authHeader.split(':')
        if (parts.length >= 2) {
          headers[parts[0].replace(/^\s+|\s+$/g, '')] =
            parts.slice(1).join(':').replace(/^\s+|\s+$/g, '')
        }
      }

      var index = 0
      var total = files.length

      function next() {
        if (index >= total) return

        var file = files[index]
        index = index + 1

        var xhr = new XMLHttpRequest()
        xhr.open('POST', endpoint, true)

        // Set headers
        var h
        for (h in headers) {
          if (headers.hasOwnProperty(h)) {
            xhr.setRequestHeader(h, headers[h])
          }
        }
        xhr.setRequestHeader('X-Filename', file.name)

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              var data = JSON.parse(xhr.responseText)
              console.log('Uploaded:', data.filename, '(' + data.size + ' bytes)')
            } catch (e) {
              console.log('Uploaded:', file.name)
            }
            next()
          } else {
            var errMsg = 'Upload failed'
            try {
              var err = JSON.parse(xhr.responseText)
              errMsg = err.error || errMsg
            } catch (e) { }
            console.error('Upload failed:', file.name, errMsg)
            alert('Failed to upload "' + file.name + '":\n' + errMsg)
            next()
          }
        }

        xhr.onerror = function () {
          console.error('Upload failed:', file.name, 'Network error')
          alert('Failed to upload "' + file.name + '":\nNetwork error')
          next()
        }

        // Send raw file
        xhr.send(file)
      }

      next()
    })

    // Cancelled
    input.addEventListener('cancel', function () {
      if (input.parentNode) {
        input.parentNode.removeChild(input)
      }
    })

    // Open picker
    try {
      input.click()
    } catch (error) {
      console.error('form-upload:', error)
      if (input.parentNode) {
        input.parentNode.removeChild(input)
      }
    }
  }
}