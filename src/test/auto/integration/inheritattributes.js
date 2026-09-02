// inheritattributes is applied while templates are merged into the live document.
// Reproducing that requires the cached srcdoc template plus the parsed template
// fragment, so it stays covered by the manual template fixtures.
test.skip('inheritattributes - merges srcdoc attributes with template overrides', function () {
  var section = createElement('header')
  section.setAttribute('inheritattributes', 'false')
  assertEqual(section.getAttribute('inheritattributes'), 'false')
})
