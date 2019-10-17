const checkUserLoginInterfaceList = [
    '/manage/api/category/add',
    '/manage/api/category/list',
    '/manage/api/category/delete',
    '/manage/api/category/edit',
    '/manage/api/food/list',
    '/manage/api/food/add',
    '/manage/api/food/delete',
    '/manage/api/food/edit',
    '/manage/api/food/find',
    '/manage/api/img/shop/uploadImg',
    '/manage/api/img/food/uploadImg',
    '/manage/api/img/delete ',
    '/manage/api/manageShop/list',
    '/manage/api/manageShop/add',
    '/manage/api/manageShop/delete',
    '/manage/api/manageShop/edit',
    '/manage/api/manageShop/find',
    '/manage/api/manageOrder/orderList',
    '/manage/api/manageOrder/orderDetail',
    '/manage/api/manageOrder/cancell',
    '/manage/api/manageOrder/changeOrderStatus',
]

module.exports = () => {
    return async (ctx, next) => {
        const path = ctx.path
        if (!path.startsWith('/manage/api')) {
            await next()
            return
        }
        const find = checkUserLoginInterfaceList.find(item => item === path)
        if (find) {
            const manageToken = ctx.cookies.get('manageToken')
            console.log(manageToken)
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
                    console.log(3333)
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