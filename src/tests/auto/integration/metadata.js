test('metadata - should copy a meta content value', function () {
  var meta = document.createElement('meta')
  meta.setAttribute('name', 'integration-description')
  meta.setAttribute('content', 'metadata value')
  document.head.appendChild(meta)
  var target = createElement('div')

  dom.metadata(target, 'integration-description')

  assertEqual(target.innerHTML, 'metadata value')
  meta.remove()
})
