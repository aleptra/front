test('screen-layout - applies named layouts through screen-layout', function () {
  var layout = createElement('section')
  layout.innerHTML = '<header></header><main></main><footer><div></div></footer>'
  layout.setAttribute('screen-layout', 'standard')

  app.call('screen-layout:[standard]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateAreas, '"head" "main" "foot"')
  assertEqual(layout.querySelector('header').style.gridArea, 'head')
  assertEqual(layout.querySelector('main').style.flexDirection, 'column')
  assertEqual(layout.querySelector('footer').style.gridArea, 'foot')
})
