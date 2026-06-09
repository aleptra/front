test('setqueryhref - should increment query param using ++', function () {
  var expected = 'https://example.com/?p=1'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=0')
  app.call('setqueryhref:#' + el.id + ':[p:++]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should decrement query param using --', function () {
  var expected = 'https://example.com/?p=-1'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=0')
  app.call('setqueryhref:#' + el.id + ':[p:--]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should add 5 to query param using +5', function () {
  var expected = 'https://example.com/?p=10'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=5')
  app.call('setqueryhref:#' + el.id + ':[p:+5]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should subtract 3 from query param using -3', function () {
  var expected = 'https://example.com/?p=7'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=10')
  app.call('setqueryhref:#' + el.id + ':[p:-3]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should multiply query param by 3 using *3', function () {
  var expected = 'https://example.com/?p=45'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=15')
  app.call('setqueryhref:#' + el.id + ':[p:*3]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should divide query param by 2 using /2', function () {
  var expected = 'https://example.com/?p=5'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=10')
  app.call('setqueryhref:#' + el.id + ':[p:/2]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should handle decimal multiplier *1.5', function () {
  var expected = 'https://example.com/?p=15'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=10')
  app.call('setqueryhref:#' + el.id + ':[p:*1.5]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should handle negative addition -5', function () {
  var expected = 'https://example.com/?p=5'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=10')
  app.call('setqueryhref:#' + el.id + ':[p:-5]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should only modify target query param', function () {
  var expected = 'https://example.com/?p=2&q=100'
  var el = createElement('a')
  el.setAttribute('href', 'https://example.com/?p=1&q=100')
  app.call('setqueryhref:#' + el.id + ':[p:++]')
  assertEqual(el.getAttribute('href'), expected)
})

test('setqueryhref - should return original href for invalid operation', function () {
  var expected = 'https://example.com/?p=10'
  var el = createElement('a')
  el.setAttribute('href', expected)
  app.call('setqueryhref:#' + el.id + ':[p:??]')
  assertEqual(el.getAttribute('href'), expected)
})