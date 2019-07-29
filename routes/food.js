const router = require('koa-router')()

router.prefix('/api/foodInfo')
// 添加菜品
router.post('/add', async (ctx, next) => {
    console.log('添加菜品')
    console.log(ctx.request.body)
    const query = ctx.request.body
    try {
        const res = await ctx.querySQL('insert into food_info values (?, ?, ?, ?, ?, ?);', [query.foodName, query.price, query.unit, query.orderCount, query.imgUrl, query.description])
        ctx.body = {
            code: '000',
            msg: '添加成功',
            data: res
        }
    } catch (e) {
        console.log(e)
    }
})

// 删除菜品
router.post('/delete', async (ctx, next) => {
    console.log('删除菜品')
    try {
        const sql = 'delete from food_info where foodName = ?;';
        const query = ctx.request.body
        const res = await ctx.querySQL(sql, [query.foodName])
        ctx.body = {
            code: '000',
            msg: '删除成功',
            data: res
        }
    } catch (e) {
        console.log(e)
    }
})

// 更新菜品
router.post('/update', async (ctx, next) => {
    console.log(ctx.request.body)
    console.log('更新菜品')
    try {
        const sql = "UPDATE food_info set description = ? where foodName = ?;";
        const query = ctx.request.body
        const res = await ctx.querySQL(sql, [query.description, query.foodName])
        ctx.body = {
            code: '000',
            msg: '更新成功',
            data: res
        }
    } catch (e) {
        console.log(e)
    }
})

// 查找菜品
router.get('/find', async (ctx, next) => {
    console.log('查找菜品')
    try {
        const res = await ctx.querySQL('select * from food_info;')
        ctx.body = {
            code: '000',
            msg: '查找成功',
            data: res
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
