/* eslint-disable */
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?path=http://localhost:8080/__webpack_hmr&noInfo=false&reload=true&quiet=false')


hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
