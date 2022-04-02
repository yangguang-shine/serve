
module.exports = async function cancel() {
    const { orderKey } = this.request.body
    if (!(orderKey)) {
        this.body = this.parameterError
        return
    }
    const sql1 = `update order_key_list set orderStatus = ? where orderKey = ? and userID = ?`;
    const promise1 = this.querySQL(sql1, [50, orderKey, this.userID])
    await promise1
    this.body = {
        code: '000',
        msg: '取消订单成功',
        data: {}
    }
}