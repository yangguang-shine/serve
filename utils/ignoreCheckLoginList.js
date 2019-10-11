const ignoreCheckLoginList = [
    '/api/order/orderList',
    '/api/order/orderDetail',
    // '/api/order/cancell',  该接口赞、暂不做校验
    '/api/shop/list',
]
module.exports = () => {
    return async (ctx, next) => {
        const path = ctx.path
        const find = ignoreCheckLoginList.find(item => item === path)
        if (find) {
            const { shopID, managerShopList } = ctx.query
            switch (path) {
                case '/api/order/orderList':
                    if (shopID) {
                        // 管理员验证
                        await checkManageLogin(ctx, next)
                    } else { // 用户验证
                         await checkUserLogin(ctx, next)
                    }
                    break;
                case '/api/order/orderDetail':
                    if (shopID) {
                        // 管理员验证
                        await checkManageLogin(ctx, next)
                    } else { // 用户验证
                        await checkUserLogin(ctx, next)
                    }
                    break;
                case '/api/shop/list':
                    if (managerShopList) {
                        await checkManageLogin(ctx, next)
                    } else {
                        await next()
                    }
                    break;
            }
        } else {
            await next()
        }
    }
}
const checkUserLogin = async (ctx, next) => {
    const status = await ctx.checkUserLogin(ctx.querySQL, ctx.cookies.get('token'))
    if (status) {
        await next()
    } else {
        ctx.body = {
            code: '666',
            msg: '请用户登录',
            data: null
        }
    }
}
const checkManageLogin = async (ctx, next) => {
    const status = await ctx.checkManageLogin(ctx.querySQL, ctx.cookies.get('manageToken'))
    if (status) {
        await next()
    } else {
        ctx.body = {
            code: '888',
            msg: '请管理员登录',
            data: null
        }
    }
}
