const router = require('koa-router')()
const list = require('./list')
const find = require('./find')
const menu = require('./menu')

router.prefix('/api/shop')
// 店铺列表
router.post('/list', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(list, {
        msg: '查询失败'
    })
})

// 查找店铺
router.post('/find', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(find, {
        msg: '查找失败'
    })
})

// 店铺菜单
router.post('/menu', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(menu, {
        msg: '查找失败'
    })
})




module.exports = router
