test('data-iterate - nested iterate="true" inside single-mode parent should receive full array', function () {
  // Mock response: array of 3 items
  var mockData = [
    { id: '1', lang_code: 'eng', word: 'Hello' },
    { id: '2', lang_code: 'swe', word: 'Hej' },
    { id: '3', lang_code: 'syc', word: 'Shlomo' }
  ]

  // Create parent section (single mode, no data-iterate)
  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://test')

  // Create nested child with data-iterate="true"
  var child = document.createElement('div')
  child.setAttribute('data-iterate', 'true')
  child.innerHTML = '<p data-get="word"></p>'
  parent.appendChild(child)

  // Save original values as attributes.run would
  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(child)

  // Simulate what data module does: call _traverse with single-mode parent
  var responseData = { data: mockData, status: 200 }
  var options = {
    iterate: undefined, // parent has no data-iterate
    element: parent
  }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // The child should have 3 <p> elements with the words populated
  var words = child.querySelectorAll('p')
  assertEqual(words.length, 3)
  assertEqual(words[0].textContent, 'Hello')
  assertEqual(words[1].textContent, 'Hej')
  assertEqual(words[2].textContent, 'Shlomo')
})

test('data-iterate - nested iterate="true" should not break when parent iterates too', function () {
  // Mock response: array of 2 items, each with a sub-array
  var mockData = [
    { name: 'Group A', items: [{ word: 'one' }, { word: 'two' }] },
    { name: 'Group B', items: [{ word: 'three' }] }
  ]

  // Create parent with data-iterate="true"
  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h6 data-get="name"></h6><ul data-iterate="items"><li data-get="word"></li></ul>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = {
    iterate: 'true',
    element: parent
  }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // Parent should have 2 h6 elements
  var headings = parent.querySelectorAll('h6')
  assertEqual(headings.length, 2)
  assertEqual(headings[0].textContent, 'Group A')
  assertEqual(headings[1].textContent, 'Group B')
})


test('data-iterate - should iterate over a named key in the response', function () {
  // Response is an object with a named array key
  var mockData = {
    extensions: [
      { name: 'navigate' },
      { name: 'data' },
      { name: 'screen' }
    ]
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'extensions')
  parent.innerHTML = '<span data-get="name"></span>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'extensions', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var spans = parent.querySelectorAll('span')
  assertEqual(spans.length, 3)
  assertEqual(spans[0].textContent, 'navigate')
  assertEqual(spans[1].textContent, 'data')
  assertEqual(spans[2].textContent, 'screen')
})

test('data-iterate - should iterate over a nested key path (multi-level)', function () {
  // Response has a deeply nested array
  var mockData = {
    result: {
      items: [
        { title: 'First' },
        { title: 'Second' }
      ]
    }
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'result.items')
  parent.innerHTML = '<p data-get="title"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'result.items', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 2)
  assertEqual(paragraphs[0].textContent, 'First')
  assertEqual(paragraphs[1].textContent, 'Second')
})


