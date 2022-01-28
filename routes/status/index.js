const router = require('koa-router')();
const _404 = require('./404')
router.prefix('/api/status')

// 添加菜品
router.post('/404', async (ctx, next) => {
    console.log(404)
    await ctx.simpleRouterTryCatchHandle(_404, {
        msg: '未找到接口'
    })
})

router.post('/404', async (ctx, next) => {
    console.log(404)
    await ctx.simpleRouterTryCatchHandle(_404, {
        msg: '未找到接口'
    })
})

module.exports = router
