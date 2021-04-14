// this 指向 ctx

const encryption = require('../../../tools/encryption')
const crypto = require('crypto');

module.exports = async function login() {
    const { phone, password } = this.request.body
    if (!(phone && password)) {
        this.body = this.parameterError
        return
    }
    const encryptPassword = encryption(password)
    const sql = `select encryptPassword, manageID, nickname from pass_info_manage where phone = ?`
    const phoneInfoList = await this.querySQL(sql, [phone])
    if (phoneInfoList.length) {
        if (phoneInfoList.length > 1) {
            console.log('多个phoneInfoList')
        }
        const phoneInfo = phoneInfoList[0];
        if (encryptPassword === phoneInfo.encryptPassword) {
            const nickname = phoneInfo.nickname
            const manageID = phoneInfo.manageID
            const md5 = crypto.createHash('md5');
            const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${phone}`
            const manageToken = await md5.update(secret).digest('hex');
            const res = await this.querySQL('select manageToken from token_store_manage where manageID = ?', [manageID])
            if (res.length) {
                if (res.length > 1) {
                    console.log('多个manageID')
                }
                await this.querySQL(`update token_store_manage set manageToken = ? where manageID = ?`, [manageToken, manageID])
            } else {
                const insertTokenSql = `insert into token_store_manage (manageID, manageToken) values (?, ?)`
                await this.querySQL(insertTokenSql, [manageID, manageToken])
            }
            this.cookies.set('manageToken', manageToken)
            this.body = {
                code: '000',
                msg: '登录成功',
                data: {
                    nickname,
                    manageToken
                }
            }
        } else {
            this.body = {
                code: '108',
                msg: '密码错误',
                data: {}
            }
        }
    } else {
        this.body = {
            code: '109',
            msg: '改手机号不存在',
            data: {}
        }
    }
}