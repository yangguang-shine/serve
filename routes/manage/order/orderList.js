// this 指向 ctx

module.exports = async function orderList() {
        // 10   待接单
        // 20   已接单
        // 30   已送出  |  制作中
        // 40   已送达  |  制作完
        // 50   已取消
        const { status, shopID } = this.query
        if (!(Number(status) >= 0 && Number(status) <= 3) && !shopID) {
            this.body = this.parameterError
            return
        }
        let sql = ''
        let orderList = []
        if (Number(status) === 0) {
            // sql = `select * from order_key_list  where userID = ? inner join shop_list b on order_key_list.shopID = b.shopID；`;
            sql = `select * from order_key_list a inner join shop_list b on a.shopID = ? and a.shopID = b.shopID ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [shopID])
        } else if (Number(status) === 1) {
            sql = `select * from order_key_list a inner join shop_list b on a.shopID = ? and a.shopID = b.shopID and (orderStatus = ? or orderStatus = ? or orderStatus = ?) ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [shopID, 10, 20, 30])
        } else if (Number(status) === 2) {
            sql = `select * from order_key_list a inner join shop_list b on a.shopID = ? and a.shopID = b.shopID and orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [shopID, 40])
        } else if (Number(status) === 3) {
            sql = `select * from order_key_list a inner join shop_list b on a.shopID = ? and a.shopID = b.shopID and orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [shopID, 50])
        }


        // if (Number(status) === 0) {
        //     sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql)
        // } else if (Number(status) === 1) {
        //     sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? or orderStatus = ? or orderStatus = ? ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql, [10, 20, 30])
        // } else if (Number(status) === 2) {
        //     sql = sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql, [40])
        // } else if (Number(status) === 3) {
        //     sql = sql = `select * from order_key_list_${shopID} a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql, [50])
        // }
        // orderList.forEach((order) => {
        //     order.orderTime = `${new Date(order.orderTime).toLocaleDateString().replace(/\//g, '-')} ${new Date(order.orderTime).toTimeString().slice(0, 5)}`
        // })
        this.body = {
            code: '000',
            msg: '查询成功',
            data: orderList
        }
}