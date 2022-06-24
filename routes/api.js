const router   = require('koa-router')()
const analysis = require('./analysisController')
//路由
router.get('/activity/:id', async (ctx, next) => {
  console.log(`page ${ctx.params.id} was loaded!`)
  await ctx.render('activity/' + ctx.params.id)
});


//路由
router.use('/pre_analysis', analysis.routes(), analysis.allowedMethods())
router.get('/activity/jump/:url', async (ctx, next) => {
    console.log(`page ${ctx.params.url} was loaded!22`)
    ctx.state.url = ctx.params.url
    await ctx.render('activity/jump.html')
});

//跳过路由 直接load view
router.get('/:id', async (ctx, next) => {
    console.log(`page ${ctx.params.id} was loaded!`)
    await ctx.render(ctx.params.id);
});
module.exports = router;
