test('data-onfinish - runs the callback and marks the element loaded', function () {
  if (!app.module.data) return

  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('data-onfinish', 'settext:#' + target.id + ':[Finished]')
  element._dataSrc = 'mock://data-onfinish'

  app.module.data._finish({ element: element })

  assertEqual(target.textContent, 'Finished')
  assertTrue(element._dataLoaded)
  assertEqual(element._dataSrc, undefined)
})

test('data-onfinish - restores the target and hides the loader', function () {
  if (!app.module.data) return

  var loader = createElement('div')
  var element = createElement('div')

  dom.hide(element)
  app.module.data._finish({ element: element, loader: '#' + loader.id })

  assertContains(loader.style.cssText, 'display: none')
  assertEqual(element.style.display === 'none', false)
})
