test.skip('prependattr - should prepend text to an attribute', function () {
  var element = createElement('div')
  element.setAttribute('data-label', 'value')

  app.call('prependattr:#' + element.id + '.data-label:[prefix-]')

  assertEqual(element.getAttribute('data-label'), 'prefix-value')
})
