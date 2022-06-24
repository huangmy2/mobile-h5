const router = require('koa-router')();
router.get('/', async (ctx, next) => {
});
router.get('/:id', async (ctx, next) => {
    ctx.state.match_id = ctx.params.id || 0;
    await ctx.render('pre_analysis.html');
});

module.exports = router;

