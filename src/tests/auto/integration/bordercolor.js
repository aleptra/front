test('bordercolor - should set border color of the element', function () {
  var expected = 'rgb(0, 128, 0)' // green
  var testElement = createElement('div')
  app.call('bordercolor:#' + testElement.id + ':[green]')
  assertStyleEqual(testElement, 'borderColor', expected)
})

test('bordercolor - should map the black01-black09 shorthands to rgba', function () {
  var first = createElement('div')
  app.call('bordercolor:#' + first.id + ':[black01]')
  assertStyleEqual(first, 'borderColor', 'rgba(0, 0, 0, 0.1)')

  var middle = createElement('div')
  app.call('bordercolor:#' + middle.id + ':[black05]')
  assertStyleEqual(middle, 'borderColor', 'rgba(0, 0, 0, 0.5)')

  var last = createElement('div')
  app.call('bordercolor:#' + last.id + ':[black09]')
  assertStyleEqual(last, 'borderColor', 'rgba(0, 0, 0, 0.9)')
})

test('bordercolor - should map the white01-white09 shorthands to rgba', function () {
  var first = createElement('div')
  app.call('bordercolor:#' + first.id + ':[white01]')
  assertStyleEqual(first, 'borderColor', 'rgba(255, 255, 255, 0.1)')

  var middle = createElement('div')
  app.call('bordercolor:#' + middle.id + ':[white05]')
  assertStyleEqual(middle, 'borderColor', 'rgba(255, 255, 255, 0.5)')

  var last = createElement('div')
  app.call('bordercolor:#' + last.id + ':[white09]')
  assertStyleEqual(last, 'borderColor', 'rgba(255, 255, 255, 0.9)')
})

test('bordercolor - should cover every shorthand step as an attribute', function () {
  for (var i = 1; i <= 9; i++) {
    var black = createElement('div')
    black.setAttribute('bordercolor', 'black0' + i)
    app.attributes.run([black])
    assertStyleEqual(black, 'borderColor', 'rgba(0, 0, 0, 0.' + i + ')')

    var white = createElement('div')
    white.setAttribute('bordercolor', 'white0' + i)
    app.attributes.run([white])
    assertStyleEqual(white, 'borderColor', 'rgba(255, 255, 255, 0.' + i + ')')
  }
})

test('bordercolor - should pass through an unmapped colour untouched', function () {
  var testElement = createElement('div')
  app.call('bordercolor:#' + testElement.id + ':[black10]')
  assertStyleEqual(testElement, 'borderColor', 'rgb(0, 0, 0)')
})

test('bordercolor - should accept hex and rgba literals untouched', function () {
  var hex = createElement('div')
  app.call('bordercolor:#' + hex.id + ':[#ff0000]')
  assertStyleEqual(hex, 'borderColor', 'rgb(255, 0, 0)')

  var rgba = createElement('div')
  app.call('bordercolor:#' + rgba.id + ':[rgba(0,0,255,.25)]')
  assertStyleEqual(rgba, 'borderColor', 'rgba(0, 0, 255, 0.25)')

  var transparent = createElement('div')
  app.call('bordercolor:#' + transparent.id + ':[transparent]')
  assertStyleEqual(transparent, 'borderColor', 'rgba(0, 0, 0, 0)')
})
