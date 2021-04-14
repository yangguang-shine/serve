// manage > category > list

module.exports = async function list() {
    const { shopID } = this.query
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    let sql = `select * from shop_category_list where shopID =?;`;
    const res = await this.querySQL(sql, [shopID])
    this.body = {
        code: '000',
        msg: '获取成功',
        data: res
    }
}