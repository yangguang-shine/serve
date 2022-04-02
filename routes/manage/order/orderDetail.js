// this 指向 ctx

module.exports = async function orderDetail() {
    const { orderKey, shopID } = this.request.body
    if (!orderKey && !shopID) {
        this.body = this.parameterError
        return
    }
    const sql1 = `select * from order_key_list where orderKey = ?`
    const sql2 = `select * from order_food_list where orderKey = ?`
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
    console.log(orderInfo)
    orderInfo.address = JSON.parse(orderInfo.address)
    this.body = {
        code: '000',
        msg: '查询成功',
        data: {
            ...orderInfo,
            foodList
        }
    }
}