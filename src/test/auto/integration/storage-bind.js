test('storage-bind - renders stored items through storage-bind', function () {
  localStorage.setItem('attribute-cart', JSON.stringify({ items: [{ name: 'Book' }, { name: 'Lamp' }] }))
  var element = createElement('div')
  element.setAttribute('storage-bind', 'local:attribute-cart')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<span storage-get="name"></span>'
  app.call('rerun', { element: element })
  assertEqual(element.querySelectorAll('span').length, 2)
  assertEqual(element.querySelector('span').textContent, 'Book')
  localStorage.removeItem('attribute-cart')
})
