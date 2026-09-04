test('border - should set border style', function () {
  var expected = '2px solid rgb(255, 0, 0)'
  var testElement = createElement('div')
  app.call('border:#' + testElement.id + ':[2px solid red]')
  assertStyleEqual(testElement, 'border', expected)
})


test('border - should expand a shade shorthand inside the shorthand value', function () {
  var testElement = createElement('div')
  testElement.setAttribute('border', '1px solid black03')
  app.attributes.run([testElement])
  assertStyleEqual(testElement, 'borderColor', 'rgba(0, 0, 0, 0.3)')
  assertStyleEqual(testElement, 'borderStyle', 'solid')
})

test('borderleft - should expand a shade shorthand on a side specific border', function () {
  var testElement = createElement('div')
  testElement.setAttribute('borderleft', '2px solid white08')
  app.attributes.run([testElement])
  assertStyleEqual(testElement, 'borderLeftColor', 'rgba(255, 255, 255, 0.8)')
})
