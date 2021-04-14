// this 指向 ctx

module.exports = async function add() {
    const { shopName, imgUrl, startTime, endTime, address, minus, businessTypes } = this.request.body
    await this.SQLtransaction(async (querySQL) => {
        const manageID = await this.getManageID()
        const sql = 'insert into shop_list (shopName, imgUrl, startTime, endTime, address, minus, businessTypes, manageID) values (?, ?, ?, ?, ?, ?, ?, ?)';
        await querySQL(sql, [shopName, imgUrl, startTime, endTime, address, minus, businessTypes, manageID])
    })
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}