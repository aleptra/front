test('app.call - parsedCall for element without attribute', function () {
  var stub = createStub(app, 'exec')
  var testElement = createElement('div')
  app.call('func:#' + testElement.id + ':[value]')
  assertIsObject(stub.get.element).desc('element is object')
  assertEqual(stub.get.func, 'func').desc('func name')
  assertEqual(stub.get.value, 'value').desc('value')
  assertEqual(stub.get.attribute, 'textContent').desc('attribute name')
  assertFalse(stub.get.hasAttribute).desc('has attribute')
  assertFalse(stub.get.hasSubAttribute).desc('has sub attribute')
  assertFalse(stub.get.subElement).desc('has sub element')
})

test('app.call - parsedCall for element with attribute', function () {
  var stub = createStub(app, 'exec')
  var testElement = createElement('div')
  app.call('func:#' + testElement.id + '.attribute:[value]')
  assertIsObject(stub.get.element).desc('element is object')
  assertEqual(stub.get.func, 'func').desc('func name')
  assertEqual(stub.get.value, 'value').desc('value')
  assertEqual(stub.get.attribute, 'attribute').desc('attribute name')
  assertTrue(stub.get.hasAttribute).desc('has attribute')
  assertFalse(stub.get.hasSubAttribute).desc('has sub attribute')
  assertFalse(stub.get.subElement).desc('sub element')
})

test('app.call - parsedCall for element with subElement and subAttribute', function () {
  var stub = createStub(app, 'exec')
  var testElement = createElement('div')
  testElement.setAttribute('attribute2', '0')
  app.call('func:#' + testElement.id + ':#' + testElement.id + '.attribute2')
  assertIsObject(stub.get.element).desc('element is object')
  assertIsObject(stub.get.subElement).desc('subElement is object')
  assertEqual(stub.get.func, 'func').desc('func name')
  assertEqual(stub.get.value, '0').desc('value')
  assertEqual(stub.get.attribute, 'textContent').desc('attribute name')
  assertFalse(stub.get.hasAttribute).desc('has attribute')
  assertTrue(stub.get.hasSubAttribute).desc('has subAttribute')
})

test('app.call - multiple commands separated by semicolon', function () {
  var stub = createStub(app, 'exec')
  var el1 = createElement('div')
  var el2 = createElement('div')
  app.call('func1:#' + el1.id + ':[A];func2:#' + el2.id + ':[B]')
  assertEqual(stub.get.func, 'func2').desc('last executed function')
})

test('app.call - empty value brackets', function () {
  var stub = createStub(app, 'exec')
  var el = createElement('div')
  app.call('func:#' + el.id + ':[]')
  assertEqual(stub.get.value, '').desc('empty brackets produce empty string')
})

test('app.call - multiple bracket values', function () {
  var stub = createStub(app, 'exec')
  var el = createElement('div')
  app.call('func:#' + el.id + ':[one][two][three]')
  assertEqual(stub.get.value.length, 3).desc('multiple bracket values parsed')
})

test('app.call - element selector using *', function () {
  var stub = createStub(app, 'exec')
  app.call('func:*main:[value]')
  assertIsObject(stub.get.element).desc('element is object selected by *')
  assertEqual(stub.get.element.localName, 'main').desc('element name')
  assertEqual(stub.get.func, 'func').desc('func name')
  assertEqual(stub.get.value, 'value').desc('value')
})

test('app.call - primaryvalue with multiple bracket values', function () {
  var stub = createStub(app, 'exec')
  app.call('func:[value1]:[value2][value3]')
  assertEqual(stub.get.func, 'func').desc('func name')
  assertFalse(stub.get.element).desc('element is false')
  assertEqual(stub.get.value.length, 3).desc('has three values')
})