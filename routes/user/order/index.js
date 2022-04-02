const router = require('koa-router')()

const orderDetail = require('./orderDetail')
const cancel = require('./cancel')
const orderList = require('./orderList')
// const menuList = require('./menuList')
const submit = require('./submit')
const foodList = require('./foodList')

router.prefix('/api/order')

// 查询订单列表
router.post('/orderList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(orderList, {
        msg: '查询失败'
    })
})

// 查询订单详情
router.post('/orderDetail', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(orderDetail, {
        msg: '查询失败'
    })
})

// 取消订单
router.post('/cancel', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(cancel, {
        msg: '取消订单失败'
    })
})

// 获取菜单列表
// router.post('/menuList', async (ctx, next) => {
//     await ctx.simpleRouterTryCatchHandle(menuList, {
//         msg: '菜品列表获取失败'
//     })
// })
// 提交订单
router.post('/submit', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(submit, {
        msg: '订单提交失败'
    })
})
// 获得订单菜品详情
router.post('/foodList', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(foodList, {
        msg: '菜品查询失败'
    })
})

module.exports = router
