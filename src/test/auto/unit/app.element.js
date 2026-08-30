test('app.element - resolves selectors, ancestors, calls, and binding defaults', function () {
  var parent = createElement('a')
  var child = document.createElement('span')
  parent.appendChild(child)
  parent.setAttribute('data-value', 'value')
  child.innerHTML = '{label:Default}'

  assertEqual(app.element.getTagLink(child), parent).desc('ancestor link resolved')
  assertEqual(app.element.getClosestWithAttr(child, 'data-value'), parent).desc('ancestor attribute resolved')
  assertEqual(app.element.resolveBindingValue(child, 'label'), 'Default').desc('binding default resolved')
  assertEqual(app.element.resolveBindingValue(child, 'label', 'Override'), 'Override').desc('explicit binding value wins')
  assertEqual(app.element.getRelativePath('user', 'user.name'), 'name').desc('relative path removed')
  assertEqual(app.element.getRelativePath('user', 'other.name'), 'other.name').desc('unrelated path preserved')

  var resolved = app.element.resolveCall(child, 'settext:#' + parent.id + ':[value]')
  assertEqual(resolved.call.func, 'settext').desc('call function resolved')
  assertEqual(resolved.call.value, 'settext:#' + parent.id + ':[value]').desc('call string preserved')
})

test('app.element - gets element properties and applies numeric operations', function () {
  var input = createElement('input')
  input.value = 'hello'
  var link = createElement('a')
  link.href = '/items?page=2&size=4'

  assertEqual(app.element.get(input), 'hello').desc('input property read')
  assertEqual(app.element.get(input, false, true), 'value').desc('input property name read')
  assertEqual(app.element.operate('+2', false, '3'), 5).desc('numeric operation applied')
  assertEqual(app.element.operate('*2', 'page', link.getAttribute('href')), '/items?page=4&size=4').desc('query operation applied')
})
