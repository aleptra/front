test('form-invalid - renders an invalid field message through form-invalid', function () {
  var form = app.module.form
  var target = createElement('p')
  var input = createElement('input')
  input.setAttribute('form-invalid', '#' + target.id + ':[Required field]')
  form.__autoload({ name: 'form', element: document.body })
  input.dispatchEvent(new Event('invalid', { bubbles: false, cancelable: true }))
  assertEqual(target.textContent, 'Required field')
  input.dispatchEvent(new Event('input', { bubbles: true }))
  assertEqual(target.textContent, '')
})
