test('data-pagesize - changes page size through data-pagesize', function () {
  var data = app.module.data
  var target = createElement('div')
  target.setAttribute('data-page', '2')
  var called = false
  withStub(data, '_rerun', function (element) { called = element }, function () {
    var button = createElement('button')
    button.setAttribute('clicktargetfield', '#' + target.id)
    button.setAttribute('click', 'data-pagesize:[25]')
    app.call(button.getAttribute('click'), { srcElement: button, element: target })
  })
  assertEqual(target.getAttribute('data-pagesize'), '25')
  assertEqual(target.getAttribute('data-page'), '1')
  assertEqual(called, target)
})
