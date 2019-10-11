const checkUserLoginInterfaceList = [
    '/api/category/list',
    '/api/category/add',
    '/api/category/delete',
    '/api/category/find',
    '/api/category/edit',
    '/api/food/list',
    '/api/food/add',
    '/api/food/delete',
    '/api/food/edit',
    '/api/food/find',
    '/api/img/shop/uploadImg',
    '/api/img/food/uploadImg',
    '/api/img/delete ',
    '/manage/user/checkManageLogin',
    '/api/shop/add',
    '/api/shop/delete',
    '/api/shop/edit',
    '/api/shop/find',
    '/api/order/changeOrderStatus'
]

module.exports = () => {
    return async (ctx, next) => {
        const path = ctx.path
        const find = checkUserLoginInterfaceList.find(item => item === path)
        if (find) {
            const manageToken = ctx.cookies.get('manageToken')
            if (!manageToken) {
                ctx.body = {
                    code: '888',
                    msg: '请管理员登录',
                    data: null
                }
            } else {
                const sql = `select manageID from manage_token_store where manageToken = ?`
                const manageIDList = await ctx.querySQL(sql, [manageToken])
                if (manageIDList.length) {
                    await next()
                } else {
                    ctx.body = {
                        code: '777',
                        msg: '管理员凭证过期,请重新登录',
                        data: null
                    }
                }
            }
        } else {
            await next()
        }
    }
}