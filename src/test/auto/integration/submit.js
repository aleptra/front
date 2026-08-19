test('submit - should invoke the form submit path', function () {
  var form = createElement('form')
  var called = false
  var originalOnsubmit = app.element.onsubmit
  app.element.onsubmit = function (event) {
    called = event.srcElement === form
  }

  dom.submit({ exec: { value: '#' + form.id, element: form } })

  app.element.onsubmit = originalOnsubmit
  assertTrue(called)
})

test('keydown - should record the submit action when Enter is pressed', function () {
  var form = createElement('form')
  form.setAttribute('onsubmit', 'settext:[submitted]')

  form.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }))

  assertEqual(form.startSubmit, 'settext')
})

test('keydown - should execute the ontabchange action for Tab', function () {
  var target = createElement('div')
  var element = createElement('button')
  element.setAttribute('ontabchange', 'settext:#' + target.id + ':[tabbed]')

  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }))

  assertEqual(target.textContent, 'tabbed')
})
