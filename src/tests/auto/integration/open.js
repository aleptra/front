test('open - opens a details element', function () {
  var details = createElement('details')
  details.id = 'test-details-open'
  details.open = false
  document.body.appendChild(details)

  assertEqual(details.open, false)
  
  dom.open(details)
  
  assertEqual(details.open, true)
  document.body.removeChild(details)
})

test('open - opens a dialog element', function () {
  var dialog = document.createElement('dialog')
  dialog.id = 'test-dialog-open'
  document.body.appendChild(dialog)
  
  var showModalCalled = false
  var originalShowModal = dialog.showModal
  dialog.showModal = function () { 
    showModalCalled = true
    originalShowModal.call(this)
  }
  
  dom.open(dialog)
  
  assertEqual(showModalCalled, true)
  document.body.removeChild(dialog)
})

test('open - prevents infinite loops with ontoggle', function () {
  var details = createElement('details')
  details.id = 'test-details-open-toggle'
  details.open = false
  
  var callCount = 0
  var originalOpen = dom.open
  dom.open = function (el) {
    callCount++
    if (callCount > 10) throw new Error('Infinite loop detected in open')
    return originalOpen.call(this, el)
  }
  
  document.body.appendChild(details)
  
  try {
    dom.open(details)
    assertEqual(details.open, true)
    assertTrue(callCount <= 2) // Should be called only once or twice maximum
  } finally {
    dom.open = originalOpen
    document.body.removeChild(details)
  }
})

test('open - works with selector through call', function () {
  var details = createElement('details')
  details.id = 'open-test-details'
  details.open = false
  document.body.appendChild(details)
  
  app.call('open:#open-test-details')
  
  assertEqual(details.open, true)
  document.body.removeChild(details)
})
