test('start - should execute multiple attributes on a single child element', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div settext="YES" insertbeforeend="YES">Original</div>'
  dom.start(parent)
  assertEqual(parent.innerText, 'YESYES')
})


test('start - should executes attributes on multiple child elements inside a parent', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div><div settext="YES"></div><div settext="YES"></div></div>'
  dom.start(parent)
  assertEqual(parent.innerText, 'YESYES')
})

test('start - should resume only the requested stopped attribute', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div settext="YES" bgcolor="red">Original</div>'
  dom.stop(parent, '*')

  dom.start(parent, 'settext')

  var child = parent.querySelector('div')
  assertEqual(child.innerText, 'YES')
  assertEqual(child.style.backgroundColor, '')
})
