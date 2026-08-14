test('loader - should hide the loader and show the target', function () {
  var loader = createElement('div')
  var target = createElement('div')
  dom.hide(target)

  dom.loader(loader, '#' + target.id)

  assertStyleEqual(loader, 'display', 'none')
  assertStyleEqual(target, 'display', 'block')
})
