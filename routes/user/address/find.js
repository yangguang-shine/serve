
module.exports = async function find() {
    const { addressID } = this.request.body
    if (!addressID) {
        this.body = this.parameterError
        return
    }
    const res = await this.querySQL(`select * from user_address_list where addressID = ? and userID = ?;`, [addressID, this.userID])
    let data = {}
    if (res.length) {
        data = res[0]
    }
    this.body = {
        code: '000',
        msg: '查找成功',
        data
    }
}