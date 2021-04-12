const router = require('koa-router')()
const login = require('./login')

router.prefix('/api/wechat/applet')
// 添加菜品
router.get('/login', async (ctx, next) => {
    await ctx.simpleRouterTryCatchHandle(login, {
        msg: '登录失败'
    })
})

module.exports = router
