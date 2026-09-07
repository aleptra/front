test('runattr - should rerun the named attribute', function () {
  var target = createElement('div')
  // runattr rebuilds "<attr>:<value>", so the value needs its own brackets.
  target.setAttribute('settext', '[updated]')

  dom.runattr({ exec: { element: target, value: 'settext' } })

  assertEqual(target.textContent, 'updated')
})
