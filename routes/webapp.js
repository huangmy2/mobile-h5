const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

router.get('/blank-page', async (ctx, next) => {
  ctx.state.title = ctx.query.title || '懂球帝APP';
  ctx.state.text = ctx.query.text || '欢迎打开懂球帝';
  await ctx.render('../webapp/blank-page');
});

router.get('/transfer', async (ctx, next) => {
  ctx.state.bannerImg = '/public/images/banner-transfer.jpg?v265';
  await ctx.render('../webapp/transfer');
});

router.get('/:page', async (ctx, next) => {
  await ctx.render('../webapp/' + ctx.params.page);
  // let page    = ctx.params.page || '/'
  // let suffix  = page.substr(-5)
  // let pathStr = suffix == '.html' ? '../webapp/'+ ctx.params.page : '../webapp/'+ ctx.params.page+'.html'
  // let filePath= path.join(__dirname, pathStr)
  // console.log(filePath)
  // let exists  = fs.existsSync('../webapp/'+ ctx.params.page)
  // //exists ? await ctx.render(pathStr) : await ctx.render('../webapp/404')

  // exists ? await ctx.render(pathStr, {title : "index"}) :  await ctx.render('../module/404/404');
});

module.exports = router;
