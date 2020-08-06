const router = require('koa-router')()
const orderDetail = require('./orderDetail')
const cancell = require('./cancell')
const orderList = require('./orderList')
const changeOrderStatus = require('./changeOrderStatus')

router.prefix('/manage/order')
// 添加菜品
router.get('/orderList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(orderList, {
        msg: '查询失败'
    })
})
router.post('/orderDetail', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(orderDetail, {
        msg: '添加失败'
    })
})

// 更新菜品
router.post('/cancell', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(cancell, {
        msg: '取消订单失败'
    })
})

// 查找菜品
router.get('/changeOrderStatus', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(changeOrderStatus, {
        msg: '订单状态修改失败'
    })
})

module.exports = router
