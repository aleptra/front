test('data-loader - shows the loader and hides the target while loading', function () {
  var data = app.module.data
  var loader = createElement('div')
  var element = createElement('div')

  dom.hide(loader)
  element.setAttribute('data-src', '/loader-items.json')
  element.setAttribute('data-loader', '#' + loader.id)

  withStub(app, 'wait', function () { }, function () {
    data.src(element)
  })

  assertContains(element.style.cssText, 'display: none')
  assertEqual(loader.style.display === 'none', false)
})

test('data-loader - forwards the loader selector to the request', function () {
  var data = app.module.data
  var loader = createElement('div')
  var element = createElement('div')
  var request

  element.setAttribute('data-src', '/loader-forward.json')
  element.setAttribute('data-loader', '#' + loader.id)

  withStub(app, 'wait', function (delay, callback) { callback() }, function () {
    withStub(app.xhr, 'request', function (options) { request = options }, function () {
      data.src(element)
    })
  })

  assertEqual(request.loader, '#' + loader.id)
})
