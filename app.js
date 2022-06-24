const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser')();
const path = require('path');
const serve = require('koa-static2');

const webapp = require('./routes/webapp');
const api = require('./routes/api');
const signpptv = require('./routes/signpptv');
const preAnalysis = require('./routes/pre_analysis');
const commonMiddle = require('./lib/middlewares/commonMiddle');
// const errorHandler = require('./middlewares/errorHandler');
const logger = require('./lib/logger.js');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger.access));

// 三个静态目录
app.use(serve('public', './public'));
app.use(serve('static', './webapp/static'));
app.use(serve('.well-known', './.well-known'));
app.use(serve('/', './public/front'));
app.use(serve('/dll', './dll'));
app.use(serve('/views', './views'));
// 模版引擎
app.use(views(path.resolve(__dirname, './views'), {
  map: {
    html: 'handlebars'
  },
  extension: 'html'
}));

// router
router.use('/webapp', commonMiddle, webapp.routes(), webapp.allowedMethods());
router.use('/v1', commonMiddle, api.routes(), api.allowedMethods());
router.use('/signpptv', commonMiddle, signpptv.routes(), signpptv.allowedMethods());
router.use('/pre_analysis', commonMiddle, preAnalysis.routes(), preAnalysis.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.use(async function pageNotFound (ctx) {
  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  switch (ctx.accepts('html', 'json')) {
  case 'json':
    ctx.type = 'application/json';
    ctx.body = {error: err.message};
    break;
  case 'html':
  default:
    if (ctx.status == 404) {
      await ctx.render('/views/404.html');
    }
  }
});

// error
app.on('error', function (err, ctx) {
  // errorHandler(err, ctx)
  let log = logger.error;
  log.error('server error', err, ctx);
});

module.exports = app;
