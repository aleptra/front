test('iterate - numeric range creates one item per number', function () {
  var target = createElement('nav')
  target.setAttribute('iterate', '1;3;i')
  target.innerHTML = '<a href="?page={i}" settext="{i}"></a>'

  app.attributes.run([target])

  var links = target.querySelectorAll('a')
  assertEqual(links.length, 3)
  assertEqual(links[0].textContent, '1')
  assertEqual(links[1].getAttribute('href'), '?page=2')
  assertEqual(links[2].textContent, '3')
})

test('iterate - deep selector copies index text href and data attributes', function () {
  var source = createElement('div')
  source.id = 'iterate-menu-source'
  source.innerHTML = '<nav><ul>' +
    '<li><a href="research/ethnology" data-section="ethnology">Ethnology</a></li>' +
    '<li><ul><li><a href="research/history" data-section="history">History</a></li></ul></li>' +
    '<li><a href="research/geography" data-section="geography">Geography</a></li>' +
    '</ul></nav>'

  var target = createElement('div')
  target.setAttribute('iterate', '#iterate-menu-source a;index;name;href;data-section')
  target.innerHTML = '<article><span class="number">{index}</span>' +
    '<a href="{href}" data-section="{data-section}">{name}</a></article>'

  app.attributes.run([target])

  var articles = target.querySelectorAll('article'),
    links = target.querySelectorAll('a'),
    numbers = target.querySelectorAll('.number')

  assertEqual(articles.length, 3)
  assertEqual(numbers[0].textContent, '1')
  assertEqual(numbers[2].textContent, '3')
  assertEqual(links[1].textContent, 'History')
  assertEqual(links[1].getAttribute('href'), 'research/history')
  assertEqual(links[1].getAttribute('data-section'), 'history')
})

test('iterate - i is a one-based index alias', function () {
  var source = createElement('div')
  source.id = 'iterate-i-source'
  source.innerHTML = '<span>One</span><span>Two</span>'

  var target = createElement('div')
  target.setAttribute('iterate', '#iterate-i-source span;i;name')
  target.innerHTML = '<p>{i}:{name}</p>'

  app.attributes.run([target])

  var paragraphs = target.querySelectorAll('p')
  assertEqual(paragraphs[0].textContent, '1:One')
  assertEqual(paragraphs[1].textContent, '2:Two')
})
