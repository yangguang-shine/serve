const httpsGet = require('../../tool/httpsGet')
// const db = require('../mongodb')
// const UserInfo = require('../mongodb/UserInfo')
const dataFormat = require('../../tool/dataFormat')
module.exports = async (ctx) => {
    if (!ctx.query.code) {
        console.log(ctx)
        console.log(ctx.hostname)
        console.log(ctx.path)
        let redirect_uri = decodeURI(`http://${ctx.hostname}${ctx.path}`)
        // redirect_uri = encodeURI
        ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd3070d04299694f4&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
        return 'false';
    }
    let code = ctx.query.code;
    const res = await httpsGet(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12&code=${code}&grant_type=authorization_code`)
    const data = await dataFormat(res)
    const { access_token, openid } = JSON.parse(data);
    const userRes = await httpsGet(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
    const userData = await dataFormat(userRes)
    const user = JSON.parse(userData)
    return user
    // https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12&code=${code}&grant_type=authorization_code`, async (res) => {
    //         const data = await dataFormat(res)
    //         const { access_token, openid } = JSON.parse(data);
    //         https.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`, async (res) => {
    //                 const data = await dataFormat(res)
    //                 const user = JSON.parse(data)
    //                 console.log(user)
    //                 // if (user.nickname) {
    //                 //     const dataBase = db.openDB();
    //                 //     const userInfo = new UserInfo(user)
    //                 //     console.log(data)
    //                 //     userInfo.save((err) => {
    //                 //         if (err) {
    //                 //             console.log(err)
    //                 //         }
    //                 //         console.log('授权信息存入成功')
    //                 //         dataBase.close()
    //                 //         console.log('数据库关闭')
    //                 //     })
    //                 // }
    //         })
    //         // 验证凭证是否有用
    //         https.get(`https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openid}`, async (res) => {
    //             const data = await dataFormat(res)
    //             console.log('凭证是否有用：')
    //             console.log(data)
    //         })
    //     })
}