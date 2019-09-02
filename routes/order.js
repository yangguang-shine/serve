const router = require('koa-router')()
const randomNum = require('../tool/randomNum');
// const moment = require('moment');

router.prefix('/api/order')
// 添加菜品
router.get('/menuList', async (ctx, next) => {
    const { shopID } = ctx.query
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

router.get('/deleteOrderKey', async (ctx, next) => {
    console.log('删除订单')
    try {
        let sql = `select orderKey from order_key_list;`
        const res = await ctx.querySQL(sql)
        console.log(res)
        const orderListString = (res.map(item => `order_list_${item.orderKey}`)).join(', ')
        sql = `drop table ${orderListString}`
        await ctx.querySQL(sql)
        await ctx.querySQL('truncate table order_key_list')
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '删除失败',
            data: null
        }
    }
})

router.post('/submit', async (ctx, next) => {
    console.log('提交订单')
    const orderKey = randomNum()
    const orderTime = new Date()
    const { shopID, orderAmount, foodList } = ctx.request.body
    const userID = await ctx.getUserID(ctx)
    try {
        await ctx.SQLtransaction(async () => {
            const values = [orderKey, shopID, orderAmount, orderTime]
            const sql = `insert into order_key_list_${userID} (orderKey, shopID, orderAmount, orderTime) values (?);`
            const insertOrderKeyPromise = await ctx.querySQL(sql, [values])
            const insertOrderPromise = await insertOrderFoodList({ querySQL: ctx.querySQL, foodList, orderKey, userID })
            const shopSQL = `insert into order_key_list_${shopID} (orderKey, shopID, orderAmount, orderTime) values (?);`
            const insertShopIDOrderKeyPromise = await ctx.querySQL(shopSQL, [values])
            const insertShopIDOrderPromise = await insertOrderFoodList({ querySQL: ctx.querySQL, foodList, orderKey, shopID })
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
    const userID = await ctx.getUserID(ctx)
    try {
        const sql = `select * from order_key_list_${userID} a inner join shop_list b on a.shopID = b.shopID ORDER BY a.orderKey desc`
        const orderList = await ctx.querySQL(sql)
        ctx.body = {
            code: '000',
            msg: '查询成功',
            data: orderList
        }
    } catch (e) {
        ctx.body = {
            code: '111',
            msg: '查询失败',
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
