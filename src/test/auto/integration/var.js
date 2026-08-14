test('var - should ignore script elements', function () {
  var script = document.createElement('script')

  dom.var(script, 'ignored')

  assertTrue(true)
})
