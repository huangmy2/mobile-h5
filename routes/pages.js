const router = require('koa-router')();
const fs = require('fs');
const path = require('path');

router.get('/:page', async (ctx, next) => {
  let page = ctx.params.page || '/';
  console.log(page);
  let suffix = page.substr(-5);
  let pathStr = suffix == '.html' ? '../webapp/' + ctx.params.page : '../webapp/' + ctx.params.page + '.html';
  let filePath = path.join(__dirname, pathStr);
  let exists = fs.existsSync('../webapp/' + ctx.params.page);
  console.log(pathStr);
  exists ? await ctx.render(pathStr) : await ctx.render('../webapp/404');
});

module.exports = router;
