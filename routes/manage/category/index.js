const router = require('koa-router')();
const add = require('./add')
const edit = require('./edit')
const list = require('./list')
const remove = require('./remove')

router.prefix('/api/manage/category')

// 添加菜品
router.get('/list', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(list, {
        msg: '查询失败'
    })
})
router.post('/add', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(add, {
        msg: '添加失败'
    })
})
router.post('/remove', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(remove, {
        msg: '删除失败'
    })
})
router.post('/edit', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(edit, {
        msg: '修改失败'
    })
})
module.exports = router
