// this 指向 ctx

module.exports = async function find() {
    const query = this.query
    if (!query.foodID) {
        this.body = this.parameterError
        return
    }
    const res = await this.querySQL(`select * from food_info_${query.shopID} where foodID = ?;`, [Number(query.foodID)])
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