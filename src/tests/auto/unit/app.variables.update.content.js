test('app.variables.update.content - replaces placeholder in text node', function () {
  var el = createElement('p')
  el.textContent = 'Hello {name}'
  app.variables.update.content(el, 'name', 'World')
  assertEqual(el.textContent, 'Hello World')
})

test('app.variables.update.content - replaces multiple occurrences', function () {
  var el = createElement('p')
  el.textContent = '{x} and {x}'
  app.variables.update.content(el, 'x', 'foo')
  assertEqual(el.textContent, 'foo and foo')
})

test('app.variables.update.content - uses default value when replaceValue is empty', function () {
  var el = createElement('p')
  el.textContent = '{name:Default}'
  app.variables.update.content(el, 'name', '')
  assertEqual(el.textContent, 'Default')
})

test('app.variables.update.content - handles zero as a valid value', function () {
  var el = createElement('p')
  el.textContent = 'Count: {n}'
  app.variables.update.content(el, 'n', 0)
  assertEqual(el.textContent, 'Count: 0')
})

test('app.variables.update.content - sets renderedText on parent after replacement', function () {
  var el = createElement('p')
  el.textContent = '{app}'
  app.variables.update.content(el, 'app', 'Front')
  assertEqual(el.renderedText, 'Front')
})

test('app.variables.update.content - does not set renderedText when nothing changed', function () {
  var el = createElement('p')
  el.textContent = 'no placeholders'
  delete el.renderedText
  app.variables.update.content(el, 'app', 'Front')
  assertEqual(el.renderedText, undefined)
})
