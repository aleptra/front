test('reload - should reload the selected frame document', function () {
  var called = false
  var originalSelect = app.element.select
  app.element.select = function () {
    return { contentDocument: { location: { reload: function () { called = true } } } }
  }

  dom.reload(null, '#frame')

  app.element.select = originalSelect
  assertTrue(called)
})
