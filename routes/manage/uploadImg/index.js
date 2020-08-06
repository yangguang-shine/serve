const router = require('koa-router')()
const shop = require('./shop')
const food = require('./food')
const remove = require('./remove')

router.prefix('/manage/uploadImg')
// 添加菜品
router.get('/shop', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(shop, {
        msg: '上传失败'
    })
})
router.post('/food', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(food, {
        msg: '上传失败'
    })
})
// 删除菜品
router.post('/remove', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(remove, {
        msg: '删除失败'
    })
})

module.exports = router
