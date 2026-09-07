test('onreset - runs after a form reset and survives the native reset', function () {
  var target = createElement('div')
  var form = createElement('form')

  form.innerHTML = '<input name="field" value="original">'
  var field = form.querySelector('input')
  field.value = 'changed'

  target.textContent = 'Waiting'
  form.setAttribute('reset', '')
  form.setAttribute('onreset', 'settext:#' + target.id + ':[Reset ran]')

  app.attributes.run([form])

  assertEqual(field.value, 'original')
  assertEqual(target.textContent, 'Reset ran')
  // The attribute is restored after the native reset so later resets still work.
  assertEqual(form.getAttribute('onreset'), 'settext:#' + target.id + ':[Reset ran]')
})
