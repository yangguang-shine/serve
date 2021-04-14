// this 指向 ctx

module.exports = async function list() {
    const { shopID, categoryID } = this.query
    if (!(shopID && categoryID)) {
        this.body = this.parameterError
        return
    }
    const sql = `select * from shop_food_info where categoryID = ?;`
    const res = await this.querySQL(sql, [categoryID])
    this.body = {
        code: '000',
        msg: '查询成功',
        data: res
    }
}