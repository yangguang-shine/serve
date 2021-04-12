const router = require('koa-router')()

router.prefix("/api/user/account");
const login = require('./login')
const register = require('./register')
const changePassword = require('./changePassword')

router.prefix('/api/user/account')

// 用户登录
router.post('/login', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(login, {
        code: '110',
        msg: '用户登录失败，请稍后再试',
        data: {}
    })
})

// 用户注册
router.post('/register', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(register, {
        code: '107',
        msg: '用户注册失败，请稍后再试',
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
