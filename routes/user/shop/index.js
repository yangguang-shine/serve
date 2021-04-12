const router = require('koa-router')()
const list = require('./list')
const find = require('./find')

router.prefix('/api/user/shop')
// 添加菜品
router.get('/list', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(list, {
        msg: '查询失败'
    })
})

// 查找菜品
router.get('/find', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(find, {
        msg: '查找失败'
    })
})


module.exports = router
