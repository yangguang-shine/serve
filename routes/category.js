const router = require('koa-router')()

router.prefix('/api/category')
// 添加菜品
router.get('/list', async (ctx, next) => {
    console.log('查找分类')
    try {
        let sql = 'select * from category_info'
        const res = await ctx.querySQL(sql)
        ctx.body = {
            code: '000',
            msg: '添加成功',
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
    console.log('添加分类')
    console.log(ctx.request.body)
    const query = ctx.request.body
    try {
        let sql = 'insert into category_info (categoryName) values (?)'
        await ctx.querySQL(sql, [query.categoryName])
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
router.post('/delete', async (ctx, next) => {
    console.log('修改分类')
    console.log(ctx.request.body)
    const query = ctx.request.body
    try {
        let sql = 'delete from category_info where categoryID = ?'
        await ctx.querySQL(sql, [query.categoryID])
        ctx.body = {
            code: '000',
            msg: '修改成功',
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '修改失败',
            data: null
        }
    }
})
router.post('/edit', async (ctx, next) => {
    console.log('修改分类')
    console.log(ctx.request.body)
    const query = ctx.request.body
    try {
        let sql = 'update category_info set categoryName = ? where categoryID = ?'
        await ctx.querySQL(sql, [query.categoryName, query.categoryID])
        ctx.body = {
            code: '000',
            msg: '修改成功',
            data: null
        }
    } catch (e) {
        console.log(e)
        ctx.body = {
            code: '111',
            msg: '修改失败',
            data: null
        }
    }
})
module.exports = router
