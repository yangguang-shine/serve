const router = require('koa-router')()
const shop = require('./shop')
const common = require('./common')
const food = require('./food')
const remove = require('./remove')

router.prefix('/api/manage/uploadImg')
// 店铺上传图片
router.post('/shop', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(shop, {
        msg: '上传失败'
    })
})
router.post('/common', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(common, {
        msg: '上传失败'
    })
})

// 菜品上传图片
router.post('/food', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(food, {
        msg: '上传失败'
    })
})
// 图片输出
router.post('/remove', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(remove, {
        msg: '删除失败'
    })
})

module.exports = router
