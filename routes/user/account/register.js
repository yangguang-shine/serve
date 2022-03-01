// this 指向 this

const encryption = require('../../../tools/encryption')
const crypto = require('crypto');

module.exports = async function register() {
        const { phone, password, nickname } = this.request.body
        if (!(phone && password && nickname)) {
            this.body = this.parameterError
            return
        }
        const encryptPassword = encryption(password)
        let phoneIsexit = false
        let sql = `select phone from pass_info_user where phone = ?`
        const phoneList = await this.querySQL(sql, [phone]);
        if (phoneList.length) {
            phoneIsexit = true
            if (phoneList.length > 1) {
                console.log('相同phone有多个')
            }
        }
        if (!phoneIsexit) {
            const md5 = crypto.createHash('md5');
            const secret = `${Math.random().toString(36).slice(2)}${+new Date()}${phone}`
            const userToken = await md5.update(secret).digest('hex');
            await this.SQLtransaction(async (querySQL) => {
                const sql = 'insert into pass_info_user (phone, encryptPassword, nickname) values (?)'
                const res = await querySQL(sql, [[phone, encryptPassword, nickname]])
                const userID = res.insertId
                const insertTokenSql = `insert into token_store_user (userID, userToken) values (?, ?)`
                await querySQL(insertTokenSql, [userID, userToken])
            })
            this.cookies.set('userToken', userToken)
            this.body = {
                code: '000',
                msg: '注册成功',
                data: {
                    nickname,
                    userToken
                }
            }
        } else {
            this.body = {
                code: '103',
                msg: '用户改手机号已被注册',
                data: {}
            }
        }
}