const router = require('koa-router')()
const randomNum = require('../tool/randomNum')
// const creatOrderTable = require('./utils/creatOrderTable')

router.prefix('/api/order')
// 添加菜品
router.get('/foodList', async (ctx, next) => {
    console.log(ctx.request.body)

    const shopID = ctx.query.shopID
    console.log(shopID)
    try {
        const sql = 'select * from food_info group by categoryID, foodID;';
        const res = await ctx.querySQL(sql, [])
        const AllfoodList = res.reduce((list, item) => {
            if (!list.length) {
                list.push({
                    categoryID: item.categoryID,
                    categoryName: item.categoryName,
                    foodList: [item]
                })
            } else {
                const lastIndex = list.length - 1;
                if (list[lastIndex].categoryID === item.categoryID) {
                    list[lastIndex].list.push(item)
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
        ctx.body = {
            code: '111',
            msg: '查询失败',
            data: null
        }
    }
})
router.post('/submit', async (ctx, next) => {
    console.log('提交订单')
    console.log(ctx.request.body)
    const query = ctx.request.body
    const orderKey = randomNum()
    try {
        let sql = 'insert into order_key_list (orderkey) values (?);'
        const insertOrderKeyPromise = ctx.querySQL(sql, [orderKey])
        const insertOrderPromise = insertOrder(ctx.querySQL, query.orderList, orderKey)
        await insertOrderKeyPromise
        await insertOrderPromise
        sql = 'insert into food_info (foodName, categoryID, price, unit, imgUrl, description) values (?, ?, ?, ?, ?, ?)';
        await ctx.querySQL(sql, [query.foodName, +query.categoryID, (+query.price).toFixed(2), query.unit, query.imgUrl, query.description])
        ctx.body = {
            code: '000',
            msg: '提交成功',
            data: null
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
async function insertOrder(querySql, orderList, orderKey) {
    const sql = 'insert into order_list (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey) values ?'
    const values = []
    orderList.forEach((item) => {
        const foodID = item.foodID
        const orderCount = item.orderCount
        const imgUrl = item.imgUrl
        const foodName = item.foodName
        const categoryID = item.categoryID
        const categoryName = item.categoryName
        const price = item.price
        const unit = item.unit
        const description = item.description
        const orderKey = item.orderKey
        values.push([foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey])
    })
    await querySql(sql, [values])
}
module.exports = router
