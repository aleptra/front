test('storage-bindlocal - replaces content through storage-bindlocal', function () {
  localStorage.setItem('attribute-name', JSON.stringify('Ada'))
  var element = createElement('p')
  element.textContent = 'Hello {name}'
  element.setAttribute('storage-bindlocal', 'attribute-name:name')
  app.call('rerun', { element: element })
  assertEqual(element.textContent, 'Hello Ada')
  localStorage.removeItem('attribute-name')
})
