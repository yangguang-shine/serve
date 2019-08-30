const router = require('koa-router')()
const createFoodInfo = require('./table/createFoodInfo')

router.prefix('/api/food')
// 添加菜品
router.get('/list', async (ctx, next) => {
    console.log('菜品列表')
    const { shopID, categoryID } = ctx.query
    try {
        const sql = `select * from food_info_${shopID} where categoryID = ?;`
        const res = await ctx.querySQL(sql, [categoryID])
        ctx.body = {
            code: '000',
            msg: '查询成功',
            data: res
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
router.post('/add', async (ctx, next) => {
    console.log('添加菜品')
    console.log(ctx.request.body)
    const { foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID } = ctx.request.body
    try {
        const sql = `insert into food_info_${shopID} (foodName, categoryID, price, unit, imgUrl, description, categoryName) values (?, ?, ?, ?, ?, ?, ?)`;
        await ctx.querySQL(sql, [foodName, categoryID, price, unit, imgUrl, description, categoryName])
        ctx.body = {
            code: '000',
            msg: '添加成功',
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '添加失败',
            data: null
        }
    }
})

// 删除菜品
router.post('/delete', async (ctx, next) => {
    console.log('删除菜品')
    const { shopID, foodID } = ctx.request.body
    try {
        const sql = `delete from food_info_${shopID} where foodID = ?;`;
        const res = await ctx.querySQL(sql, [foodID])
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: res
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

// 更新菜品
router.post('/edit', async (ctx, next) => {
    console.log(ctx.request.body)
    console.log('更新菜品')
    const { shopID, foodName, price, unit, imgUrl, description, foodID } = ctx.request.body
    try {
        const sql = `update food_info_${shopID} set foodName = ?, price = ?, unit = ?, imgUrl = ?, description = ? where foodID = ?;`
        const res = await ctx.querySQL(sql, [foodName, price, unit, imgUrl, description, foodID])
        ctx.body = {
            code: '000',
            msg: '更新成功',
            data: res
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '更新失败',
            data: null
        }
    }
})

// 查找菜品
router.get('/find', async (ctx, next) => {
    console.log('查找菜品')
    try {
        const query = ctx.query
        console.log(typeof query.foodID)
        const res = await ctx.querySQL(`select * from food_info_${query.shopID} where foodID = ?;`, [Number(query.foodID)])
        let data = {}
        if (res.length) {
            data = res[0]
        }
        ctx.body = {
            code: '000',
            msg: '查找成功',
            data
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '查找失败',
            data: null
        }
    }
})

module.exports = router
