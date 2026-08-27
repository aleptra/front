test('overlay-dialog - opens and binds a dialog through overlay-dialog', function () {
  var dialog = document.createElement('dialog')
  dialog.id = 'attribute-dialog'
  dialog.originalHtml = '<input overlay-bind>'
  document.body.appendChild(dialog)
  var source = createElement('button')
  source.setAttribute('overlay-bind', 'source-value')
  source.setAttribute('click', 'overlay-dialog:#attribute-dialog')
  var opened = false
  dialog.showModal = function () { opened = true }
  try {
    app.call(source.getAttribute('click'), { srcElement: source })
    assertTrue(opened)
    assertEqual(dialog.querySelector('input').value, 'source-value')
  } finally {
    dialog.remove()
  }
})