test('data-iterate - nested iterate inside iterate should render sub-items', function () {
  if (!app.module.data) return

  // Parent array with nested arrays
  var mockData = [
    { category: 'Fruits', items: [{ name: 'Apple' }, { name: 'Banana' }] },
    { category: 'Vegetables', items: [{ name: 'Carrot' }, { name: 'Pea' }, { name: 'Onion' }] }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h4 data-get="category"></h4><ul data-iterate="items"><li data-get="name"></li></ul>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // Should have 2 categories
  var headings = parent.querySelectorAll('h4')
  assertEqual(headings.length, 2)
  assertEqual(headings[0].textContent, 'Fruits')
  assertEqual(headings[1].textContent, 'Vegetables')

  // Should have 2 <ul> lists
  var lists = parent.querySelectorAll('ul')
  assertEqual(lists.length, 2)

  // First list: 2 items
  var firstItems = lists[0].querySelectorAll('li')
  assertEqual(firstItems.length, 2)
  assertEqual(firstItems[0].textContent, 'Apple')
  assertEqual(firstItems[1].textContent, 'Banana')

  // Second list: 3 items
  var secondItems = lists[1].querySelectorAll('li')
  assertEqual(secondItems.length, 3)
  assertEqual(secondItems[0].textContent, 'Carrot')
  assertEqual(secondItems[1].textContent, 'Pea')
  assertEqual(secondItems[2].textContent, 'Onion')
})

test('data-iterate - three levels deep nested iterate', function () {
  if (!app.module.data) return

  var mockData = [
    {
      department: 'Engineering',
      teams: [
        { team: 'Frontend', members: [{ name: 'Alice' }, { name: 'Bob' }] },
        { team: 'Backend', members: [{ name: 'Carol' }] }
      ]
    }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h3 data-get="department"></h3>' +
    '<div data-iterate="teams">' +
    '<h5 data-get="team"></h5>' +
    '<ul data-iterate="members"><li data-get="name"></li></ul>' +
    '</div>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // 1 department
  var departments = parent.querySelectorAll('h3')
  assertEqual(departments.length, 1)
  assertEqual(departments[0].textContent, 'Engineering')

  // 2 teams
  var teams = parent.querySelectorAll('h5')
  assertEqual(teams.length, 2)
  assertEqual(teams[0].textContent, 'Frontend')
  assertEqual(teams[1].textContent, 'Backend')

  // 3 total members across both teams
  var members = parent.querySelectorAll('li')
  assertEqual(members.length, 3)
  assertEqual(members[0].textContent, 'Alice')
  assertEqual(members[1].textContent, 'Bob')
  assertEqual(members[2].textContent, 'Carol')
})


test('data-iterate - empty array should produce no iterations', function () {
  if (!app.module.data) return

  var mockData = []

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<p data-get="word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 0)
})

test('data-iterate - single item array should produce one iteration', function () {
  if (!app.module.data) return

  var mockData = [{ word: 'Solo' }]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<p data-get="word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 1)
  assertEqual(paragraphs[0].textContent, 'Solo')
})

test('data-iterate - data-set should resolve variable into attribute', function () {
  if (!app.module.data) return

  var mockData = [
    { id: '42', label: 'Click me' },
    { id: '99', label: 'Submit' }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<a data-set="myid:id" data-get="label" href="page.html?id={myid}"></a>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var links = parent.querySelectorAll('a')
  assertEqual(links.length, 2)
  assertEqual(links[0].textContent, 'Click me')
  assertEqual(links[0].getAttribute('href'), 'page.html?id=42')
  assertEqual(links[1].textContent, 'Submit')
  assertEqual(links[1].getAttribute('href'), 'page.html?id=99')
})

test('data-iterate - iterate over object keys', function () {
  if (!app.module.data) return

  // Response is a plain object (not array) — iterates over keys
  var mockData = {
    eng: { word: 'Hello' },
    swe: { word: 'Hej' }
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<p data-get="[*].word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 2)
  assertEqual(paragraphs[0].textContent, 'Hello')
  assertEqual(paragraphs[1].textContent, 'Hej')
})

test('data-iterate - multiple elements per iteration block', function () {
  if (!app.module.data) return

  var mockData = [
    { title: 'Post 1', author: 'Alice' },
    { title: 'Post 2', author: 'Bob' }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h3 data-get="title"></h3><small data-get="author"></small>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var titles = parent.querySelectorAll('h3')
  var authors = parent.querySelectorAll('small')
  assertEqual(titles.length, 2)
  assertEqual(authors.length, 2)
  assertEqual(titles[0].textContent, 'Post 1')
  assertEqual(authors[0].textContent, 'Alice')
  assertEqual(titles[1].textContent, 'Post 2')
  assertEqual(authors[1].textContent, 'Bob')
})

test('data-iterate - data-get with dot-path accesses nested property', function () {
  if (!app.module.data) return

  var mockData = [
    { meta: { score: '95' } },
    { meta: { score: '82' } }
  ]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<span data-get="meta.score"></span>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  var spans = parent.querySelectorAll('span')
  assertEqual(spans.length, 2)
  assertEqual(spans[0].textContent, '95')
  assertEqual(spans[1].textContent, '82')
})

test('data-iterate - data-iterate-skip elements should be preserved', function () {
  if (!app.module.data) return

  var mockData = [{ word: 'One' }, { word: 'Two' }]

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h2 data-iterate-skip>Header</h2><p data-get="word"></p>'

  app.element.saveOriginalValues(parent)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: 'true', element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // The h2 with data-iterate-skip should appear once at the top
  var headers = parent.querySelectorAll('h2')
  assertEqual(headers.length, 1)
  assertEqual(headers[0].textContent, 'Header')

  // The iterated content should have 2 paragraphs
  var paragraphs = parent.querySelectorAll('p')
  assertEqual(paragraphs.length, 2)
  assertEqual(paragraphs[0].textContent, 'One')
  assertEqual(paragraphs[1].textContent, 'Two')
})

test('data-iterate - data-set to external element by id', function () {
  if (!app.module.data) return

  var mockData = [
    { lang_code: 'eng', word: 'Jesus' },
    { lang_code: 'swe', word: 'Jesus' }
  ]

  // External target element
  var target = createElement('h1')
  target.id = 'ext_target'

  var parent = createElement('section')
  parent.setAttribute('data-src', 'mock://test')
  parent.setAttribute('data-set', '(lang_code%eng).word:#' + target.id)

  // Nested iterate
  var child = document.createElement('div')
  child.setAttribute('data-iterate', 'true')
  child.innerHTML = '<p data-get="word"></p>'
  parent.appendChild(child)

  app.element.saveOriginalValues(parent)
  app.element.saveOriginalValues(child)

  var responseData = { data: mockData, status: 200 }
  var options = { iterate: undefined, element: parent }

  app.module.data._traverse(options, responseData, parent, '*:not([data-iterate-skip])')

  // External element should have the resolved value
  assertEqual(target.textContent, 'Jesus')

  // Iterated items should be populated
  var words = child.querySelectorAll('p')
  assertEqual(words.length, 2)
  assertEqual(words[0].textContent, 'Jesus')
  assertEqual(words[1].textContent, 'Jesus')
})
