test('responsivevoice-speak - speaks a value through responsivevoice--speak', function () {
  var spoken = ''
  withProperty(window, 'responsiveVoice', { cancel: function () { }, speak: function (value) { spoken = value } }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'responsivevoice--speak:[hello]')
    app.call(button.getAttribute('click'), { srcElement: button })
  })
  assertEqual(spoken, 'hello')
})
