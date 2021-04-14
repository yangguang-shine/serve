const httpsGet = require('../../tools/httpsGet')
const dataFormat = require('../../tools/dataFormat')
const crypto = require('crypto');
const fsPromise = require('fs').promises;
const { readFile } = fsPromise
const createUserIDOrShopIDOrderFoodList = require('../../createTable/createUserIDOrShopIDOrderFoodList')
const createUserIDOrShopIDOrderKeyList = require('../../createTable/createUserIDOrShopIDOrderKeyList')
const createUserIDAddress = require('../../createTable/createUserIDAddress')

module.exports = async (ctx) => {
    console.log(ctx.query)
    if (!ctx.query.code) {
        let redirect_uri = decodeURI(`https://${ctx.hostname}${ctx.path}?channel=20`)
        console.log('redirect_uri')
        console.log(redirect_uri)
        // redirect_uri = encodeURI
        return ctx.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd3070d04299694f4&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
    }
    let code = ctx.query.code;
    const res = await httpsGet(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12&code=${code}&grant_type=authorization_code`)
    const data = await dataFormat(res)
    const { access_token, openid } = JSON.parse(data);
    const sql = `select * from pass_info_user where openid = ?`
    console.log('openid')
    console.log(openid)
    const userList = await ctx.querySQL(sql, [openid])
    console.log('userList')
    console.log(userList)
    let userInfo = {}
    let userID = ''
    if (userList.length > 1) {
        console.log('多个openID')
        userInfo = userList[0]
    } else if (userList.length === 1) {
        userInfo = userList[0]
    }
    const userRes = await httpsGet(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
    const userData = await dataFormat(userRes)
    const wechatUserInfo = JSON.parse(userData)
    console.log(wechatUserInfo)
    await ctx.SQLtransaction(async (querySQL) => {
        const { nickname, sex, province, city, country, headimgurl, unionid } = wechatUserInfo
        if (!userInfo.openid) {
            const sql = `insert into pass_info_user (openid, nickname, sex, province, city, country, headimgurl, unionid) values (?)`
            const res = await querySQL(sql, [[openid, nickname, sex, province, city, country, headimgurl, unionid]])
            console.log(res)
            userID = res.insertId
            const createUserIDOrderFoodListPromise = createUserIDOrShopIDOrderFoodList({ querySQL, userID })
            const createUserIDOrderKeyListPromise = createUserIDOrShopIDOrderKeyList({ querySQL, userID })
            const createUserIDAddressPromise = createUserIDAddress({ querySQL, userID })
            await createUserIDOrderFoodListPromise
            await createUserIDOrderKeyListPromise
            await createUserIDAddressPromise
            console.log(res)
        } else {
            userID = userInfo.userID
            const sql = `update pass_info_user set  nickname = ?, sex = ?, province =?, city = ?, country = ?, headimgurl = ?, unionid = ? where openid = ?`
            const res = await querySQL(sql, [nickname, sex, province, city, country, headimgurl, unionid, openid])
            console.log(res)
        }
        const userIDTokenList = await querySQL(`select * from token_store_user where userID = ?`, [userID])
        const md5 = crypto.createHash('md5');
        const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${openid}`
        const token = await md5.update(secret).digest('hex');
        if (!userIDTokenList.length) {
            const insertTokenSql = `insert into token_store_user (userID, token) values (?, ?)`
            await querySQL(insertTokenSql, [userID, token])
        } else {
            if (userIDTokenList.length > 1) {
                console.log('查询到多个userID和token')
            }
            await querySQL(`update token_store_user set token = ? where userID = ?`, [token, userID])
        }
        ctx.cookies.set('token', token)
        console.log(token)
    })
    const html = await readFile('./public/index.html')
    ctx.type = 'text/html;charset=utf-8';
    ctx.body = html
}