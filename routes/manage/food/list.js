// this 指向 ctx

module.exports = async function list() {
    const { shopID, categoryID } = this.request.body
    if (!(shopID && categoryID)) {
        this.body = this.parameterError
        return
    }
    const sql = `select * from shop_food_info where shopID = ? and categoryID = ? and manageID = ?;`
    const res = await this.querySQL(sql, [shopID, categoryID, this.manageID])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}