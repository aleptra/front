test('data - filter, sort, and resolve throughput', function () {
  var records = []
  for (var i = 0; i < 500; i++) {
    records.push({
      active: i % 2 === 0,
      score: i,
      profile: { name: 'User ' + i }
    })
  }

  var filtered
  var sorted
  var resolved
  var elapsed = measure(function () {
    for (var j = 0; j < 100; j++) {
      filtered = app.module.data._filter(records, 'active:true')
      sorted = app.module.data._sort(records.slice(), 'score', 'desc')
      resolved = app.module.data._resolve(records[249], 'profile.name')
      app.module.data._generateId('performance-data-' + j)
    }
  })

  assertEqual(filtered.data.length, 250)
  assertEqual(sorted[0].score, 499)
  assertEqual(resolved, 'User 249')
  assertTrue(elapsed < 1500).desc('100 data-processing passes in ' + elapsed.toFixed(2) + 'ms')
})

test('data - large flat iteration and attribute processing', function () {
  var items = []
  for (var i = 0; i < 500; i++) {
    items.push({ id: String(i), label: 'Item ' + i })
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<a data-set="itemId:id" data-get="label" href="item.html?id={itemId}"></a>'
  app.element.saveOriginalValues(parent)

  var elapsed = measure(function () {
    app.module.data._traverse(
      { iterate: 'true', element: parent },
      { data: items, status: 200 },
      parent,
      '*:not([data-iterate-skip])'
    )
  })

  var links = parent.querySelectorAll('a')
  assertEqual(links.length, 500)
  assertEqual(links[0].textContent, 'Item 0')
  assertEqual(links[499].textContent, 'Item 499')
  assertEqual(links[499].getAttribute('href'), 'item.html?id=499')
  assertTrue(elapsed < 1500).desc('500 data iterations in ' + elapsed.toFixed(2) + 'ms')
})

test('data - nested iteration workload', function () {
  var groups = []
  for (var i = 0; i < 50; i++) {
    var items = []
    for (var j = 0; j < 5; j++) {
      items.push({ name: 'Item ' + i + '-' + j })
    }
    groups.push({ category: 'Group ' + i, items: items })
  }

  var parent = createElement('div')
  parent.setAttribute('data-iterate', 'true')
  parent.innerHTML = '<h4 data-get="category"></h4>' +
    '<ul data-iterate="items"><li data-get="name"></li></ul>'
  app.element.saveOriginalValues(parent)

  var elapsed = measure(function () {
    app.module.data._traverse(
      { iterate: 'true', element: parent },
      { data: groups, status: 200 },
      parent,
      '*:not([data-iterate-skip])'
    )
  })

  var headings = parent.querySelectorAll('h4')
  var lists = parent.querySelectorAll('ul')
  var items = parent.querySelectorAll('li')
  assertEqual(headings.length, 50)
  assertEqual(lists.length, 50)
  assertEqual(items.length, 250)
  assertEqual(headings[49].textContent, 'Group 49')
  assertEqual(items[249].textContent, 'Item 49-4')
  assertTrue(elapsed < 1500).desc('50 groups and 250 nested items in ' + elapsed.toFixed(2) + 'ms')
})

test('data - request orchestration throughput', function () {
  var module = app.module.data
  var originalValidate = app.caches.validate
  var originalRequest = app.xhr.request
  var element = document.createElement('section')
  element.setAttribute('data-src', '/performance-data')
  element.setAttribute('data-iterate', 'true')
  var requests = []

  module.module = 'data'
  app.caches.validate = function () { return false }
  app.xhr.request = function (options) { requests.push(options) }

  var elapsed
  try {
    elapsed = measure(function () {
      for (var i = 0; i < 100; i++) {
        module._open(element.attributes, {
          element: element,
          iterate: 'true',
          attribute: 'data-src',
          storageKey: 'data-performance-' + i,
          ttl: 0
        })
      }
    })
  } finally {
    app.caches.validate = originalValidate
    app.xhr.request = originalRequest
  }

  assertEqual(requests.length, 100)
  assertEqual(requests[99].type, 'data')
  assertEqual(requests[99].url, '/performance-data')
  assertEqual(requests[99].srcEl, element)
  assertEqual(requests[99].cache.keyType, 'module')
  assertTrue(elapsed < 1000).desc('100 data requests orchestrated in ' + elapsed.toFixed(2) + 'ms')
})

test('data - cached response processing throughput', function () {
  var module = app.module.data
  var records = []
  for (var i = 0; i < 250; i++) records.push({ label: 'Cached ' + i })

  var element = createElement('div')
  element.setAttribute('data-iterate', 'true')
  element.innerHTML = '<span data-get="label"></span>'
  app.element.saveOriginalValues(element)

  var elapsed = measure(function () {
    module._run(
      { element: element, iterate: 'true', storageKey: 'data-cache-performance' },
      { data: records, status: 200 }
    )
  })

  var spans = element.querySelectorAll('span')
  assertEqual(spans.length, 250)
  assertEqual(spans[249].textContent, 'Cached 249')
  assertTrue(elapsed < 1500).desc('250 cached records processed in ' + elapsed.toFixed(2) + 'ms')
})
