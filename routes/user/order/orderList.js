// this 指向 this

module.exports = async function orderList() {
    // 10   待接单
    // 20   已接单
    // 30   待自提   已送出
    // 40   已自提   已送达
    // 50   已取消
    const { status } = this.request.body
    if (!(Number(status) >= 0 && Number(status) <= 3)) {
        this.body = this.parameterError
        return
    }
    let sql = ''
    let orderKeyList = []
    if (Number(status) === 0) {
        // sql = `select * from order_key_list a inner join shop_list b on a.userID = ? and a.shopID = b.shopID ORDER BY a.orderKey desc`;
        sql = 'select * from order_key_list where userID = ? ORDER BY orderKey desc'
        orderKeyList = await this.querySQL(sql, [this.userID])
    } else if (Number(status) === 1) {
        // sql = `select *, a.address as deliverAddress from order_key_list a inner join shop_list b on a.userID = ? and a.shopID = b.shopID and (orderStatus = ? or orderStatus = ? or orderStatus = ?) ORDER BY a.orderKey desc`;
        sql = 'select * from order_key_list where userID = ? and (orderStatus = ? or orderStatus = ? or orderStatus = ?) ORDER BY orderKey desc'
        orderKeyList = await this.querySQL(sql, [this.userID, 10, 20, 30])
    } else if (Number(status) === 2) {
        sql = 'select * from order_key_list where userID = ? and orderStatus = ? ORDER BY orderKey desc'
        orderKeyList = await this.querySQL(sql, [this.userID, 40])
    } else if (Number(status) === 3) {
        sql = 'select * from order_key_list where userID = ? and orderStatus = ? ORDER BY orderKey desc'
        orderKeyList = await this.querySQL(sql, [this.userID, 50])
    }
    const shopList = [...new Set(orderKeyList.map((item) => item.shopID))]
    let sql2 = ''
    shopList.forEach((item, index) => {
        if (index === 0) {
            sql2 = `select * from shop_list where shopID = ?`
        } else {
            sql2 = `${sql2} or shopID = ?`
        }
    })
    let shopInfoList = []
    if (sql2) {
        shopInfoList = await this.querySQL(sql2, [...shopList])
    }
    // const shopListInfo = await this.querySQL(sql1, [...shopList])
    const orderListInfo = {
        orderKeyList,
        shopInfoList
    }
    this.body = {
        code: '000',
        msg: '查询成功',
        data: orderListInfo
    }
}