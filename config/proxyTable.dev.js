const mockMap = require('../config/mockmap');
// mock地址对应关系
// 对应的mock接口 http://yapi.dongqiudi.net/project/{id} 可查到
mockDetail = process.env.mock;

if (mockDetail) { // 本地开发环境存在mock参数
  var apimap = require('../src/utils/apimap');
}
// 域名与地址对应关系 其中包含转发前缀 ‘_/’ 对应挂你

function getHost(host) {
  if (!mockDetail) {
    return '';
  }
  if (mockDetail != 'local') {
    return 'https:' + apimap.map[mockDetail][host];
  } else {
    return mockMap[host];
  }
}

module.exports = {
  '/api': {
    target: getHost('api'),
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/'
    }
  },
  '/v2': {
    target: getHost('api'),
    changeOrigin: true
  },
  '/share': {
    target: getHost('api'),
    changeOrigin: true
  },
  '/archive': {
    target: getHost('api'),
    changeOrigin: true
  },
  '/sport-data': {
    target: getHost('sport-data'),
    changeOrigin: true,
    pathRewrite: {
      '^/sport-data': '/'
    }
  },
  '/mall': {
    target: getHost('mall'),
    changeOrigin: true,
    pathRewrite: {
      '^/mall': '/'
    }
  },
  '/go-biz': {
    target: getHost('go-biz'),
    changeOrigin: true,
    pathRewrite: {
      '^/go-biz': '/'
    }
  },
  '/lott': {
    target: getHost('lott'),
    changeOrigin: true,
    pathRewrite: {
      '^/lott': '/'
    }
  },
  '/go': {
    target: getHost('go'),
    changeOrigin: true,
    pathRewrite: {
      '^/go': '/'
    }
  },
  '/lott-game': {
    target: getHost('lott-game'),
    changeOrigin: true,
    pathRewrite: {
      '^/lott-game': '/'
    }
  },
  '/zc': {
    target: getHost('zc'),
    changeOrigin: true,
    pathRewrite: {
      '^/zc': '/'
    }
  },
  '/ap': {
    target: getHost('ap'),
    changeOrigin: true,
    pathRewrite: {
      '^/ap': '/'
    }
  },
  '/springcard': {
    target: getHost('springcard'),
    changeOrigin: true,
    pathRewrite: {
      '^/springcard': '/'
    }
  },
  '/zf': {
    target: getHost('zf'),
    changeOrigin: true,
    pathRewrite: {
      '^/zf': '/'
    }
  },
  '/hao': {
    target: getHost('hao'),
    changeOrigin: true,
    pathRewrite: {
      '^/hao': '/'
    }
  },
  '/upload': {
    target: getHost('upload'),
    changeOrigin: true,
    pathRewrite: {
      '^/upload': '/'
    }
  },
  '/game': {
    target: getHost('game'),
    changeOrigin: true,
    pathRewrite: {
      '^/game': '/'
    }
  },
  '/live-api': {
    target: getHost('live-api'),
    changeOrigin: true,
    pathRewrite: {
      '^/live-api': '/'
    }
  },
  '/qxk-goods': {
    target: getHost('qxk-goods'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-goods': '/'
    }
  },
  '/qxk-orders': {
    target: getHost('qxk-orders'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-orders': '/'
    }
  },
  '/qxk-medias': {
    target: getHost('qxk-medias'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-medias': '/'
    }
  },
  '/qxk-passport': {
    target: getHost('qxk-passport'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-passport': '/'
    }
  },
  '/qxk-search': {
    target: getHost('qxk-search'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-search': '/'
    }
  },
  '/qxk-notice': {
    target: getHost('qxk-notice'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-notice': '/'
    }
  },
  '/game-center': {
    target: getHost('game-center'),
    changeOrigin: true,
    pathRewrite: {
      '^/game-center': '/'
    }
  },
  '/qxk-database': {
    target: getHost('qxk-database'),
    changeOrigin: true,
    pathRewrite: {
      '^/qxk-database': '/'
    }
  }
};
