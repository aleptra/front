test('app.exec - dispatches two, three, and four path commands', function () {
  var target = createElement('div')
  var twoCalled = false
  var threeCalled = false
  var fourCalled = false
  var originalHide = dom.hide
  var originalNamespace = window.frontExecCoverage

  dom.hide = function (args) {
    twoCalled = args.exec.element === target
  }
  window.frontExecCoverage = {
    group: {
      three: function (args) {
        threeCalled = args.marker === 'three'
      },
      deep: {
        four: function (args) {
          fourCalled = args.marker === 'four'
        }
      }
    }
  }

  try {
    app.exec('dom.hide', { exec: { element: target } })
    app.exec('frontExecCoverage.group.three', { marker: 'three' })
    app.exec('frontExecCoverage.group.deep.four', { marker: 'four' })
  } finally {
    dom.hide = originalHide
    if (originalNamespace) window.frontExecCoverage = originalNamespace
    else delete window.frontExecCoverage
  }

  assertTrue(twoCalled).desc('two-part command dispatched')
  assertTrue(threeCalled).desc('three-part command dispatched')
  assertTrue(fourCalled).desc('four-part command dispatched')
})
