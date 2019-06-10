const router = require('koa-router')()
const submit = require("../model/food/submit");

router.prefix('/food')
// 输入信息
router.get('/info', async (ctx, next) => {
    console.log('输入信息')
    await ctx.render('food', {})
})
// 提交信息
router.post('/submit', async (ctx, next) => {
    await submit(ctx)
    console.log('提交信息')
})

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
})

module.exports = router
