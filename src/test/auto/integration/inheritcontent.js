// inheritcontent is resolved inside the template render pass, which needs a cached
// srcdoc template, a parsed template fragment and the live document section all in
// place. That pipeline is exercised by the manual template fixtures instead.
test.skip('inheritcontent - keeps the source document content over the template', function () {
  var section = createElement('header')
  section.setAttribute('inheritcontent', '')
  assertEqual(section.hasAttribute('inheritcontent'), true)
})
