// this 指向 ctx

module.exports = async function edit() {
    const { shopID, foodName, price, unit, imgUrl, description, foodID, categoryID, packPrice, reserveCount, specification } = this.request.body
    if (!(shopID && categoryID && foodID)) {
        this.body = this.parameterError
        return
    }
    const sql = `update shop_food_info set foodName = ?, price = ?, unit = ?, imgUrl = ?, description = ?, packPrice = ? , reserveCount = ?, specification = ? where shopID = ? and categoryID= ? and foodID = ? and manageID = ?;`
    const res = await this.querySQL(sql, [foodName, price, unit, imgUrl, description, packPrice, reserveCount, specification, shopID, categoryID, foodID, this.manageID])
    this.body = {
        code: '000',
        msg: '更新成功',
        data: res
    }
}