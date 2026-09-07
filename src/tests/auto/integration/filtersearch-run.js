test('filtersearch-run - filters a target through filtersearch--run', function () {
  var plugin = app.plugin.filtersearch
  plugin.__autoload({ name: 'filtersearch', element: document.body })
  var input = createElement('input')
  input.type = 'text'
  input.setAttribute('filtersearch--input', '')
  input.value = 'apple'
  var container = createElement('section')
  container.id = 'attribute-filter'
  var first = document.createElement('article')
  first.setAttribute('filtersearch--select', '')
  first.textContent = 'Apple'
  var second = document.createElement('article')
  second.setAttribute('filtersearch--select', '')
  second.textContent = 'Banana'
  container.appendChild(first)
  container.appendChild(second)
  input.setAttribute('click', 'filtersearch--run:#attribute-filter')
  app.call(input.getAttribute('click'), { srcElement: input })
  assertEqual(first.style.display, '')
  assertContains(second.style.cssText, 'display: none')
})
