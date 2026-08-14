test('initial - should apply the initial style value', function () {
  var element = createElement('div')

  app.call('initial:#' + element.id + ':[inherit]')

  assertEqual(element.style.initial, 'inherit')
})
