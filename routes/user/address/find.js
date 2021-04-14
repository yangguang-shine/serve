
module.exports = async function find() {
    const { addressID } = this.query
    if (!addressID) {
        this.body = this.parameterError
        return
    }
    const userID = await this.getUserID()
    const res = await this.querySQL(`select * from user_address_list where addressID = ? and userID = ?;`, [addressID, userID])
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