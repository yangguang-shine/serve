// this 指向 ctx

module.exports = async function add() {
    const { foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const sql = `insert into food_info_${shopID} (foodName, categoryID, price, unit, imgUrl, description, categoryName) values (?, ?, ?, ?, ?, ?, ?)`;
    await this.querySQL(sql, [foodName, categoryID, price, unit, imgUrl, description, categoryName])
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}