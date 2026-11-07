test('runtree - runs attributes on element and children', function () {
  var parent = createElement('div')
  var child = createElement('span')
  parent.appendChild(child)

  parent.setAttribute('settext', 'parent-text')
  child.setAttribute('settext', 'child-text')

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(child)

  dom.runtree(parent)

  assertEqual(parent.textContent, 'parent-text')
})
