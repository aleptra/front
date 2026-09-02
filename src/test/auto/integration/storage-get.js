test('storage-get - reads item properties into the bound elements', function () {
  var storage = app.module.storage
  var element = createElement('ul')

  sessionStorage.setItem('storageGetKey', JSON.stringify({
    items: [
      { title: 'First', author: 'Ada' },
      { title: 'Second', author: 'Grace' }
    ]
  }))
  element.setAttribute('storage-bind', 'session:storageGetKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<li><b storage-get="title"></b><i storage-get="author"></i></li>'

  storage.bind(element)

  var titles = element.querySelectorAll('b')
  var authors = element.querySelectorAll('i')
  assertEqual(titles.length, 2)
  assertEqual(titles[0].textContent, 'First')
  assertEqual(authors[1].textContent, 'Grace')

  sessionStorage.removeItem('storageGetKey')
})

test('storage-get - resolves a nested path inside each item', function () {
  var storage = app.module.storage
  var element = createElement('ul')

  sessionStorage.setItem('storageGetNestedKey', JSON.stringify({
    items: [{ title: 'First', meta: { name: 'Docs' } }]
  }))
  element.setAttribute('storage-bind', 'session:storageGetNestedKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<li><span storage-get="meta.name"></span></li>'

  storage.bind(element)

  assertEqual(element.querySelector('span').textContent, 'Docs')

  sessionStorage.removeItem('storageGetNestedKey')
})
