test('color - should set text color of element to red', function () {
  var expected = 'rgb(255, 0, 0)'
  var testElement = createElement('div')
  app.call('color:#' + testElement.id + ':[red]')
  assertStyleEqual(testElement, 'color', expected)
})


test('color - should map the shade shorthands to rgba', function () {
  var black = createElement('div')
  app.call('color:#' + black.id + ':[black03]')
  assertStyleEqual(black, 'color', 'rgba(0, 0, 0, 0.3)')

  var white = createElement('div')
  app.call('color:#' + white.id + ':[white05]')
  assertStyleEqual(white, 'color', 'rgba(255, 255, 255, 0.5)')
})

test('color - should cover every shade step', function () {
  for (var i = 1; i <= 9; i++) {
    var black = createElement('div')
    black.setAttribute('color', 'black0' + i)
    app.attributes.run([black])
    assertStyleEqual(black, 'color', 'rgba(0, 0, 0, 0.' + i + ')')

    var white = createElement('div')
    white.setAttribute('color', 'white0' + i)
    app.attributes.run([white])
    assertStyleEqual(white, 'color', 'rgba(255, 255, 255, 0.' + i + ')')
  }
})

test('color - should leave named colours untouched', function () {
  var testElement = createElement('div')
  app.call('color:#' + testElement.id + ':[red]')
  assertStyleEqual(testElement, 'color', 'rgb(255, 0, 0)')
})
