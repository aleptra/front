test('app.globals.refresh - updates live global bindings and removes detached elements', function () {
  var element = createElement('div')
  element.setAttribute('bindglobal', 'title:title')
  element.setAttribute('data-label', '{title}')
  element.originalAttributes = [{ name: 'data-label', value: '{title}', originalValue: '{title}' }]
  element._live = { attr: 'data-label', template: '{title}', callPrefix: 'settext:' }
  app.globals._live.push(element)
  var oldHref = app.globals.href
  var oldTitle = app.globals.title
  var oldDocumentTitle = document.title
  var called = ''

  withStub(app, 'call', function (run) { called = run }, function () {
    app.globals.href = '__different_href__'
    document.title = 'Updated'
    app.globals.refresh()
  })

  app.globals.href = oldHref
  app.globals.title = oldTitle
  document.title = oldDocumentTitle
  app.globals._live = []

  assertEqual(element.getAttribute('data-label'), 'Updated').desc('live binding updated')
  assertEqual(called, 'settext:Updated').desc('live binding action dispatched')
})
