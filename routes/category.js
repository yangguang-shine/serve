const router = require('koa-router')()
const createCategory = require('./table/createCategory')

router.prefix('/api/category')
// 添加菜品
router.get('/list', async (ctx, next) => {
    console.log('查找分类')
    const { shopID } = ctx.query
    try {
        let sql = `select * from category_list_${shopID};`;
        const res = await ctx.querySQL(sql)
        ctx.body = {
            code: '000',
            msg: '添加成功',
            data: res
        }
    } catch (e) {
        console.log(e)
        if (e.code === 'ER_NO_SUCH_TABLE') {
            try {
                await createCategory(ctx.querySQL, shopID)
                ctx.body = {
                    code: '000',
                    msg: '添加成功',
                    data: []
                }
            } catch (e) {
                console.log(e)
                ctx.body = {
                    code: '111',
                    msg: '查询失败',
                    data: null
                }
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
router.post('/add', async (ctx, next) => {
    console.log('添加分类')
    console.log(ctx.request.body)
    const { categoryName, shopID } = ctx.request.body
    try {
        let sql = `insert into category_list_${shopID} (categoryName, shopID) values (?, ?);`
        await ctx.querySQL(sql, [categoryName, shopID])
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
    const { categoryID, shopID } = ctx.request.body
    try {
        let sql = `delete from category_list_${shopID} where categoryID = ?`
        await ctx.querySQL(sql, [categoryID])
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
router.post('/edit', async (ctx, next) => {
    console.log('修改分类')
    console.log(ctx.request.body)
    const { categoryName, categoryID, shopID } = ctx.request.body
    console.log(typeof categoryID)
    try {
        let sql = `update category_list_${shopID} set categoryName = ? where categoryID = ?`
        await ctx.querySQL(sql, [categoryName, categoryID])
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
