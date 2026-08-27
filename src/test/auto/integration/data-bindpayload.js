test('data-bindpayload - binds a form value through data-bindpayload', function () {
  var form = createElement('form')
  var input = document.createElement('input')
  input.name = 'name'
  input.value = 'Ada'
  form.appendChild(input)
  form.setAttribute('data-name', '{data-name}')
  var button = createElement('button')
  button.setAttribute('click', 'data-bindpayload:[data-name:name]')
  button.setAttribute('clicktargetfield', '#' + form.id)
  app.call(button.getAttribute('click'), { srcElement: button, element: form })
  assertEqual(form.getAttribute('data-name'), 'Ada')
})
