test('chronotize-age - calculates age through chronotize-age', function () {
  var now = new Date()
  var age = createElement('span')
  age.textContent = (now.getFullYear() - 20) + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
  age.setAttribute('chronotize-age', '')

  app.call('rerun', { element: age })

  assertTrue(/^\d+$/.test(age.textContent))
})
