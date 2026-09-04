test('bgcolor - should set background color of the element', function () {
  var expected = 'rgb(0, 128, 0)' // green
  var testElement = createElement('div')
  app.call('bgcolor:#' + testElement.id + ':[green]')
  assertStyleEqual(testElement, 'backgroundColor', expected)
})

test('bgcolor - should map the black01-black09 shorthands to rgba', function () {
  var first = createElement('div')
  app.call('bgcolor:#' + first.id + ':[black01]')
  assertStyleEqual(first, 'backgroundColor', 'rgba(0, 0, 0, 0.1)')

  var middle = createElement('div')
  app.call('bgcolor:#' + middle.id + ':[black05]')
  assertStyleEqual(middle, 'backgroundColor', 'rgba(0, 0, 0, 0.5)')

  var last = createElement('div')
  app.call('bgcolor:#' + last.id + ':[black09]')
  assertStyleEqual(last, 'backgroundColor', 'rgba(0, 0, 0, 0.9)')
})

test('bgcolor - should map the white01-white09 shorthands to rgba', function () {
  var first = createElement('div')
  app.call('bgcolor:#' + first.id + ':[white01]')
  assertStyleEqual(first, 'backgroundColor', 'rgba(255, 255, 255, 0.1)')

  var middle = createElement('div')
  app.call('bgcolor:#' + middle.id + ':[white05]')
  assertStyleEqual(middle, 'backgroundColor', 'rgba(255, 255, 255, 0.5)')

  var last = createElement('div')
  app.call('bgcolor:#' + last.id + ':[white09]')
  assertStyleEqual(last, 'backgroundColor', 'rgba(255, 255, 255, 0.9)')
})

test('bgcolor - should cover every shorthand step as an attribute', function () {
  for (var i = 1; i <= 9; i++) {
    var black = createElement('div')
    black.setAttribute('bgcolor', 'black0' + i)
    app.attributes.run([black])
    assertStyleEqual(black, 'backgroundColor', 'rgba(0, 0, 0, 0.' + i + ')')

    var white = createElement('div')
    white.setAttribute('bgcolor', 'white0' + i)
    app.attributes.run([white])
    assertStyleEqual(white, 'backgroundColor', 'rgba(255, 255, 255, 0.' + i + ')')
  }
})

test('bgcolor - should pass through an unmapped colour untouched', function () {
  var testElement = createElement('div')
  app.call('bgcolor:#' + testElement.id + ':[black10]')
  assertStyleEqual(testElement, 'backgroundColor', 'rgba(0, 0, 0, 0)')
})
