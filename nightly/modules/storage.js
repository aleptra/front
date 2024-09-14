'use strict'

app.module.storage = {
  set: function (object) {
    console.log(object)
    var data = object.exec.value
    var cache = {
      mechanism: 'session',
      type: 'module',
      key: 'test',
      value: '{ "wrong": "'+data+'" }'
    }

    app.caches.set(cache.mechanism, cache.type, cache.key, cache.value, '', 'json')
  }
}