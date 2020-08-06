// this 指向 ctx

module.exports = async function find() {
    const { orderKey, shopID, orderStatus } = this.request.body
    if (!(orderKey && shopID && orderStatus)) {
        this.body = {
            code: '222',
            msg: '参数校验失败',
            data: {}
        }
        return
    }
    const userIDList = await this.querySQL(`select userID from order_key_list_${shopID} where orderKey = ?`, [orderKey])
    let userID = ''
    if (userIDList.length) {
        if (userIDList.length > 1) console.log('多个userID');
        userID = userIDList[0].userID
    } else {
        this.body = {
            code: '111',
            msg: '未找到该订单',
            data: {}
        }
        return
    }
    const nextOrderStatus = Number(orderStatus) + 10
    await this.SQLtransaction(async (querySQL) => {
        const sql1 = `update order_key_list_${userID} set orderStatus = ? where orderKey = ?`;
        const sql2 = `update order_key_list_${shopID} set orderStatus = ? where orderKey = ?`;
        const promise1 = querySQL(sql1, [nextOrderStatus, orderKey])
        const promise2 = querySQL(sql2, [nextOrderStatus, orderKey])
        await promise1
        await promise2
    })
    this.body = {
        code: '000',
        msg: '订单状态修改成功',
        data: {}
    }
}