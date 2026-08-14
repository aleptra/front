test('submitted - should run the normalized submit callback', function () {
  var target = createElement('div')
  var form = createElement('form')
  form.setAttribute('onsubmitted', 'settext:#' + target.id + ':[submitted]')
  var originalOnsubmit = app.element.onsubmit
  app.element.onsubmit = function () {}

  app.call('submit:#' + form.id + ':[#' + form.id + ']')

  app.element.onsubmit = originalOnsubmit
  assertEqual(target.textContent, 'submitted')
})
