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
    const sql = `select encryptPassword, userID, nickname from user_info_pass where phone = ?`
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
            const res = await this.querySQL('select userToken from user_token_store where userID = ?', [userID])
            if (res.length) {
                if (res.length > 1) {
                    console.log('多个userID')
                }
                await this.querySQL(`update user_token_store set userToken = ? where userID = ?`, [userToken, userID])
            } else {
                const insertTokenSql = `insert into user_token_store (userID, userToken) values (?, ?)`
                await this.querySQL(insertTokenSql, [userID, userToken])
            }
            this.cookies.set('userToken', userToken)
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