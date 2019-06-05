const httpsGet = require('../../tool/httpsGet')
const connect = require('../mongodb/index').connect
const findOne = require('../mongodb/index').findOne
const UserInfo = require('../mongodb/index').UserInfo
const dataFormat = require('../../tool/dataFormat')
module.exports = async (ctx) => {
    if (!ctx.query.code) {
        let redirect_uri = decodeURI(`http://${ctx.hostname}${ctx.path}`)
        // redirect_uri = encodeURI
        ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd3070d04299694f4&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
        return 'false';
    }
    let code = ctx.query.code;
    const res = await httpsGet(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12&code=${code}&grant_type=authorization_code`)
    const data = await dataFormat(res)
    const { access_token, openid } = JSON.parse(data);
    let user = null
    console.log(123)
    let db = connect()
    await findOne(UserInfo, { openid }, (err, result) => {
        if (err) {
        console.log(456)
            console.log(err)
            return;
        }
        console.log(123)
        console.log(result)
        user = result
        ctx.session.userName = 'hhh'
        db.close()
    })
    if (user) return user;
    console.log(5555)
    const userRes = await httpsGet(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
    const userData = await dataFormat(userRes)
    ctx.session.userName = 'hhh'
    // db = connect()
    user = JSON.parse(userData)
    const userInfo = new UserInfo(user)
    userInfo.save((err) => {
        if (err) {
            console.log(55555)
            console.log(err)
        }
        console.log('授权信息存入成功')
        // db.close()
        console.log('数据库关闭')
    })
    return user
    // https.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12&code=${code}&grant_type=authorization_code`, async (res) => {
    //         const data = await dataFormat(res)
    //         const { access_token, openid } = JSON.parse(data);
    //         https.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`, async (res) => {
    //                 const data = await dataFormat(res)
    //                 const user = JSON.parse(data)
    //                 console.log(user)
                    // if (user.nickname) {
                    //     const dataBase = db.openDB();
                    //     const userInfo = new UserInfo(user)
                    //     console.log(data)
                    //     userInfo.save((err) => {
                    //         if (err) {
                    //             console.log(err)
                    //         }
                    //         console.log('授权信息存入成功')
                    //         dataBase.close()
                    //         console.log('数据库关闭')
                    //     })
                    // }
    //         })
            // 验证凭证是否有用
    //         https.get(`https://api.weixin.qq.com/sns/auth?access_token=${access_token}&openid=${openid}`, async (res) => {
    //             const data = await dataFormat(res)
    //             console.log('凭证是否有用：')
    //             console.log(data)
    //         })
    //     })
}