const log4js = require('koa-log4');
const path = require('path');

let env = process.env.NODE_ENV;
let dir = '';

let request_config = require('../bin/config');
const envNew = request_config.ENV_NEW || false;

if (envNew) {
  // 为了环境迁移引进的变量，解决新老环境共用同一git问题
  dir = env === 'production' && !process.env.VIEW_ENV ? '/home/work/logs/node' : path.resolve(__dirname, '../logs');
} else {
  dir = env === 'production' && !process.env.VIEW_ENV ? '/home/work/logs/dongqiudi-crowdfunding-cardmal' : path.resolve(__dirname, '../logs');
}

console.log(dir);
let log4config = {
  pm2: true,
  appenders: {
    console: {
      'category': 'console',
      'type': 'console'
    },
    app: {
      'category': 'app',
      'type': 'file',
      'filename': dir + '/app.log',
      'maxLogSize': 104800,
      'backups': 100
    },
    access: {
      'category': 'access',
      'type': 'dateFile',
      'filename': dir + '/access',
      'alwaysIncludePattern': true,
      'pattern': '.yyyyMMdd.log',
      'backups': 100,
      'compress': true
    },
    error: {
      'category': 'error',
      'type': 'dateFile',
      'filename': dir + '/error',
      'alwaysIncludePattern': true,
      'pattern': '.yyyyMMdd.log',
      'backups': 100
    }
  },
  categories: {
    default: { appenders: [ 'console'], level: 'ALL' },
    app: { appenders: [ 'app'], level: 'ALL' },
    access: { appenders: [ 'access'], level: 'ALL' },
    error: { appenders: [ 'error'], level: 'ALL' }
  }
};

log4js.configure(log4config);

const logger = {
  access: log4js.koaLogger(log4js.getLogger('access'), { level: 'auto' }),
  error: log4js.getLogger('error'),
  app: log4js.getLogger('app')
};

module.exports = logger;
