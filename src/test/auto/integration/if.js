test('if - executes action when values are equal (:)', function () {
  var expected = 'EQUAL'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([42]:[42])/settext:[EQUAL]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes action with parameters when values are equal (:)', function () {
  var expected = 'value2'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([42]:[42])/setattr:#' + testElement.id + ':[value1][value2]')
  dom.rerun(testElement)
  assertEqual(testElement.getAttribute('value1'), expected)
})

test('if - executes action when values are not equal (!)', function () {
  var expected = 'NOT_EQUAL'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([42]![43])/settext:[NOT_EQUAL]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes action when left value is greater than right value (>)', function () {
  var expected = 'GREATER'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([10]>[5])/settext:[GREATER]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes action when left value is less than right value (<)', function () {
  var expected = 'LESS'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([5]<[10])/settext:[LESS]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes action when left value contains right value (~)', function () {
  var expected = 'CONTAINS'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([hello world]~[world])/settext:[CONTAINS]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes action when left value contains right value (~)', function () {
  var expected = 'CONTAINS'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([http://localhost:5502/documentation/fundamentals/attributes.html]~[/fundamentals/attributes])/settext:[CONTAINS]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes action when left value does not contain right value (!~)', function () {
  var expected = 'NOT_CONTAINS'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([hello world]!~[mars])/settext:[NOT_CONTAINS]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes true action when both conditions are met (&)', function () {
  var expected = 'BOTH_TRUE'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([1]:[1]&[A]:[A])/settext:[BOTH_TRUE]?settext:[FAIL]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes false action when one condition in AND fails (&)', function () {
  var expected = 'FAILED'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([1]:[1]&[1]:[2])/settext:[SUCCESS]?settext:[FAILED]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes multiple actions in the true block with more than two actions', function () {
  var testElement = createElement('div')
  testElement.id = 'multiActionExtended'

  // True conditions: [1]:[1] AND [A]:[A]
  // True block actions: settext + two other actions (simulated as attributes)
  testElement.setAttribute('if', '([1]:[1]&[A]:[A])/settext:[BOTH_TRUE]&setattr:#multiActionExtended:[action1][done]&setattr:#multiActionExtended:[action2][done]?settext:[FAIL]')

  dom.rerun(testElement)

  // Verify all true actions executed
  assertEqual(testElement.innerText, 'BOTH_TRUE')
  assertEqual(testElement.getAttribute('action1'), 'done')
  assertEqual(testElement.getAttribute('action2'), 'done')
})

test('if - executes true action when at least one condition is met (|)', function () {
  var expected = 'OR_SUCCESS'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([1]:[2]|[A]:[A])/settext:[OR_SUCCESS]?settext:[FAIL]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes false action when all OR conditions fail (|)', function () {
  var expected = 'ALL_FAILED'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([1]:[2]|[3]:[4])/settext:[SUCCESS]?settext:[ALL_FAILED]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - evaluates complex chains from left to right ([F & T | T])', function () {
  var expected = 'TRUE'
  var testElement = createElement('div')
  // (1:2 is False AND 1:1 is True) -> False. (False OR 3:3 is True) -> True.
  testElement.setAttribute('if', '([1]:[2]&[1]:[1]|[3]:[3])/settext:[TRUE]?settext:[FALSE]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - evaluates complex chains from left to right ([T | T & F])', function () {
  var expected = 'FALSE'
  var testElement = createElement('div')
  // (1:1 is True OR 2:2 is True) -> True. (True AND 3:4 is False) -> False.
  testElement.setAttribute('if', '([1]:[1]|[2]:[2]&[3]:[4])/settext:[TRUE]?settext:[FALSE]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - executes multiple actions in the true block', function () {
  var testElement = createElement('div')
  testElement.id = 'multiAction'
  testElement.setAttribute('if', '([1]:[1])/settext:[DONE]&setattr:#multiAction:[data-check][passed]')
  dom.rerun(testElement)

  assertEqual(testElement.innerText, 'DONE')
  assertEqual(testElement.getAttribute('data-check'), 'passed')
})

test('if - handles missing false action block gracefully', function () {
  var testElement = createElement('div')
  testElement.innerText = 'ORIGINAL'
  // Condition is false, but no ?falseAction is provided
  testElement.setAttribute('if', '([1]:[2])/settext:[NEW]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, 'ORIGINAL')
})

test('if - handles empty values within brackets', function () {
  var expected = 'EMPTY_MATCH'
  var testElement = createElement('div')
  testElement.setAttribute('if', '([]:[])/settext:[EMPTY_MATCH]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - only runs false action when condition is false', function () {
  const testElement = createElement('div')
  testElement.innerText = 'ORIGINAL'

  testElement.setAttribute('if', '([1]:[2])/?settext:[FALSE]')
  dom.rerun(testElement)

  assertEqual(testElement.innerText, 'FALSE')
})

test('if - get values from one input', function () {
  var expected = 'True'
  var testElement = createElement('div')

  // Input element to reference
  var inputElement = createElement('input')
  inputElement.id = 'element1'
  inputElement.type = 'text'
  inputElement.value = '10'

  testElement.setAttribute('if', '(#element1:[10])/settext:[True]?settext:[False]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)

  var expected = 'False'
  var testElement = createElement('div')

  // Input element to reference
  var inputElement = createElement('input')
  inputElement.id = 'element1'
  inputElement.type = 'text'
  inputElement.value = '10'

  testElement.setAttribute('if', '(#element1:[20])/settext:[True]?settext:[False]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})

test('if - get values from two input', function () {
  var expected = 'True'
  var testElement = createElement('div')

  // Input element to reference
  var inputElement = createElement('input')
  inputElement.id = 'element1'
  inputElement.type = 'text'
  inputElement.value = '10'

  // Input element to reference
  var inputElement = createElement('input')
  inputElement.id = 'element2'
  inputElement.type = 'text'
  inputElement.value = '20'

  testElement.setAttribute('if', '(#element1:[10]&#element2:[20])/settext:[True]?settext:[False]')
  dom.rerun(testElement)
  assertEqual(testElement.innerText, expected)
})