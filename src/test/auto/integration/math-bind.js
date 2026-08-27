test('math-bind - dispatches the math-bind attribute', function () {
  var called = false
  withStub(app.module.math, 'bind', function (element) { called = element }, function () {
    var element = createElement('input')
    element.setAttribute('math-bind', '')
    app.call('rerun', { element: element })
    assertEqual(called, element)
  })
})
