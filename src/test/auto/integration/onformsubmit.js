test('onformsubmit - runs each action after a form submit', function () {
  var first = createElement('div')
  var second = createElement('div')
  var form = createElement('form')

  first.textContent = 'Waiting'
  second.textContent = 'Waiting'
  form.setAttribute('onformsubmit', 'settext:#' + first.id + ':[One];settext:#' + second.id + ':[Two]')

  // The handler defers actions so key events can finish first.
  withProperty(window, 'setTimeout', function (callback) { callback(); return 1 }, function () {
    app.element.onsubmit({ srcElement: form })
  })

  assertEqual(first.textContent, 'One')
  assertEqual(second.textContent, 'Two')
})
