const httpsGet = require('../../tool/httpsGet')
// const connect = require('../mongodb/index').connect
// const findOne = require('../mongodb/index').findOne
const WechatUser = require('../mongodb/WechatUser')
const dataFormat = require('../../tool/dataFormat')
module.exports = async (ctx) => {
    if (!ctx.query.code) {
        let redirect_uri = decodeURI(`http://${ctx.hostname}${ctx.path}`)
        // redirect_uri = encodeURI
        ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd3070d04299694f4&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
        return false;
    }
    let code = ctx.query.code;
    const res = await httpsGet(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12&code=${code}&grant_type=authorization_code`)
    const data = await dataFormat(res)
    const { access_token, openid } = JSON.parse(data);
    let user = null
    user = await ctx.findOne(WechatUser, { openid })
    if (user) {
        console.log('找到')
        console.log('设置session:' + openid)
        ctx.session.openid = openid
        return user;
    }
    console.log('未找到')
    // 获取详细信息个人
    const userRes = await httpsGet(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
    const userData = await dataFormat(userRes)
    user = JSON.parse(userData)
    if (user) {
        console.log('找到')
        console.log('设置session:' + openid)
        ctx.session.openid = openid
    }
    const userInfo = new WechatUser(user)
    await ctx.saveOne(WechatUser, userInfo)
    return user
            // 验证凭证是否有用
    //         https.get(`https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openid}`, async (res) => {
    //             const data = await dataFormat(res)
    //             console.log('凭证是否有用：')
    //             console.log(data)
    //         })
    //     })
}