test('stop - Pattern 0: *.attr + stop nested in child', function () {
  var parent = createElement('div')
  parent.innerHTML = `
    <div settext="NO" stop="bgcolor">Original</div>
    <div settext="NO" stop="bgcolor;bold" bold>
      Original
      <div settext="NO" stop="bgcolor;bold;settext" bold>Inner</div>
    </div>`

  dom.stop(parent, '*.settext')
  app.attributes.run(parent.querySelectorAll('*'))

  var children = parent.querySelectorAll('div')
  children.forEach(function (child) {
    assertEqual(child.innerText.trim().startsWith('Original') || child.innerText.trim() === 'Inner', true)
  })
})

test('stop - Pattern 1: * (all attributes on children only)', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div settext="NO" bgcolor="red">Original</div>'

  dom.stop(parent, '*')
  app.attributes.run(parent.querySelectorAll('*'))

  var child = parent.querySelector('div')
  assertEqual(child.innerText, 'Original')
  assertEqual(child.getAttribute('bgcolor'), 'red')
})

test('stop - Pattern 2: *.attr (specific attribute on children only)', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div settext="NO" bgcolor="green">Original</div>'

  dom.stop(parent, '*.settext')
  app.attributes.run(parent.querySelectorAll('*'))

  var child = parent.querySelector('div')
  assertEqual(child.innerText, 'Original')
  assertEqual(child.getAttribute('bgcolor'), 'green')
})

test('stop - Pattern 3: attr (specific attribute on parent only)', function () {
  var parent = createElement('div')
  parent.setAttribute('settext', 'NO')
  parent.innerHTML = '<div>YES</div>'

  dom.stop(parent, 'settext')
  app.attributes.run(parent)

  assertEqual(parent.innerText.includes('YES'), true)
})


test.skip('stop - Pattern 4: *;parentattr (attributes on children and parent)', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div id="parent" settext="NO1">YES<div settext="NO2">YES</div></div>'

  //dom.stop(parent, '*;settext')
  dom.stop(parent, '*')
  dom.rerun(parent)
  assertEqual(parent.innerText, 'YESYES')
})

test.skip('stop - Pattern 5: Mixed (specific parent, specific child)', function () {
  var parent = createElement('div')
  parent.setAttribute('settext', 'NO')
  parent.innerHTML = '<div settext="YES" bgcolor="red" bold>Child</div>'

  dom.stop(parent, 'settext;*.bgcolor')
  app.attributes.run([parent].concat(parent.querySelectorAll('*')))

  var child = parent.querySelector('div')
  assertEqual(parent.innerText.includes('Child'), true)
  assertEqual(child.getAttribute('bgcolor'), 'red')
  assertEqual(child.innerText, 'Child')
})

test('stop - Pattern 6: Multiple Children targets', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div settext="NO" bgcolor="red">Child</div>'

  dom.stop(parent, '*.settext;*.bgcolor')
  app.attributes.run(parent.querySelectorAll('*'))

  var child = parent.querySelector('div')
  assertEqual(child.innerText, 'Child')
  assertEqual(child.getAttribute('bgcolor'), 'red')
})


test('stop - Pattern 7: Wrong attribute typo', function () {
  var parent = createElement('div')
  parent.innerHTML = '<div settext="YES" bgcolor="red">Child</div>'

  dom.stop(parent, '*.settex;*.bgcolor')
  app.attributes.run(parent.querySelectorAll('*'))

  var child = parent.querySelector('div')
  assertEqual(child.innerText, 'YES')
  assertEqual(child.getAttribute('bgcolor'), 'red')
})