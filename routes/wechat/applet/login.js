const httpsGet = require('../../../tools/httpsGet')
// const createUserIDOrShopIDOrderFoodList = require('../../creatTable/createUserIDOrShopIDOrderFoodList')
// const createUserIDOrShopIDOrderKeyList = require('../../creatTable/createUserIDOrShopIDOrderKeyList')
// const createUserIDAddress = require('../../creatTable/createUserIDAddress')
const { createUserIDOrShopIDOrderFoodList, createUserIDOrShopIDOrderKeyList, createUserIDAddress } = require('../../../creatTable')
const crypto = require('crypto');

module.exports = async function login() {
    let token = ''
    const { code } = this.request.body
    if (!code) {
        this.body = this.parameterError
    }
    await this.SQLtransaction(async (querySQL) => {
        const res = await httpsGet(`https://api.weixin.qq.com/sns/jscode2session?appid=wx5e8fc6bbef84c4c3&secret=776934fd2bf6193cf8fd5e5af684d30c&js_code=${code}&grant_type=authorization_code`)
        const data = await this.dataFormat(res)
        const { session_key, openid } = JSON.parse(data)
        let sql = `select userID from pass_info_user where openid = ?`
        let queryUserIDList = await querySQL(sql, [openid])
        let userID = null
        // 增加更新用户
        if (queryUserIDList.length === 1) {
            sql = `update pass_info_user set session_key = ? where openid = ?`
            await querySQL(sql, [session_key, openid])
            userID = queryUserIDList[0].userID
        } else if (!queryUserIDList.length) {
            sql = `insert into pass_info_user (session_key, openid) values (?, ?)`
            const resInsert = await querySQL(sql, [session_key, openid])
            userID = resInsert.insertId
            const createUserIDOrderFoodListPromise = createUserIDOrShopIDOrderFoodList({ querySQL, userID })
            const createUserIDOrderKeyListPromise = createUserIDOrShopIDOrderKeyList({ querySQL, userID })
            const createUserIDAddressPromise = createUserIDAddress({ querySQL, userID })
            await createUserIDOrderFoodListPromise
            await createUserIDOrderKeyListPromise
            await createUserIDAddressPromise
        } else {
            console.log('userID查找多个+')
            userID = queryUserIDList[0].userID
        }
        const md5 = crypto.createHash('md5');
        const secret = `${session_key}${+new Date()}${openid}`
        token = await md5.update(secret).digest('hex');
        sql = `select token from token_store_user where userID = ?`
        const findToken = await querySQL(sql, [userID])
        // 增加更新用户token
        if (findToken.length === 1) {
            sql = `update token_store_user set token = ?, secret = ?  where userID = ?`
            await querySQL(sql, [token, secret, userID])
        } else if (!findToken.length) {
            sql = `insert into token_store_user (userID, token, secret) values (?, ?, ?)`
            await querySQL(sql, [userID, token, secret])
        } else {
            throw new Error('userID查找多个++')
        }
    })
    this.body = {
        code: '000',
        msg: 'code获取成功',
        data: token
    }
}
