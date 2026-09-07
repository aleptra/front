test('core.templates - template section rendering throughput', function () {
  var body = document.body
  var savedChildren = []
  while (body.firstChild) savedChildren.push(body.removeChild(body.firstChild))

  var originalGet = app.caches.get
  var originalSrcTemplate = app.srcTemplate
  var originalSrcDocTemplate = app.srcDocTemplate
  var originalBaseHref = app.baseHref
  var header = document.createElement('header')
  var nav = document.createElement('nav')
  var main = document.createElement('main')
  var fixture = '<template>' +
    '<header data-template="header"><img src="images/icon.png"><h1>Header</h1></header>' +
    '<nav><span>Navigation</span></nav>' +
    '</template>'

  body.appendChild(header)
  body.appendChild(nav)
  body.appendChild(main)
  app.srcTemplate = { url: { srcDoc: false, src: ['performance-template'] }, page: false }
  app.srcDocTemplate = '<body></body>'
  app.baseHref = '/assets/'
  app.caches.get = function (mechanism, type, key, options) {
    if (type === 'template' && key === 'performance-template') return { data: fixture }
    return originalGet.call(app.caches, mechanism, type, key, options)
  }

  var elapsed
  try {
    elapsed = measure(function () {
      for (var i = 0; i < 25; i++) app.templates.render()
    })
  } finally {
    app.caches.get = originalGet
    app.srcTemplate = originalSrcTemplate
    app.srcDocTemplate = originalSrcDocTemplate
    app.baseHref = originalBaseHref
    while (body.firstChild) body.removeChild(body.firstChild)
    for (var j = 0; j < savedChildren.length; j++) body.appendChild(savedChildren[j])
  }

  assertEqual(header.getAttribute('data-template'), 'header')
  assertEqual(header.querySelector('h1').textContent, 'Header')
  assertEqual(header.querySelector('img').getAttribute('src'), '/assets/images/icon.png')
  assertEqual(nav.textContent, 'Navigation')
  assertTrue(elapsed < 1500).desc('25 template renders in ' + elapsed.toFixed(2) + 'ms')
})
