test.skip('runattr - should rerun the named attribute', function () {
  var target = createElement('div')
  target.setAttribute('settext', 'updated')

  dom.runattr({ exec: { element: target, value: 'settext' } })

  assertEqual(target.textContent, 'updated')
})
