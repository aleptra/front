test('clone - should clone element content into target', function () {
  var source = createElement('div')
  source.innerHTML = '<p>Hello</p>'

  var target = createElement('div')

  app.call('clone:#' + target.id + ':#' + source.id)

  // Target should contain a cloned copy of source (the div wrapping p)
  assertEqual(target.querySelector('p').textContent, 'Hello')
})

test('clone - with inherit="false" should copy only innerHTML', function () {
  var source = createElement('div')
  source.innerHTML = '<span>Content</span>'

  var target = createElement('div')
  target.setAttribute('inherit', 'false')

  app.call('clone:#' + target.id + ':#' + source.id)

  // Should have the innerHTML directly, not a nested wrapper div
  assertEqual(target.innerHTML, '<span>Content</span>')
})

test('clone - should work with click syntax via app.call', function () {
  var source = createElement('div')
  source.innerHTML = '<b>Bold</b>'

  var target = createElement('div')

  // Simulate click="clone:#target:#source"
  app.call('clone:#' + target.id + ':#' + source.id)

  assertEqual(target.querySelector('b').textContent, 'Bold')
})

test('clone - should clone via clone attribute selector', function () {
  var source = createElement('div')
  source.id = 'menuitems'
  source.innerHTML = '<a href="#">Menu item</a>'

  var target = createElement('div')
  target.setAttribute('clone', '#menuitems')

  app.attributes.run([target])
  app.attributes.runDeferred()

  assertEqual(target.querySelector('a').textContent, 'Menu item')
  assertEqual(source.id, 'menuitems')
})
