// this 指向 this

module.exports = async function edit() {
    const { name, sex, mobile, address1, address2, addressID, longitude, latitude } = this.request.body
    if (!addressID) {
        this.body = this.parameterError
        return
    }
    const sql = `update user_address_list set name = ?, sex = ?, mobile = ?, address1 = ?, address2 = ?, longitude = ?, latitude = ? where addressID = ? and userID = ?;`
    const res = await this.querySQL(sql, [name, sex, mobile, address1, address2, longitude, latitude, addressID, this.userID])
    // await addressExchange({ querySQL, userID, addressID })
    this.body = {
        code: '000',
        msg: '更新成功',
        data: null
    }
}