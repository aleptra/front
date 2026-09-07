test('storage-iterate-skip - keeps the marked block out of repeated output', function () {
  var storage = app.module.storage
  var element = createElement('ul')

  sessionStorage.setItem('storageSkipKey', JSON.stringify({ items: ['alpha', 'beta', 'gamma'] }))
  element.setAttribute('storage-bind', 'session:storageSkipKey')
  element.setAttribute('storage-iterate', 'items')
  element.innerHTML =
    '<li class="skipHeader" storage-iterate-skip>Header</li>' +
    '<li class="skipRow" storage-get="[*]"></li>'

  storage.bind(element)

  // The skipped header renders once, the row renders per item.
  assertEqual(element.querySelectorAll('.skipHeader').length, 1)
  assertEqual(element.querySelectorAll('.skipRow').length, 3)

  sessionStorage.removeItem('storageSkipKey')
})
