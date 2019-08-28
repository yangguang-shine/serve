module.exports = async (ctx) => {
    if (ctx.session.user) return true;
    ctx.body = {
        code: '222',
        msg: '需要登录',
        data: null
    }
    return false
}