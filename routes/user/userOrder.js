const router = require('koa-router')()
const randomNum = require('../../tool/randomNum');
// const moment = require('moment');

router.prefix('/user/api/userOrder')
// 添加菜品
router.get('/menuList', async (ctx, next) => {
    const { shopID } = ctx.query
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    try {
        const sql = `select * from food_info_${shopID} group by categoryID, foodID;`;
        const res = await ctx.querySQL(sql, [])
        const AllfoodList = (res || []).reduce((list, item) => {
            if (!list.length) {
                list.push({
                    categoryID: item.categoryID,
                    categoryName: item.categoryName,
                    foodList: [item]
                })
            } else {
                const find = list.find(Listitem => Listitem.categoryID === item.categoryID)
                if (find) {
                    find.foodList.push(item)
                } else {
                    list.push({
                        categoryID: item.categoryID,
                        categoryName: item.categoryName,
                        foodList: [item]
                    })
                }
            }
            return list
        }, [])
        ctx.body = {
            code: '000',
            msg: '查询成功',
            data: AllfoodList
        }
    } catch (e) {
        console.log(e)
        if (e.code === 'ER_NO_SUCH_TABLE') {
            ctx.body = {
                code: '111',
                msg: '商家未配置菜品',
                data: null
            }
            return
        }
        ctx.body = {
            code: '111',
            msg: '查询失败',
            data: null
        }
    }
})

router.post('/submit', async (ctx, next) => {
    const orderKey = randomNum()
    const orderTime = new Date()
    const { shopID, orderAmount, foodList, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime } = ctx.request.body
    if (!shopID) {
        ctx.body = ctx.parameterError
        return
    }
    const userID = await ctx.getUserID(ctx)
    try {
        await ctx.SQLtransaction(async (querySQL) => {
            const valuesUserID = [orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime]
            const valuesShopID = [orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, userID]
            const sql = `insert into order_key_list_${userID} (orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime) values (?);`
            const insertOrderKeyPromise = await querySQL(sql, [valuesUserID])
            const insertOrderPromise = await insertOrderFoodList({ querySQL: querySQL, foodList, orderKey, userID })
            const shopSQL = `insert into order_key_list_${shopID} (orderKey, shopID, orderAmount, orderTime, minusPrice, businessType, reservePhone, selfTakeTime, address, takeOutTime, userID) values (?);`
            const insertShopIDOrderKeyPromise = await querySQL(shopSQL, [valuesShopID])
            const insertShopIDOrderPromise = await insertOrderFoodList({ querySQL: querySQL, foodList, orderKey, shopID })
            await insertOrderKeyPromise
            await insertOrderPromise
            await insertShopIDOrderKeyPromise
            await insertShopIDOrderPromise
        })
        ctx.body = {
            code: '000',
            msg: '提交成功',
            data: orderKey
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '提交失败',
            data: null
        }
    }
})

router.get('/orderList', async (ctx, next) => {
    try {
        // 10   待接单
        // 20   已接单
        // 30   待自提   已送出
        // 40   已自提   已送达
        // 50   已取消
        const { status } = ctx.query
        if (!(Number(status) >= 0 && Number(status) <= 3)) {
            ctx.body = ctx.parameterError
            return
        }
        let sql = ''
        let orderList = []
        const userID = await ctx.getUserID(ctx)
        if (Number(status) === 0) {
            sql = `select * from order_key_list_${userID} a inner join shop_list b on a.shopID = b.shopID ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql)
        } else if (Number(status) === 1) {
            sql = `select * from order_key_list_${userID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? or orderStatus = ? or orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql, [10, 20, 30])
        } else if (Number(status) === 2) {
            sql = sql = `select * from order_key_list_${userID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await ctx.querySQL(sql, [40])
        } else if (Number(status) === 3) {
            sql = sql = `select * from order_key_list_${userID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
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
        const { orderKey } = ctx.query
        if (!orderKey) {
            ctx.body = ctx.parameterError
            return
        }
        const userID = await ctx.getUserID(ctx)
        const sql1 = `select * from order_key_list_${userID} where orderKey = ?`
        const sql2 = `select * from order_food_list_${userID} where orderKey = ?`
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

router.get('/foodList', async (ctx) => {
    try {
        const { orderKey, shopID } = ctx.query
        if (!orderKey || !shopID) {
            ctx.body = ctx.parameterError
            return
        }
        const sql = `select * from order_food_list_${shopID} where orderKey = ?`
        const res = await ctx.querySQL(sql, [orderKey])
        if (res.length) {
            ctx.body = {
                code: '000',
                msg: '查找成功',
                data: res
            }
        } else {
            ctx.body = {
                code: '111',
                msg: '该订单没有菜品',
                data: []
            }
        }
    } catch (e) {
        ctx.body = {
            code: '111',
            msg: '获取失败',
            data: []
        }
    }
})

async function insertOrderFoodList({ querySQL, foodList, orderKey, userID = '', shopID = '' } = {}) {
    let sql = ''
    if(userID) {
        sql = `insert into order_food_list_${userID} (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey) values ?`
    } else if (shopID) {
        sql = `insert into order_food_list_${shopID} (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey) values ?`
    }
    const values = []
    foodList.forEach((item) => {
        const foodID = item.foodID
        const orderCount = item.orderCount
        const imgUrl = item.imgUrl
        const foodName = item.foodName
        const categoryID = item.categoryID
        const categoryName = item.categoryName
        const price = item.price
        const unit = item.unit
        const description = item.description
        values.push([foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey])
    })
    await querySQL(sql, [values])
}
module.exports = router
