test('data-previous - decrements the target page through data-previous', function () {
  var data = app.module.data
  var target = createElement('div')
  target.setAttribute('data-page', '3')
  var called = false
  withStub(data, '_rerun', function (element) { called = element }, function () {
    var button = createElement('button')
    button.setAttribute('clicktargetfield', '#' + target.id)
    button.setAttribute('click', 'data-previous')
    app.call(button.getAttribute('click'), { srcElement: button, element: target })
  })
  assertEqual(target.getAttribute('data-page'), '2')
  assertEqual(called, target)
})
