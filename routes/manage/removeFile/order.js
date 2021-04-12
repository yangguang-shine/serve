const router = require('koa-router')()
// const moment = require('moment');

router.prefix('/api/manage/order')
// 添加菜品
router.get('/orderList', async (ctx, next) => {
    try {
        // 10   待接单
        // 20   已接单
        // 30   已送出  |  制作中
        // 40   已送达  |  制作完
        // 50   已取消
        const { status, shopID } = ctx.query
        if (!(Number(status) >= 0 && Number(status) <= 3) && !shopID) {
            ctx.body = ctx.parameterError
            return
        }
        let sql = ''
        let orderList = []
        if (Number(status) === 0) {
            sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql)
        } else if (Number(status) === 1) {
            sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? or orderStatus = ? or orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql, [10, 20, 30])
        } else if (Number(status) === 2) {
            sql = sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql, [40])
        } else if (Number(status) === 3) {
            sql = sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql, [50])
        }
        orderList.forEach((order) => {
            order.orderTime = `${new Date(order.orderTime).toLocaleDateString().replace(/\//g, '-')} ${new Date(order.orderTime).toTimeString().slice(0, 5)}`
        })
        ctx.body = {
            code: '000',
            msg: '查询成功',
            data: orderList
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '查询失败',
            data: []
        }
    }
})

router.get('/orderDetail', async (ctx) => {
    try {
        const { orderKey, shopID } = ctx.query
        if (!orderKey && !shopID) {
            ctx.body = ctx.parameterError
            return
        }
        const sql1 = `select * from order_key_list_${shopID} where orderKey = ?`
        const sql2 = `select * from order_food_list_${shopID} where orderKey = ?`
        const promise1 = ctx.querySQL(sql1, [orderKey])
        const promise2 = ctx.querySQL(sql2, [orderKey])
        const orderInfoList = await promise1
        const foodList = await promise2
        if (!orderInfoList.length) {
            ctx.body = {
                code: '111',
                msg: '查询失败',
                data: {}
            }
        }
        const orderInfo = orderInfoList[0]
        orderInfo.address = JSON.parse(orderInfo.address)
        orderInfo.orderTime = `${new Date(orderInfo.orderTime).toLocaleDateString().replace(/\//g, '-')} ${new Date(orderInfo.orderTime).toTimeString().slice(0, 5)}`
        orderInfo.takeOutTime = orderInfo.takeOutTime ? `${new Date(orderInfo.orderTime).toLocaleDateString().replace(/\//g, '-')} ${orderInfo.takeOutTime}` : orderInfo.takeOutTime
        orderInfo.selfTakeTime = orderInfo.selfTakeTime ? `${new Date(orderInfo.orderTime).toLocaleDateString().replace(/\//g, '-')} ${orderInfo.selfTakeTime}` : orderInfo.selfTakeTime
        ctx.body = {
            code: '000',
            msg: '查询成功',
            data: {
                ...orderInfo,
                foodList
            }
        }
    } catch(e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '查询失败',
            data: {}
        }
    }
})

router.post('/cancell', async (ctx) => {
    try {
        const { orderKey, shopID } = ctx.request.body
        if (!(orderKey && shopID)) {
            ctx.body = ctx.parameterError
            return
        }
        const userIDList = await ctx.querySQL(`select userID from order_key_list_${shopID} where orderKey = ?`, [orderKey])
        let userID = ''
        if (userIDList.length) {
            if (userIDList.length > 1) console.log('多个userID');
            userID = userIDList[0].userID
        } else {
            ctx.body = {
                code: '111',
                msg: '未找到该订单',
                data: {}
            }
            return
        }
        await ctx.SQLtransaction(async (querySQL) => {
            const sql1 = `update order_key_list_${userID} set orderStatus = ? where orderKey = ?`;
            const sql2 = `update order_key_list_${shopID} set orderStatus = ? where orderKey = ?`;
            const promise1 = querySQL(sql1, [50, orderKey])
            const promise2 = querySQL(sql2, [50, orderKey])
            await promise1
            await promise2
        })
        ctx.body = {
            code: '000',
            msg: '取消订单成功',
            data: {}
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '取消订单失败',
            data: {}
        }
    }
})

router.post('/changeOrderStatus', async (ctx) => {
    try {
        const { orderKey, shopID, orderStatus } = ctx.request.body
        if (!(orderKey && shopID && orderStatus)) {
            ctx.body = {
                code: '222',
                msg: '参数校验失败',
                data: {}
            }
            return
        }
        const userIDList = await ctx.querySQL(`select userID from order_key_list_${shopID} where orderKey = ?`, [orderKey])
        let userID = ''
        if (userIDList.length) {
            if (userIDList.length > 1) console.log('多个userID');
            userID = userIDList[0].userID
        } else {
            ctx.body = {
                code: '111',
                msg: '未找到该订单',
                data: {}
            }
            return
        }
        const nextOrderStatus = Number(orderStatus) + 10
        await ctx.SQLtransaction(async (querySQL) => {
            const sql1 = `update order_key_list_${userID} set orderStatus = ? where orderKey = ?`;
            const sql2 = `update order_key_list_${shopID} set orderStatus = ? where orderKey = ?`;
            const promise1 = querySQL(sql1, [nextOrderStatus, orderKey])
            const promise2 = querySQL(sql2, [nextOrderStatus, orderKey])
            await promise1
            await promise2
        })
        ctx.body = {
            code: '000',
            msg: '订单状态修改成功',
            data: {}
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '订单状态修改失败',
            data: {}
        }
    }
})

module.exports = router
