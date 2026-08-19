test('disable - should disable element', function () {
  var testElement = createElement('button')
  app.call('disable:#' + testElement.id)
  assertTrue(testElement.disabled)
})

test('disable - should suppress click and wheel events until enabled', function () {
  var parent = createElement('div')
  var button = createElement('button', true)
  parent.appendChild(button)
  var clickCount = 0
  var wheelCount = 0
  parent.addEventListener('click', function () { clickCount++ })
  parent.addEventListener('wheel', function () { wheelCount++ })

  app.call('disable:#' + button.id)
  app.click(button)
  button.dispatchEvent(new Event('wheel', { bubbles: true, cancelable: true }))

  assertEqual(clickCount, 0)
  assertEqual(wheelCount, 0)

  app.call('enable:#' + button.id)
  app.click(button)
  button.dispatchEvent(new Event('wheel', { bubbles: true, cancelable: true }))

  assertEqual(clickCount, 1)
  assertEqual(wheelCount, 1)
})
