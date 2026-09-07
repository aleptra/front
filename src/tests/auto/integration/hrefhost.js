test('hrefhost - should set base href based on matching hostname', function () {
  var expected = '/test/'
  var testElement = createElement('base')
  testElement.setAttribute('hrefhost', location.hostname + ':test')
  dom.rerun(testElement)
  assertEqual(testElement.getAttribute('href'), expected)
})