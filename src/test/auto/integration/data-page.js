test('data-page - changes the target page through data-page', function () {
  var data = app.module.data
  var target = createElement('div')
  target.setAttribute('data-page', '1')
  var called = false
  withStub(data, '_rerun', function (element) { called = element }, function () {
    var button = createElement('button')
    button.setAttribute('clicktargetfield', '#' + target.id)
    button.setAttribute('click', 'data-page:[3]')
    app.call(button.getAttribute('click'), { srcElement: button, element: target })
  })
  assertEqual(target.getAttribute('data-page'), '3')
  assertEqual(called, target)
})
