// manage > category > add

module.exports = async function add() {
    const { categoryName, shopID } = this.request.body
    if (!shopID | !categoryName) {
        this.body = this.parameterError
        return
    }
    let sql = `insert into shop_category_list (categoryName, shopID, manageID) values (?, ?, ?);`
    await this.querySQL(sql, [categoryName, shopID, this.manageID])
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}