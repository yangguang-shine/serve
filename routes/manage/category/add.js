// manage > category > add

module.exports = async function add() {
    const { categoryName, shopID } = this.request.body
    if (!shopID | !categoryName) {
        this.body = this.parameterError
        return
    }
    let sql = `insert into category_list_${shopID} (categoryName, shopID) values (?, ?);`
    await this.querySQL(sql, [categoryName, shopID])
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}