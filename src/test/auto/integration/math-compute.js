test('math-compute - evaluates an expression through math-compute', function () {
  var element = createElement('div')
  element.textContent = '2^3+1'
  element.setAttribute('math-compute', '')
  app.call('rerun', { element: element })
  assertEqual(element.textContent, '9')
})
