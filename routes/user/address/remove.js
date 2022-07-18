// this 指向 this

module.exports = async function remove() {
    const { addressID } = this.request.body
    if (!addressID) {
        this.body = this.parameterError
        return
    }
    const sql = `delete from user_address_list where addressID = ? and userID = ?`;
    await this.querySQL(sql, [addressID, this.userID])
    this.body = {
        code: '000',
        msg: '删除成功',
        data: {}
    }
}