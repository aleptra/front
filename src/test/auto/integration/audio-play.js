test('audio-play - invokes the browser audio object through audio-play', function () {
  var source = ''
  withProperty(window, 'Audio', function (value) {
    source = value
    return { play: function () { return true } }
  }, function () {
    var button = createElement('button')
    button.setAttribute('click', 'audio-play:[tone.mp3]')
    app.call(button.getAttribute('click'), { srcElement: button })
  })
  assertEqual(source, 'tone.mp3')
})
