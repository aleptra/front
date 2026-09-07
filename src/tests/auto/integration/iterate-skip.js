test('iterate-skip - the marked element is kept once and not repeated', function () {
  var target = createElement('nav')

  target.setAttribute('iterate', '1;3;i')
  target.innerHTML = '<b iterate-skip>Header</b><a href="?page={i}" settext="{i}"></a>'

  app.attributes.run([target])

  assertEqual(target.querySelectorAll('b').length, 1)
  assertEqual(target.querySelector('b').textContent, 'Header')

  var links = target.querySelectorAll('a')
  assertEqual(links.length, 3)
  assertEqual(links[0].textContent, '1')
  assertEqual(links[2].textContent, '3')
})
