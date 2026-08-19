test('submitted - should run the normalized submit callback', function () {
  var target = createElement('div')
  var form = createElement('form')
  form.setAttribute('onsubmitted', 'settext:#' + target.id + ':[submitted]')
  var originalOnsubmit = app.element.onsubmit
  app.element.onsubmit = function () { }

  app.call('submit:#' + form.id + ':[#' + form.id + ']')

  app.element.onsubmit = originalOnsubmit
  assertEqual(target.textContent, 'submitted')
})

test('formsubmit - should execute its delayed callback', function () {
  var target = createElement('div')
  var form = createElement('form')
  var originalTimeout = window.setTimeout
  var delay
  form.setAttribute('onformsubmit', 'settext:#' + target.id + ':[submitted]')
  window.setTimeout = function (callback, value) {
    delay = value
    callback()
  }

  app.element.onsubmit({ srcElement: form })

  window.setTimeout = originalTimeout
  assertEqual(delay, 50)
  assertEqual(target.textContent, 'submitted')
})
