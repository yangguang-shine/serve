// this 指向 this
const encryption = require('../../../tools/encryption')
const crypto = require('crypto');

module.exports = async function logout() {
    const sql = `delete from token_store_user  where userID = ?;`
    await this.querySQL(sql, [this.userID])
    this.body = {
        code: '000',
        msg: '注销成功',
        data: {}
    }
}