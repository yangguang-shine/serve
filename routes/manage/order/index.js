const router = require('koa-router')()
const orderDetail = require('./orderDetail')
const cancel = require('./cancel')
const orderList = require('./orderList')
const changeOrderStatus = require('./changeOrderStatus')

router.prefix('/api/manage/order')
// 添加菜品
router.post('/orderList', async (ctx, next) => {
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
router.post('/cancel', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(cancel, {
        msg: '取消订单失败'
    })
})

// 查找菜品
router.post('/changeOrderStatus', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(changeOrderStatus, {
        msg: '订单状态修改失败'
    })
})

module.exports = router
