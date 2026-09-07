test('data-next - advances the target page through data-next', function () {
  var data = app.module.data
  var target = createElement('div')
  target.setAttribute('data-page', '2')
  var called = false
  withStub(data, '_rerun', function (element) { called = element }, function () {
    var button = createElement('button')
    button.setAttribute('clicktargetfield', '#' + target.id)
    button.setAttribute('click', 'data-next')
    app.call(button.getAttribute('click'), { srcElement: button, element: target })
  })
  assertEqual(target.getAttribute('data-page'), '3')
  assertEqual(called, target)
})
