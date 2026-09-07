test('storage-onempty - shows the empty target when the collection is empty', function () {
  var storage = app.module.storage
  var empty = createElement('div')
  var element = createElement('ul')

  dom.hide(empty)
  sessionStorage.setItem('storageOnemptyKey', JSON.stringify({ items: [] }))
  element.setAttribute('storage-bind', 'session:storageOnemptyKey')
  element.setAttribute('storage-iterate', 'items')
  element.setAttribute('storage-onempty', '#' + empty.id)
  element.innerHTML = '<li storage-get="[*]"></li>'

  storage.bind(element)

  assertEqual(empty.style.display === 'none', false)

  sessionStorage.removeItem('storageOnemptyKey')
})

test('storage-onempty - hides the empty target when items exist', function () {
  var storage = app.module.storage
  var empty = createElement('div')
  var element = createElement('ul')

  dom.show(empty)
  sessionStorage.setItem('storageOnemptyFilledKey', JSON.stringify({ items: ['alpha'] }))
  element.setAttribute('storage-bind', 'session:storageOnemptyFilledKey')
  element.setAttribute('storage-iterate', 'items')
  element.setAttribute('storage-onempty', '#' + empty.id)
  element.innerHTML = '<li storage-get="[*]"></li>'

  storage.bind(element)

  assertContains(empty.style.cssText, 'display: none')

  sessionStorage.removeItem('storageOnemptyFilledKey')
})
