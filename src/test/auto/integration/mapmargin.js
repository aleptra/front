test('mapmargin - should apply mapped margin from enum data', function () {
  app.caches.set('window', 'var', 'enum', {
    data: {
      margin: {
        small: '5px',
        big: '20px'
      }
    }
  })

  var testElement = createElement('div')
  testElement.originalAttribute = 'mapmargin'
  app.call('mapmargin:#' + testElement.id + ':[small]')
  assertEqual(testElement.style.margin, '5px')

  var testElement = createElement('div')
  testElement.originalAttribute = 'mapmargin'
  app.call('mapmargin:#' + testElement.id + ':[big]')
  assertEqual(testElement.style.margin, '20px')
})