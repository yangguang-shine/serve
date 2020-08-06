const router = require('koa-router')()

const orderDetail = require('./orderDetail')
const cancell = require('./cancell')
const orderList = require('./orderList')
const menuList = require('./menuList')
const submit = require('./submit')
const foodList = require('./foodList')

router.prefix('/user/order')
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
router.get('/menuList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(menuList, {
        msg: '订单状态修改失败'
    })
})
// 查找菜品
router.get('/submit', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(submit, {
        msg: '订单状态修改失败'
    })
})
// 查找菜品
router.get('/foodList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(foodList, {
        msg: '订单状态修改失败'
    })
})

module.exports = router
