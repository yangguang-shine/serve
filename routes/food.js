const router = require('koa-router')()

router.prefix('/api/food')
// 添加菜品
router.get('/list', async (ctx, next) => {
    console.log('菜品列表')
    const query = ctx.query
    try {
        const sql = 'select * from food_info where categoryID = ?;'
        const res = await ctx.querySQL(sql, [query.categoryID])
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
    const query = ctx.request.body
    try {
        console.log((+query.price).toFixed(2))
        const sql = 'insert into food_info (foodName, categoryID, price, unit, imgUrl, description, categoryName) values (?, ?, ?, ?, ?, ?, ?)';
        await ctx.querySQL(sql, [query.foodName, +query.categoryID, (+query.price).toFixed(2), query.unit, query.imgUrl, query.description, query.categoryName])
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
    try {
        const sql = 'delete from food_info where foodID = ?;';
        const query = ctx.request.body
        console.log(query)
        const res = await ctx.querySQL(sql, [+query.foodID])
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
    try {
        const query = ctx.request.body
        const sql = 'update food_info set foodName = ?, price = ?, unit = ?, imgUrl = ?, description = ? where foodID = ?;'
        const res = await ctx.querySQL(sql, [query.foodName, (+query.price).toFixed(2), query.unit, query.imgUrl, query.description, query.foodID])
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
        const res = await ctx.querySQL('select * from food_info where foodID = ?;', [Number(query.foodID)])
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
