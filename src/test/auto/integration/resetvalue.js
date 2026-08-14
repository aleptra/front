test('resetvalue - should restore a button snapshot', function () {
  var button = createElement('button')
  button.textContent = 'Original'
  app.element.saveOriginalValues(button)
  button.textContent = 'Changed'

  app.call('resetvalue:#' + button.id)

  assertEqual(button.textContent, 'Original')
})
