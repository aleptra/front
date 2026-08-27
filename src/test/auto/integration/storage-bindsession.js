test('storage-bindsession - replaces content through storage-bindsession', function () {
  sessionStorage.setItem('attribute-role', JSON.stringify('admin'))
  var element = createElement('p')
  element.textContent = 'Role: {role}'
  element.setAttribute('storage-bindsession', 'attribute-role:role')
  app.call('rerun', { element: element })
  assertEqual(element.textContent, 'Role: admin')
  sessionStorage.removeItem('attribute-role')
})
