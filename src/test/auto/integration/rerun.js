test('rerun - should restore and process original markup', function () {
  var target = createElement('div')
  target.setAttribute('settext', 'updated')
  app.element.saveOriginalValues(target)
  target.textContent = 'changed'

  dom.rerun(target)

  assertEqual(target.textContent, 'updated')
})
