test('data-goto - jumps to a target page through data-goto', function () {
  var data = app.module.data
  var target = createElement('div')
  target.setAttribute('data-page', '1')
  var called = false
  withStub(data, '_rerun', function (element) { called = element }, function () {
    var button = createElement('button')
    button.setAttribute('clicktargetfield', '#' + target.id)
    button.setAttribute('click', 'data-goto:[4]')
    app.call(button.getAttribute('click'), { srcElement: button, element: target })
  })
  assertEqual(target.getAttribute('data-page'), '4')
  assertEqual(called, target)
})
