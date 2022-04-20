// this 指向 this
const encryption = require('../../../tools/encryption')
const crypto = require('crypto');

module.exports = async function login() {
    const { phone, password } = this.request.body
    if (!(phone && password)) {
        this.body = this.parameterError
        return
    }
    const encryptPassword = encryption(password)
    const sql = `select encryptPassword, userID, nickname from pass_info_user where phone = ?`
    const phoneInfoList = await this.querySQL(sql, [phone])
    if (phoneInfoList.length) {
        if (phoneInfoList.length > 1) {
            console.log('多个phoneInfoList')
        }
        const phoneInfo = phoneInfoList[0];

        if (encryptPassword === phoneInfo.encryptPassword) {
            const nickname = phoneInfo.nickname
            const userID = phoneInfo.userID
            const md5 = crypto.createHash('md5');
            const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${phone}`
            const userToken = await md5.update(secret).digest('hex');
            const res = await this.querySQL('select userToken from token_store_user where userID = ?', [userID])
            if (res.length) {
                if (res.length > 1) {
                    console.log('多个userID')
                }
                await this.querySQL(`update token_store_user set userToken = ? where userID = ?`, [userToken, userID])
            } else {
                const insertTokenSql = `insert into token_store_user (userID, userToken) values (?, ?)`
                await this.querySQL(insertTokenSql, [userID, userToken])
            }
            this.cookies.set('userToken', userToken, { maxAge: 7200000 * 24 })
            this.body = {
                code: '000',
                msg: '登录成功',
                data: {
                    nickname,
                    userToken
                }
            }
        } else {
            this.body = {
                code: '101',
                msg: '用户密码错误',
                data: {}
            }
        }
    } else {
        this.body = {
            code: '102',
            msg: '用户手机号不存在',
            data: {}
        }
    }
}