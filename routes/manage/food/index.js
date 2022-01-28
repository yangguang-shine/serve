const router = require('koa-router')()
const add = require('./add')
const edit = require('./edit')
const list = require('./list')
const find = require('./find')
const remove = require('./remove')

router.prefix('/api/manage/food')
// 添加菜品
router.post('/list', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(list, {
        msg: '查询失败'
    })
})
router.post('/add', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(add, {
        msg: '添加失败'
    })
})
// 删除菜品
router.post('/remove', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(remove, {
        msg: '删除失败'
    })
})

// 更新菜品
router.post('/edit', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(edit, {
        msg: '更新失败'
    })
})

// 查找菜品
router.post('/find', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(find, {
        msg: '查找失败'
    })
})

module.exports = router
