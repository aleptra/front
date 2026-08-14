test('prepend - should move a source before existing children', function () {
  var target = createElement('div')
  var existing = document.createElement('span')
  existing.textContent = 'existing'
  target.appendChild(existing)
  var source = createElement('span')
  source.textContent = 'source'

  dom.prepend(target, '#' + source.id)

  assertEqual(target.firstChild.textContent, 'source')
  assertEqual(target.lastChild.textContent, 'existing')
})
