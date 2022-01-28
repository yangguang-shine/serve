// this 指向 ctx

module.exports = async function find() {
    const query = this.request.body
    if (!query.foodID) {
        this.body = this.parameterError
        return
    }
    const res = await this.querySQL(`select * from shop_food_info where foodID = ? and manageID = ?;`, [Number(query.foodID), this.manageID])
    let data = {}
    if (res.length) {
        data = res[0]
    }
    this.body = {
        code: '000',
        msg: '查找成功',
        data
    }
}