test('overlay-close - closes a dialog through overlay-close', function () {
  var dialog = document.createElement('dialog')
  dialog.id = 'attribute-close-dialog'
  document.body.appendChild(dialog)
  var button = createElement('button')
  button.setAttribute('click', 'overlay-close:#attribute-close-dialog')
  var closed = false
  dialog.close = function () { closed = true }
  try {
    app.call(button.getAttribute('click'), { srcElement: button })
    assertTrue(closed)
  } finally {
    dialog.remove()
  }
})
