test('svgworldmap-filter - applies filter tags through svgworldmap--filter', function () {
  var plugin = app.plugin.svgworldmap
  var target = createElement('div')
  var marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  var label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  target._svgWorldMap = {
    markerItems: [{ tags: ['city'], hasMarker: true, elements: { marker: marker, text: label } }],
    filterDefinitions: [{ label: 'City', tags: ['city'] }],
    activeFilters: [], filterButtons: []
  }
  var button = createElement('button')
  button.setAttribute('clicktargetfield', '#' + target.id)
  button.setAttribute('click', 'svgworldmap--filter:[city]')
  app.call(button.getAttribute('click'), { srcElement: button, element: target })
  assertEqual(target._svgWorldMap.filterTags[0], 'city')
  assertEqual(marker.style.display, '')
})
