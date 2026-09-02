test('overlay-bind - copies the source value into matching dialog inputs', function () {
  var dialog = document.createElement('dialog')
  dialog.id = 'attribute-overlay-bind'
  dialog.originalHtml = '<input overlay-bind><input overlay-bind>'
  document.body.appendChild(dialog)

  var source = createElement('button')
  source.setAttribute('overlay-bind', 'bound-value')
  dialog.showModal = function () { }

  try {
    app.module.overlay.dialog({ exec: { element: dialog }, options: { srcElement: source } })

    var inputs = dialog.querySelectorAll('input')
    assertEqual(inputs.length, 2)
    assertEqual(inputs[0].value, 'bound-value')
    assertEqual(inputs[1].getAttribute('value'), 'bound-value')
  } finally {
    dialog.remove()
  }
})

test('overlay-bind - leaves inputs untouched without a bound source', function () {
  var dialog = document.createElement('dialog')
  dialog.id = 'attribute-overlay-bind-empty'
  dialog.originalHtml = '<input overlay-bind>'
  document.body.appendChild(dialog)

  var source = createElement('button')
  dialog.showModal = function () { }

  try {
    app.module.overlay.dialog({ exec: { element: dialog }, options: { srcElement: source } })

    assertEqual(dialog.querySelector('input').value, '')
  } finally {
    dialog.remove()
  }
})
