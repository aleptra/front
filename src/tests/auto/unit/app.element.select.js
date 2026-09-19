test('app.element.select - should return element by id selector', function () {
  var el = createElement('div')

  assertEqual(app.element.select('#' + el.id), el).desc('element found by id')
  assertEqual(app.element.select('#nonexistent'), '').desc('returns empty string when not found')
})

test('app.element.select - should return list when list=true', function () {
  var el1 = createElement('div')
  var el2 = createElement('div')
  el1.setAttribute('data-sel-test', '')
  el2.setAttribute('data-sel-test', '')

  var result = app.element.select('[data-sel-test]', true)

  assertTrue(result.length >= 2).desc('returns multiple elements')
})

test('app.element.select - should return element by index using [n] syntax', function () {
  var el1 = createElement('span')
  var el2 = createElement('span')
  el1.setAttribute('data-sel-index', '')
  el2.setAttribute('data-sel-index', '')

  var result = app.element.select('[data-sel-index][0]')

  assertEqual(result, el1).desc('first element returned by index')
})
