test('setsrc - should set src attribute on img', function () {
  var expected = 'https://example.com/image.jpg'
  var testElement = createElement('img')
  app.call('setsrc:#' + testElement.id + ':[' + expected + ']')
  assertEqual(testElement.getAttribute('src'), expected)
})