test('data-bind - dispatches the data-bind attribute', function () {
  var called
  withStub(dom, 'bind', function (element, value, attribute) { called = { element: element, value: value, attribute: attribute } }, function () {
    var element = createElement('div')
    element.setAttribute('data-bind', 'name')
    app.call('rerun', { element: element })
    assertEqual(called.element, element)
    assertEqual(called.value, 'name')
    assertEqual(called.attribute, 'data-bind')
  })
})
