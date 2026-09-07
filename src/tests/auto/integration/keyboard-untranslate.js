test('keyboard-untranslate - removes the mapped text before the caret', function () {
  var element = document.createElement('div')
  element.id = 'keyboardUntranslate'
  element.setAttribute('contenteditable', 'true')
  element.setAttribute('keyboard-untranslate', 'Backspace:--')
  element.textContent = 'ab--'
  document.body.appendChild(element)

  try {
    var range = document.createRange()
    range.setStart(element.firstChild, 4)
    range.collapse(true)
    var selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }))

    assertEqual(element.textContent, 'ab')
  } finally {
    element.parentNode.removeChild(element)
  }
})

test('keyboard-untranslate - leaves text that does not match the mapping', function () {
  var element = document.createElement('div')
  element.id = 'keyboardUntranslateOther'
  element.setAttribute('contenteditable', 'true')
  element.setAttribute('keyboard-untranslate', 'Backspace:--')
  element.textContent = 'abcd'
  document.body.appendChild(element)

  try {
    var range = document.createRange()
    range.setStart(element.firstChild, 4)
    range.collapse(true)
    var selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true }))

    assertEqual(element.textContent, 'abcd')
  } finally {
    element.parentNode.removeChild(element)
  }
})
