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

test('start - should start element directly without selector', function () {
  var el = createElement('div')
  el.setAttribute('settext', 'Running')
  el.innerText = 'Original'

  dom.start(el)

  assertEqual(el.innerText, 'Running')
})

test('start - should override stop attribute when called without exclusions', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext')
  el.setAttribute('settext', 'Running')
  el.innerText = 'Original'

  dom.start(el)

  // start without exclusions should OVERRIDE stop and run all attributes
  assertEqual(el.innerText, 'Running')
})

test('start - should preserve stop when using wildcard exclusions', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext')
  el.setAttribute('settext', 'Running')
  el.setAttribute('bgcolor', 'red')
  el.innerText = 'Original'

  dom.start(el, '[*][*.stop]')

  // start with wildcard should preserve existing stop attribute
  assertEqual(el.innerText, 'Original')
  assertEqual(el.style.backgroundColor, 'red')
})

test('start - should support multiple wildcard exclusions', function () {
  var el = createElement('div')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.setAttribute('color', 'blue')
  el.innerText = 'Original'

  dom.start(el, '[*][*.settext][*.color]')

  // Should run bgcolor but not settext or color
  assertEqual(el.innerText, 'Original')
  assertEqual(el.style.backgroundColor, 'red')
  assertEqual(el.style.color, '')
})





test('start - should exclude attributes', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext;bgcolor')
  el.setAttribute('settext', 'Running')
  el.setAttribute('bgcolor', 'blue')
  el.innerText = '...'

  // Use wildcard syntax to exclude
  dom.start(el, '[*][*.settext][*.bgcolor]')

  // Should run no attributes (all excluded by wildcard)
  assertEqual(el.innerText, '...')
  assertEqual(el.style.backgroundColor, '')
})

test('start - click handler with selector and exclusion', function () {
  var container = createElement('div')
  container.innerHTML = '<div id="start" stop="settext;bgcolor" settext="Running" bgcolor="green">...</div><button click="start:#start:[*][*.bgcolor]">Start</button>'

  document.body.appendChild(container)

  var startDiv = container.querySelector('#start')
  var button = container.querySelector('button')

  // Verify initial state
  assertEqual(startDiv.innerText, '...')
  assertEqual(startDiv.style.backgroundColor, '')

  // Simulate button click
  button.click()

  // After click with [*][*.bgcolor]: settext should run (shows "Running"), bgcolor should be excluded (stays empty)
  assertEqual(startDiv.innerText, 'Running')
  assertEqual(startDiv.style.backgroundColor, '')

  document.body.removeChild(container)
})


test('start - parent with stop start should process child', function () {
  var parent = createElement('div')
  parent.setAttribute('stop', '*;bgcolor')
  parent.setAttribute('start', '*')
  parent.setAttribute('bgcolor', 'red')

  var child = createElement('div')
  child.setAttribute('settext', 'OK')
  child.setAttribute('stop', 'bgcolor')
  child.setAttribute('bgcolor', 'red')
  child.innerText = 'NOT OK'

  parent.appendChild(child)

  // Manually call start on parent to simulate what start="*" does
  dom.start(parent, '*')

  // Child settext should run
  assertEqual(child.innerText, 'OK')
})


test('start - selective attributes resume only stopped ones', function () {
  var el = createElement('div')
  el.setAttribute('settext', 'Running')
  el.setAttribute('bgcolor', 'red')
  el.setAttribute('color', 'blue')
  el.setAttribute('stop', 'settext;bgcolor;color')
  el.innerText = '...'

  // Resume only settext and bgcolor (these were stopped)
  dom.start(el, '[settext][bgcolor]')

  // settext should run (was stopped, now resumed)
  assertEqual(el.innerText, 'Running')

  // bgcolor should run (was stopped, now resumed)
  assertEqual(el.style.backgroundColor, 'red')

  // color should still be blocked (stop wasn't removed for it)
  assertEqual(el.style.color, '')
})


// ==== COMPREHENSIVE START TESTS ====

test('start - mode 1: no args removes stop and runs all', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext;bgcolor')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.innerText = 'Original'

  dom.start(el)

  assertEqual(el.innerText, 'Changed')
  assertEqual(el.style.backgroundColor, 'red')
  assertEqual(el.getAttribute('stop'), null)
})

test('start - mode 2: wildcard [*] runs everything', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext;bgcolor')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.innerText = 'Original'

  dom.start(el, '[*]')

  assertEqual(el.innerText, 'Changed')
  assertEqual(el.style.backgroundColor, 'red')
})

test('start - mode 3: wildcard [*][*.attr] excludes attr', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext;bgcolor')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.innerText = 'Original'

  dom.start(el, '[*][*.bgcolor]')

  assertEqual(el.innerText, 'Changed')
  assertEqual(el.style.backgroundColor, '')
})

test('start - mode 4: selective [attr] resumes only stopped attr', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext;bgcolor;color')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.setAttribute('color', 'blue')
  el.innerText = 'Original'

  dom.start(el, '[settext][bgcolor]')

  // settext resumed from stop
  assertEqual(el.innerText, 'Changed')
  // bgcolor resumed from stop
  assertEqual(el.style.backgroundColor, 'red')
  // color still blocked by stop
  assertEqual(el.style.color, '')
})

