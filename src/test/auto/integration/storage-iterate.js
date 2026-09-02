test('storage-iterate - renders one block per item in the stored collection', function () {
  var storage = app.module.storage
  var element = createElement('ul')

  sessionStorage.setItem('storageIterateKey', JSON.stringify({ items: ['alpha', 'beta', 'gamma'] }))
  element.setAttribute('storage-bind', 'session:storageIterateKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<li storage-get="[*]"></li>'

  storage.bind(element)

  var rows = element.querySelectorAll('li')
  assertEqual(rows.length, 3)
  assertEqual(rows[0].textContent, 'alpha')
  assertEqual(rows[2].textContent, 'gamma')

  sessionStorage.removeItem('storageIterateKey')
})

test('storage-iterate - renders nothing for an empty collection', function () {
  var storage = app.module.storage
  var element = createElement('ul')

  sessionStorage.setItem('storageIterateEmptyKey', JSON.stringify({ items: [] }))
  element.setAttribute('storage-bind', 'session:storageIterateEmptyKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<li storage-get="[*]"></li>'

  storage.bind(element)

  assertEqual(element.querySelectorAll('li').length, 0)

  sessionStorage.removeItem('storageIterateEmptyKey')
})
