// this 指向 ctx

module.exports = async function edit() {
    const { shopName, imgUrl, startTime, endTime, address, minus, businessTypes, shopID } = this.request.body
    if (!shopID) {
        this.body = this.parameterError
        return
    }
    const sql = 'update shop_list set shopName = ?, imgUrl = ?, startTime = ?, endTime = ?, address = ?, minus = ?, businessTypes = ? where shopID = ?;'
    const res = await this.querySQL(sql, [shopName, imgUrl, startTime, endTime, address, minus, businessTypes, shopID])
    this.body = {
        code: '000',
        msg: '更新成功',
        data: res
    }
}