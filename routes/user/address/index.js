const router = require('koa-router')()
const add = require('./add')
const remove = require('./remove')
const list = require('./list')
const edit = require('./edit')
const find = require('./find')
const setDefault = require('./setDefault')
const getDefault = require('./getDefault')

router.prefix('/api/user/address')
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

// 更新菜品
router.post('/remove', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(remove, {
        msg: '删除失败'
    })
})

// 查找菜品
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

// 查找菜品
router.post('/setDefault', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(setDefault, {
        msg: '查找失败'
    })
})
// 获取默认地址
router.post('/getDefault', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(getDefault, {
        msg: '获取失败'
    })
})

module.exports = router
