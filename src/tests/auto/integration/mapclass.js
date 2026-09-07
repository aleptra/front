test('mapclass - should apply mapped classes from enum data', function () {
  app.caches.set('window', 'var', 'enum', {
    data: {
      class: {
        class1: 'bg color',
        class2: 'bg2 color2'
      }
    }
  })

  var testElement = createElement('div')
  testElement.originalAttribute = 'mapclass'
  app.call('mapclass:#' + testElement.id + ':[class1]')
  assertEqual(testElement.classList.value, 'bg color')

  var testElement = createElement('div')
  testElement.originalAttribute = 'mapclass'
  app.call('mapclass:#' + testElement.id + ':[class2]')
  assertEqual(testElement.classList.value, 'bg2 color2')
})