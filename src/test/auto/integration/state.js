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

  dom.rerun(select)
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

  dom.rerun(input)
  dom.rerun(textarea)
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

  dom.rerun(template)
  dom.rerun(plain)
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
  dom.rerun(output)

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

  dom.rerun(output)
  assertEqual(target.textContent, 'State changed')

  target.textContent = 'Waiting'
  app.state.set(key, 'changed')
  assertEqual(target.textContent, 'State changed')
})

test('statebind - replaces attribute variables without replacing content', function () {
  var key = 'integrationStateBind'
  var parent = createElement('section')
  var element = document.createElement('div')
  var sourceCalls = 0
  var originalSource = app.module.data && app.module.data.src
  parent.setAttribute('data-src', 'mock://statebind')
  parent.appendChild(element)
  element.innerHTML = '<span>Rows remain</span>'
  element.setAttribute('statebind', 's:' + key)
  element.setAttribute('data-filter', 'since>:[{s}]')

  if (app.module.data) app.module.data.src = function () { sourceCalls++ }

  try {
    app.state.set(key, 1000000)
    dom.rerun(element)
    assertEqual(element.getAttribute('data-filter'), 'since>:[1000000]')
    assertEqual(element.querySelector('span').textContent, 'Rows remain')

    app.state.set(key, 1000001)
    assertEqual(element.getAttribute('data-filter'), 'since>:[1000001]')
    assertEqual(element.querySelector('span').textContent, 'Rows remain')
    assertEqual(sourceCalls, 0)
  } finally {
    if (app.module.data) app.module.data.src = originalSource
  }
})

test('statebind - runs onstatebind after state changes', function () {
  var key = 'integrationStateBindEvent'
  var target = createElement('div')
  var element = createElement('div')

  target.textContent = 'Waiting'
  element.setAttribute('statebind', 's:' + key)
  element.setAttribute('onstatebind', 'settext:#' + target.id + ':[State changed]')

  dom.rerun(element)
  assertEqual(target.textContent, 'Waiting')

  app.state.set(key, 1000000)
  assertEqual(target.textContent, 'State changed')

  target.textContent = 'Waiting'
  app.state.set(key, 1000001)
  assertEqual(target.textContent, 'State changed')
})

test('statebind - reruns a data source once after a state change', function () {
  if (!app.module.data) return

  var key = 'integrationStateBindDataRerun'
  var data = app.module.data
  var element = createElement('div')
  var reruns = 0

  element.setAttribute('data-src', 'mock://statebind-data-rerun')
  element.setAttribute('statebind', 's:' + key)
  element.setAttribute('data-filter', 'since<:[{s}]')
  element.setAttribute('onstatebind', 'data-rerun:#' + element.id)

  withStub(data, '_rerun', function (target) {
    reruns++
    assertEqual(target, element)
    assertEqual(target.getAttribute('data-filter'), 'since<:[1000000]')
  }, function () {
    dom.rerun(element)
    assertEqual(reruns, 0)

    app.state.set(key, 1000000)
    assertEqual(reruns, 1)

    app.state.set(key, 1000000)
    assertEqual(reruns, 1)
  })
})

test('statebind - generic rerun does not re-enter onstatebind', function () {
  var key = 'integrationStateBindGenericRerun'
  var element = createElement('div')
  var callbacks = 0

  element.setAttribute('statebind', 's:' + key)
  element.setAttribute('data-filter', 'since<:[{s}]')
  element.setAttribute('onstatebind', 'alert:[changed];rerun:#' + element.id)

  // Counting with a cap keeps a recursion regression a failed assertion
  // instead of an exhausted call stack.
  withStub(dom, 'alert', function () {
    callbacks++
    if (callbacks > 25) throw new Error('onstatebind recursion detected')
  }, function () {
    dom.rerun(element)
    assertEqual(callbacks, 0)

    app.state.set(key, 1000000)
    assertEqual(callbacks, 1)
    assertEqual(element.getAttribute('data-filter'), 'since<:[1000000]')

    app.state.set(key, 1000001)
    assertEqual(callbacks, 2)
    assertEqual(element.getAttribute('data-filter'), 'since<:[1000001]')
  })
})

test('statebind - detached iterate nodes stop dispatching callbacks', function () {
  if (!app.module.data) return

  var key = 'integrationStateBindDetached'
  var data = app.module.data
  var source = createElement('div')
  var reruns = 0

  source.setAttribute('data-src', 'mock://statebind-detached')

  function addBoundNode() {
    var element = document.createElement('div')
    element.setAttribute('statebind', 's:' + key)
    element.setAttribute('data-filter', 'since<:[{s}]')
    element.setAttribute('onstatebind', 'data-rerun:#' + source.id)
    source.appendChild(element)
    app.attributes.run([element])
    return element
  }

  addBoundNode()
  source.innerHTML = ''
  addBoundNode()

  withStub(data, '_rerun', function (element) {
    reruns++
    assertEqual(element, source)
  }, function () {
    app.state.set(key, 1000000)
    assertEqual(reruns, 1)

    source.innerHTML = ''
    addBoundNode()
    app.state.set(key, 1000001)
    assertEqual(reruns, 2)
  })
})

test('statebind - does not suppress events for later attributes or elements', function () {
  var key = 'integrationStateBindEventIsolation'
  var target = createElement('div')
  var bound = createElement('div')
  var sibling = createElement('div')

  bound.setAttribute('statebind', 's:' + key)
  sibling.setAttribute('bgcolor', 'black')
  sibling.setAttribute('onbgcolor', 'settext:#' + target.id + ':[Sibling event ran]')
  target.textContent = 'Waiting'

  app.attributes.run([bound, sibling])
  assertEqual(target.textContent, 'Sibling event ran')
})

test('statebind - later attributes on the same element still dispatch events', function () {
  var key = 'integrationStateBindSameElement'
  var target = createElement('div')
  var element = createElement('div')

  // statebind owns its own event, but must not suppress events for the
  // attributes processed after it on the very same element. A non-action
  // attribute is used deliberately: an action would reassign the internal
  // result and hide a leaked suppression value.
  element.setAttribute('statebind', 's:' + key)
  element.setAttribute('marker', 'true')
  element.setAttribute('onmarker', 'settext:#' + target.id + ':[Later attribute ran]')
  target.textContent = 'Waiting'

  app.attributes.run([element])
  assertEqual(target.textContent, 'Later attribute ran')
})

test('statebind - ignores malformed bindings without subscribing', function () {
  var element = createElement('div')
  var missingKey = createElement('div')

  element.setAttribute('statebind', '')
  element.setAttribute('data-filter', 'since<:[{s}]')
  missingKey.setAttribute('statebind', 'docVersion')
  missingKey.setAttribute('data-filter', 'since<:[{s}]')

  app.attributes.run([element, missingKey])

  assertEqual(element.getAttribute('data-filter'), 'since<:[{s}]')
  assertEqual(missingKey.getAttribute('data-filter'), 'since<:[{s}]')
  assertEqual(!!element._statebindSubscribed, false)
  assertEqual(!!missingKey._statebindSubscribed, false)
})

test('statebind - renders an empty value for unset state', function () {
  var element = createElement('div')

  element.setAttribute('statebind', 's:integrationStateBindUnset')
  element.setAttribute('data-filter', 'since<:[{s}]')

  app.attributes.run([element])
  assertEqual(element.getAttribute('data-filter'), 'since<:[]')
})
