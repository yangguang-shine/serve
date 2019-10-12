const UserInfo = require('../mongodb/UserInfo')
const crypto = require('crypto');
module.exports = async (ctx) => {
    const md5 = crypto.createHash('md5');
    const account = ctx.request.body.account
    const password = ctx.request.body.password
    const encodePassword = await md5.update(password).digest('hex');
    const user = await ctx.findOne(UserInfo, { account, encodePassword });
    if (user) {
        ctx.body = {
            code: '000',
            msg: '登录成功',
            data: {
                account,
                encodePassword
            }
        }
    } else {
        ctx.body = {
            code: '111',
            msg: '登录失败',
            data: {
                account,
                encodePassword
            }
        }
    }
}