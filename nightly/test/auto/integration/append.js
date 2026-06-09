test('append - should insert element at the end', function () {
  var target = createElement('div')
  var copy = createElement('span')
  var child = createElement('span', false)
  copy.appendChild(child)

  app.call('append:#' + target.id + ':#' + copy.id)
  assertEqual(child.id, target.lastChild.id)
})
