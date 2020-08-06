// manage > category > list

module.exports = async function list() {
    const { shopID } = this.query
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    let sql = `select * from category_list_${shopID};`;
    const res = await this.querySQL(sql)
    this.body = {
        code: '000',
        msg: '获取成功',
        data: res
    }
}