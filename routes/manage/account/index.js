const router = require('koa-router')()

const login = require('./login')
const register = require('./register')
const checkManageLogin = require('./checkManageLogin')
const changePassword = require('./changePassword')

router.prefix('/api/manage/account')

// 添加菜品
router.post('/login', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(login, {
        code: '110',
        msg: '管理员登录失败，请稍后再试',
        data: {}
    })
})
router.post('/register', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(register, {
        code: '107',
        msg: '管理员注册失败，请稍后再试',
        data: {}
    })
})
// 删除菜品
router.post('/changePassword', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(changePassword, {
    })
})

// 更新菜品
router.post('/checkManageLogin', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(checkManageLogin, {
        code: '888',
        msg: '管理登录过期',
        data: false
    })
})

module.exports = router
