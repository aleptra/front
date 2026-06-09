test('app.parse.text - simple div', function () {
  var result = app.parse.text('<div>Hello</div>')
  assertEqual(result.tagName.toLowerCase(), 'spot').desc('returns spot element')
  assertEqual(result.innerHTML, '<div>Hello</div>').desc('innerHTML preserved')
})

test('app.parse.text - html attributes', function () {
  var html = '<html lang="en" dir="ltr">'
  var result = app.parse.text(html)

  assertEqual(result.getAttribute('lang'), 'en').desc('lang attribute')
  assertEqual(result.getAttribute('dir'), 'ltr').desc('dir attribute')
})

test('app.parse.text - body attributes', function () {
  var body = '<body class="main" id="body1">'
  var result = app.parse.text(body)

  assertIsObject(result.bodyAttr).desc('attrList is object')
  assertEqual(result.bodyAttr.class, 'main').desc('class attribute')
  assertEqual(result.bodyAttr.id, 'body1').desc('id attribute')
})

test('app.parse.text - doctype', function () {
  var string = '<!DOCTYPE html><html></html>'
  var result = app.parse.text(string)

  assertEqual(result.doctype, '<!DOCTYPE html>').desc('doctype preserved')
})

test('app.parse.text - exclude single tag', function () {
  var string = '<div>Hello</div><script>alert(1)</script>'
  var result = app.parse.text(string, ['script'])

  assertEqual(result.innerHTML.indexOf('<script>'), -1).desc('script tag removed')
  assertEqual(result.innerHTML.indexOf('<div>'), 0).desc('div tag preserved')
})

test('app.parse.text - exclude paired tag', function () {
  var string = '<div>Hello</div><style>body{}</style>'
  var result = app.parse.text(string, ['style'])

  assertEqual(result.innerHTML.indexOf('<style>'), -1).desc('style tag removed')
  assertEqual(result.innerHTML.indexOf('<div>'), 0).desc('div tag preserved')
})

test('app.parse.text - multiple exclude tags', function () {
  var string = '<div>Hello</div><script>1</script><style>2</style>'
  var result = app.parse.text(string, ['script', 'style'])

  assertEqual(result.innerHTML.indexOf('<script>'), -1).desc('script removed')
  assertEqual(result.innerHTML.indexOf('<style>'), -1).desc('style removed')
  assertEqual(result.innerHTML.indexOf('<div>'), 0).desc('div preserved')
})

test('app.parse.text - nested elements', function () {
  var string = '<ul><li>One</li><li>Two</li></ul>'
  var result = app.parse.text(string)

  assertEqual(result.innerHTML, string).desc('nested structure preserved')
})