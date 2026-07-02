test('move - should move element to target', function () {
  var source = createElement('div')
  var target = createElement('div')
  source.setAttribute('move', '#' + target.id)
  dom.rerun(source)
  assertEqual(source.parentNode.id, target.id)
})
