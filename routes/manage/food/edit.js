// this 指向 ctx

module.exports = async function edit() {
    const { shopID, foodName, price, unit, imgUrl, description, foodID } = this.request.body
    if (!(shopID && foodID)) {
        this.body = this.parameterError
        return
    }
    const sql = `update shop_food_info set foodName = ?, price = ?, unit = ?, imgUrl = ?, description = ? where foodID = ?;`
    const res = await this.querySQL(sql, [foodName, price, unit, imgUrl, description, foodID])
    this.body = {
        code: '000',
        msg: '更新成功',
        data: res
    }
}