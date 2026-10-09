test('ondata-get - runs handler after data-get resolves', function () {
  var element = createElement('div')
  element.setAttribute('data-src', 'mock://ondata-get')
  element.setAttribute('ondata-get', 'log("executed")')
  element.innerHTML = '<span id="output" data-get="type"></span>'
  app.element.saveOriginalValues(element)

  app.module.data._run(
    { storageKey: 'ondata-get-key', iterate: undefined, element: element },
    { data: { type: 'file' }, status: 200 }
  )

  assertEqual(element.querySelector('#output').textContent, 'file').desc('ondata-get handler does not block data-get processing')
})

test('ondata-get - fires multiple times on repeated data-get', function () {
  var element = createElement('div')
  element.setAttribute('data-src', 'mock://ondata-get-repeat')
  element.setAttribute('ondata-get', 'log("called")')
  element.innerHTML = '<span id="output" data-get="count"></span>'
  app.element.saveOriginalValues(element)

  app.module.data._run(
    { storageKey: 'ondata-get-repeat-1', iterate: undefined, element: element },
    { data: { count: '1' }, status: 200 }
  )
  assertEqual(element.querySelector('#output').textContent, '1').desc('first data-get updates element')

  app.module.data._run(
    { storageKey: 'ondata-get-repeat-2', iterate: undefined, element: element },
    { data: { count: '2' }, status: 200 }
  )
  assertEqual(element.querySelector('#output').textContent, '2').desc('second data-get updates element with ondata-get handler')
})
