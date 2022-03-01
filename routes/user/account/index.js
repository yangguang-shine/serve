const router = require('koa-router')()

router.prefix("/api/user/account");
const login = require('./login')
const register = require('./register')
const logout = require('./logout')
const changePassword = require('./changePassword')

router.prefix('/api/user/account')

// 用户登录
router.post('/login', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(login, {
        code: '105',
        msg: '用户登录失败，请稍后再试',
        data: {}
    })
})

// 用户注册
router.post('/register', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(register, {
        code: '104',
        msg: '用户注册失败，请稍后再试',
        data: {}
    })
})

// 用户注销登录态
router.post('/logout', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(logout, {
        code: '106',
        msg: '用户登录注销失败，请稍后再试',
        data: {}
    })
})

// 用户修改密码
router.post('/changePassword', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(changePassword, {
        
    })
})



// 更新菜品
// router.post('/checkManageLogin', async (ctx, next) => {
//     await ctx.simpleRouterTryCatchHandle(checkManageLogin, {
//         code: '888',
//         msg: '用户登录过期',
//         data: false
//     })
// })


module.exports = router
