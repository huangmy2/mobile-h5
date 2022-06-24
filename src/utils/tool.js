// 常用函数

// 环境接口对应关系 根据不同项目自行配置
function _getHostName() {
  var domian = {
    // 'localhost': '//test1-api.dongqiudi.com',
    'test1-n.dongqiudi.com': '//test1-api.dongqiudi.com',
    'st-test-n.dongqiudi.com': '//st-test-api.dongqiudi.com',
    'beta-n.dongqiudi.com': '//beta-api.dongqiudi.com',
    'n.dongqiudi.com': '//api.dongqiudi.com',
    'test1-api.dongqiudi.com': '//test1-api.dongqiudi.com',
    'st-test-api.dongqiudi.com': '//st-test-api.dongqiudi.com',
    'beta-api.dongqiudi.com': '//beta-api.dongqiudi.com',
    'api.dongqiudi.com': '//api.dongqiudi.com',
    '10.18.7.108': '/hgn'
  };
  return (domian[location.hostname] || '');
}

// 获取url参数
function _getQuery(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}

// 获取cookie
function _getCookie(name) {
  let arr = '';
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  arr = document.cookie.match(reg);
  if (arr) { return unescape(arr[2]); } else { return ''; }
}

function _openApp (schema) {
  schema = schema || 'dongqiudi:///url/' + location.href;
  if (schema && !/^(dongqiudi)/.test(schema)) {
    schema = 'dongqiudi:///url/' + schema;
  }
  const USER_AGENT = navigator.userAgent.toLowerCase();
  let browser = {};
  browser.Android = USER_AGENT.match(/android/);
  if (browser.Android) {
    if (USER_AGENT.match(/micromessenger|weibo/)) {
      location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.dongqiudi.news&android_schema=' + encodeURIComponent(schema);
    } else {
      let iframe = document.createElement('iframe'),
        num = 0,
        timer;
      iframe.src = schema;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      timer = setInterval(function () {
        num++;
      }, 20);
      setTimeout(function () {
        clearInterval(timer);
        document.body.removeChild(iframe);
        if (num > 50) {
          location.href = 'https://dqdfiles.b0.upaiyun.com/app/apk/channel/dongqiudi-m_yindao.apk';
        }
      }, 2000);
    }
  } else {
    location.href = 'https://front.dongqiudi.com/app.html?type=' + schema;
  }
}

function _getQueryVariable (variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

export {
  _getHostName,
  _getQuery,
  _getCookie,
  _openApp,
  _getQueryVariable
};
