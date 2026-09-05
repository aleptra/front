test('placeholdercolor - should create a placeholder stylesheet', function () {
  var element = createElement('input')
  app.call('placeholdercolor:#' + element.id + ':[red]')
  var style = document.getElementById('ph-' + element.id)
  assertTrue(!!style)
  assertTrue(style.textContent.indexOf('color: red') !== -1)
})

test('placeholdercolor - should expand a shade shorthand', function () {
  var element = createElement('input')
  app.call('placeholdercolor:#' + element.id + ':[white05]')
  var style = document.getElementById('ph-' + element.id)
  assertContains(style.textContent, 'rgba(255,255,255,.5)')
})

test('placeholdercolor - should fall back to the color attribute', function () {
  var element = createElement('input')
  element.setAttribute('color', 'blue')
  element.setAttribute('placeholdercolor', '')
  app.attributes.run([element])
  var style = document.getElementById('ph-' + element.id)
  assertTrue(!!style)
  assertContains(style.textContent, 'color: blue')
})

test('placeholdercolor - should expand a shade on the color fallback', function () {
  var element = createElement('input')
  element.setAttribute('color', 'black03')
  element.setAttribute('placeholdercolor', '')
  app.attributes.run([element])
  var style = document.getElementById('ph-' + element.id)
  assertContains(style.textContent, 'rgba(0,0,0,.3)')
})

test('placeholdercolor - should replace the stylesheet instead of stacking', function () {
  var element = createElement('input')
  app.call('placeholdercolor:#' + element.id + ':[red]')
  app.call('placeholdercolor:#' + element.id + ':[green]')

  assertEqual(document.querySelectorAll('style[id="ph-' + element.id + '"]').length, 1)
  assertContains(document.getElementById('ph-' + element.id).textContent, 'color: green')
})

test('placeholdercolor - should do nothing without a value or color', function () {
  var element = createElement('input')
  element.setAttribute('placeholdercolor', '')
  app.attributes.run([element])
  assertEqual(document.getElementById('ph-' + element.id), null)
})
