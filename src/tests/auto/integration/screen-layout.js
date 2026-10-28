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

test('screen-layout - applies navside layout with nav on left', function () {
  var layout = createElement('section')
  layout.innerHTML = '<nav></nav><header></header><main></main><footer></footer>'
  layout.setAttribute('screen-layout', 'navside')

  app.call('screen-layout:[navside]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateAreas, '"nav head" "nav main" "nav foot"')
  assertEqual(layout.style.gridTemplateColumns, 'auto 1fr')
  assertEqual(layout.querySelector('nav').style.gridArea, 'nav')
  assertEqual(layout.querySelector('main').style.gridArea, 'main')
})

test('screen-layout - reverses navside layout with screen-layoutdir row-reverse', function () {
  var layout = createElement('section')
  layout.innerHTML = '<nav></nav><header></header><main></main><footer></footer>'
  layout.setAttribute('screen-layout', 'navside')
  layout.setAttribute('screen-layoutdir', 'row-reverse')

  app.call('screen-layout:[navside]', { element: layout })

  assertEqual(layout.style.gridTemplateAreas, '"head nav" "main nav" "foot nav"')
  assertEqual(layout.style.gridTemplateColumns, '1fr auto')
  assertEqual(layout.querySelector('nav').style.gridArea, 'nav')
})

test('screen-layout - reverses advanced layout with screen-layoutdir row-reverse', function () {
  var layout = createElement('section')
  layout.innerHTML = '<header></header><nav></nav><main></main><footer></footer>'
  layout.setAttribute('screen-layout', 'advanced')
  layout.setAttribute('screen-layoutdir', 'row-reverse')

  app.call('screen-layout:[advanced]', { element: layout })

  assertEqual(layout.style.gridTemplateAreas, '"head head" "main nav" "foot foot"')
  assertEqual(layout.style.gridTemplateColumns, '1fr auto')
})

test('screen-layout - applies ultimate layout with header nav left main right footer', function () {
  var layout = createElement('section')
  layout.innerHTML = '<header></header><nav></nav><aside></aside><main></main><aside></aside><footer></footer>'
  layout.setAttribute('screen-layout', 'ultimate')

  app.call('screen-layout:[ultimate]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateAreas, '"head head head" "nav nav nav" "left middle right" "foot foot foot"')
  assertEqual(layout.style.gridTemplateColumns, 'auto 1fr auto')
})

test('screen-layout - reverses ultimate layout with screen-layoutdir row-reverse', function () {
  var layout = createElement('section')
  layout.innerHTML = '<header></header><nav></nav><aside></aside><main></main><aside></aside><footer></footer>'
  layout.setAttribute('screen-layout', 'ultimate')
  layout.setAttribute('screen-layoutdir', 'row-reverse')

  app.call('screen-layout:[ultimate]', { element: layout })

  assertEqual(layout.style.gridTemplateAreas, '"head head head" "nav nav nav" "right middle left" "foot foot foot"')
})

test('screen-layout - applies simple layout without footer', function () {
  var layout = createElement('section')
  layout.innerHTML = '<header></header><main></main>'
  layout.setAttribute('screen-layout', 'simple')

  app.call('screen-layout:[simple]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateRows, 'auto 1fr')
})

test('screen-layout - applies centered layout for centered content', function () {
  var layout = createElement('section')
  layout.setAttribute('screen-layout', 'centered')

  app.call('screen-layout:[centered]', { element: layout })

  assertEqual(layout.style.display, 'flex')
  assertEqual(layout.style.flexDirection, 'column')
  assertEqual(layout.style.alignItems, 'center')
  assertEqual(layout.style.justifyContent, 'center')
})

test('screen-layout - applies stacked layout for vertical stacking', function () {
  var layout = createElement('section')
  layout.setAttribute('screen-layout', 'stacked')

  app.call('screen-layout:[stacked]', { element: layout })

  assertEqual(layout.style.display, 'flex')
  assertEqual(layout.style.flexDirection, 'column')
  assertEqual(layout.style.width, '100%')
  assertEqual(layout.style.height, '100%')
})

test('screen-layout - applies fullscreen layout', function () {
  var layout = createElement('section')
  layout.setAttribute('screen-layout', 'fullscreen')

  app.call('screen-layout:[fullscreen]', { element: layout })

  assertEqual(layout.style.display, 'flex')
  assertEqual(layout.style.width, '100%')
  assertEqual(layout.style.height, '100vh')
})

test('screen-layout - applies masonry layout for grid cards', function () {
  var layout = createElement('section')
  layout.setAttribute('screen-layout', 'masonry')

  app.call('screen-layout:[masonry]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateColumns, 'repeat(auto-fit, minmax(250px, 1fr))')
})

test('screen-layout - applies 2column layout', function () {
  var layout = createElement('section')
  layout.setAttribute('screen-layout', '2column')

  app.call('screen-layout:[2column]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateColumns, '1fr 1fr')
})

test('screen-layout - applies 2row layout', function () {
  var layout = createElement('section')
  layout.setAttribute('screen-layout', '2row')

  app.call('screen-layout:[2row]', { element: layout })

  assertEqual(layout.style.display, 'grid')
  assertEqual(layout.style.gridTemplateRows, '1fr 1fr')
})
