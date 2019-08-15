const router = require('koa-router')()

router.prefix('/api/shop')
// 添加菜品
router.get('/list', async (ctx, next) => {
    console.log('店铺列表')
    // const query = ctx.query
    try {
        const sql = 'select * from shop_list'
        const res = await ctx.querySQL(sql, [])
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
    console.log('添加店铺')
    console.log(ctx.request.body)
    const query = ctx.request.body
    try {
        const sql = 'insert into shop_list (shopName, imgUrl, startTime, endTime, address) values (?, ?, ?, ?, ?)';
        await ctx.querySQL(sql, [query.shopName, query.imgUrl, query.startTime, query.endTime, query.address])
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
    console.log('删除店铺')
    try {
        const sql = 'delete from shop_list where shopID = ?;';
        const query = ctx.request.body
        console.log(query)
        const res = await ctx.querySQL(sql, [+query.shopID])
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
    console.log('更新店铺')
    try {
        const query = ctx.request.body
        const sql = 'update shop_list set shopName = ?, imgUrl = ?, startTime = ?, endTime = ?, address = ? where shopID = ?;'
        const res = await ctx.querySQL(sql, [query.shopName, query.imgUrl, query.startTime, query.endTime, query.address, query.shopID])
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
        console.log(typeof query.shopID)
        const res = await ctx.querySQL('select * from shop_list where shopID = ?;', [Number(query.shopID)])
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
