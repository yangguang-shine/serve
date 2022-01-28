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
        let orderList = []
        if (Number(status) === 0) {
            // sql = `select * from order_key_list  where userID = ? inner join shop_list b on order_key_list.shopID = b.shopID；`;
            sql = `select * from order_key_list a inner join shop_list b on a.userID = ? and a.shopID = b.shopID ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [this.userID])
        } else if (Number(status) === 1) {
            sql = `select * from order_key_list a inner join shop_list b on a.userID = ? and a.shopID = b.shopID and (orderStatus = ? or orderStatus = ? or orderStatus = ?) ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [this.userID, 10, 20, 30])
        } else if (Number(status) === 2) {
            sql = `select * from order_key_list a inner join shop_list b on a.userID = ? and a.shopID = b.shopID and orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [this.userID, 40])
        } else if (Number(status) === 3) {
            sql = `select * from order_key_list a inner join shop_list b on a.userID = ? and a.shopID = b.shopID and orderStatus = ? ORDER BY a.orderKey desc`;
            orderList = await this.querySQL(sql, [this.userID, 50])
        }
        //  else if (Number(status) === 1) {
        //     sql = `select * from order_key_list a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? or orderStatus = ? or orderStatus = ? ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql, [10, 20, 30])
        // } else if (Number(status) === 2) {
        //     sql = sql = `select * from order_key_list a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql, [40])
        // } else if (Number(status) === 3) {
        //     sql = sql = `select * from order_key_list a inner join shop_list b on a.shopID = b.shopID where orderStatus = ? ORDER BY a.orderKey desc`;
        //     orderList = await this.querySQL(sql, [50])
        // }
        this.body = {
            code: '000',
            msg: '查询成功',
            data: orderList
        }
}