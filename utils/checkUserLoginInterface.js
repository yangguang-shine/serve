const checkUserLoginInterfaceList = [
    'user/api/address/list',
    'user/api/address/add',
    'user/api/address/delete',
    'user/api/address/edit',
    'user/api/address/find',
    'user/api/address/default',
    'user/api/userOrder/menuList',
    'user/api/userOrder/submit',
    'user/api/userOrder/orderList',
    'user/api/userOrder/orderDetail',
    'user/api/userOrder/cancell',
    // '/api/order/orderList',
]
module.exports = () => {
    return async (ctx, next) => {
        const path = ctx.path
        if (!path.startsWith('/user/api')) {
            await next()
            return
        }
        const find = checkUserLoginInterfaceList.find(item => item === path)
        if (find) {
            const token = ctx.cookies.get('token')
            if (!token) {
                ctx.body = {
                    code: '666',
                    msg: '请登录',
                    data: null
                }
            } else {
                const sql = `select userID from my_token_store where token = ?`
                const userIDList = await ctx.querySQL(sql, [token])
                if (userIDList.length) {
                    await next()
                } else {
                    ctx.body = {
                        code: '555',
                        msg: '登录凭证过期',
                        data: null
                    }
                }
            }
        } else {
            await next()
        }
    }
} 