test('placeholdercolor - should create a placeholder stylesheet', function () {
  var element = createElement('input')

  app.call('placeholdercolor:#' + element.id + ':[red]')

  var style = document.getElementById('ph-' + element.id)
  assertTrue(!!style)
  assertTrue(style.textContent.indexOf('color: red') !== -1)
})
