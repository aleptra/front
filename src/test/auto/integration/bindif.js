test('bindif - should return for a supported text field', function () {
  var target = createElement('input')
  target.type = 'text'
  target.value = 'yes'
  var source = createElement('button')

  assertTrue(dom.bindif({ value: '#' + target.id + ':yes;ignored' }))
})
