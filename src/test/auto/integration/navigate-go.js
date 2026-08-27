test('navigate-go - handles a destination through navigate-go', function () {
  var clickedHref = ''
  var anchorPrototype = window.HTMLAnchorElement && window.HTMLAnchorElement.prototype
  var button = createElement('button')
  button.setAttribute('click', 'navigate-go:[/next]')
  withStub(anchorPrototype, 'click', function () { clickedHref = this.href }, function () {
    app.call(button.getAttribute('click'), { srcElement: button })
  })
  assertTrue(clickedHref.indexOf('/next') !== -1)
})
