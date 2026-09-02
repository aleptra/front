test('bindfieldreloadcontent - false keeps the previously rendered content', function () {
  var target = createElement('div')
  var input = createElement('input')

  target.innerHTML = '{test}'
  input.value = 'A'
  input.setAttribute('bindfield', 'test:#' + target.id)
  input.setAttribute('bindfieldreloadcontent', 'false')

  // Binding renders the current value once and consumes the placeholder.
  app.attributes.run([input])
  assertEqual(target.textContent, 'A')

  // Without a content reset there is no placeholder left to replace.
  input.value = 'B'
  input.dispatchEvent(new KeyboardEvent('keyup', { key: 'b', bubbles: true }))
  assertEqual(target.textContent, 'A')
})

test('bindfieldreloadcontent - content is reloaded by default', function () {
  var target = createElement('div')
  var input = createElement('input')

  target.innerHTML = '{test}'
  input.setAttribute('bindfield', 'test:#' + target.id)

  app.attributes.run([input])

  input.value = 'A'
  input.dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }))
  assertEqual(target.textContent, 'A')

  input.value = 'B'
  input.dispatchEvent(new KeyboardEvent('keyup', { key: 'b', bubbles: true }))
  assertEqual(target.textContent, 'B')
})
