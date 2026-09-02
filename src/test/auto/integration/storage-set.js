test('storage-set - writes a resolved value into the named attribute', function () {
  var storage = app.module.storage
  var element = createElement('ul')

  sessionStorage.setItem('storageSetKey', JSON.stringify({
    items: [{ title: 'First', slug: 'first-item' }]
  }))
  element.setAttribute('storage-bind', 'session:storageSetKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<li><a storage-set="data-slug:slug" storage-get="title"></a></li>'

  storage.bind(element)

  var link = element.querySelector('a')
  assertEqual(link.getAttribute('data-slug'), 'first-item')
  assertEqual(link.textContent, 'First')

  sessionStorage.removeItem('storageSetKey')
})

test('storage-set - writes into another element when given a selector', function () {
  var storage = app.module.storage
  var target = createElement('span')
  var element = createElement('ul')

  sessionStorage.setItem('storageSetTargetKey', JSON.stringify({ items: [{ owner: 'Front' }] }))
  element.setAttribute('storage-bind', 'session:storageSetTargetKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML = '<li storage-set="#' + target.id + ':owner"></li>'

  storage.bind(element)

  assertEqual(app.element.get(target), 'Front')

  sessionStorage.removeItem('storageSetTargetKey')
})
