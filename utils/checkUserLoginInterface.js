const checkUserLoginInterfaceList = [
    '/api/address/list',
    '/api/address/add',
    '/api/address/delete',
    '/api/address/edit',
    '/api/address/find',
    '/api/address/default',
    '/api/order/menuList',
    '/api/order/submit',
    // '/api/order/orderList',
]
module.exports = () => {
    return async (ctx, next) => {
        const path = ctx.path
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