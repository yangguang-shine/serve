
module.exports = async function list(next) {
    let res = []
    const sql = 'select * from shop_list where manageID = ?'
    res = await this.querySQL(sql, [this.manageID])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}