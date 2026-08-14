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
