test('onclicked - should fire onclicked when element is clicked', function () {
  var testElement = createElement('button')
  testElement.setAttribute('onclicked', 'settext:[OK]')
  app.attributes.run('#' + testElement.id)
  app.call('click:#' + testElement.id)
  assertEqual(testElement.textContent, 'OK')
})

test('rightclick - should route a nested context menu event to its closest target', function () {
  var target = createElement('div')
  var container = createElement('div')
  var nested = document.createElement('span')
  container.appendChild(nested)
  container.setAttribute('rightclick', 'settext:#' + target.id + ':[context]')

  nested.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))

  assertEqual(target.textContent, 'context')
})

test('onclicked - should run the conditional event callback', function () {
  var target = createElement('div')
  var element = createElement('button')
  element.setAttribute('onifclicked', '([1]:[1])/settext:#' + target.id + ':[conditional]')

  app.call('click:#' + element.id)

  assertEqual(target.textContent, 'conditional')
})

test('onclicked - should suppress event callbacks while a parent is data-loading', function () {
  var parent = createElement('div')
  var target = createElement('div')
  var element = createElement('button')
  parent.appendChild(element)
  element.setAttribute('onclicked', 'settext:#' + target.id + ':[clicked]')
  app.attributes.run([element])
  parent._dataLoaded = false

  app.call('click:#' + element.id)
  assertEqual(target.textContent, '')

  parent._dataLoaded = true
  app.call('click:#' + element.id)
  assertEqual(target.textContent, 'clicked')
})

test.skip('onclicked - should route a nested native click to its button ancestor once', function () {
  var target = createElement('div')
  var button = createElement('button')
  var nested = document.createElement('span')
  button.appendChild(nested)
  button.setAttribute('click', 'settext:#' + target.id + ':[clicked]')
  button.setAttribute('onclicked', 'insertbeforeend:#' + target.id + ':[!]')

  app.click(nested)

  assertEqual(target.textContent, 'clicked!')
})
