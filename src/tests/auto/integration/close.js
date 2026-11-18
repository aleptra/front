test('close - closes a details element', function () {
  var details = createElement('details')
  details.id = 'test-details'
  details.open = true
  document.body.appendChild(details)

  assertEqual(details.open, true)
  
  dom.close(details)
  
  assertEqual(details.open, false)
  document.body.removeChild(details)
})

test('close - closes a dialog element', function () {
  var dialog = document.createElement('dialog')
  dialog.id = 'test-dialog'
  document.body.appendChild(dialog)
  
  var closeCalled = false
  var originalClose = dialog.close
  dialog.close = function () { 
    closeCalled = true
    originalClose.call(this)
  }
  
  dom.close(dialog)
  
  assertEqual(closeCalled, true)
  document.body.removeChild(dialog)
})

test('close - prevents infinite loops with ontoggle', function () {
  var details = createElement('details')
  details.id = 'test-details-toggle'
  details.open = true
  
  var callCount = 0
  var originalClose = dom.close
  dom.close = function (el) {
    callCount++
    if (callCount > 10) throw new Error('Infinite loop detected in close')
    return originalClose.call(this, el)
  }
  
  document.body.appendChild(details)
  
  try {
    dom.close(details)
    assertEqual(details.open, false)
    assertTrue(callCount <= 2) // Should be called only once or twice maximum
  } finally {
    dom.close = originalClose
    document.body.removeChild(details)
  }
})

test('close - works with selector through call', function () {
  var details = createElement('details')
  details.id = 'close-test-details'
  details.open = true
  document.body.appendChild(details)
  
  app.call('close:#close-test-details')
  
  assertEqual(details.open, false)
  document.body.removeChild(details)
})
