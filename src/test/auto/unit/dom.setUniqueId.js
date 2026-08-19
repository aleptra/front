test('dom.setUniqueId - should assign a generated id', function () {
  var element = createElement('div')
  var nextId = dom._uniqueId + 1

  dom.setUniqueId(element)

  assertEqual(element.id, 'id' + nextId)
})

test('dom.setUniqueId - should assign an internal uniqueid attribute', function () {
  var element = createElement('div')
  var nextId = dom._uniqueId + 1

  dom.setUniqueId(element, true, 'attribute')

  assertEqual(element.getAttribute('uniqueid'), '' + nextId)
})

test('dom.setUniqueId - should assign an internal uniqueId property', function () {
  var element = createElement('div')
  var nextId = dom._uniqueId + 1

  dom.setUniqueId(element, true)

  assertEqual(element.uniqueId, nextId)
})
