const router = require('koa-router')();

router.get('/:id', async (ctx, next) => {

  ctx.state.match_id = ctx.params.id;

  await ctx.render('pre_analysis.html');
});
module.exports = router;
