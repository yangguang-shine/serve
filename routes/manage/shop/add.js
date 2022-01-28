// this 指向 ctx

module.exports = async function add() {
    const { shopName, imgUrl, startTime, endTime, address,description, businessTypes, minus, latitude, longitude, location } = this.request.body
    await this.SQLtransaction(async (querySQL) => {
        const sql = 'insert into shop_list (shopName, imgUrl, startTime, endTime, address,description, businessTypes, minus, latitude, longitude, location, manageID) values (?)';
        await querySQL(sql, [[shopName, imgUrl, startTime, endTime, address,description, businessTypes, minus, latitude, longitude, location, this.manageID]])
    })
    this.body = {
        code: '000',
        msg: '添加成功',
        data: null
    }
}