const router = require('koa-router')()

router.prefix('/user/shop')
// 添加菜品
router.get('/list', async (ctx, next) => {
    const { businessType } = ctx.query
    let res = []
    try {
        if (businessType) {
            const sql = `select * from shop_list where businessTypes like '%${businessType}%'`
            res = await ctx.querySQL(sql, [])
        } else {
            const sql = 'select * from shop_list'
            res = await ctx.querySQL(sql, [])
        }
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
// 查找菜品
router.get('/find', async (ctx, next) => {
    try {
        const query = ctx.query
        if (!query.shopID) {
            ctx.body = ctx.parameterError
            return
        }
        const res = await ctx.querySQL('select * from shop_list where shopID = ?;', [Number(query.shopID)])
        if (res.length) {
            ctx.body = {
                code: '000',
                msg: '查找成功',
                data: res[0]
            }
        } else {
            ctx.body = {
                code: '111',
                msg: '无此店铺',
                data: {}
            }
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
