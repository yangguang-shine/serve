const router = require('koa-router')()

const orderDetail = require('./orderDetail')
const cancell = require('./cancell')
const orderList = require('./orderList')
const menuList = require('./menuList')
const submit = require('./submit')
const foodList = require('./foodList')

router.prefix('/user/order')

// 查询订单列表
router.get('/orderList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(orderList, {
        msg: '查询失败'
    })
})

// 查询订单详情
router.get('/orderDetail', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(orderDetail, {
        msg: '添加失败'
    })
})

// 取消订单
router.post('/cancell', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(cancell, {
        msg: '取消订单失败'
    })
})

// 获取菜单列表
router.get('/menuList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(menuList, {
        msg: '订单状态修改失败'
    })
})
// 提交订单
router.post('/submit', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(submit, {
        msg: '订单状态修改失败'
    })
})
// 获得订单菜品详情
router.get('/foodList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(foodList, {
        msg: '订单状态修改失败'
    })
})

module.exports = router
