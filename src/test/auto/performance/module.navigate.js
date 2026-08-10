test('navigate - page load orchestration throughput', function () {
  var navigate = app.module.navigate
  var originalConfig = navigate.config
  var originalMainTarget = navigate.mainTarget
  var originalRequest = app.xhr.request
  var main = document.createElement('main')
  main.id = 'performance-navigate-main'
  var loader = document.createElement('div')
  loader.id = 'performance-navigate-loader'
  loader.innerHTML = '<span></span>'
  document.body.appendChild(main)
  document.body.appendChild(loader)

  var request
  navigate.config = {
    target: '#performance-navigate-main',
    preloader: '#performance-navigate-loader',
    startpage: false,
    startpageLocal: false,
    onleave: false,
    onenter: false,
    success: false,
    error: false,
    transition: 'none',
    duration: 0
  }
  navigate.mainTarget = main
  app.xhr.request = function (options) { request = options }

  var elapsed
  try {
    elapsed = measure(function () {
      for (var i = 0; i < 50; i++) {
        navigate._load({
          pathname: '/performance-page-' + i,
          target: '#performance-navigate-main',
          extension: false,
          skipTemplates: true
        })
      }
    })
  } finally {
    navigate.config = originalConfig
    navigate.mainTarget = originalMainTarget
    app.xhr.request = originalRequest
    main.parentNode.removeChild(main)
    loader.parentNode.removeChild(loader)
  }

  assertEqual(request.type, 'page')
  assertEqual(request.target, '#performance-navigate-main')
  assertEqual(request.single, true)
  assertEqual(request.skipTemplates, true)
  assertTrue(elapsed < 1000).desc('50 page loads orchestrated in ' + elapsed.toFixed(2) + 'ms')
})
