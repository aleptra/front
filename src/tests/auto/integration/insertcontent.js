test('insertcontent - true inserts into the link text instead of the href', function () {
  var element = createElement('a')

  element.setAttribute('href', '/base')
  element.textContent = 'Link'
  element.setAttribute('insertcontent', 'true')
  element.setAttribute('insertafterbegin', 'PRE ')

  app.attributes.run([element])

  assertEqual(element.textContent, 'PRE Link')
  assertContains(element.getAttribute('href'), '/base')
})

test('insertcontent - links insert into the href by default', function () {
  var element = createElement('a')

  element.setAttribute('href', '/base')
  element.textContent = 'Link'
  element.setAttribute('insertafterbegin', 'https://example.com')

  app.attributes.run([element])

  assertEqual(element.textContent, 'Link')
  assertContains(element.href, 'https://example.com')
})
