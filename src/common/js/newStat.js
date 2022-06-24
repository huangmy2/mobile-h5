// 打点
/***
 * stat.track('', {
    refer : 'h5',
    action: 'view'
  });
**/

const Cookies = require('js-cookie')
const getQueryString = function (name) { // 获取url参数
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2]); return null
}

let trackSource = Cookies.get('trackSource', { domain: 'dongqiudi.com' }) // => 'value'

let source = getQueryString('dqd_source')

if (source) {
  Cookies.set('trackSource', source, { domain: 'dongqiudi.com' })
  trackSource = source
}

/**
 * Polyfill for Object.assign
 *
 * @see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/assign
 */
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target) {
      'use strict'
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object')
      }

      var to = Object(target)
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i]
        if (nextSource === undefined || nextSource === null) {
          continue
        }
        nextSource = Object(nextSource)

        var keysArray = Object.keys(Object(nextSource))
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex]
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
      return to
    }
  })
}

/**
 * Polyfill for Object.keys
 *
 * @see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */
if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty

    var hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString')

    var dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor'
    ]

    var dontEnumsLength = dontEnums.length

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')

      var result = []

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop)
      }

      if (hasDontEnumBug) {
        for (var i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])
        }
      }
      return result
    }
  })()
};

export default {
  source: trackSource || 'unknown',
  track: function (page, params) {
    let data = {}
    let querys = []
    if (trackSource) {
      Object.assign(data, {
        dqd_source: trackSource
      })
    }
    Object.assign(data, params)

    Object.keys(data).forEach(key => {
      querys.push(`${key}=${data[key]}`)
    })

    new Image().src = `//stat.dongqiudi.com/${page}?${querys.join('&')}`
  }
}
