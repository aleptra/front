test('clear - should remove content', function () {
  var target = createElement('div')
  target.innerHTML = '<b>content</b>'

  dom.clear({ exec: { element: target } })

  assertEqual(target.innerHTML, '')
})
