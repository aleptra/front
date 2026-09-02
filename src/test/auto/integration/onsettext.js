test('onsettext - runs on the element that received the text', function () {
  var target = createElement('div')
  var source = createElement('div')
  var flag = createElement('div')

  flag.textContent = 'Waiting'
  target.setAttribute('onsettext', 'settext:#' + flag.id + ':[Text applied]')

  // Elements are initialised by the attribute runner before events can fire.
  app.attributes.run([target])

  app.call('settext:#' + target.id + ':[Hello]', { element: source })

  assertEqual(target.textContent, 'Hello')
  assertEqual(flag.textContent, 'Text applied')
})
