const UserInfo = require('../mongodb/UserInfo')
const crypto = require('crypto');
module.exports = async (ctx) => {
    const md5 = crypto.createHash('md5');
    const account = ctx.request.body.account
    const password = ctx.request.body.password
    const encodePassword = md5.update(password).digest('hex');
    const user = await ctx.findOne(UserInfo, { account })
    if (user) {
        ctx.body = {
            code: '111',
            msg: '该账号已被注册',
            data: {
                account,
                encodePassword
            }
        }
    } else {
        await ctx.saveOne(UserInfo, { account, encodePassword })
        // const user = new UserInfo({
        //     account,
        //     encodePassword
        // })
        // await ctx.saveOne(UserInfo, user)
        ctx.body = {
            code: '000',
            msg: '注册成功',
            data: {
                account,
                encodePassword
            }
        }
    }
}