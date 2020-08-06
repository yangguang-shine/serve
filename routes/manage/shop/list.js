
module.exports = async function edit() {
    let res = []
    const manageID = await this.getManageID()
    const sql = 'select * from shop_list where manageID = ?'
    res = await this.querySQL(sql, [manageID])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}