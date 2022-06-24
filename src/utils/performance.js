const connectWebViewJavascriptBridge = function (callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener('WebViewJavascriptBridgeReady', function () {
      callback(WebViewJavascriptBridge)
    }, false)
  }
}

const reportData = {
  type: 'page',
  url: location.href.split('?')[0]
}

const track = function (key, value) {
  reportData[key] = value
}

const navigationInfo = {}

connectWebViewJavascriptBridge(function (bridge) {
  bridge.callHandler('getNavigationInfo', {}, function (data) {
    Object.assign(navigationInfo, data)
  })
})

const jsReport = function () {
  connectWebViewJavascriptBridge(function (bridge) {
    bridge.callHandler('jsH5Report', reportData, function () {})
  })
}

const perf = function () {
  if (!window.performance || !window.performance.timing) {
    return
  }

  if (navigationInfo.navigation_start_time && performance.timing && performance.timing.navigationStart) {
    track('init', performance.timing.navigationStart - navigationInfo.navigation_start_time)
    track('load', performance.timing.loadEventEnd - navigationInfo.navigation_start_time)
  }

  if (navigationInfo.network_type) {
    track('network_type', navigationInfo.network_type)
  }

  // 平均值
  let getAverageValue = (arr) => {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += Number(arr[i])
    }
    return Math.floor(sum / arr.length)
  }
  // 获取域名
  let getHost = (url) => {
    if (url.indexOf('//') < 0) {
      return url
    }
    let hosPath = url.split('//')[1]

    return hosPath.split('/')[0]
  }
  // 获得最大值
  let getMax = (arr) => {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
      let element = arr[i]
      if (element > max) {
        max = element
      }
    }
    return parseInt(max, 10)
  }
  // 获得最小值
  let getMin = (arr) => {
    let min = arr[0]
    for (let i = 1; i < arr.length; i++) {
      let element = arr[i]
      if (element < min) {
        min = element
      }
    }
    return parseInt(min, 10)
  }

  let handleNavigation = (element) => {
    let paint = performance.getEntriesByType && performance.getEntriesByType('paint')
    let paintStartTime = 0
    if (paint && paint.length) {
      paintStartTime = paint[0].startTime || 0
    }

    let times = {
      DNS: element.domainLookupEnd - element.domainLookupStart,
      CONNECT: element.connectEnd - element.connectStart,
      REQUEST: element.responseEnd - element.requestStart,
      PAINT: paintStartTime - element.responseEnd
    }

    for (var i in times) {
      if (parseInt(times[i], 10) > 0) {
        track(i, parseInt(times[i], 10))
      }
    }
  }

  let imgObj = {}

  let ajaxObj = {}

  let jsRequeststartArr = []
  let jsResponseEndArr = []
  let jsHostname
  let cssRequeststartArr = []
  let cssResponseEndArr = []
  let cssHostname

  if (window.performance.getEntries) {
    let getEntries = window.performance.getEntries()

    for (let i = 0; i < getEntries.length; i++) {
      let element = getEntries[i]
      let hostname = getHost(element.name)

      if (hostname.indexOf('allfootballapp') < 0 && hostname.indexOf('dongqiudi') < 0) {
        continue
      }

      if (element.initiatorType === 'script') {
        jsRequeststartArr.push(element.requestStart || element.startTime)
        jsResponseEndArr.push(element.responseEnd)
        jsHostname = element.name
      } else if (element.initiatorType === 'link') {
        cssRequeststartArr.push(element.requestStart || element.startTime)
        cssResponseEndArr.push(element.responseEnd)
        cssHostname = element.name
      } else if (element.initiatorType === 'xmlhttprequest') {
        if (!ajaxObj[getHost(element.name)]) {
          ajaxObj[getHost(element.name)] = element.duration.toString()
        } else {
          ajaxObj[getHost(element.name)] = ajaxObj[getHost(element.name)] + ',' + element.duration
        }
      } else if (element.initiatorType === 'img') {
        if (!imgObj[getHost(element.name)]) {
          imgObj[getHost(element.name)] = element.duration.toString()
        } else {
          imgObj[getHost(element.name)] = imgObj[getHost(element.name)] + ',' + element.duration
        }
      }
      if (element.entryType === 'navigation') {
        handleNavigation(element)
      }
    }
  } else {
    handleNavigation(performance.timing)
  }
  // 发图片
  for (let key in imgObj) {
    let imgArr = imgObj[key].split(',')
    imgObj[key] = imgArr
    track('IMG', getAverageValue(imgArr), key)
  }
  // ajax
  for (let key in ajaxObj) {
    let ajaxArr = ajaxObj[key].split(',')
    ajaxObj[key] = ajaxArr
    track('AJAX', getAverageValue(ajaxArr), key)
  }
  // 发js
  track('JS', getMax(jsResponseEndArr) - getMin(jsRequeststartArr), jsHostname)
  // 发css
  track('CSS', getMax(cssResponseEndArr) - getMin(cssRequeststartArr), cssHostname)

  jsReport()
}

if (typeof window !== 'undefined' && window.addEventListener && Math.random() < 0.1) { // 性能抽样
  if (document.readyState === 'complete') {
    setTimeout(perf, 3000)
  } else {
    window.addEventListener('load', () => {
      setTimeout(perf, 3000) // onload后3s统计
    })
  }
}
