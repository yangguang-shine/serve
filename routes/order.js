const router = require('koa-router')()
const randomNum = require('../tool/randomNum')
// const creatOrderTable = require('./utils/creatOrderTable')

router.prefix('/api/order')
// 添加菜品
router.get('/menuList', async (ctx, next) => {
    console.log(ctx.request.body)
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
router.post('/submit', async (ctx, next) => {
    console.log('提交订单')
    console.log(ctx.request.body)
    const query = ctx.request.body
    const orderKey = randomNum()
    try {
        let sql = 'insert into order_key_list (orderKey) values (?);'
        const insertOrderKeyPromise = ctx.querySQL(sql, [orderKey])
        const insertOrderPromise = insertOrder(ctx.querySQL, query.foodList, orderKey)
        await insertOrderKeyPromise
        await insertOrderPromise
        sql = 'insert into food_info (foodName, categoryID, price, unit, imgUrl, description) values (?, ?, ?, ?, ?, ?)';
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
async function insertOrder(querySql, foodList, orderKey) {
    const sql = 'insert into order_list (foodID, orderCount, imgUrl, foodName, categoryID, categoryName, price, unit, description, orderKey) values ?'
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
    await querySql(sql, [values])
}
module.exports = router
