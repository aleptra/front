test('chronotize-get - formats a date once through chronotize-get', function () {
  var date = createElement('span')
  date.setAttribute('chronotize-get', 'Y')
  date.textContent = '2020-01-02'

  app.call('rerun', { element: date })
  assertEqual(date.textContent, '2020')
  assertEqual(date.textContent, '2020')
})
