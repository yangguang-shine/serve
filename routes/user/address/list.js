
module.exports = async function list() {
    const userID = await this.getUserID()
    const sql = `select * from address_list_${userID}`
    const res = await this.querySQL(sql, [])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}