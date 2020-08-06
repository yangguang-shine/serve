
module.exports = async function edit() {
    const { orderKey, shopID } = this.request.body
    if (!(orderKey && shopID)) {
        this.body = this.parameterError
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
    await this.SQLtransaction(async (querySQL) => {
        const sql1 = `update order_key_list_${userID} set orderStatus = ? where orderKey = ?`;
        const sql2 = `update order_key_list_${shopID} set orderStatus = ? where orderKey = ?`;
        const promise1 = querySQL(sql1, [50, orderKey])
        const promise2 = querySQL(sql2, [50, orderKey])
        await promise1
        await promise2
    })
    this.body = {
        code: '000',
        msg: '取消订单成功',
        data: {}
    }
}