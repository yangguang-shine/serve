
module.exports = async function foodList() {
    const { orderKey, shopID } = this.query
    if (!orderKey || !shopID) {
        this.body = this.parameterError
        return
    }
    const sql = `select * from shop_order_food_list where orderKey = ? and shopID = ?`
    const res = await this.querySQL(sql, [orderKey, shopID])
    if (res.length) {
        this.body = {
            code: '000',
            msg: '查找成功',
            data: res
        }
    } else {
        this.body = {
            code: '111',
            msg: '该订单没有菜品',
            data: []
        }
    }
}