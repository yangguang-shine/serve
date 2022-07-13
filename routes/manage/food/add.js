// this 指向 ctx

module.exports = async function add() {
    const { foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID, packPrice, reserveCount, specification } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    console.log({ foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID, packPrice, reserveCount, specification })
    // (foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID,manageID,packPrice, reserveCount)
    const sql = `insert into shop_food_info (foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID,packPrice, reserveCount, specification, manageID) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await this.querySQL(sql, [foodName, categoryID, price, unit, imgUrl, description, categoryName, shopID, packPrice, reserveCount, specification, this.manageID])
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}