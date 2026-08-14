test('set - should write content and strip markup', function () {
  var target = createElement('div')

  dom.set(target, '<b>plain</b>', true)

  assertEqual(target.innerHTML, 'plain')
})