test('start - mode 5: wildcard [*][*.stop] preserves stop meta-attribute', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.innerText = 'Original'

  dom.start(el, '[*][*.stop]')

  // settext blocked by preserved stop
  assertEqual(el.innerText, 'Original')
  // bgcolor runs
  assertEqual(el.style.backgroundColor, 'red')
  // stop attribute preserved
  assertEqual(el.getAttribute('stop'), 'settext')
})

test('start - mode 6: multiple exclusions [*][*.attr1][*.attr2]', function () {
  var el = createElement('div')
  el.setAttribute('stop', 'settext;bgcolor;color')
  el.setAttribute('settext', 'Changed')
  el.setAttribute('bgcolor', 'red')
  el.setAttribute('color', 'blue')
  el.innerText = 'Original'

  dom.start(el, '[*][*.settext][*.bgcolor]')

  // settext blocked
  assertEqual(el.innerText, 'Original')
  // bgcolor blocked
  assertEqual(el.style.backgroundColor, '')
  // color runs
  assertEqual(el.style.color, 'blue')
})

test('start - mode 7: with click handler [*][*.attr]', function () {
  var container = createElement('div')
  container.innerHTML = '<div id="target" stop="settext;bgcolor" settext="Running" bgcolor="green">...</div><button click="start:#target:[*][*.bgcolor]">Start</button>'

  document.body.appendChild(container)

  var target = container.querySelector('#target')
  var button = container.querySelector('button')

  button.click()

  // settext runs
  assertEqual(target.innerText, 'Running')
  // bgcolor excluded
  assertEqual(target.style.backgroundColor, '')

  document.body.removeChild(container)
})

// ==== START ATTRIBUTE SYNTAX (*.attr) ====

test('start - *.attr selective on parent: resume only child attr', function () {
  var parent = createElement('div')
  parent.setAttribute('stop', '*')
  parent.setAttribute('start', '*.settext')

  var child = createElement('div')
  child.setAttribute('stop', 'settext;bgcolor')
  child.setAttribute('settext', 'OK')
  child.setAttribute('bgcolor', 'red')
  child.innerText = 'NOT OK'

  parent.appendChild(child)

  // Call start with *.settext on parent (processes children)
  dom.start(parent, '*.settext')

  // settext should run on child (resumed from stop)
  assertEqual(child.innerText, 'OK')
  // bgcolor should not run (not resumed, still in stop)
  assertEqual(child.style.backgroundColor, '')
})

test('start - *.attr multiple selective resume', function () {
  var parent = createElement('div')
  var child = createElement('div')
  child.setAttribute('stop', 'settext;bgcolor;color')
  child.setAttribute('settext', 'OK')
  child.setAttribute('bgcolor', 'red')
  child.setAttribute('color', 'blue')
  child.innerText = 'NOT OK'

  parent.appendChild(child)

  // Resume only settext and bgcolor on children
  dom.start(parent, '*.settext;*.bgcolor')

  // settext runs
  assertEqual(child.innerText, 'OK')
  // bgcolor runs
  assertEqual(child.style.backgroundColor, 'red')
  // color does not run (not in resume list)
  assertEqual(child.style.color, '')
})

test('start - *.attr with child having no stop', function () {
  var parent = createElement('div')
  var child = createElement('div')
  child.setAttribute('settext', 'OK')
  child.setAttribute('bgcolor', 'red')
  child.innerText = 'NOT OK'

  parent.appendChild(child)

  // Resume *.settext on children (child has no stop, so all attrs run anyway)
  dom.start(parent, '*.settext')

  // settext runs
  assertEqual(child.innerText, 'OK')
  // bgcolor also runs (no stop to block it)
  assertEqual(child.style.backgroundColor, 'red')
})

test('start - *.attr with attribute that has no stop blocking', function () {
  var parent = createElement('div')
  var child = createElement('div')
  child.setAttribute('stop', 'bgcolor')
  child.setAttribute('settext', 'OK')
  child.setAttribute('bgcolor', 'red')
  child.innerText = 'NOT OK'

  parent.appendChild(child)

  // Resume *.settext (which is not in stop list anyway)
  dom.start(parent, '*.settext')

  // settext runs (not blocked by stop)
  assertEqual(child.innerText, 'OK')
  // bgcolor runs (removed from stop by splice(-1) when removing non-existent settext)
  assertEqual(child.style.backgroundColor, 'red')
})

test('start - parent with selective *.attr and child with different stop', function () {
  var parent = createElement('div')
  parent.setAttribute('stop', '*;bgcolor')
  parent.setAttribute('start', '*.settext')
  parent.setAttribute('bgcolor', 'red')

  var child = createElement('div')
  child.setAttribute('settext', 'OK')
  child.setAttribute('stop', 'bgcolor')
  child.setAttribute('bgcolor', 'red')
  child.innerText = 'NOT OK'

  parent.appendChild(child)

  // Call start on parent with *.settext
  dom.start(parent, '*.settext')

  // Child settext should run (resumed by parent start)
  assertEqual(child.innerText, 'OK')
  // Child bgcolor runs (removed from stop by splice(-1) when removing non-existent settext)
  assertEqual(child.style.backgroundColor, 'red')
  // Parent bgcolor runs (removed from stop by splice(-1) when removing non-existent settext)
  assertEqual(parent.style.backgroundColor, 'red')
})
