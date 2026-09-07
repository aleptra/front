test('share-open - opens a platform share URL through share--open', function () {
  var opened = ''
  withProperty(window, 'open', function (url) { opened = url }, function () {
    var source = createElement('button')
    source.setAttribute('share--platform', 'twitter')
    source.setAttribute('share--title', 'Hello')
    source.setAttribute('share--url', 'https://example.com')
    source.setAttribute('click', 'share--open')
    app.call(source.getAttribute('click'), { srcElement: source })
  })
  assertContains(opened, 'twitter.com/intent/tweet')
})
