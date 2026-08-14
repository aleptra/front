test('bindappend - should bind a source value to content', function () {
  var source = createElement('span')
  source.textContent = 'World'
  var target = createElement('div')
  target.textContent = 'Hello {name}'
  target.setAttribute('bindappend', '#' + source.id + ':name')

  dom.rerun(target)

  assertEqual(target.textContent, 'Hello World')
})
