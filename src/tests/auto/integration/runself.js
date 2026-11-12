test('runself - runs attributes on specific selector', function () {
  var element = createElement('div')
  element.id = 'runself-test'
  element.setAttribute('settext', 'selector-text')

  app.element.saveOriginalValues(element)

  // runself runs app.attributes.run with the selector
  dom.runself(element, '#runself-test')

  assertEqual(element.textContent, 'selector-text')
})

test('runself - bracket syntax with selector and stop', function () {
  var container = createElement('div')
  container.innerHTML = '<div id="test1" settext="Changed" stop="settext">Original</div><button click="runself:#test1:[stop]">Run</button>'
  document.body.appendChild(container)

  var target = container.querySelector('#test1')
  var button = container.querySelector('button')

  // Verify initial state
  assertEqual(target.textContent, 'Original')
  assertEqual(target.getAttribute('stop'), 'settext')

  // Simulate button click
  button.click()

  // After runself:#test1:[stop], stop attribute should be removed and settext should run
  assertEqual(target.textContent, 'Changed')
  assertEqual(target.getAttribute('stop'), null)

  document.body.removeChild(container)
})

test('runself - bracket syntax with current element (#:)', function () {
  var container = createElement('div')
  container.innerHTML = '<button settext="Self" stop="settext" click="runself:#:[stop]">Original</button>'
  document.body.appendChild(container)

  var button = container.querySelector('button')

  assertEqual(button.textContent, 'Original')
  assertEqual(button.getAttribute('stop'), 'settext')

  button.click()

  assertEqual(button.textContent, 'Self')
  assertEqual(button.getAttribute('stop'), null)

  document.body.removeChild(container)
})

test('runself - bracket syntax without stop works normally', function () {
  var element = createElement('div')
  element.id = 'test2'
  element.setAttribute('settext', 'Works')
  element.textContent = 'Original'

  app.element.saveOriginalValues(element)
  app.call('runself:#test2', { srcElement: element })

  assertEqual(element.textContent, 'Works')
})
