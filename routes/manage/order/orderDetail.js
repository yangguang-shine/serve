// this 指向 ctx

module.exports = async function remove() {
    const { orderKey, shopID } = this.query
    if (!orderKey && !shopID) {
        this.body = this.parameterError
        return
    }
    const sql1 = `select * from order_key_list_${shopID} where orderKey = ?`
    const sql2 = `select * from order_food_list_${shopID} where orderKey = ?`
    const promise1 = this.querySQL(sql1, [orderKey])
    const promise2 = this.querySQL(sql2, [orderKey])
    const orderInfoList = await promise1
    const foodList = await promise2
    if (!orderInfoList.length) {
        this.body = {
            code: '111',
            msg: '查询失败',
            data: {}
        }
    }
    const orderInfo = orderInfoList[0]
    orderInfo.address = JSON.parse(orderInfo.address)
    orderInfo.orderTime = `${new Date(orderInfo.orderTime).toLocaleDateString().replace(/\//g, '-')} ${new Date(orderInfo.orderTime).toTimeString().slice(0, 5)}`
    orderInfo.takeOutTime = orderInfo.takeOutTime ? `${new Date(orderInfo.orderTime).toLocaleDateString().replace(/\//g, '-')} ${orderInfo.takeOutTime}` : orderInfo.takeOutTime
    orderInfo.selfTakeTime = orderInfo.selfTakeTime ? `${new Date(orderInfo.orderTime).toLocaleDateString().replace(/\//g, '-')} ${orderInfo.selfTakeTime}` : orderInfo.selfTakeTime
    this.body = {
        code: '000',
        msg: '查询成功',
        data: {
            ...orderInfo,
            foodList
        }
    }
}