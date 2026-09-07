test('keyboard-translate - replaces the pressed key with the mapped text', function () {
  var element = document.createElement('div')
  element.id = 'keyboardTranslate'
  element.setAttribute('contenteditable', 'true')
  element.setAttribute('keyboard-translate', 'Tab:--')
  element.textContent = 'ab'
  document.body.appendChild(element)

  try {
    var range = document.createRange()
    range.setStart(element.firstChild, 2)
    range.collapse(true)
    var selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))

    assertEqual(element.textContent, 'ab--')
  } finally {
    element.parentNode.removeChild(element)
  }
})

test('keyboard-translate - ignores keys that are not mapped', function () {
  var element = document.createElement('div')
  element.id = 'keyboardTranslateOther'
  element.setAttribute('contenteditable', 'true')
  element.setAttribute('keyboard-translate', 'Tab:--')
  element.textContent = 'ab'
  document.body.appendChild(element)

  try {
    var range = document.createRange()
    range.setStart(element.firstChild, 2)
    range.collapse(true)
    var selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }))

    assertEqual(element.textContent, 'ab')
  } finally {
    element.parentNode.removeChild(element)
  }
})
