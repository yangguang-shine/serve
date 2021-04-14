
module.exports = async function list() {
    const userID = await this.getUserID()
    const sql = `select * from user_address_list`
    const res = await this.querySQL(sql, [userID])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}