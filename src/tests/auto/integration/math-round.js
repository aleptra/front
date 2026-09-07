test('math-round - rounds a value through math-round', function () {
  var element = createElement('input')
  element.value = '3.6'
  element.setAttribute('math-round', '')
  app.call('rerun', { element: element })
  assertEqual(element.value, '4')
})
