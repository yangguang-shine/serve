// this 指向 ctx

module.exports = async function changeOrderStatus() {
    const { orderKey, orderStatus } = this.request.body
    if (!(orderKey && orderStatus)) {
        this.body = {
            code: '222',
            msg: '参数校验失败',
            data: {}
        }
        return
    }
    const nextOrderStatus = Number(orderStatus) + 10
    const sql1 = `update order_key_list set orderStatus = ? where orderKey = ?`;
    const promise1 = this.querySQL(sql1, [nextOrderStatus, orderKey])
    await promise1
    this.body = {
        code: '000',
        msg: '订单状态修改成功',
        data: {}
    }
}