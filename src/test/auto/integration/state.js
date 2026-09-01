function runState(element) {
  dom.rerun(element)
}

test('state - should get and set a value by key', function () {
  var key = 'integrationStateGetSet'

  app.state.set(key, 'ready')

  assertEqual(app.state.get(key), 'ready')
  assertEqual(app.state.set(key, 'updated')[key], 'updated')
  assertEqual(app.state.get(key), 'updated')
})

test('state - should apply object patches and return the whole state', function () {
  var firstKey = 'integrationStatePatchFirst'
  var secondKey = 'integrationStatePatchSecond'
  var patch = {}
  patch[firstKey] = 'one'
  patch[secondKey] = 'two'
  var state = app.state.set(patch)

  assertEqual(state[firstKey], 'one')
  assertEqual(state[secondKey], 'two')
  assertTrue(app.state.get() === state)
})

test('state - should suppress unchanged notifications and support unsubscribe', function () {
  var key = 'integrationStateSubscription'
  var notifications = 0
  var received

  app.state.set(key, 'before')
  var unsubscribe = app.state.subscribe(function (state) {
    notifications++
    received = state[key]
  })

  app.state.set(key, 'before')
  app.state.set(key, 'after')
  unsubscribe()
  app.state.set(key, 'last')

  assertEqual(notifications, 1)
  assertEqual(received, 'after')
})

test('state - should ignore invalid set values', function () {
  var key = 'integrationStateInvalid'
  app.state.set(key, 'kept')
  var before = app.state.get()

  assertTrue(app.state.set() === before)
  assertTrue(app.state.set(null) === before)
  assertTrue(app.state.set([]) === before)
  assertEqual(app.state.get(key), 'kept')
})

test('state - should initialize and update a select control', function () {
  var key = 'integrationStateSelect'
  var select = createElement('select')
  var first = document.createElement('option')
  var second = document.createElement('option')

  first.value = 'first'
  first.textContent = 'First'
  second.value = 'second'
  second.textContent = 'Second'
  select.appendChild(first)
  select.appendChild(second)
  select.value = 'first'
  select.setAttribute('state', key)

  runState(select)
  assertEqual(app.state.get(key), 'first')

  select.value = 'second'
  dispatchTestEvent(select, 'change')
  assertEqual(app.state.get(key), 'second')
})

test('state - should initialize and update input and textarea controls', function () {
  var inputKey = 'integrationStateInput'
  var textareaKey = 'integrationStateTextarea'
  var input = createElement('input')
  var textarea = createElement('textarea')

  input.value = 'input-first'
  input.setAttribute('state', inputKey)
  textarea.value = 'text-first'
  textarea.setAttribute('state', textareaKey)

  runState(input)
  runState(textarea)
  assertEqual(app.state.get(inputKey), 'input-first')
  assertEqual(app.state.get(textareaKey), 'text-first')

  input.value = 'input-second'
  dispatchTestEvent(input, 'input')
  textarea.value = 'text-second'
  dispatchTestEvent(textarea, 'change')
  assertEqual(app.state.get(inputKey), 'input-second')
  assertEqual(app.state.get(textareaKey), 'text-second')
})

test('state - should update multiple templated and plain outputs', function () {
  var key = 'integrationStateOutputs'
  var template = createElement('span')
  var plain = createElement('span')

  app.state.set(key, 'initial')
  template.innerHTML = 'Value: {state}'
  template.setAttribute('state', key)
  plain.textContent = 'Waiting'
  plain.setAttribute('state', key)

  runState(template)
  runState(plain)
  assertEqual(template.textContent, 'Value: initial')
  assertEqual(plain.textContent, 'initial')

  app.state.set(key, 'changed')
  assertEqual(template.textContent, 'Value: changed')
  assertEqual(plain.textContent, 'changed')
})

test('state - should render a fallback for an unset state value', function () {
  var key = 'integrationStateFallback'
  var output = createElement('span')

  output.innerHTML = '{state:No value}'
  output.setAttribute('state', key)
  runState(output)

  assertEqual(output.textContent, 'No value')

  app.state.set(key, 'available')
  assertEqual(output.textContent, 'available')
})

test('state - should run the onstate callback when the value changes', function () {
  var key = 'integrationStateEvent'
  var target = createElement('div')
  var output = createElement('span')

  target.textContent = 'Waiting'
  output.setAttribute('state', key)
  output.setAttribute('onstate', 'settext:#' + target.id + ':[State changed]')

  runState(output)
  assertEqual(target.textContent, 'State changed')

  target.textContent = 'Waiting'
  app.state.set(key, 'changed')
  assertEqual(target.textContent, 'State changed')
})
