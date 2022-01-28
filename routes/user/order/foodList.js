
module.exports = async function foodList() {
    const { orderKey } = this.request.body
    if (!orderKey) {
        this.body = this.parameterError
        return
    }
    const sql = `select * from order_food_list where orderKey = ?`
    const res = await this.querySQL(sql, [orderKey])
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